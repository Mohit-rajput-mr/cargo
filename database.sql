-- =====================================================
-- CARGO MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Database: MySQL
-- This schema includes database creation and all tables
-- =====================================================

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `cargo_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `cargo_db`;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
-- Stores user/driver information including authentication,
-- profile data, documents, and notifications
-- =====================================================
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `siteId` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique site identifier (e.g., T1, T2)',
  `username` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Login username',
  `password` VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
  `name` VARCHAR(255) DEFAULT NULL COMMENT 'Full name',
  `email` VARCHAR(255) DEFAULT NULL COMMENT 'Email address',
  `phone` VARCHAR(50) DEFAULT NULL COMMENT 'Phone number',
  `truckType` VARCHAR(100) DEFAULT NULL COMMENT 'Type of truck',
  `customTruckType` VARCHAR(100) DEFAULT NULL COMMENT 'Custom truck type if other',
  `vehicleImage` TEXT DEFAULT NULL COMMENT 'URL to vehicle image (Cloudinary)',
  `idNumber` VARCHAR(100) DEFAULT NULL COMMENT 'ID/Passport number',
  `iban` VARCHAR(50) DEFAULT NULL COMMENT 'Bank IBAN',
  `swiftCode` VARCHAR(50) DEFAULT NULL COMMENT 'Bank SWIFT code',
  `recipientName` VARCHAR(255) DEFAULT NULL COMMENT 'Bank account recipient name',
  `drivingLicenseFront` TEXT DEFAULT NULL COMMENT 'URL to driving license front image',
  `drivingLicenseBack` TEXT DEFAULT NULL COMMENT 'URL to driving license back image',
  `idCardFront` TEXT DEFAULT NULL COMMENT 'URL to ID card front image',
  `idCardBack` TEXT DEFAULT NULL COMMENT 'URL to ID card back image',
  `notifications` JSON DEFAULT NULL COMMENT 'JSON array of user notifications',
  `isDeleted` TINYINT(1) DEFAULT 0 COMMENT 'Soft delete flag (0=active, 1=deleted)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  INDEX `idx_username` (`username`),
  INDEX `idx_siteId` (`siteId`),
  INDEX `idx_email` (`email`),
  INDEX `idx_isDeleted` (`isDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User/Driver accounts and profiles';

-- =====================================================
-- 2. LOADS TABLE
-- =====================================================
-- Stores cargo load information that drivers can bid on
-- =====================================================
CREATE TABLE `loads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `imageUrl` TEXT DEFAULT NULL COMMENT 'Main load image URL (Cloudinary)',
  `title` VARCHAR(255) NOT NULL COMMENT 'Load title/description',
  `description` TEXT DEFAULT NULL COMMENT 'Detailed load description',
  `pickup` VARCHAR(255) DEFAULT NULL COMMENT 'Pickup location',
  `delivery` VARCHAR(255) DEFAULT NULL COMMENT 'Delivery location',
  `pay` DECIMAL(10, 2) DEFAULT NULL COMMENT 'Payment amount for the load',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Load creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cargo loads available for bidding';

-- =====================================================
-- 3. LOAD_IMAGES TABLE
-- =====================================================
-- Stores multiple images per load (one-to-many relationship)
-- =====================================================
CREATE TABLE `load_images` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `load_id` INT UNSIGNED NOT NULL COMMENT 'Foreign key to loads table',
  `image_url` TEXT NOT NULL COMMENT 'Image URL (Cloudinary)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Image upload timestamp',
  FOREIGN KEY (`load_id`) REFERENCES `loads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_load_id` (`load_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Multiple images per load';

