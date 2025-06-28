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

type AdminService struct {
	collection *mongo.Collection
}

func NewAdminService(db *mongo.Database) *AdminService {
	return &AdminService{
		collection: db.Collection("admins"),
	}
}

func (s *AdminService) CreateAdmin(admin *models.Admin, password string) error {
	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	admin.ID = primitive.NewObjectID()
	admin.PasswordHash = string(hashedPassword)
	admin.CreatedAt = time.Now()
	admin.UpdatedAt = time.Now()
	
	// Set default permissions based on role
	if len(admin.Permissions) == 0 {
		admin.Permissions = models.GetDefaultPermissions(admin.Role)
	}

	_, err = s.collection.InsertOne(context.Background(), admin)
	return err
}

func (s *AdminService) AdminExists(email string) (bool, error) {
	count, err := s.collection.CountDocuments(context.Background(), bson.M{"email": email})
	return count > 0, err
}

func (s *AdminService) UpdateAdminPassword(email, newPassword string) error {
	// Hash the new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Update the admin's password
	filter := bson.M{"email": email}
	update := bson.M{
		"$set": bson.M{
			"password_hash": string(hashedPassword),
			"updated_at":    time.Now(),
		},
	}

	result, err := s.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("admin not found")
	}

	return nil
}

func (s *AdminService) GetAdminByEmail(email string) (*models.Admin, error) {
	var admin models.Admin
	err := s.collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&admin)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (s *AdminService) GetAdminByID(id string) (*models.Admin, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var admin models.Admin
	err = s.collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&admin)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (s *AdminService) ValidatePassword(admin *models.Admin, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password))
	return err == nil
}

func (s *AdminService) UpdateLastLogin(adminID string) error {
	objectID, err := primitive.ObjectIDFromHex(adminID)
	if err != nil {
		return err
	}

	now := time.Now()
	_, err = s.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{"last_login": now, "updated_at": now}},
	)
	return err
}

func (s *AdminService) UpdateProfile(adminID string, req *models.UpdateProfileRequest) (*models.Admin, error) {
	objectID, err := primitive.ObjectIDFromHex(adminID)
	if err != nil {
		return nil, err
	}

	// Check if username is already taken by another admin
	existingAdmin := &models.Admin{}
	err = s.collection.FindOne(context.Background(), bson.M{
		"username": req.Username,
		"_id":      bson.M{"$ne": objectID},
	}).Decode(existingAdmin)
	
	if err == nil {
		return nil, errors.New("username already taken")
	} else if err != mongo.ErrNoDocuments {
		return nil, err
	}

	// Update admin
	update := bson.M{
		"$set": bson.M{
			"first_name": req.FirstName,
			"last_name":  req.LastName,
			"username":   req.Username,
			"updated_at": time.Now(),
		},
	}

	_, err = s.collection.UpdateOne(context.Background(), bson.M{"_id": objectID}, update)
	if err != nil {
		return nil, err
	}

	return s.GetAdminByID(adminID)
}

func (s *AdminService) ChangePassword(adminID string, req *models.ChangePasswordRequest) error {
	admin, err := s.GetAdminByID(adminID)
	if err != nil {
		return err
	}

	// Validate current password
	if !s.ValidatePassword(admin, req.CurrentPassword) {
		return errors.New("current password is incorrect")
	}

	// Validate new password confirmation
	if req.NewPassword != req.ConfirmPassword {
		return errors.New("password confirmation does not match")
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	objectID, _ := primitive.ObjectIDFromHex(adminID)
	_, err = s.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{
			"password_hash": string(hashedPassword),
			"updated_at":    time.Now(),
		}},
	)

	return err
}

func (s *AdminService) ListAdmins(page, limit int) ([]models.Admin, int64, error) {
	skip := (page - 1) * limit
	
	// Get total count
	total, err := s.collection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		return nil, 0, err
	}

	// Get admins
	opts := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(bson.M{"created_at": -1})

	cursor, err := s.collection.Find(context.Background(), bson.M{}, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(context.Background())

	var admins []models.Admin
	if err = cursor.All(context.Background(), &admins); err != nil {
		return nil, 0, err
	}

	return admins, total, nil
}

func (s *AdminService) DeleteAdmin(adminID, currentAdminID string) error {
	// Prevent self-deletion
	if adminID == currentAdminID {
		return errors.New("cannot delete your own account")
	}

	objectID, err := primitive.ObjectIDFromHex(adminID)
	if err != nil {
		return err
	}

	_, err = s.collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	return err
}
