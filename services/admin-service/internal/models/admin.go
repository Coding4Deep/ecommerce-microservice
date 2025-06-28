package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Admin struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email        string             `bson:"email" json:"email" binding:"required,email"`
	Username     string             `bson:"username" json:"username" binding:"required,min=3,max=50"`
	FirstName    string             `bson:"first_name" json:"first_name" binding:"required,min=1,max=50"`
	LastName     string             `bson:"last_name" json:"last_name" binding:"required,min=1,max=50"`
	PasswordHash string             `bson:"password_hash" json:"-"`
	Role         string             `bson:"role" json:"role"` // super_admin, admin, moderator
	IsActive     bool               `bson:"is_active" json:"is_active"`
	LastLogin    *time.Time         `bson:"last_login,omitempty" json:"last_login,omitempty"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
	CreatedBy    string             `bson:"created_by,omitempty" json:"created_by,omitempty"`
	Permissions  []string           `bson:"permissions" json:"permissions"`
}

type AdminLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type AdminRegisterRequest struct {
	Email             string `json:"email" binding:"required,email"`
	Username          string `json:"username" binding:"required,min=3,max=50"`
	FirstName         string `json:"first_name" binding:"required,min=1,max=50"`
	LastName          string `json:"last_name" binding:"required,min=1,max=50"`
	Password          string `json:"password" binding:"required,min=6"`
	ConfirmPassword   string `json:"confirm_password" binding:"required"`
	RegistrationToken string `json:"registration_token" binding:"required"`
	Role              string `json:"role,omitempty"` // Optional, defaults to 'admin'
}

type AdminResponse struct {
	ID          primitive.ObjectID `json:"id"`
	Email       string             `json:"email"`
	Username    string             `json:"username"`
	FirstName   string             `json:"first_name"`
	LastName    string             `json:"last_name"`
	Role        string             `json:"role"`
	IsActive    bool               `json:"is_active"`
	LastLogin   *time.Time         `json:"last_login,omitempty"`
	CreatedAt   time.Time          `json:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at"`
	CreatedBy   string             `json:"created_by,omitempty"`
	Permissions []string           `json:"permissions"`
}

type LoginResponse struct {
	AccessToken  string        `json:"access_token"`
	TokenType    string        `json:"token_type"`
	ExpiresIn    int           `json:"expires_in"`
	RefreshToken string        `json:"refresh_token,omitempty"`
	Admin        AdminResponse `json:"admin"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

type UpdateProfileRequest struct {
	FirstName string `json:"first_name" binding:"required,min=1,max=50"`
	LastName  string `json:"last_name" binding:"required,min=1,max=50"`
	Username  string `json:"username" binding:"required,min=3,max=50"`
}

// Convert Admin to AdminResponse
func (a *Admin) ToResponse() AdminResponse {
	return AdminResponse{
		ID:          a.ID,
		Email:       a.Email,
		Username:    a.Username,
		FirstName:   a.FirstName,
		LastName:    a.LastName,
		Role:        a.Role,
		IsActive:    a.IsActive,
		LastLogin:   a.LastLogin,
		CreatedAt:   a.CreatedAt,
		UpdatedAt:   a.UpdatedAt,
		CreatedBy:   a.CreatedBy,
		Permissions: a.Permissions,
	}
}

// Get default permissions based on role
func GetDefaultPermissions(role string) []string {
	switch role {
	case "super_admin":
		return []string{
			"admin.create", "admin.read", "admin.update", "admin.delete",
			"user.create", "user.read", "user.update", "user.delete",
			"product.create", "product.read", "product.update", "product.delete",
			"order.create", "order.read", "order.update", "order.delete",
			"analytics.read", "system.manage", "backup.create",
		}
	case "admin":
		return []string{
			"user.create", "user.read", "user.update", "user.delete",
			"product.create", "product.read", "product.update", "product.delete",
			"order.read", "order.update",
			"analytics.read",
		}
	case "moderator":
		return []string{
			"user.read",
			"product.read", "product.update",
			"order.read",
		}
	default:
		return []string{"user.read", "product.read", "order.read"}
	}
}
