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

type ProductService struct {
	collection *mongo.Collection
}

func NewProductService(db *mongo.Database) *ProductService {
	return &ProductService{
		collection: db.Collection("products"),
	}
}

func (s *ProductService) ListProducts(page, limit int, search, category string) ([]models.Product, int64, error) {
	skip := (page - 1) * limit
	
	// Build filter
	filter := bson.M{}
	if search != "" {
		filter["$text"] = bson.M{"$search": search}
	}
	if category != "" {
		filter["categoryId"] = category
	}

	// Get total count
	total, err := s.collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return nil, 0, err
	}

	// Get products
	opts := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(bson.M{"createdAt": -1})

	cursor, err := s.collection.Find(context.Background(), filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(context.Background())

	var products []models.Product
	if err = cursor.All(context.Background(), &products); err != nil {
		return nil, 0, err
	}

	return products, total, nil
}

func (s *ProductService) GetProduct(id string) (*models.Product, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var product models.Product
	err = s.collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&product)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (s *ProductService) CreateProduct(req *models.CreateProductRequest, createdBy string) (*models.Product, error) {
	product := &models.Product{
		ID:            primitive.NewObjectID(),
		Name:          req.Name,
		Description:   req.Description,
		Price:         req.Price,
		CategoryId:    req.CategoryId,
		Brand:         req.Brand,
		SKU:           req.SKU,
		StockQuantity: req.StockQuantity,
		Images:        req.Images,
		Tags:          req.Tags,
		IsActive:      true,
		IsFeatured:    false,
		Rating:        0,
		ReviewCount:   0,
		SoldCount:     0,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		CreatedBy:     createdBy,
	}

	if req.IsActive != nil {
		product.IsActive = *req.IsActive
	}
	if req.IsFeatured != nil {
		product.IsFeatured = *req.IsFeatured
	}

	_, err := s.collection.InsertOne(context.Background(), product)
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (s *ProductService) UpdateProduct(id string, req *models.UpdateProductRequest) (*models.Product, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	update := bson.M{
		"$set": bson.M{
			"updated_at": time.Now(),
		},
	}

	if req.Name != "" {
		update["$set"].(bson.M)["name"] = req.Name
	}
	if req.Description != "" {
		update["$set"].(bson.M)["description"] = req.Description
	}
	if req.Price != nil {
		update["$set"].(bson.M)["price"] = *req.Price
	}
	if req.Category != "" {
		update["$set"].(bson.M)["category"] = req.Category
	}
	if req.Brand != "" {
		update["$set"].(bson.M)["brand"] = req.Brand
	}
	if req.SKU != "" {
		update["$set"].(bson.M)["sku"] = req.SKU
	}
	if req.Stock != nil {
		update["$set"].(bson.M)["stock"] = *req.Stock
	}
	if req.Images != nil {
		update["$set"].(bson.M)["images"] = req.Images
	}
	if req.Tags != nil {
		update["$set"].(bson.M)["tags"] = req.Tags
	}
	if req.IsActive != nil {
		update["$set"].(bson.M)["is_active"] = *req.IsActive
	}
	if req.IsFeatured != nil {
		update["$set"].(bson.M)["is_featured"] = *req.IsFeatured
	}

	_, err = s.collection.UpdateOne(context.Background(), bson.M{"_id": objectID}, update)
	if err != nil {
		return nil, err
	}

	return s.GetProduct(id)
}

func (s *ProductService) DeleteProduct(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = s.collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	return err
}
