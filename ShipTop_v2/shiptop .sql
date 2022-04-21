-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2022 at 01:24 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shiptop`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountants`
--

CREATE TABLE `accountants` (
  `accountantID` int(8) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `updatedBy` varchar(11) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `administrators`
--

CREATE TABLE `administrators` (
  `administratorID` int(8) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `consignors`
--

CREATE TABLE `consignors` (
  `consignorID` int(8) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `rate` int(5) NOT NULL DEFAULT 0,
  `updatedBy` varchar(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `dispatchers`
--

CREATE TABLE `dispatchers` (
  `dispatcherID` int(8) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `updatedBy` varchar(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driverID` int(8) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` int(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `vehicleID` int(8) DEFAULT NULL,
  `dispatcherID` varchar(11) DEFAULT NULL,
  `updatedBy` varchar(11) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `email` varchar(255) NOT NULL,
  `employeeID` varchar(11) DEFAULT NULL,
  `role` varchar(11) DEFAULT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `phoneNumber` varchar(8) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `updatedBy` varchar(8) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`email`, `employeeID`, `role`, `firstName`, `lastName`, `phoneNumber`, `password`, `updatedBy`, `lastUpdate`) VALUES
('aaa@gmail.com', '23', 'WM', 'ahmed', 'ali', '02184654', 'yuhjmhg2', 'LM75', '2022-04-21 09:02:46'),
('lop@gmail.com', '22', 'WM', 'abdullah', 'omar', '05369874', 'ophv1864', 'LM75', '2022-04-22 00:00:50');

-- --------------------------------------------------------

--
-- Table structure for table `freightbrokers`
--

CREATE TABLE `freightbrokers` (
  `freightBrokerID` int(8) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `consignorID` varchar(11) DEFAULT NULL,
  `updatedBy` varchar(11) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoiceID` int(9) NOT NULL,
  `orderID` int(11) DEFAULT NULL,
  `date` date DEFAULT current_timestamp(),
  `recipent` varchar(255) DEFAULT NULL,
  `amount` int(255) DEFAULT NULL,
  `payment` int(255) DEFAULT NULL,
  `accountantID` int(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `logisticmanagers`
--

CREATE TABLE `logisticmanagers` (
  `logisticManagerID` int(8) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `adminID` varchar(11) NOT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderID` int(8) NOT NULL,
  `senderID` int(11) NOT NULL,
  `receiverID` int(11) NOT NULL,
  `paymentStatus` tinyint(1) DEFAULT NULL,
  `deliveryStatus` tinyint(1) DEFAULT NULL,
  `senderAddress` varchar(11) DEFAULT NULL,
  `receiverAddress` varchar(11) DEFAULT NULL,
  `departureDate` datetime DEFAULT NULL,
  `estimatedArrivalDate` varchar(11) DEFAULT 'TBA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `shipmentID` int(8) DEFAULT NULL,
  `recordedPlace` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `updatedBy` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `ReportID` int(11) NOT NULL,
  `EMail` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `Content` varchar(255) DEFAULT NULL,
  `customerServerID` int(8) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shelfs`
--

CREATE TABLE `shelfs` (
  `shelfNumber` int(8) NOT NULL,
  `row` int(8) DEFAULT NULL,
  `section` varchar(8) DEFAULT NULL,
  `lane` int(8) DEFAULT NULL,
  `floor` varchar(30) DEFAULT NULL,
  `isReserved` tinyint(1) DEFAULT NULL,
  `warehouseID` int(8) DEFAULT NULL,
  `shipmentID` int(8) DEFAULT NULL,
  `workerID` int(8) DEFAULT 0,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shipments`
--

CREATE TABLE `shipments` (
  `shipmentID` int(10) NOT NULL,
  `orderID` int(11) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `length` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `isBreakable` tinyint(1) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `currentCity` varchar(30) DEFAULT NULL,
  `nextCity` varchar(30) DEFAULT NULL,
  `deliveryDate` date DEFAULT NULL,
  `currentUserID` varchar(11) DEFAULT NULL,
  `nextUserID` varchar(11) DEFAULT NULL,
  `updatedBy` varchar(11) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicleID` int(11) NOT NULL,
  `vehicleName` varchar(255) DEFAULT NULL,
  `manufacturerCompany` varchar(255) DEFAULT NULL,
  `model` varchar(11) DEFAULT NULL,
  `weight` double DEFAULT NULL COMMENT 'in Tons',
  `color` varchar(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `assignedDriver` varchar(255) DEFAULT NULL,
  `dispatcherID` varchar(11) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `warehousemanagers`
--

CREATE TABLE `warehousemanagers` (
  `warehouseManagerID` int(8) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `updatedBy` varchar(11) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `warehousemanagers`
--

INSERT INTO `warehousemanagers` (`warehouseManagerID`, `firstName`, `lastName`, `email`, `phoneNumber`, `password`, `updatedBy`, `lastUpdate`) VALUES
(22, 'abdullah', 'omar', 'lop@gmail.com', '053698745', 'ophv1864', 'LM75', '2022-04-22 00:00:50'),
(23, 'ahmed', 'ali', 'aaa@gmail.com', '021846544', 'yuhjmhg2', 'LM75', '2022-04-21 09:02:46');

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `WarehouseID` int(8) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `telephone` int(255) DEFAULT NULL,
  `warehouseManagerID` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `workers`
--

CREATE TABLE `workers` (
  `workerID` int(11) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `warehouseID` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workers`
--

INSERT INTO `workers` (`workerID`, `firstName`, `lastName`, `email`, `phoneNumber`, `password`, `warehouseID`, `lastUpdate`) VALUES
(1, 'khalid', 'qasim', 'k8474@gmail.com', '966548546325', 'hud72947', 78948, '2022-03-31 16:00:04'),
(2, 'khalid', 'qasim', 'k8474@gmail.com', '966548546325', 'hud72947', 78948, '2022-03-31 14:37:27'),
(3, 'khalid', 'qasim', 'k8474@gmail.com', '966548546325', 'hud72947', 78948, '2022-03-31 16:06:47'),
(4, 'ahmed', 'qasim', 'k8474@gmail.com', '966548546325', 'hud72947', 78948, '2022-03-31 16:07:36'),
(5, 'ahmed', 'qasim', 'k8474@gmail.com', '966548546325', 'hud72947', 78948, '2022-04-20 19:48:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accountants`
--
ALTER TABLE `accountants`
  ADD PRIMARY KEY (`accountantID`);

--
-- Indexes for table `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`administratorID`);

--
-- Indexes for table `consignors`
--
ALTER TABLE `consignors`
  ADD PRIMARY KEY (`consignorID`);

--
-- Indexes for table `dispatchers`
--
ALTER TABLE `dispatchers`
  ADD PRIMARY KEY (`dispatcherID`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`driverID`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `freightbrokers`
--
ALTER TABLE `freightbrokers`
  ADD PRIMARY KEY (`freightBrokerID`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoiceID`);

--
-- Indexes for table `logisticmanagers`
--
ALTER TABLE `logisticmanagers`
  ADD PRIMARY KEY (`logisticManagerID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderID`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`ReportID`);

--
-- Indexes for table `shelfs`
--
ALTER TABLE `shelfs`
  ADD PRIMARY KEY (`shelfNumber`);

--
-- Indexes for table `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`shipmentID`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicleID`);

--
-- Indexes for table `warehousemanagers`
--
ALTER TABLE `warehousemanagers`
  ADD PRIMARY KEY (`warehouseManagerID`);

--
-- Indexes for table `warehouses`
--
ALTER TABLE `warehouses`
  ADD PRIMARY KEY (`WarehouseID`);

--
-- Indexes for table `workers`
--
ALTER TABLE `workers`
  ADD PRIMARY KEY (`workerID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accountants`
--
ALTER TABLE `accountants`
  MODIFY `accountantID` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `administrators`
--
ALTER TABLE `administrators`
  MODIFY `administratorID` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consignors`
--
ALTER TABLE `consignors`
  MODIFY `consignorID` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispatchers`
--
ALTER TABLE `dispatchers`
  MODIFY `dispatcherID` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driverID` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `freightbrokers`
--
ALTER TABLE `freightbrokers`
  MODIFY `freightBrokerID` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoiceID` int(9) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logisticmanagers`
--
ALTER TABLE `logisticmanagers`
  MODIFY `logisticManagerID` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `ReportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shelfs`
--
ALTER TABLE `shelfs`
  MODIFY `shelfNumber` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `warehousemanagers`
--
ALTER TABLE `warehousemanagers`
  MODIFY `warehouseManagerID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `workers`
--
ALTER TABLE `workers`
  MODIFY `workerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
