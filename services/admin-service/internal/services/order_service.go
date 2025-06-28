package services

import (
	"admin-service/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type OrderService struct {
	collection *mongo.Collection
}

func NewOrderService(db *mongo.Database) *OrderService {
	return &OrderService{
		collection: db.Collection("orders"),
	}
}

func (s *OrderService) ListOrders(page, limit int, status, search string) ([]models.Order, int64, error) {
	skip := (page - 1) * limit
	
	// Build filter
	filter := bson.M{}
	if status != "" {
		filter["status"] = status
	}
	if search != "" {
		filter["$or"] = []bson.M{
			{"order_number": bson.M{"$regex": search, "$options": "i"}},
			{"user_email": bson.M{"$regex": search, "$options": "i"}},
		}
	}

	// Get total count
	total, err := s.collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return nil, 0, err
	}

	// Get orders
	opts := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(bson.M{"created_at": -1})

	cursor, err := s.collection.Find(context.Background(), filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(context.Background())

	var orders []models.Order
	if err = cursor.All(context.Background(), &orders); err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (s *OrderService) GetOrder(id string) (*models.Order, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var order models.Order
	err = s.collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&order)
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (s *OrderService) UpdateOrderStatus(id string, req *models.UpdateOrderStatusRequest) (*models.Order, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	update := bson.M{
		"$set": bson.M{
			"status":     req.Status,
			"updated_at": time.Now(),
		},
	}

	if req.TrackingNum != "" {
		update["$set"].(bson.M)["tracking_number"] = req.TrackingNum
	}
	if req.Notes != "" {
		update["$set"].(bson.M)["notes"] = req.Notes
	}

	// Set timestamps based on status
	now := time.Now()
	switch req.Status {
	case "shipped":
		update["$set"].(bson.M)["shipped_at"] = now
	case "delivered":
		update["$set"].(bson.M)["delivered_at"] = now
	}

	_, err = s.collection.UpdateOne(context.Background(), bson.M{"_id": objectID}, update)
	if err != nil {
		return nil, err
	}

	return s.GetOrder(id)
}

func (s *OrderService) DeleteOrder(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = s.collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	return err
}
