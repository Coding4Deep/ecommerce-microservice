package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	OrderNumber   string             `bson:"order_number" json:"order_number"`
	UserID        string             `bson:"user_id" json:"user_id"`
	UserEmail     string             `bson:"user_email" json:"user_email"`
	Items         []OrderItem        `bson:"items" json:"items"`
	TotalAmount   float64            `bson:"total_amount" json:"total_amount"`
	Status        string             `bson:"status" json:"status"` // pending, confirmed, processing, shipped, delivered, cancelled
	PaymentStatus string             `bson:"payment_status" json:"payment_status"` // pending, paid, failed, refunded
	PaymentMethod string             `bson:"payment_method,omitempty" json:"payment_method,omitempty"`
	ShippingAddr  Address            `bson:"shipping_address" json:"shipping_address"`
	BillingAddr   Address            `bson:"billing_address,omitempty" json:"billing_address,omitempty"`
	TrackingNum   string             `bson:"tracking_number,omitempty" json:"tracking_number,omitempty"`
	Notes         string             `bson:"notes,omitempty" json:"notes,omitempty"`
	CreatedAt     time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt     time.Time          `bson:"updated_at" json:"updated_at"`
	ShippedAt     *time.Time         `bson:"shipped_at,omitempty" json:"shipped_at,omitempty"`
	DeliveredAt   *time.Time         `bson:"delivered_at,omitempty" json:"delivered_at,omitempty"`
}

type OrderItem struct {
	ProductID   string  `bson:"product_id" json:"product_id"`
	ProductName string  `bson:"product_name" json:"product_name"`
	Price       float64 `bson:"price" json:"price"`
	Quantity    int     `bson:"quantity" json:"quantity"`
	Total       float64 `bson:"total" json:"total"`
	Image       string  `bson:"image,omitempty" json:"image,omitempty"`
}

type UpdateOrderStatusRequest struct {
	Status        string `json:"status" binding:"required,oneof=pending confirmed processing shipped delivered cancelled"`
	TrackingNum   string `json:"tracking_number,omitempty"`
	Notes         string `json:"notes,omitempty"`
}
