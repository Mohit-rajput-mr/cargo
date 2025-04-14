CREATE DATABASE cargodb;
USE cargodb;

-- Table structure for table `bids`
CREATE TABLE `bids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loadId` int(11) NOT NULL,
  `bidAmount` varchar(50) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `adminMessage` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `status_updated_at` timestamp NULL DEFAULT NULL,
  `isRemoved` tinyint(1) NOT NULL DEFAULT 0,
  `removed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for table `contacts`
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for table `loads`
CREATE TABLE `loads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imageUrl` text NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `pickup` varchar(255) NOT NULL,
  `delivery` varchar(255) NOT NULL,
  `pay` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for table `services`
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for table `transactions`
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `payDescription` text DEFAULT NULL,
  `paidAmount` varchar(50) NOT NULL,
  `documentUrl` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `siteId` varchar(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `truckType` varchar(100) NOT NULL,
  `customTruckType` varchar(100) DEFAULT NULL,
  `vehicleImage` varchar(255) DEFAULT NULL,
  `idNumber` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `iban` varchar(100) DEFAULT NULL,
  `swiftCode` varchar(50) DEFAULT NULL,
  `recipientName` varchar(255) DEFAULT NULL,
  `drivingLicenseFront` varchar(255) DEFAULT NULL,
  `drivingLicenseBack` varchar(255) DEFAULT NULL,
  `idCardFront` varchar(255) DEFAULT NULL,
  `idCardBack` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `notifications` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;