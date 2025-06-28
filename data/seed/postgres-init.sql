-- PostgreSQL initialization script for payments database
-- This script runs when PostgreSQL container starts for the first time

-- Create payments database if it doesn't exist
-- (This is handled by POSTGRES_DB environment variable)

-- Connect to payments database
\c payments;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'refunded',
    'partially_refunded'
);

CREATE TYPE payment_method AS ENUM (
    'credit_card',
    'debit_card',
    'paypal',
    'stripe',
    'bank_transfer',
    'wallet',
    'cash_on_delivery'
);

CREATE TYPE transaction_type AS ENUM (
    'payment',
    'refund',
    'chargeback',
    'fee'
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status payment_status NOT NULL DEFAULT 'pending',
    payment_method payment_method NOT NULL,
    payment_gateway VARCHAR(100),
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create payment_transactions table for detailed transaction history
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_methods table for stored payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    type payment_method NOT NULL,
    provider VARCHAR(100) NOT NULL,
    provider_payment_method_id VARCHAR(255),
    last_four VARCHAR(4),
    brand VARCHAR(50),
    expires_month INTEGER,
    expires_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create refunds table
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    reason VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    gateway_refund_id VARCHAR(255),
    gateway_response JSONB,
    processed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_gateway_transaction_id ON payments(gateway_transaction_id);

CREATE INDEX idx_payment_transactions_payment_id ON payment_transactions(payment_id);
CREATE INDEX idx_payment_transactions_type ON payment_transactions(transaction_type);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(is_default);
CREATE INDEX idx_payment_methods_is_active ON payment_methods(is_active);

CREATE INDEX idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_refunds_created_at ON refunds(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON payment_methods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample payment methods for testing
INSERT INTO payment_methods (user_id, type, provider, last_four, brand, expires_month, expires_year, is_default, metadata) VALUES
('64a1b2c3d4e5f6789abcde01', 'credit_card', 'stripe', '4242', 'Visa', 12, 2025, true, '{"fingerprint": "test_fingerprint", "country": "US"}'),
('64a1b2c3d4e5f6789abcde01', 'paypal', 'paypal', null, null, null, null, false, '{"email": "user@example.com"}');

-- Insert sample payments for testing
INSERT INTO payments (order_id, user_id, amount, status, payment_method, payment_gateway, description) VALUES
('ORD-2024-001', '64a1b2c3d4e5f6789abcde01', 999.00, 'completed', 'credit_card', 'stripe', 'Payment for iPhone 15 Pro'),
('ORD-2024-002', '64a1b2c3d4e5f6789abcde01', 150.00, 'completed', 'paypal', 'paypal', 'Payment for Nike Air Max 270'),
('ORD-2024-003', '64a1b2c3d4e5f6789abcde01', 12.99, 'pending', 'credit_card', 'stripe', 'Payment for The Great Gatsby');

-- Create views for reporting
CREATE VIEW payment_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as payment_date,
    status,
    payment_method,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM payments 
GROUP BY DATE_TRUNC('day', created_at), status, payment_method
ORDER BY payment_date DESC;

CREATE VIEW daily_revenue AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_revenue,
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_revenue,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_transactions,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_transactions
FROM payments 
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Grant permissions (if needed for specific users)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO payment_service_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO payment_service_user;

-- Print completion message
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL payments database initialization completed successfully!';
    RAISE NOTICE 'Created tables: payments, payment_transactions, payment_methods, refunds';
    RAISE NOTICE 'Created indexes for optimal performance';
    RAISE NOTICE 'Inserted sample data for testing';
    RAISE NOTICE 'Created views: payment_summary, daily_revenue';
END $$;
