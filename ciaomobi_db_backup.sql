-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: ciaomobi_db
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Activation`
--

DROP TABLE IF EXISTS `Activation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Activation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portability` tinyint(1) NOT NULL,
  `categoryOffer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryTarrif` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moodOfPayment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentDocument` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activationDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activationDocuments` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(65,30) DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  `userId` int NOT NULL,
  `tarrifId` int NOT NULL,
  `serialNumberId` int NOT NULL,
  `companyId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Activation_userId_idx` (`userId`),
  KEY `Activation_tarrifId_idx` (`tarrifId`),
  KEY `Activation_serialNumberId_idx` (`serialNumberId`),
  KEY `Activation_companyId_idx` (`companyId`),
  KEY `Activation_createdAt_idx` (`createdAt`),
  CONSTRAINT `Activation_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Activation_serialNumberId_fkey` FOREIGN KEY (`serialNumberId`) REFERENCES `serialNumber` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Activation_tarrifId_fkey` FOREIGN KEY (`tarrifId`) REFERENCES `Tarrif` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Activation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Activation`
--

LOCK TABLES `Activation` WRITE;
/*!40000 ALTER TABLE `Activation` DISABLE KEYS */;
/*!40000 ALTER TABLE `Activation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Actor`
--

DROP TABLE IF EXISTS `Actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Actor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Actor_email_key` (`email`),
  KEY `Actor_userId_fkey` (`userId`),
  CONSTRAINT `Actor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Actor`
--

LOCK TABLES `Actor` WRITE;
/*!40000 ALTER TABLE `Actor` DISABLE KEYS */;
/*!40000 ALTER TABLE `Actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zip` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Address_userId_fkey` (`userId`),
  CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Admin_email_key` (`email`),
  KEY `Admin_email_idx` (`email`),
  KEY `Admin_roleId_idx` (`roleId`),
  KEY `Admin_createdAt_idx` (`createdAt`),
  CONSTRAINT `Admin_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Analytics`
--

DROP TABLE IF EXISTS `Analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Analytics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `totalSales` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `orderCount` int NOT NULL DEFAULT '0',
  `productViews` int NOT NULL DEFAULT '0',
  `activeUsers` int NOT NULL DEFAULT '0',
  `topProducts` json DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Analytics_date_idx` (`date`),
  KEY `Analytics_type_idx` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Analytics`
--