-- =====================================================
-- 4. BIDS TABLE
-- =====================================================
-- Stores driver bids on loads with approval/rejection status
-- =====================================================
CREATE TABLE `bids` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `loadId` INT UNSIGNED NOT NULL COMMENT 'Foreign key to loads table',
  `userId` INT UNSIGNED NOT NULL COMMENT 'Foreign key to users table (driver)',
  `bidAmount` DECIMAL(10, 2) NOT NULL COMMENT 'Bid amount offered by driver',
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT 'Bid status',
  `adminMessage` TEXT DEFAULT NULL COMMENT 'Admin message/notes on approval/rejection',
  `isRemoved` TINYINT(1) DEFAULT 0 COMMENT 'Soft delete flag (0=active, 1=removed)',
  `removed_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp when bid was removed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Bid creation timestamp',
  `status_updated_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp when status was last updated',
  FOREIGN KEY (`loadId`) REFERENCES `loads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_loadId` (`loadId`),
  INDEX `idx_userId` (`userId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_isRemoved` (`isRemoved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Driver bids on loads';

-- =====================================================
-- 5. TRANSACTIONS TABLE
-- =====================================================
-- Stores user transaction records (payments, earnings)
-- =====================================================
CREATE TABLE `transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL COMMENT 'Foreign key to users table',
  `payDescription` TEXT DEFAULT NULL COMMENT 'Transaction description',
  `paidAmount` DECIMAL(10, 2) NOT NULL COMMENT 'Transaction amount',
  `documentUrl` TEXT DEFAULT NULL COMMENT 'URL to transaction document',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Transaction creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User transaction records';

-- =====================================================
-- 6. CLIENT_TRANSACTIONS TABLE
-- =====================================================
-- Stores Stripe payment transactions from clients to drivers
-- =====================================================
CREATE TABLE `client_transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `loadId` INT UNSIGNED NOT NULL COMMENT 'Foreign key to loads table',
  `driverId` INT UNSIGNED NOT NULL COMMENT 'Foreign key to users table (driver)',
  `clientEmail` VARCHAR(255) NOT NULL COMMENT 'Client email address',
  `amount` DECIMAL(10, 2) NOT NULL COMMENT 'Payment amount',
  `stripePaymentId` VARCHAR(255) DEFAULT NULL COMMENT 'Stripe payment intent ID',
  `paymentLink` TEXT DEFAULT NULL COMMENT 'Stripe checkout session URL',
  `status` ENUM('pending', 'paid', 'failed', 'cancelled') DEFAULT 'pending' COMMENT 'Payment status',
  `adminStatus` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT 'Admin approval status',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Transaction creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  FOREIGN KEY (`loadId`) REFERENCES `loads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`driverId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_loadId` (`loadId`),
  INDEX `idx_driverId` (`driverId`),
  INDEX `idx_clientEmail` (`clientEmail`),
  INDEX `idx_status` (`status`),
  INDEX `idx_adminStatus` (`adminStatus`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stripe payment transactions from clients';

-- =====================================================
-- 7. CONTACTS TABLE
-- =====================================================
-- Stores contact form submissions
-- =====================================================
CREATE TABLE `contacts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `description` TEXT NOT NULL COMMENT 'Contact message/description',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Contact submission timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Contact form submissions';

-- =====================================================
-- 8. SERVICES TABLE
-- =====================================================
-- Stores service descriptions/information
-- =====================================================
CREATE TABLE `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `description` TEXT NOT NULL COMMENT 'Service description',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Service creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Service information';

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- =====================================================
-- OPTIONAL: SAMPLE DATA (Uncomment if needed for testing)
-- =====================================================
/*
-- NOTE: Admin user is NOT stored in database - it's hardcoded in the application
-- Admin credentials: username='admin', password='a123'

-- Insert sample driver users for testing
-- Password for driver1: 'driver123'
INSERT INTO `users` (`siteId`, `username`, `password`, `name`, `email`, `phone`, `truckType`) 
VALUES ('T1', 'driver1', '$2b$10$LwCg5q6Bu.rGuayTRDcA/ubs0bxYfSnZxuFgiFbP2eVhFR.UXTus6', 'John Driver', 'driver1@test.com', '+1234567890', 'Flatbed');

-- Password for driver2: 'user123'
INSERT INTO `users` (`siteId`, `username`, `password`, `name`, `email`, `phone`, `truckType`) 
VALUES ('T2', 'driver2', '$2b$10$g/zdxg5xfIPqWcBaCJ/o2uRI.MtP4Ijdl5xyPy0RHdBnhbm3F7H7q', 'Jane Driver', 'driver2@test.com', '+1234567891', 'Box Truck');

-- Insert sample services
INSERT INTO `services` (`description`) VALUES 
('Freight Transportation'),
('Warehouse Management'),
('Logistics Solutions');

-- Insert sample contacts
INSERT INTO `contacts` (`description`) VALUES 
('Sample contact message');
*/

-- =====================================================
-- DATABASE SETUP INSTRUCTIONS
-- =====================================================
-- This file automatically creates the database and all tables.
--
-- To run this schema file:
-- 
-- Option 1: Using MySQL Command Line
--    mysql -u your_user -p < database.sql
--
-- Option 2: Using MySQL Workbench
--    1. Open MySQL Workbench
--    2. Connect to your MySQL server
--    3. File → Open SQL Script → Select database.sql
--    4. Execute the script
--
-- Option 3: Using MySQL CLI (already connected)
--    source /path/to/database.sql;
--
-- After running this file, update your .env file with:
--    MYSQL_HOST=localhost
--    MYSQL_USER=your_user
--    MYSQL_PASSWORD=your_password
--    MYSQL_DATABASE=cargo_db
-- =====================================================

