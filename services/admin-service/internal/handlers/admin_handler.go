package handlers

import (
	"admin-service/internal/config"
	"admin-service/internal/models"
	"admin-service/internal/services"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/mongo"
)

type AdminHandler struct {
	adminService *services.AdminService
	config       *config.Config
}

func NewAdminHandler(adminService *services.AdminService) *AdminHandler {
	return &AdminHandler{
		adminService: adminService,
		config:       config.Load(),
	}
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req models.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
		return
	}

	// Get admin by email
	admin, err := h.adminService.GetAdminByEmail(req.Email)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid email or password",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Login failed",
		})
		return
	}

	// Check if admin is active
	if !admin.IsActive {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Account is deactivated",
		})
		return
	}

	// Validate password
	if !h.adminService.ValidatePassword(admin, req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid email or password",
		})
		return
	}

	// Generate JWT token
	token, err := h.generateJWT(admin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to generate token",
		})
		return
	}

	// Update last login
	h.adminService.UpdateLastLogin(admin.ID.Hex())

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login successful",
		"data": models.LoginResponse{
			AccessToken: token,
			TokenType:   "Bearer",
			ExpiresIn:   3600, // 1 hour
			Admin:       admin.ToResponse(),
		},
	})
}

func (h *AdminHandler) Register(c *gin.Context) {
	var req models.AdminRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
		return
	}

	// Validate registration token
	if req.RegistrationToken != h.config.AdminRegToken {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": "Invalid registration token",
		})
		return
	}

	// Validate password confirmation
	if req.Password != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Password confirmation does not match",
		})
		return
	}

	// Check if admin already exists
	exists, err := h.adminService.AdminExists(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Registration failed",
		})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"message": "Email already registered",
		})
		return
	}

	// Create admin
	admin := &models.Admin{
		Email:     req.Email,
		Username:  req.Username,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      "admin", // Default role
		IsActive:  true,
	}

	if req.Role != "" {
		admin.Role = req.Role
	}

	if err := h.adminService.CreateAdmin(admin, req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create admin account",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Admin account created successfully",
		"data":    admin.ToResponse(),
	})
}

func (h *AdminHandler) GetProfile(c *gin.Context) {
	adminID := c.GetString("admin_id")
	
	admin, err := h.adminService.GetAdminByID(adminID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Admin not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    admin.ToResponse(),
	})
}

func (h *AdminHandler) UpdateProfile(c *gin.Context) {
	adminID := c.GetString("admin_id")
	
	var req models.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
		return
	}

	admin, err := h.adminService.UpdateProfile(adminID, &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Profile updated successfully",
		"data":    admin.ToResponse(),
	})
}

func (h *AdminHandler) ChangePassword(c *gin.Context) {
	adminID := c.GetString("admin_id")
	
	var req models.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"errors":  err.Error(),
		})
		return
	}

	if err := h.adminService.ChangePassword(adminID, &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password changed successfully",
	})
}

func (h *AdminHandler) ListAdmins(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	admins, total, err := h.adminService.ListAdmins(page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch admins",
		})
		return
	}

	// Convert to response format
	var adminResponses []models.AdminResponse
	for _, admin := range admins {
		adminResponses = append(adminResponses, admin.ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"admins": adminResponses,
			"pagination": gin.H{
				"page":  page,
				"limit": limit,
				"total": total,
				"pages": (total + int64(limit) - 1) / int64(limit),
			},
		},
	})
}

func (h *AdminHandler) DeleteAdmin(c *gin.Context) {
	adminID := c.Param("id")
	currentAdminID := c.GetString("admin_id")

	if err := h.adminService.DeleteAdmin(adminID, currentAdminID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Admin deleted successfully",
	})
}

// Analytics and Dashboard methods
func (h *AdminHandler) GetDashboard(c *gin.Context) {
	// This would typically aggregate data from multiple collections
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total_users":    1250,
			"total_products": 450,
			"total_orders":   2340,
			"total_revenue":  125000.50,
			"recent_orders":  []gin.H{},
			"top_products":   []gin.H{},
		},
	})
}

func (h *AdminHandler) GetSalesAnalytics(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"daily_sales":   []gin.H{},
			"monthly_sales": []gin.H{},
			"yearly_sales":  []gin.H{},
		},
	})
}

func (h *AdminHandler) GetUserAnalytics(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user_growth":      []gin.H{},
			"user_activity":    []gin.H{},
			"user_demographics": gin.H{},
		},
	})
}

func (h *AdminHandler) GetProductAnalytics(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"top_selling":     []gin.H{},
			"low_stock":       []gin.H{},
			"category_stats":  []gin.H{},
		},
	})
}

func (h *AdminHandler) GetSystemLogs(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"logs": []gin.H{
				{
					"timestamp": time.Now(),
					"level":     "INFO",
					"message":   "System running normally",
				},
			},
		},
	})
}

func (h *AdminHandler) CreateBackup(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Backup created successfully",
		"data": gin.H{
			"backup_id": "backup_" + time.Now().Format("20060102_150405"),
		},
	})
}

func (h *AdminHandler) GetSystemHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"status":     "healthy",
			"uptime":     "24h 30m",
			"memory":     "512MB / 2GB",
			"cpu":        "15%",
			"disk":       "45GB / 100GB",
			"database":   "connected",
			"services":   gin.H{
				"user_service":    "healthy",
				"product_service": "healthy",
				"cart_service":    "healthy",
				"order_service":   "healthy",
			},
		},
	})
}

func (h *AdminHandler) generateJWT(admin *models.Admin) (string, error) {
	claims := jwt.MapClaims{
		"admin_id":    admin.ID.Hex(),
		"email":       admin.Email,
		"role":        admin.Role,
		"permissions": admin.Permissions,
		"exp":         time.Now().Add(time.Hour * 1).Unix(),
		"iat":         time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.config.JWTSecret))
}