LOCK TABLES `Analytics` WRITE;
/*!40000 ALTER TABLE `Analytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `Analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Banner`
--

DROP TABLE IF EXISTS `Banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Banner`
--

LOCK TABLES `Banner` WRITE;
/*!40000 ALTER TABLE `Banner` DISABLE KEYS */;
/*!40000 ALTER TABLE `Banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BillingAddress`
--

DROP TABLE IF EXISTS `BillingAddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BillingAddress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealerId` int NOT NULL,
  `street` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zipCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `municipality` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BillingAddress_dealerId_key` (`dealerId`),
  CONSTRAINT `BillingAddress_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BillingAddress`
--

LOCK TABLES `BillingAddress` WRITE;
/*!40000 ALTER TABLE `BillingAddress` DISABLE KEYS */;
/*!40000 ALTER TABLE `BillingAddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Brand`
--

DROP TABLE IF EXISTS `Brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Brand` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Brand_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brand`
--

LOCK TABLES `Brand` WRITE;
/*!40000 ALTER TABLE `Brand` DISABLE KEYS */;
/*!40000 ALTER TABLE `Brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cart`
--

DROP TABLE IF EXISTS `Cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `total` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Cart_userId_idx` (`userId`),
  KEY `Cart_createdAt_idx` (`createdAt`),
  CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cart`
--

LOCK TABLES `Cart` WRITE;
/*!40000 ALTER TABLE `Cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `Cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CartItem`
--

DROP TABLE IF EXISTS `CartItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CartItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `productId` int NOT NULL,
  `variationId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `CartItem_cartId_fkey` (`cartId`),
  KEY `CartItem_productId_fkey` (`productId`),
  KEY `CartItem_variationId_fkey` (`variationId`),
  CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CartItem_variationId_fkey` FOREIGN KEY (`variationId`) REFERENCES `ProductVariation` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CartItem`
--

LOCK TABLES `CartItem` WRITE;
/*!40000 ALTER TABLE `CartItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `CartItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'smartphone','smartphone','',NULL);
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Company`
--

DROP TABLE IF EXISTS `Company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Company_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Company`
--

LOCK TABLES `Company` WRITE;
/*!40000 ALTER TABLE `Company` DISABLE KEYS */;
/*!40000 ALTER TABLE `Company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CreditDetails`
--

DROP TABLE IF EXISTS `CreditDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CreditDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealerId` int NOT NULL,
  `assignedCreditLimit` double NOT NULL,
  `invoicesToPay` double NOT NULL,
  `availableCreditLimit` double NOT NULL,
  `escudo` double NOT NULL,
  `creditForTopUps` double NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CreditDetails_dealerId_key` (`dealerId`),
  CONSTRAINT `CreditDetails_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CreditDetails`
--

LOCK TABLES `CreditDetails` WRITE;
/*!40000 ALTER TABLE `CreditDetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `CreditDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dealer`
--

DROP TABLE IF EXISTS `Dealer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Dealer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealerCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vatNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taxCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adminPhone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pecEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adminEmail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `iban` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recoveryEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `websiteUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Dealer_dealerCode_key` (`dealerCode`),
  UNIQUE KEY `Dealer_companyName_key` (`companyName`),
  UNIQUE KEY `Dealer_adminPhone_key` (`adminPhone`),
  UNIQUE KEY `Dealer_adminEmail_key` (`adminEmail`),
  UNIQUE KEY `Dealer_vatNumber_key` (`vatNumber`),
  UNIQUE KEY `Dealer_pecEmail_key` (`pecEmail`),
  UNIQUE KEY `Dealer_iban_key` (`iban`),
  UNIQUE KEY `Dealer_recoveryEmail_key` (`recoveryEmail`),
  KEY `Dealer_companyName_idx` (`companyName`),
  KEY `Dealer_vatNumber_idx` (`vatNumber`),
  KEY `Dealer_adminEmail_idx` (`adminEmail`),
  KEY `Dealer_dealerCode_idx` (`dealerCode`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dealer`
--

LOCK TABLES `Dealer` WRITE;
/*!40000 ALTER TABLE `Dealer` DISABLE KEYS */;
/*!40000 ALTER TABLE `Dealer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Documents`
--

DROP TABLE IF EXISTS `Documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealerId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Documents_dealerId_fkey` (`dealerId`),
  CONSTRAINT `Documents_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Documents`
--

LOCK TABLES `Documents` WRITE;
/*!40000 ALTER TABLE `Documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `Documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Faq`
--

DROP TABLE IF EXISTS `Faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Faq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Faq`
--

LOCK TABLES `Faq` WRITE;
/*!40000 ALTER TABLE `Faq` DISABLE KEYS */;
/*!40000 ALTER TABLE `Faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Offer`
--

DROP TABLE IF EXISTS `Offer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Offer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Offer_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Offer`
--

LOCK TABLES `Offer` WRITE;
/*!40000 ALTER TABLE `Offer` DISABLE KEYS */;
/*!40000 ALTER TABLE `Offer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OfferCategory`
--

DROP TABLE IF EXISTS `OfferCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OfferCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `OfferCategory_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OfferCategory`
--

LOCK TABLES `OfferCategory` WRITE;
/*!40000 ALTER TABLE `OfferCategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `OfferCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `total` decimal(65,30) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  `subtotal` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `tax` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `discount` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `shippingCost` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentProof` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryProof` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderDocument` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentConfirmationDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `returnDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `returnProof` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `returnConfirmationDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `returnReason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `returnStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Order_orderNumber_key` (`orderNumber`),
  KEY `Order_userId_idx` (`userId`),
  KEY `Order_status_idx` (`status`),
  KEY `Order_createdAt_idx` (`createdAt`),
  KEY `Order_orderNumber_idx` (`orderNumber`),
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItem`
--

DROP TABLE IF EXISTS `OrderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `variationId` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(65,30) DEFAULT NULL,
  `discount` decimal(65,30) DEFAULT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_fkey` (`orderId`),
  KEY `OrderItem_productId_fkey` (`productId`),
  KEY `OrderItem_variationId_fkey` (`variationId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_variationId_fkey` FOREIGN KEY (`variationId`) REFERENCES `ProductVariation` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItem`
--

LOCK TABLES `OrderItem` WRITE;
/*!40000 ALTER TABLE `OrderItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderStatusHistory`
--

DROP TABLE IF EXISTS `OrderStatusHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderStatusHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `changedById` int NOT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderStatusHistory_orderId_idx` (`orderId`),
  KEY `OrderStatusHistory_changedAt_idx` (`changedAt`),
  KEY `OrderStatusHistory_changedById_idx` (`changedById`),
  CONSTRAINT `OrderStatusHistory_changedById_fkey` FOREIGN KEY (`changedById`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OrderStatusHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderStatusHistory`
--

LOCK TABLES `OrderStatusHistory` WRITE;
/*!40000 ALTER TABLE `OrderStatusHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderStatusHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pages`
--

DROP TABLE IF EXISTS `Pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pages`
--

LOCK TABLES `Pages` WRITE;
/*!40000 ALTER TABLE `Pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `Pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permission`
--

DROP TABLE IF EXISTS `Permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permission`
--

LOCK TABLES `Permission` WRITE;
/*!40000 ALTER TABLE `Permission` DISABLE KEYS */;
INSERT INTO `Permission` VALUES (1,'Manage Shop','Permission to add, update, or delete Shop Data.','2025-01-13 07:05:45.262','2025-01-13 07:05:45.262',NULL),(2,'Manage User','Permission to add, update, or delete Shop Data.','2025-01-13 07:05:53.321','2025-01-13 07:05:53.321',NULL),(3,'assign_permissions','Allows assigning/removing permissions to roles','2025-05-09 13:25:45.672','2025-05-09 13:25:45.672',NULL),(4,'create_dealers','Allows creating new dealers','2025-05-09 13:25:45.681','2025-05-09 13:25:45.681',NULL),(5,'delete_dealers','Allows soft-deleting dealers','2025-05-09 13:25:45.691','2025-05-09 13:25:45.691',NULL),(6,'delete_permissions','Allows soft-deleting permissions','2025-05-09 13:25:45.698','2025-05-09 13:25:45.698',NULL),(7,'delete_roles','Allows soft-deleting roles','2025-05-09 13:25:45.704','2025-05-09 13:25:45.704',NULL),(8,'generate_pdfs','Allows generating PDFs from images','2025-05-09 13:25:45.712','2025-05-09 13:25:45.712',NULL),(9,'manage_admins','Allows managing admin users','2025-05-09 13:25:45.720','2025-05-09 13:25:45.720',NULL),(10,'manage_assets','Allows deleting assets','2025-05-09 13:25:45.729','2025-05-09 13:25:45.729',NULL),(11,'manage_dealer_billing','Allows managing dealer billing addresses','2025-05-09 13:25:45.737','2025-05-09 13:25:45.737',NULL),(12,'manage_dealer_contracts','Allows managing dealer contracts','2025-05-09 13:25:45.745','2025-05-09 13:25:45.745',NULL),(13,'manage_dealer_credit','Allows managing dealer credit details','2025-05-09 13:25:45.753','2025-05-09 13:25:45.753',NULL),(14,'manage_dealer_documents','Allows managing dealer documents','2025-05-09 13:25:45.762','2025-05-09 13:25:45.762',NULL),(15,'manage_dealer_salepoints','Allows managing dealer sale points','2025-05-09 13:25:45.768','2025-05-09 13:25:45.768',NULL),(16,'manage_notifications','Allows sending notifications','2025-05-09 13:25:45.776','2025-05-09 13:25:45.776',NULL),(17,'manage_permissions','Allows managing permissions','2025-05-09 13:25:45.784','2025-05-09 13:25:45.784',NULL),(18,'manage_roles','Allows managing roles','2025-05-09 13:25:45.792','2025-05-09 13:25:45.792',NULL),(19,'manage_users','Allows managing general users','2025-05-09 13:25:45.801','2025-05-09 13:25:45.801',NULL),(20,'manage_workflows','Allows managing workflows','2025-05-09 13:25:45.808','2025-05-09 13:25:45.808',NULL),(21,'send_emails','Allows sending emails','2025-05-09 13:25:45.816','2025-05-09 13:25:45.816',NULL),(22,'update_dealers','Allows updating dealers','2025-05-09 13:25:45.825','2025-05-09 13:25:45.825',NULL),(23,'update_permissions','Allows updating permissions','2025-05-09 13:25:45.833','2025-05-09 13:25:45.833',NULL),(24,'update_roles','Allows updating roles','2025-05-09 13:25:45.841','2025-05-09 13:25:45.841',NULL),(25,'update_workflows','Allows updating workflows','2025-05-09 13:25:45.849','2025-05-09 13:25:45.849',NULL),(26,'upload_assets','Allows uploading assets','2025-05-09 13:25:45.863','2025-05-09 13:25:45.863',NULL),(27,'view_activation_analytics','Allows viewing activation analytics','2025-05-09 13:25:45.878','2025-05-09 13:25:45.878',NULL),(28,'view_all_notifications','Allows viewing all notifications','2025-05-09 13:25:45.889','2025-05-09 13:25:45.889',NULL),(29,'view_admins','Allows viewing admin users','2025-05-09 13:25:45.902','2025-05-09 13:25:45.902',NULL),(30,'view_assets','Allows viewing assets','2025-05-09 13:25:45.918','2025-05-09 13:25:45.918',NULL),(31,'view_dealer_analytics','Allows viewing dealer analytics','2025-05-09 13:25:45.929','2025-05-09 13:25:45.929',NULL),(32,'view_dealer_billing','Allows viewing dealer billing addresses','2025-05-09 13:25:45.937','2025-05-09 13:25:45.937',NULL),(33,'view_dealer_contracts','Allows viewing dealer contracts','2025-05-09 13:25:45.946','2025-05-09 13:25:45.946',NULL),(34,'view_dealer_credit','Allows viewing dealer credit details','2025-05-09 13:25:45.954','2025-05-09 13:25:45.954',NULL),(35,'view_dealer_documents','Allows viewing dealer documents','2025-05-09 13:25:45.960','2025-05-09 13:25:45.960',NULL),(36,'view_dealers','Allows viewing dealers','2025-05-09 13:25:45.968','2025-05-09 13:25:45.968',NULL),(37,'view_dealer_salepoints','Allows viewing dealer sale points','2025-05-09 13:25:45.976','2025-05-09 13:25:45.976',NULL),(38,'view_permissions','Allows viewing permissions','2025-05-09 13:25:45.984','2025-05-09 13:25:45.984',NULL),(39,'view_product_analytics','Allows viewing product analytics','2025-05-09 13:25:45.992','2025-05-09 13:25:45.992',NULL),(40,'view_revenue_forecast','Allows viewing revenue forecast','2025-05-09 13:25:46.001','2025-05-09 13:25:46.001',NULL),(41,'view_roles','Allows viewing roles','2025-05-09 13:25:46.008','2025-05-09 13:25:46.008',NULL),(42,'view_sales_analytics','Allows viewing sales analytics','2025-05-09 13:25:46.016','2025-05-09 13:25:46.016',NULL),(43,'view_user_analytics','Allows viewing user analytics','2025-05-09 13:25:46.024','2025-05-09 13:25:46.024',NULL),(44,'view_users','Allows viewing general users','2025-05-09 13:25:46.032','2025-05-09 13:25:46.032',NULL),(45,'view_workflows','Allows viewing workflows','2025-05-09 13:25:46.040','2025-05-09 13:25:46.040',NULL),(46,'manage_companies','Allows managing companies','2025-05-09 13:25:46.048','2025-05-09 13:25:46.048',NULL),(47,'view_sim_serials','Allows viewing SIM serial numbers','2025-05-09 13:25:46.056','2025-05-09 13:25:46.056',NULL),(48,'manage_sim_serials','Allows managing SIM serial numbers','2025-05-09 13:25:46.064','2025-05-09 13:25:46.064',NULL),(49,'view_serial_numbers','Allows viewing Serial Numbers','2025-05-09 13:25:46.072','2025-05-09 13:25:46.072',NULL),(50,'manage_serial_numbers','Allows managing Serial Numbers','2025-05-09 13:25:46.080','2025-05-09 13:25:46.080',NULL),(51,'view_activations','Allows viewing Activations','2025-05-09 13:25:46.088','2025-05-09 13:25:46.088',NULL),(52,'create_activations','Allows creating Activations','2025-05-09 13:25:46.094','2025-05-09 13:25:46.094',NULL),(53,'update_activations','Allows updating Activations','2025-05-09 13:25:46.102','2025-05-09 13:25:46.102',NULL),(54,'delete_activations','Allows deleting Activations','2025-05-09 13:25:46.110','2025-05-09 13:25:46.110',NULL),(55,'view_tariffs','Allows viewing Tariffs','2025-05-09 13:25:46.118','2025-05-09 13:25:46.118',NULL),(56,'manage_tariffs','Allows managing Tariffs and Tariff Options','2025-05-09 13:25:46.126','2025-05-09 13:25:46.126',NULL),(57,'view_carts','Allows viewing Carts','2025-05-09 13:25:46.134','2025-05-09 13:25:46.134',NULL),(58,'manage_carts','Allows managing Carts','2025-05-09 13:25:46.142','2025-05-09 13:25:46.142',NULL),(59,'view_products','view_products','2025-05-09 14:14:57.898','2025-05-09 14:14:57.898',NULL),(60,'view_companies','view_companies','2025-05-09 14:20:20.769','2025-05-09 14:20:20.769',NULL),(62,'view_categories','view_categories','2025-05-09 14:22:21.005','2025-05-09 14:22:21.005',NULL),(63,'manage_categories','manage_categories','2025-05-09 14:22:26.598','2025-05-09 14:22:26.598',NULL),(64,'manage_products','manage_products','2025-05-09 14:22:47.925','2025-05-09 14:22:47.925',NULL),(65,'view_all_orders','view_all_orders','2025-05-09 14:22:56.212','2025-05-09 14:22:56.212',NULL),(66,'manage_orders','manage_orders','2025-05-09 14:23:04.232','2025-05-09 14:23:04.232',NULL),(67,'view_all_carts','view_all_carts','2025-05-09 14:23:36.608','2025-05-09 14:23:36.608',NULL),(68,'view_banners','view_banners','2025-05-09 14:23:48.791','2025-05-09 14:23:48.791',NULL),(69,'manage_banners','manage_banners','2025-05-09 14:23:53.084','2025-05-09 14:23:53.084',NULL),(70,'view_dealer_serial_numbers','view_dealer_serial_numbers','2025-05-09 16:29:53.838','2025-05-09 16:29:53.838',NULL),(71,'view_user_activations','view_user_activations','2025-05-09 16:31:47.209','2025-05-09 16:31:47.209',NULL),(72,'manage_activations','manage_activations','2025-05-09 16:51:25.157','2025-05-09 16:51:25.157',NULL),(73,'view_brands','view_brands','2025-05-09 19:10:52.869','2025-05-09 19:10:52.869',NULL),(74,'manage_brands','manage_brands','2025-05-09 19:11:04.672','2025-05-09 19:11:04.672',NULL),(75,'user_permissions','user_permissions','2025-05-09 20:39:44.769','2025-05-09 20:39:44.769',NULL);
/*!40000 ALTER TABLE `Permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionIt` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `dealer_price` decimal(65,30) NOT NULL,
  `retail_price` decimal(65,30) NOT NULL,
  `purchase_price` decimal(65,30) NOT NULL,
  `margin` decimal(65,30) NOT NULL,
  `product_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `categoryId` int NOT NULL,
  `subCategoryId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  `brandId` int NOT NULL DEFAULT '1',
  `thumbnail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalSales` int NOT NULL DEFAULT '0',
  `viewCount` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_name_key` (`name`),
  UNIQUE KEY `Product_product_code_key` (`product_code`),
  KEY `Product_categoryId_idx` (`categoryId`),
  KEY `Product_subCategoryId_idx` (`subCategoryId`),
  KEY `Product_brandId_idx` (`brandId`),
  KEY `Product_createdAt_idx` (`createdAt`),
  KEY `Product_product_code_idx` (`product_code`),
  CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Product_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `subCategory` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductVariation`
--

DROP TABLE IF EXISTS `ProductVariation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProductVariation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` int NOT NULL,
  `productId` int NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ProductVariation_productId_fkey` (`productId`),
  CONSTRAINT `ProductVariation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductVariation`
--

LOCK TABLES `ProductVariation` WRITE;
/*!40000 ALTER TABLE `ProductVariation` DISABLE KEYS */;
/*!40000 ALTER TABLE `ProductVariation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'user','user','2025-01-13 07:05:33.233','2025-01-13 07:05:33.233',NULL),(2,'admin','admin description','2025-01-13 07:05:22.979','2025-01-15 18:16:59.858',NULL),(3,'SuperAdmin','SuperAdmin role','2025-05-09 13:25:46.149','2025-05-09 13:25:46.149',NULL),(4,'SalesManager','SalesManager role','2025-05-09 13:25:46.157','2025-05-09 13:25:46.157',NULL),(5,'ShopManager','ShopManager role','2025-05-09 13:25:46.165','2025-05-09 13:25:46.165',NULL),(6,'DealerViewer','DealerViewer role','2025-05-09 13:25:46.173','2025-05-09 13:25:46.173',NULL),(7,'DealerSales','DealerSales role','2025-05-09 13:25:46.181','2025-05-09 13:25:46.181',NULL),(8,'DealerActivator','DealerActivator role','2025-05-09 13:25:46.192','2025-05-09 13:25:46.192',NULL),(9,'DealerAccounts','DealerAccounts role','2025-05-09 13:25:46.199','2025-05-09 13:25:46.199',NULL),(10,'DealerManager','DealerManager role','2025-05-09 13:25:46.205','2025-05-09 13:25:46.205',NULL),(11,'manager','Manager','2025-05-09 20:15:33.039','2025-05-09 20:18:08.579',NULL);
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SalePoint`
--

DROP TABLE IF EXISTS `SalePoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SalePoint` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealerId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `SalePoint_dealerId_fkey` (`dealerId`),
  CONSTRAINT `SalePoint_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SalePoint`
--

LOCK TABLES `SalePoint` WRITE;
/*!40000 ALTER TABLE `SalePoint` DISABLE KEYS */;
/*!40000 ALTER TABLE `SalePoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SignedContract`
--

DROP TABLE IF EXISTS `SignedContract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SignedContract` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealerId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `signedOn` datetime(3) NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `SignedContract_dealerId_fkey` (`dealerId`),
  CONSTRAINT `SignedContract_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SignedContract`
--

LOCK TABLES `SignedContract` WRITE;
/*!40000 ALTER TABLE `SignedContract` DISABLE KEYS */;
/*!40000 ALTER TABLE `SignedContract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteInfo`
--

DROP TABLE IF EXISTS `SiteInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SiteInfo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `webLogo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobileLogo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favicon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteInfo`
--

LOCK TABLES `SiteInfo` WRITE;
/*!40000 ALTER TABLE `SiteInfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `SiteInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SocialMedia`
--

DROP TABLE IF EXISTS `SocialMedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialMedia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SocialMedia`
--

LOCK TABLES `SocialMedia` WRITE;
/*!40000 ALTER TABLE `SocialMedia` DISABLE KEYS */;
/*!40000 ALTER TABLE `SocialMedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tarrif`
--

DROP TABLE IF EXISTS `Tarrif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tarrif` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  `companyId` int NOT NULL,
  `categoryOffer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryTarrif` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `portability` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(65,30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tarrif_name_key` (`name`),
  KEY `Tarrif_companyId_fkey` (`companyId`),
  CONSTRAINT `Tarrif_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tarrif`
--

LOCK TABLES `Tarrif` WRITE;
/*!40000 ALTER TABLE `Tarrif` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tarrif` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TarrifOptions`
--

DROP TABLE IF EXISTS `TarrifOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TarrifOptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TarrifOptions_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TarrifOptions`
--

LOCK TABLES `TarrifOptions` WRITE;
/*!40000 ALTER TABLE `TarrifOptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `TarrifOptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `dealerId` int DEFAULT NULL,
  `passwordResetExpires` datetime(3) DEFAULT NULL,
  `passwordResetToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_email_idx` (`email`),
  KEY `User_roleId_idx` (`roleId`),
  KEY `User_createdAt_idx` (`createdAt`),
  KEY `User_dealerId_idx` (`dealerId`),
  CONSTRAINT `User_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'syfuddhin@gmail.com','Syfuddin','$2a$10$3TysxhiL2hhAovdVJ6tJyOra0YCZIyhdutSTAodj2MTMCCDXxl6pu',NULL,3,'2025-01-16 17:28:23.421','2025-05-09 14:25:51.825',NULL,NULL,NULL,NULL),(2,'syfuddhin1@gmail.com','syfuddhin user','$2a$10$tsVZROZlqK3ZCx2E2UHFM.u01MOozEQvoRoUA2vMGvfMTC5zDTi8W',NULL,1,'2025-05-09 14:26:49.343','2025-05-09 20:07:19.251',1,NULL,NULL,NULL),(3,'Soab42@gmail.com','Soab admin','$2a$10$kk/m/CADxJIvZti.IP292.araIQxvCCwVonLZoy0QpLe7bLH5ax8e',NULL,2,'2025-05-09 19:41:21.829','2025-05-09 19:41:21.829',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workflow`
--

DROP TABLE IF EXISTS `Workflow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workflow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `referenceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workflow`
--

LOCK TABLES `Workflow` WRITE;
/*!40000 ALTER TABLE `Workflow` DISABLE KEYS */;
/*!40000 ALTER TABLE `Workflow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkflowStep`
--

DROP TABLE IF EXISTS `WorkflowStep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkflowStep` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workflowId` int NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actorId` int NOT NULL,
  `actorRole` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `WorkflowStep_workflowId_idx` (`workflowId`),
  KEY `WorkflowStep_actorId_idx` (`actorId`),
  KEY `WorkflowStep_createdAt_idx` (`createdAt`),
  CONSTRAINT `WorkflowStep_workflowId_fkey` FOREIGN KEY (`workflowId`) REFERENCES `Workflow` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkflowStep`
--

LOCK TABLES `WorkflowStep` WRITE;
/*!40000 ALTER TABLE `WorkflowStep` DISABLE KEYS */;
/*!40000 ALTER TABLE `WorkflowStep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_ActorToWorkflowStep`
--

DROP TABLE IF EXISTS `_ActorToWorkflowStep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_ActorToWorkflowStep` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_ActorToWorkflowStep_AB_unique` (`A`,`B`),
  KEY `_ActorToWorkflowStep_B_index` (`B`),
  CONSTRAINT `_ActorToWorkflowStep_A_fkey` FOREIGN KEY (`A`) REFERENCES `Actor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_ActorToWorkflowStep_B_fkey` FOREIGN KEY (`B`) REFERENCES `WorkflowStep` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_ActorToWorkflowStep`
--

LOCK TABLES `_ActorToWorkflowStep` WRITE;
/*!40000 ALTER TABLE `_ActorToWorkflowStep` DISABLE KEYS */;
/*!40000 ALTER TABLE `_ActorToWorkflowStep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_FaqToSiteInfo`
--

DROP TABLE IF EXISTS `_FaqToSiteInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_FaqToSiteInfo` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_FaqToSiteInfo_AB_unique` (`A`,`B`),
  KEY `_FaqToSiteInfo_B_index` (`B`),
  CONSTRAINT `_FaqToSiteInfo_A_fkey` FOREIGN KEY (`A`) REFERENCES `Faq` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_FaqToSiteInfo_B_fkey` FOREIGN KEY (`B`) REFERENCES `SiteInfo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_FaqToSiteInfo`
--

LOCK TABLES `_FaqToSiteInfo` WRITE;
/*!40000 ALTER TABLE `_FaqToSiteInfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `_FaqToSiteInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_OfferToOfferCategory`
--

DROP TABLE IF EXISTS `_OfferToOfferCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_OfferToOfferCategory` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_OfferToOfferCategory_AB_unique` (`A`,`B`),
  KEY `_OfferToOfferCategory_B_index` (`B`),
  CONSTRAINT `_OfferToOfferCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Offer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_OfferToOfferCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `OfferCategory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_OfferToOfferCategory`
--

LOCK TABLES `_OfferToOfferCategory` WRITE;
/*!40000 ALTER TABLE `_OfferToOfferCategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `_OfferToOfferCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_OfferToProduct`
--

DROP TABLE IF EXISTS `_OfferToProduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_OfferToProduct` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_OfferToProduct_AB_unique` (`A`,`B`),
  KEY `_OfferToProduct_B_index` (`B`),
  CONSTRAINT `_OfferToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `Offer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_OfferToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_OfferToProduct`
--

LOCK TABLES `_OfferToProduct` WRITE;
/*!40000 ALTER TABLE `_OfferToProduct` DISABLE KEYS */;
/*!40000 ALTER TABLE `_OfferToProduct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_OrderProducts`
--

DROP TABLE IF EXISTS `_OrderProducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_OrderProducts` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_OrderProducts_AB_unique` (`A`,`B`),
  KEY `_OrderProducts_B_index` (`B`),
  CONSTRAINT `_OrderProducts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_OrderProducts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_OrderProducts`
--

LOCK TABLES `_OrderProducts` WRITE;
/*!40000 ALTER TABLE `_OrderProducts` DISABLE KEYS */;
/*!40000 ALTER TABLE `_OrderProducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_PagesToSiteInfo`
--

DROP TABLE IF EXISTS `_PagesToSiteInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_PagesToSiteInfo` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_PagesToSiteInfo_AB_unique` (`A`,`B`),
  KEY `_PagesToSiteInfo_B_index` (`B`),
  CONSTRAINT `_PagesToSiteInfo_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_PagesToSiteInfo_B_fkey` FOREIGN KEY (`B`) REFERENCES `SiteInfo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_PagesToSiteInfo`
--

LOCK TABLES `_PagesToSiteInfo` WRITE;
/*!40000 ALTER TABLE `_PagesToSiteInfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `_PagesToSiteInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_PermissionToRole`
--

DROP TABLE IF EXISTS `_PermissionToRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_PermissionToRole` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_PermissionToRole_AB_unique` (`A`,`B`),
  KEY `_PermissionToRole_B_index` (`B`),
  CONSTRAINT `_PermissionToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_PermissionToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_PermissionToRole`
--

LOCK TABLES `_PermissionToRole` WRITE;
/*!40000 ALTER TABLE `_PermissionToRole` DISABLE KEYS */;
INSERT INTO `_PermissionToRole` VALUES (8,1),(22,1),(26,1),(30,1),(36,1),(51,1),(52,1),(55,1),(57,1),(59,1),(60,1),(62,1),(65,1),(66,1),(67,1),(68,1),(70,1),(71,1),(72,1),(75,1),(1,2),(2,2),(4,2),(5,2),(8,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(19,2),(21,2),(22,2),(25,2),(26,2),(27,2),(28,2),(29,2),(30,2),(31,2),(32,2),(33,2),(34,2),(35,2),(36,2),(37,2),(38,2),(39,2),(40,2),(41,2),(42,2),(43,2),(44,2),(46,2),(47,2),(48,2),(49,2),(50,2),(51,2),(52,2),(53,2),(54,2),(55,2),(56,2),(57,2),(58,2),(59,2),(60,2),(62,2),(63,2),(64,2),(65,2),(66,2),(67,2),(68,2),(69,2),(70,2),(71,2),(72,2),(73,2),(74,2),(75,2),(1,3),(3,3),(4,3),(5,3),(6,3),(7,3),(8,3),(9,3),(10,3),(11,3),(12,3),(13,3),(14,3),(15,3),(16,3),(17,3),(18,3),(19,3),(20,3),(21,3),(22,3),(23,3),(24,3),(25,3),(26,3),(27,3),(28,3),(29,3),(30,3),(31,3),(32,3),(33,3),(34,3),(35,3),(36,3),(37,3),(38,3),(39,3),(40,3),(41,3),(42,3),(43,3),(44,3),(45,3),(46,3),(47,3),(48,3),(49,3),(50,3),(51,3),(52,3),(53,3),(54,3),(55,3),(56,3),(57,3),(58,3),(59,3),(60,3),(62,3),(63,3),(64,3),(65,3),(66,3),(67,3),(68,3),(69,3),(70,3),(71,3),(72,3),(73,3),(74,3),(75,3),(1,4),(4,4),(5,4),(8,4),(11,4),(12,4),(13,4),(14,4),(15,4),(21,4),(22,4),(26,4),(30,4),(31,4),(32,4),(33,4),(34,4),(35,4),(36,4),(37,4),(39,4),(40,4),(42,4),(46,4),(47,4),(48,4),(49,4),(50,4),(51,4),(52,4),(53,4),(54,4),(55,4),(56,4),(57,4),(58,4),(1,5),(10,5),(26,5),(30,5),(39,5),(47,5),(49,5),(51,5),(55,5),(27,6),(30,6),(31,6),(32,6),(33,6),(34,6),(35,6),(36,6),(37,6),(39,6),(40,6),(42,6),(43,6),(45,6),(47,6),(49,6),(51,6),(55,6),(57,6),(12,7),(14,7),(15,7),(20,7),(26,7),(27,7),(30,7),(31,7),(32,7),(33,7),(34,7),(35,7),(36,7),(37,7),(39,7),(40,7),(42,7),(43,7),(45,7),(47,7),(49,7),(51,7),(55,7),(57,7),(14,8),(20,8),(26,8),(27,8),(30,8),(31,8),(33,8),(35,8),(36,8),(37,8),(39,8),(45,8),(47,8),(49,8),(51,8),(55,8),(11,9),(12,9),(13,9),(14,9),(26,9),(31,9),(32,9),(33,9),(34,9),(35,9),(36,9),(37,9),(40,9),(42,9),(43,9),(45,9),(55,9),(57,9),(5,10),(11,10),(12,10),(13,10),(14,10),(15,10),(20,10),(22,10),(26,10),(27,10),(30,10),(31,10),(32,10),(33,10),(34,10),(35,10),(36,10),(37,10),(39,10),(40,10),(42,10),(43,10),(45,10),(46,10),(47,10),(48,10),(49,10),(50,10),(51,10),(52,10),(53,10),(54,10),(55,10),(56,10),(57,10),(58,10);
/*!40000 ALTER TABLE `_PermissionToRole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_SiteInfoToSocialMedia`
--

DROP TABLE IF EXISTS `_SiteInfoToSocialMedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_SiteInfoToSocialMedia` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_SiteInfoToSocialMedia_AB_unique` (`A`,`B`),
  KEY `_SiteInfoToSocialMedia_B_index` (`B`),
  CONSTRAINT `_SiteInfoToSocialMedia_A_fkey` FOREIGN KEY (`A`) REFERENCES `SiteInfo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_SiteInfoToSocialMedia_B_fkey` FOREIGN KEY (`B`) REFERENCES `SocialMedia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_SiteInfoToSocialMedia`
--

LOCK TABLES `_SiteInfoToSocialMedia` WRITE;
/*!40000 ALTER TABLE `_SiteInfoToSocialMedia` DISABLE KEYS */;
/*!40000 ALTER TABLE `_SiteInfoToSocialMedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adminRefreshToken`
--

DROP TABLE IF EXISTS `adminRefreshToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminRefreshToken` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adminId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `adminRefreshToken_token_key` (`token`),
  KEY `adminRefreshToken_adminId_idx` (`adminId`),
  KEY `adminRefreshToken_createdAt_idx` (`createdAt`),
  CONSTRAINT `adminRefreshToken_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminRefreshToken`
--

LOCK TABLES `adminRefreshToken` WRITE;
/*!40000 ALTER TABLE `adminRefreshToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `adminRefreshToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int NOT NULL,
  `seen` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_userId_idx` (`userId`),
  KEY `notification_seen_idx` (`seen`),
  KEY `notification_createdAt_idx` (`createdAt`),
  CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp`
--

DROP TABLE IF EXISTS `otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `otp_token_key` (`token`),
  UNIQUE KEY `otp_userId_key` (`userId`),
  KEY `otp_userId_idx` (`userId`),
  KEY `otp_createdAt_idx` (`createdAt`),
  CONSTRAINT `otp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp`
--

LOCK TABLES `otp` WRITE;
/*!40000 ALTER TABLE `otp` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passwordReset`
--

DROP TABLE IF EXISTS `passwordReset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passwordReset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `passwordReset_token_key` (`token`),
  UNIQUE KEY `passwordReset_userId_key` (`userId`),
  KEY `passwordReset_userId_idx` (`userId`),
  KEY `passwordReset_createdAt_idx` (`createdAt`),
  CONSTRAINT `passwordReset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwordReset`
--

LOCK TABLES `passwordReset` WRITE;
/*!40000 ALTER TABLE `passwordReset` DISABLE KEYS */;
/*!40000 ALTER TABLE `passwordReset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refreshToken`
--

DROP TABLE IF EXISTS `refreshToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refreshToken` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `refreshToken_token_key` (`token`),
  KEY `refreshToken_userId_idx` (`userId`),
  KEY `refreshToken_createdAt_idx` (`createdAt`),
  CONSTRAINT `refreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refreshToken`
--

LOCK TABLES `refreshToken` WRITE;
/*!40000 ALTER TABLE `refreshToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `refreshToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serialNumber`
--

DROP TABLE IF EXISTS `serialNumber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serialNumber` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyId` int DEFAULT NULL,
  `dealerId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serialNumber_number_key` (`number`),
  KEY `serialNumber_companyId_idx` (`companyId`),
  KEY `serialNumber_dealerId_idx` (`dealerId`),
  KEY `serialNumber_createdAt_idx` (`createdAt`),
  CONSTRAINT `serialNumber_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `serialNumber_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serialNumber`
--

LOCK TABLES `serialNumber` WRITE;
/*!40000 ALTER TABLE `serialNumber` DISABLE KEYS */;
/*!40000 ALTER TABLE `serialNumber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subCategory`
--

DROP TABLE IF EXISTS `subCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryId` int NOT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subCategory_name_key` (`name`),
  KEY `subCategory_categoryId_fkey` (`categoryId`),
  CONSTRAINT `subCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subCategory`
--

LOCK TABLES `subCategory` WRITE;
/*!40000 ALTER TABLE `subCategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `subCategory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-10  3:09:59
