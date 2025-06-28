package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	Environment    string
	MongoURL       string
	JWTSecret      string
	AdminRegToken  string
	RedisURL       string
	VaultAddr      string
	VaultToken     string
	AllowedOrigins string
	AdminEmail     string
	AdminPassword  string
	AdminUsername  string
	AdminFirstName string
	AdminLastName  string
}

func Load() *Config {
	// Load .env file if it exists
	godotenv.Load()

	return &Config{
		Port:           getEnv("PORT", "8000"),
		Environment:    getEnv("NODE_ENV", "development"),
		MongoURL:       getEnv("MONGODB_URL", "mongodb://admin:password123@localhost:27017/ecommerce?authSource=admin"),
		JWTSecret:      getEnv("JWT_SECRET", "your-jwt-secret-change-in-production-2024"),
		AdminRegToken:  getEnv("ADMIN_REGISTRATION_TOKEN", "admin-reg-token-deepak-2024-secure"),
		RedisURL:       getEnv("REDIS_URL", "redis://:redis123@localhost:6379/2"),
		VaultAddr:      getEnv("VAULT_ADDR", "http://localhost:8200"),
		VaultToken:     getEnv("VAULT_TOKEN", "myroot"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3001,http://localhost:8080"),
		AdminEmail:     getEnv("ADMIN_EMAIL", "admin@ecommerce.com"),
		AdminPassword:  getEnv("ADMIN_PASSWORD", "admin123"),
		AdminUsername:  getEnv("ADMIN_USERNAME", "admin"),
		AdminFirstName: getEnv("ADMIN_FIRST_NAME", "Admin"),
		AdminLastName:  getEnv("ADMIN_LAST_NAME", "User"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
