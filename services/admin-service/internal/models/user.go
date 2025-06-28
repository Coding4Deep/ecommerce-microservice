package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email          string             `bson:"email" json:"email"`
	FirstName      string             `bson:"first_name" json:"first_name"`
	LastName       string             `bson:"last_name" json:"last_name"`
	Phone          string             `bson:"phone,omitempty" json:"phone,omitempty"`
	HashedPassword string             `bson:"hashed_password" json:"-"`
	Role           string             `bson:"role" json:"role"`
	IsActive       bool               `bson:"is_active" json:"is_active"`
	IsVerified     bool               `bson:"is_verified" json:"is_verified"`
	LastLogin      *time.Time         `bson:"last_login,omitempty" json:"last_login,omitempty"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt      time.Time          `bson:"updated_at" json:"updated_at"`
	Addresses      []Address          `bson:"addresses,omitempty" json:"addresses,omitempty"`
	TotalOrders    int                `bson:"total_orders" json:"total_orders"`
	TotalSpent     float64            `bson:"total_spent" json:"total_spent"`
}

type Address struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Type        string             `bson:"type" json:"type"` // home, work, other
	Street      string             `bson:"street" json:"street"`
	City        string             `bson:"city" json:"city"`
	State       string             `bson:"state" json:"state"`
	ZipCode     string             `bson:"zip_code" json:"zip_code"`
	Country     string             `bson:"country" json:"country"`
	IsDefault   bool               `bson:"is_default" json:"is_default"`
}

type CreateUserRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	FirstName string `json:"first_name" binding:"required,min=1,max=50"`
	LastName  string `json:"last_name" binding:"required,min=1,max=50"`
	Phone     string `json:"phone,omitempty"`
	Role      string `json:"role,omitempty"`
}

type UpdateUserRequest struct {
	FirstName  string `json:"first_name" binding:"required,min=1,max=50"`
	LastName   string `json:"last_name" binding:"required,min=1,max=50"`
	Phone      string `json:"phone,omitempty"`
	IsActive   *bool  `json:"is_active,omitempty"`
	IsVerified *bool  `json:"is_verified,omitempty"`
}
