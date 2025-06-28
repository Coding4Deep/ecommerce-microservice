package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name          string             `bson:"name" json:"name" binding:"required,min=1,max=200"`
	Description   string             `bson:"description" json:"description"`
	Price         float64            `bson:"price" json:"price" binding:"required,min=0"`
	CategoryId    string             `bson:"categoryId" json:"categoryId" binding:"required"`
	Brand         string             `bson:"brand" json:"brand" binding:"required"`
	SKU           string             `bson:"sku" json:"sku"`
	StockQuantity int                `bson:"stockQuantity" json:"stockQuantity" binding:"min=0"`
	Images        []string           `bson:"images,omitempty" json:"images,omitempty"`
	Tags          []string           `bson:"tags,omitempty" json:"tags,omitempty"`
	IsActive      bool               `bson:"isActive" json:"isActive"`
	IsFeatured    bool               `bson:"isFeatured" json:"isFeatured"`
	Rating        float64            `bson:"rating" json:"rating"`
	ReviewCount   int                `bson:"reviewCount" json:"reviewCount"`
	SoldCount     int                `bson:"soldCount" json:"soldCount"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
	CreatedBy     string             `bson:"createdBy,omitempty" json:"createdBy,omitempty"`
}

type CreateProductRequest struct {
	Name          string   `json:"name" binding:"required,min=1,max=200"`
	Description   string   `json:"description" binding:"required,min=10,max=2000"`
	Price         float64  `json:"price" binding:"required,min=0"`
	CategoryId    string   `json:"categoryId" binding:"required"`
	Brand         string   `json:"brand" binding:"required"`
	SKU           string   `json:"sku" binding:"required"`
	StockQuantity int      `json:"stockQuantity" binding:"min=0"`
	Images        []string `json:"images,omitempty"`
	Tags          []string `json:"tags,omitempty"`
	IsActive      *bool    `json:"isActive,omitempty"`
	IsFeatured    *bool    `json:"isFeatured,omitempty"`
}

type UpdateProductRequest struct {
	Name        string   `json:"name,omitempty" binding:"omitempty,min=1,max=200"`
	Description string   `json:"description,omitempty"`
	Price       *float64 `json:"price,omitempty" binding:"omitempty,min=0"`
	Category    string   `json:"category,omitempty"`
	Brand       string   `json:"brand,omitempty"`
	SKU         string   `json:"sku,omitempty"`
	Stock       *int     `json:"stock,omitempty" binding:"omitempty,min=0"`
	Images      []string `json:"images,omitempty"`
	Tags        []string `json:"tags,omitempty"`
	IsActive    *bool    `json:"is_active,omitempty"`
	IsFeatured  *bool    `json:"is_featured,omitempty"`
}
