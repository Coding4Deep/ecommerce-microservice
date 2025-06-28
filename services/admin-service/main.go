package main

import (
	"admin-service/internal/config"
	"admin-service/internal/database"
	"admin-service/internal/handlers"
	"admin-service/internal/middleware"
	"admin-service/internal/models"
	"admin-service/internal/services"
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Connect(cfg.MongoURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Disconnect()

	// Initialize services
	adminService := services.NewAdminService(db)
	userService := services.NewUserService(db)
	productService := services.NewProductService(db)
	orderService := services.NewOrderService(db)

	// Create default admin user
	if err := createDefaultAdmin(adminService, cfg); err != nil {
		log.Printf("Warning: Failed to create default admin: %v", err)
	}

	// Setup Gin router
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// CORS middleware
	router.Use(middleware.CORS())

	// Security middleware
	router.Use(middleware.Security())

	// Rate limiting
	router.Use(middleware.RateLimit())

	// Initialize handlers
	adminHandler := handlers.NewAdminHandler(adminService)
	userHandler := handlers.NewUserHandler(userService)
	productHandler := handlers.NewProductHandler(productService)
	orderHandler := handlers.NewOrderHandler(orderService)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"service":   "admin-service",
			"version":   "1.0.0",
			"timestamp": time.Now().UTC(),
		})
	})

	// Public routes
	public := router.Group("/api/v1")
	{
		public.POST("/auth/login", adminHandler.Login)
		public.POST("/auth/register", adminHandler.Register) // Requires special token
	}

	// Protected routes (require admin authentication)
	protected := router.Group("/api/v1")
	protected.Use(middleware.AdminAuth(cfg.JWTSecret))
	{
		// Admin management
		protected.GET("/admin/profile", adminHandler.GetProfile)
		protected.PUT("/admin/profile", adminHandler.UpdateProfile)
		protected.POST("/admin/change-password", adminHandler.ChangePassword)
		protected.GET("/admin/list", adminHandler.ListAdmins)
		protected.DELETE("/admin/:id", adminHandler.DeleteAdmin)

		// User management
		protected.GET("/users", userHandler.ListUsers)
		protected.GET("/users/:id", userHandler.GetUser)
		protected.POST("/users", userHandler.CreateUser)
		protected.PUT("/users/:id", userHandler.UpdateUser)
		protected.DELETE("/users/:id", userHandler.DeleteUser)
		protected.POST("/users/:id/activate", userHandler.ActivateUser)
		protected.POST("/users/:id/deactivate", userHandler.DeactivateUser)

		// Product management
		protected.GET("/products", productHandler.ListProducts)
		protected.GET("/products/:id", productHandler.GetProduct)
		protected.POST("/products", productHandler.CreateProduct)
		protected.PUT("/products/:id", productHandler.UpdateProduct)
		protected.DELETE("/products/:id", productHandler.DeleteProduct)

		// Order management
		protected.GET("/orders", orderHandler.ListOrders)
		protected.GET("/orders/:id", orderHandler.GetOrder)
		protected.PUT("/orders/:id/status", orderHandler.UpdateOrderStatus)
		protected.DELETE("/orders/:id", orderHandler.DeleteOrder)

		// Analytics and reports
		protected.GET("/analytics/dashboard", adminHandler.GetDashboard)
		protected.GET("/analytics/sales", adminHandler.GetSalesAnalytics)
		protected.GET("/analytics/users", adminHandler.GetUserAnalytics)
		protected.GET("/analytics/products", adminHandler.GetProductAnalytics)

		// System management
		protected.GET("/system/logs", adminHandler.GetSystemLogs)
		protected.POST("/system/backup", adminHandler.CreateBackup)
		protected.GET("/system/health", adminHandler.GetSystemHealth)
	}

	// Start server
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	// Graceful shutdown
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	log.Printf("🔐 Admin Service started on port %s", cfg.Port)
	log.Printf("📊 Health check: http://localhost:%s/health", cfg.Port)
	log.Printf("🔗 API endpoint: http://localhost:%s/api/v1", cfg.Port)

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}

func createDefaultAdmin(adminService *services.AdminService, cfg *config.Config) error {
	// Check if default admin already exists
	exists, err := adminService.AdminExists(cfg.AdminEmail)
	if err != nil {
		return err
	}

	if exists {
		log.Printf("Default admin user already exists: %s", cfg.AdminEmail)
		
		// Update admin password if it's different from environment
		if err := adminService.UpdateAdminPassword(cfg.AdminEmail, cfg.AdminPassword); err != nil {
			log.Printf("Warning: Failed to update admin password: %v", err)
		} else {
			log.Printf("✅ Admin password updated from environment variables")
		}
		return nil
	}

	// Create default admin
	admin := &models.Admin{
		Email:     cfg.AdminEmail,
		Username:  cfg.AdminUsername,
		FirstName: cfg.AdminFirstName,
		LastName:  cfg.AdminLastName,
		Role:      "super_admin",
		IsActive:  true,
	}

	if err := adminService.CreateAdmin(admin, cfg.AdminPassword); err != nil {
		return err
	}

	log.Printf("✅ Default admin user created: %s / %s", cfg.AdminEmail, cfg.AdminPassword)
	return nil
}
