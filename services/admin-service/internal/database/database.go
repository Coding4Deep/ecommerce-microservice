package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func Connect(mongoURL string) (*mongo.Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURL))
	if err != nil {
		return nil, err
	}

	// Test the connection
	if err = client.Ping(ctx, nil); err != nil {
		return nil, err
	}

	log.Println("✅ Connected to MongoDB")

	db := client.Database("ecommerce")
	
	// Create indexes
	if err := createIndexes(db); err != nil {
		log.Printf("Warning: Failed to create indexes: %v", err)
	}

	return db, nil
}

func Disconnect() {
	if client != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		
		if err := client.Disconnect(ctx); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
		} else {
			log.Println("Disconnected from MongoDB")
		}
	}
}

func createIndexes(db *mongo.Database) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Admin collection indexes
	adminCollection := db.Collection("admins")
	adminIndexes := []mongo.IndexModel{
		{
			Keys:    map[string]int{"email": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    map[string]int{"username": 1},
			Options: options.Index().SetUnique(true),
		},
	}
	
	if _, err := adminCollection.Indexes().CreateMany(ctx, adminIndexes); err != nil {
		return err
	}

	// Users collection indexes
	userCollection := db.Collection("users")
	userIndexes := []mongo.IndexModel{
		{
			Keys:    map[string]int{"email": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]int{"created_at": -1},
		},
	}
	
	if _, err := userCollection.Indexes().CreateMany(ctx, userIndexes); err != nil {
		return err
	}

	// Products collection indexes
	productCollection := db.Collection("products")
	productIndexes := []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"name": "text", "description": "text"},
		},
		{
			Keys: map[string]int{"category": 1},
		},
		{
			Keys: map[string]int{"is_active": 1},
		},
		{
			Keys: map[string]int{"created_at": -1},
		},
	}
	
	if _, err := productCollection.Indexes().CreateMany(ctx, productIndexes); err != nil {
		return err
	}

	// Orders collection indexes
	orderCollection := db.Collection("orders")
	orderIndexes := []mongo.IndexModel{
		{
			Keys:    map[string]int{"order_number": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]int{"user_id": 1},
		},
		{
			Keys: map[string]int{"status": 1},
		},
		{
			Keys: map[string]int{"created_at": -1},
		},
	}
	
	if _, err := orderCollection.Indexes().CreateMany(ctx, orderIndexes); err != nil {
		return err
	}

	log.Println("✅ Database indexes created successfully")
	return nil
}
