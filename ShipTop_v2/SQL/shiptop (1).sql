-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2022 at 09:26 PM
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
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `consignees`
--

CREATE TABLE `consignees` (
  `consigneeID` int(8) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL
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
  `addedBy` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `consignors`
--

INSERT INTO `consignors` (`consignorID`, `firstName`, `lastName`, `email`, `phoneNumber`, `password`, `rate`, `addedBy`, `lastUpdate`) VALUES
(4553, 'Al', 'halidy', 'aliKhalid@gmail.com', '996553972100', 'q1w2e3r4', 0, 33974, '2022-03-29 01:28:40'),
(45891, 'Ali', 'Al-khalidy', 'aliKhalid@gmail.com', '996553972100', 'q1w2e3r4', 0, NULL, '2022-03-28 16:29:58'),
(45893, 'Ali', 'Al-khalidy', 'aliKhalid@gmail.com', '996553972100', 'q1w2e3r4', 3, NULL, '2022-03-28 16:32:35'),
(433553, 'Al', 'halidy', 'aliKhalid@gmail.com', '996553972100', 'q1w2e3r4', 0, 33974, '2022-03-29 01:30:16'),
(455673, 'Ali', 'Al-khalidy', 'aliKhalid@gmail.com', '996553972100', 'q1w2e3r4', 0, NULL, '2022-03-29 01:15:47'),
(4993553, 'Al', 'halidy', 'aliKhalid@gmail.com', '996553972100', 'q1w2e3r4', 0, 33974, '2022-03-29 01:30:54');

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
  `logisticManagerID` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driverID` int(8) NOT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` int(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `vehicleID` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `lastUpdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoiceID` int(9) NOT NULL,
  `date` date DEFAULT NULL,
  `orders` varchar(255) DEFAULT NULL,
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
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
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

--
-- Dumping data for table `records`
--

INSERT INTO `records` (`shipmentID`, `recordedPlace`, `action`, `updatedBy`, `lastUpdate`) VALUES
(12371, '0', NULL, 33974, '2022-03-29 16:08:49'),
(12371, '0', NULL, 33974, '2022-03-29 16:09:09'),
(12371, 'warehouse78948', NULL, 33974, '2022-03-29 16:09:48'),
(22371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:15:47'),
(29371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:16:30'),
(29371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:16:42'),
(85371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:16:55'),
(85371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:17:11'),
(85371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:18:31'),
(85371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:20:09'),
(85371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:21:39'),
(85371, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:22:10'),
(86721, 'warehouse78948', 'undefined', 33974, '2022-03-29 16:23:20'),
(86721, 'warehouse78948', 'modified', 33974, '2022-03-29 16:29:57');

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

--
-- Dumping data for table `shelfs`
--

INSERT INTO `shelfs` (`shelfNumber`, `row`, `section`, `lane`, `floor`, `isReserved`, `warehouseID`, `shipmentID`, `workerID`, `lastUpdate`) VALUES
(12, 8, '3', 9, 'second', 1, 444, 51371, 54546, '2022-03-27 22:01:48'),
(13, 8, '3', 9, 'second', 0, 444, NULL, 54546, '2022-03-27 21:45:07');

-- --------------------------------------------------------

--
-- Table structure for table `shipments`
--

CREATE TABLE `shipments` (
  `ShipmentID` int(10) NOT NULL,
  `destinationNumber` int(30) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `length` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `isBreakable` tinyint(1) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `telephone` varchar(12) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `sender` varchar(255) DEFAULT NULL,
  `departureCity` varchar(30) DEFAULT NULL,
  `arrivalCity` varchar(30) DEFAULT NULL,
  `arrivalDate` date DEFAULT NULL,
  `deliveryDate` date DEFAULT NULL,
  `warehouseID` int(8) DEFAULT NULL,
  `updatedBy` int(8) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shipments`
--

INSERT INTO `shipments` (`ShipmentID`, `destinationNumber`, `weight`, `description`, `length`, `width`, `height`, `isBreakable`, `status`, `telephone`, `department`, `address`, `sender`, `departureCity`, `arrivalCity`, `arrivalDate`, `deliveryDate`, `warehouseID`, `updatedBy`, `lastUpdate`) VALUES
(4171, 35329, 35.3, 'led light', 30.1, 18.3, 10.4, 1, 'arrived', '996585638890', 'Dhahran', 'testAddress0', 'ahmed', NULL, NULL, '2022-05-28', '2022-02-10', 35685, NULL, '2022-03-25 02:31:36'),
(12371, 35529, 35.3, 'led light', 30, 12, 10.4, 1, 'arrived', '996553322100', 'Dhahran', 'testAddress4', 'ahmed', 'Jeddah', 'Mekkah', '2022-05-28', '2022-02-10', 78948, NULL, '2022-03-29 16:06:04'),
(22371, 35529, 35.3, 'led light', 30, 12, 10.4, 1, 'arrived', '996553322100', 'Dhahran', 'testAddress4', 'ahmed', 'Jeddah', 'Mekkah', '2022-05-28', '2022-02-10', 78948, NULL, '2022-03-29 16:15:47'),
(29371, 35529, 35.3, 'led light', 30, 12, 10.4, 1, 'arrived', '996553322100', 'Dhahran', 'testAddress4', 'ahmed', 'Jeddah', 'Mekkah', '2022-05-28', '2022-02-10', 78948, NULL, '2022-03-29 16:16:30'),
(41371, 35529, 35.3, 'led light', 50, 12, 10.4, 1, 'arrived', '996553322100', 'Dhahran', 'testAddress4', 'ahmed', 'Jeddah', 'Mekkah', '2022-05-28', '2022-02-10', 333, NULL, '2022-03-26 05:27:10'),
(85371, 35529, 35.3, 'led light', 30, 12, 10.4, 1, 'arrived', '996553322100', 'Dhahran', 'testAddress4', 'ahmed', 'Jeddah', 'Mekkah', '2022-05-28', '2022-02-10', 78948, NULL, '2022-03-29 16:16:55'),
(86721, 35529, 35.3, 'led light', 30, 12, 10.4, 1, 'arrived', '996553322100', 'Dhahran', 'testAddress4', 'ahmed', 'Jeddah', 'Mekkah', '2022-05-28', '2022-02-10', 33974, 78948, '2022-03-29 16:29:57'),
(92371, 35529, 35.3, 'led light', 30, 12, 10.4, 1, 'arrived', '996553322100', 'Dhahran', 'testAddress4', 'ahmed', 'Jeddah', 'Mekkah', '2022-05-28', '2022-02-10', 78948, NULL, '2022-03-28 15:28:33'),
(489371, 35529, 35.3, 'led light', 30, 12, 10.4, 1, 'arrived', '996553322100', 'Dhahran', 'testAddress4', 'ahmed', 'Jeddah', 'Mekkah', '2022-05-28', '2022-02-10', 333, NULL, '2022-03-26 10:52:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(8) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `firstName`, `lastName`, `email`, `phoneNumber`, `role`, `lastUpdate`) VALUES
(4553, 'Al', 'halidy', 'aliKhalid@gmail.com', '996553972100', 'consignor', '2022-03-29 01:25:30'),
(33974, 'Ali', 'Al-khalidy', 'aliKhalid@gmail.com', '996553972100', 'consignor', '2022-03-29 01:15:47'),
(433553, 'Al', 'halidy', 'aliKhalid@gmail.com', '996553972100', 'consignor', '2022-03-29 01:30:16'),
(973306, 'khalid', 'qasim', 'k8474@gmail.com', '966548546325', 'worker', '2022-03-29 00:32:07'),
(4993553, 'Al', 'halidy', 'aliKhalid@gmail.com', '996553972100', 'consignor', '2022-03-29 01:30:54');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `VehicleID` int(11) NOT NULL,
  `VehicleName` varchar(255) DEFAULT NULL,
  `ManufacturerCompany` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `assignedDriver` varchar(255) DEFAULT NULL,
  `dispatcherID` int(8) DEFAULT NULL,
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
  `warehouseID` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `warehousemanagers`
--

INSERT INTO `warehousemanagers` (`warehouseManagerID`, `firstName`, `lastName`, `email`, `phoneNumber`, `password`, `warehouseID`, `lastUpdate`) VALUES
(25256, 'Yahia', 'Adel', 'yahiaAdel@outlook.com', '966532489576', 'Yaia123', 78948, '2022-03-26 05:13:06'),
(31256, 'Yahia', 'Adel', 'yahiaAdel@outlook.com', '966532489576', 'Yaia123', 78948, '2022-03-26 05:05:26'),
(34256, 'Yahia', 'Adel', 'yahiaAdel@outlook.com', '966532489576', 'Yaia123', 78948, '2022-03-26 04:55:44'),
(34258, 'Yahia', 'Adel', 'yahiaAdel@outlook.com', '966532489576', 'Yaia123', 78948, '2022-03-26 05:05:08');

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `WarehouseID` int(8) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `telephone` int(255) DEFAULT NULL,
  `referenceNumber` int(255) DEFAULT NULL,
  `warehouseManagerID` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`WarehouseID`, `name`, `location`, `city`, `telephone`, `referenceNumber`, `warehouseManagerID`, `lastUpdate`) VALUES
(78902, 'DmmWarehouse', 'address/5029-230', 'Dammam', 2147483647, 986764, 31359, '2022-03-26 03:52:10'),
(78903, 'DmmWarehouse', 'address/5029-230', 'Dammam', 2147483647, 986764, 31359, '2022-03-26 03:52:51'),
(78948, 'DmmWarehouse', 'address/5029-230', 'Dammam', 2147483647, 986764, 76578, '2022-03-26 03:55:11');

-- --------------------------------------------------------

--
-- Table structure for table `workers`
--

CREATE TABLE `workers` (
  `workerID` int(8) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL,
  `warehouseID` int(8) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workers`
--

INSERT INTO `workers` (`workerID`, `firstName`, `lastName`, `email`, `phoneNumber`, `password`, `warehouseID`, `lastUpdate`) VALUES
(973306, 'klalid', 'qasim', 'k8474@gmail.com', '966548546325', 'hud72947', 78948, '2022-03-29 01:10:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accountants`
--
ALTER TABLE `accountants`
  ADD PRIMARY KEY (`accountantID`);

--
-- Indexes for table `consignees`
--
ALTER TABLE `consignees`
  ADD PRIMARY KEY (`consigneeID`);

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
  ADD PRIMARY KEY (`ShipmentID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`VehicleID`);

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
-- AUTO_INCREMENT for table `consignees`
--
ALTER TABLE `consignees`
  MODIFY `consigneeID` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consignors`
--
ALTER TABLE `consignors`
  MODIFY `consignorID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4993554;

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
  MODIFY `shelfNumber` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `shipments`
--
ALTER TABLE `shipments`
  MODIFY `ShipmentID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=489372;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4993554;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `VehicleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `warehousemanagers`
--
ALTER TABLE `warehousemanagers`
  MODIFY `warehouseManagerID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34259;

--
-- AUTO_INCREMENT for table `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `WarehouseID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78949;

--
-- AUTO_INCREMENT for table `workers`
--
ALTER TABLE `workers`
  MODIFY `workerID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=973307;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
