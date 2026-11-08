-- Create database
CREATE DATABASE ingwanelihle_db;

-- Connect to database and create tables
\c ingwanelihle_db;

-- Enquiries table
CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    service_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'new',
    admin_notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at);
CREATE INDEX idx_enquiries_email ON enquiries(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;

$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_enquiries_updated_at 
    BEFORE UPDATE ON enquiries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
