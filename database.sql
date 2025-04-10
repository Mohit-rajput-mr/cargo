-- No CREATE DATABASE or USE statements -- it will just create these tables 
-- in whichever database you're already "in" with phpMyAdmin.

-- 1) Create the 'users' table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `siteId` VARCHAR(20) NOT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `truckType` VARCHAR(100) NOT NULL,
  `customTruckType` VARCHAR(100),
  `vehicleImage` VARCHAR(255),
  `idNumber` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `iban` VARCHAR(100),
  `swiftCode` VARCHAR(50),
  `recipientName` VARCHAR(255),
  `drivingLicenseFront` VARCHAR(255),
  `drivingLicenseBack` VARCHAR(255),
  `idCardFront` VARCHAR(255),
  `idCardBack` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `notifications` TEXT,
  PRIMARY KEY (`id`)
);

-- 2) Create the 'loads' table
CREATE TABLE IF NOT EXISTS `loads` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `imageUrl` TEXT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `pickup` VARCHAR(255) NOT NULL,
  `delivery` VARCHAR(255) NOT NULL,
  `pay` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- 3) Create the 'bids' table
CREATE TABLE IF NOT EXISTS `bids` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `loadId` INT NOT NULL,
  `bidAmount` VARCHAR(50) NOT NULL,
  `userId` INT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'pending',
  `adminMessage` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status_updated_at` TIMESTAMP NULL,
  `isRemoved` TINYINT(1) NOT NULL DEFAULT 0,
  `removed_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`)
);

-- 4) Create the 'contacts' table
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- 5) Create the 'services' table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- 6) Create the 'transactions' table
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `payDescription` TEXT,
  `paidAmount` VARCHAR(50) NOT NULL,
  `documentUrl` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
