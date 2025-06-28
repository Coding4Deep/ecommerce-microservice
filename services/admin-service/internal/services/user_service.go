package services

import (
	"admin-service/internal/models"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	collection *mongo.Collection
}

func NewUserService(db *mongo.Database) *UserService {
	return &UserService{
		collection: db.Collection("users"),
	}
}

func (s *UserService) CreateUser(req *models.CreateUserRequest) (*models.User, error) {
	// Check if user already exists
	var existingUser models.User
	err := s.collection.FindOne(context.Background(), bson.M{"email": req.Email}).Decode(&existingUser)
	if err == nil {
		return nil, errors.New("user with this email already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := models.User{
		ID:             primitive.NewObjectID(),
		Email:          req.Email,
		FirstName:      req.FirstName,
		LastName:       req.LastName,
		Phone:          req.Phone,
		HashedPassword: string(hashedPassword),
		Role:           "user",
		IsActive:       true,
		IsVerified:     false,
		Addresses:      []models.Address{},
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	_, err = s.collection.InsertOne(context.Background(), user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *UserService) ListUsers(page, limit int, search string) ([]models.User, int64, error) {
	skip := (page - 1) * limit
	
	// Build filter
	filter := bson.M{}
	if search != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"email": bson.M{"$regex": search, "$options": "i"}},
				{"first_name": bson.M{"$regex": search, "$options": "i"}},
				{"last_name": bson.M{"$regex": search, "$options": "i"}},
			},
		}
	}

	// Get total count
	total, err := s.collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return nil, 0, err
	}

	// Get users
	opts := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(bson.M{"created_at": -1})

	cursor, err := s.collection.Find(context.Background(), filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(context.Background())

	var users []models.User
	for cursor.Next(context.Background()) {
		var rawUser bson.M
		if err := cursor.Decode(&rawUser); err != nil {
			continue // Skip problematic documents
		}

		user := models.User{}
		
		// Handle ID field (can be ObjectID or string)
		if id, ok := rawUser["_id"]; ok {
			if objID, ok := id.(primitive.ObjectID); ok {
				user.ID = objID
			} else if strID, ok := id.(string); ok {
				// Convert string ID to ObjectID if possible, otherwise create new one
				if objID, err := primitive.ObjectIDFromHex(strID); err == nil {
					user.ID = objID
				} else {
					user.ID = primitive.NewObjectID()
				}
			}
		}

		// Handle other fields with defaults
		if email, ok := rawUser["email"].(string); ok {
			user.Email = email
		}
		if firstName, ok := rawUser["first_name"].(string); ok {
			user.FirstName = firstName
		}
		if lastName, ok := rawUser["last_name"].(string); ok {
			user.LastName = lastName
		}
		if phone, ok := rawUser["phone"].(string); ok {
			user.Phone = phone
		}
		if role, ok := rawUser["role"].(string); ok {
			user.Role = role
		} else {
			user.Role = "user" // Default role
		}
		if isActive, ok := rawUser["is_active"].(bool); ok {
			user.IsActive = isActive
		} else {
			user.IsActive = true // Default active
		}
		if isVerified, ok := rawUser["is_verified"].(bool); ok {
			user.IsVerified = isVerified
		} else {
			user.IsVerified = false // Default not verified
		}
		if createdAt, ok := rawUser["created_at"].(primitive.DateTime); ok {
			user.CreatedAt = createdAt.Time()
		}
		if updatedAt, ok := rawUser["updated_at"].(primitive.DateTime); ok {
			user.UpdatedAt = updatedAt.Time()
		}
		if lastLogin, ok := rawUser["last_login"].(primitive.DateTime); ok {
			loginTime := lastLogin.Time()
			user.LastLogin = &loginTime
		}

		users = append(users, user)
	}

	return users, total, nil
}

func (s *UserService) GetUser(id string) (*models.User, error) {
	var user models.User
	var err error
	
	// Try to parse as ObjectID first
	if objectID, parseErr := primitive.ObjectIDFromHex(id); parseErr == nil {
		err = s.collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&user)
	} else {
		// If not ObjectID, treat as string ID (UUID)
		err = s.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&user)
	}
	
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserService) UpdateUser(id string, req *models.UpdateUserRequest) (*models.User, error) {
	update := bson.M{
		"$set": bson.M{
			"first_name": req.FirstName,
			"last_name":  req.LastName,
			"updated_at": time.Now(),
		},
	}

	if req.Phone != "" {
		update["$set"].(bson.M)["phone"] = req.Phone
	}
	if req.IsActive != nil {
		update["$set"].(bson.M)["is_active"] = *req.IsActive
	}
	if req.IsVerified != nil {
		update["$set"].(bson.M)["is_verified"] = *req.IsVerified
	}

	var err error
	// Try to parse as ObjectID first
	if objectID, parseErr := primitive.ObjectIDFromHex(id); parseErr == nil {
		_, err = s.collection.UpdateOne(context.Background(), bson.M{"_id": objectID}, update)
	} else {
		// If not ObjectID, treat as string ID (UUID)
		_, err = s.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	}
	
	if err != nil {
		return nil, err
	}

	return s.GetUser(id)
}

func (s *UserService) DeleteUser(id string) error {
	// Try to parse as ObjectID first
	if objectID, err := primitive.ObjectIDFromHex(id); err == nil {
		_, err = s.collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
		return err
	}
	
	// If not ObjectID, treat as string ID (UUID)
	_, err := s.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}

func (s *UserService) ActivateUser(id string) error {
	return s.updateUserStatus(id, true)
}

func (s *UserService) DeactivateUser(id string) error {
	return s.updateUserStatus(id, false)
}

func (s *UserService) updateUserStatus(id string, isActive bool) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = s.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{"is_active": isActive, "updated_at": time.Now()}},
	)
	return err
}
