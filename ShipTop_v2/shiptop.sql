-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2022 at 04:25 AM
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
-- Table structure for table `consignororder`
--

CREATE TABLE `consignororder` (
  `orderID` int(11) NOT NULL,
  `destination` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `consignorrate`
--

CREATE TABLE `consignorrate` (
  `consignorID` int(12) NOT NULL,
  `rate` int(1) NOT NULL DEFAULT 0,
  `comment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `employeeID` int(11) NOT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `role` varchar(2) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(12) DEFAULT NULL,
  `password` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employeeID`, `firstName`, `lastName`, `role`, `email`, `phoneNumber`, `password`) VALUES
(1, 'ahmed', 'ali', 'WO', 'gnwwd7@gmail.com', '053698745', 'ophv1864');

-- --------------------------------------------------------

--
-- Table structure for table `employeeupdate`
--

CREATE TABLE `employeeupdate` (
  `employeeID` int(11) NOT NULL,
  `updatedBy` int(11) NOT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employeeupdate`
--

INSERT INTO `employeeupdate` (`employeeID`, `updatedBy`, `lastUpdate`) VALUES
(1, 75, '2022-04-24 23:23:58');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoiceID` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `paymentMethod` varchar(11) DEFAULT NULL,
  `amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `office`
--

CREATE TABLE `office` (
  `employeeID` int(12) NOT NULL,
  `location` varchar(30) DEFAULT NULL,
  `telephone` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `office`
--

INSERT INTO `office` (`employeeID`, `location`, `telephone`) VALUES
(1, 'Dammam', '0138763937');

-- --------------------------------------------------------

--
-- Table structure for table `orderpayment`
--

CREATE TABLE `orderpayment` (
  `orderID` int(12) NOT NULL,
  `accountantID` int(12) DEFAULT NULL,
  `invoiceID` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ordershipment`
--

CREATE TABLE `ordershipment` (
  `orderID` int(12) NOT NULL,
  `shipmentID` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `reportID` int(11) NOT NULL,
  `reportType` varchar(30) NOT NULL,
  `reportPriority` int(2) NOT NULL,
  `subject` varchar(30) NOT NULL,
  `content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reportprint`
--

CREATE TABLE `reportprint` (
  `reportID` int(12) NOT NULL,
  `customerServerID` int(12) NOT NULL,
  `dateOfPrint` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shelf`
--

CREATE TABLE `shelf` (
  `shelfID` int(12) NOT NULL,
  `width` double DEFAULT NULL,
  `height` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shelfaddress`
--

CREATE TABLE `shelfaddress` (
  `shelfID` int(11) NOT NULL,
  `shelfNumber` int(11) DEFAULT NULL,
  `row` int(11) DEFAULT NULL,
  `section` varchar(1) DEFAULT NULL,
  `lane` int(12) DEFAULT NULL,
  `floor` varchar(12) DEFAULT NULL,
  `warehouseID` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shelfreservation`
--

CREATE TABLE `shelfreservation` (
  `shelfID` int(12) NOT NULL,
  `assignedShipment` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shelfupdate`
--

CREATE TABLE `shelfupdate` (
  `shelfID` int(12) NOT NULL,
  `updatedBy` int(12) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shipment`
--

CREATE TABLE `shipment` (
  `shipmentID` int(11) NOT NULL,
  `shipmentName` varchar(30) DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `isBreakable` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shipmentdelivery`
--

CREATE TABLE `shipmentdelivery` (
  `shipmentID` int(11) NOT NULL,
  `currentCity` varchar(30) NOT NULL,
  `deliveryDate` datetime DEFAULT NULL,
  `assignedEmployee` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shipmentdetails`
--

CREATE TABLE `shipmentdetails` (
  `shipmentID` int(12) NOT NULL,
  `height` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  `length` double DEFAULT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shipmentrecord`
--

CREATE TABLE `shipmentrecord` (
  `shipmentID` int(12) NOT NULL,
  `recordedPlace` int(30) DEFAULT NULL,
  `recordedTime` datetime DEFAULT NULL,
  `action` varchar(12) DEFAULT NULL,
  `actor` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shipmentupdate`
--

CREATE TABLE `shipmentupdate` (
  `shipmentID` int(12) NOT NULL,
  `updatedBy` int(12) DEFAULT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `vehicleID` int(12) NOT NULL,
  `currentLocation` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vehicledriver`
--

CREATE TABLE `vehicledriver` (
  `driverID` int(11) NOT NULL,
  `vehicleID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vehicleregistration`
--

CREATE TABLE `vehicleregistration` (
  `vehicleID` int(12) NOT NULL,
  `plateNumber` varchar(11) DEFAULT NULL,
  `manufacturerCompany` varchar(30) DEFAULT NULL,
  `model` varchar(30) DEFAULT NULL,
  `color` varchar(12) DEFAULT NULL,
  `yearOfManufactoring` year(4) DEFAULT NULL,
  `weightInTons` decimal(2,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vehicleupdate`
--

CREATE TABLE `vehicleupdate` (
  `vehicleID` int(12) NOT NULL,
  `dispatcherID` int(12) NOT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `warehouseID` int(11) NOT NULL,
  `location` varchar(30) DEFAULT NULL,
  `telephone` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `warehousemember`
--

CREATE TABLE `warehousemember` (
  `memberID` int(12) NOT NULL,
  `warehouseID` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `warehouseupdate`
--

CREATE TABLE `warehouseupdate` (
  `warehouseID` int(11) NOT NULL,
  `managerID` int(11) NOT NULL,
  `lastUpdate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `consignororder`
--
ALTER TABLE `consignororder`
  ADD PRIMARY KEY (`orderID`);

--
-- Indexes for table `consignorrate`
--
ALTER TABLE `consignorrate`
  ADD PRIMARY KEY (`consignorID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`employeeID`);

--
-- Indexes for table `employeeupdate`
--
ALTER TABLE `employeeupdate`
  ADD PRIMARY KEY (`employeeID`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoiceID`);

--
-- Indexes for table `office`
--
ALTER TABLE `office`
  ADD PRIMARY KEY (`employeeID`);

--
-- Indexes for table `orderpayment`
--
ALTER TABLE `orderpayment`
  ADD PRIMARY KEY (`orderID`);

--
-- Indexes for table `ordershipment`
--
ALTER TABLE `ordershipment`
  ADD PRIMARY KEY (`orderID`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`reportID`);

--
-- Indexes for table `reportprint`
--
ALTER TABLE `reportprint`
  ADD PRIMARY KEY (`reportID`);

--
-- Indexes for table `shelf`
--
ALTER TABLE `shelf`
  ADD PRIMARY KEY (`shelfID`);

--
-- Indexes for table `shelfaddress`
--
ALTER TABLE `shelfaddress`
  ADD PRIMARY KEY (`shelfID`);

--
-- Indexes for table `shelfreservation`
--
ALTER TABLE `shelfreservation`
  ADD PRIMARY KEY (`shelfID`);

--
-- Indexes for table `shelfupdate`
--
ALTER TABLE `shelfupdate`
  ADD PRIMARY KEY (`shelfID`);

--
-- Indexes for table `shipment`
--
ALTER TABLE `shipment`
  ADD PRIMARY KEY (`shipmentID`);

--
-- Indexes for table `shipmentdelivery`
--
ALTER TABLE `shipmentdelivery`
  ADD PRIMARY KEY (`shipmentID`);

--
-- Indexes for table `shipmentdetails`
--
ALTER TABLE `shipmentdetails`
  ADD PRIMARY KEY (`shipmentID`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicleID`);

--
-- Indexes for table `vehicledriver`
--
ALTER TABLE `vehicledriver`
  ADD PRIMARY KEY (`driverID`);

--
-- Indexes for table `vehicleregistration`
--
ALTER TABLE `vehicleregistration`
  ADD PRIMARY KEY (`vehicleID`);

--
-- Indexes for table `vehicleupdate`
--
ALTER TABLE `vehicleupdate`
  ADD PRIMARY KEY (`vehicleID`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`warehouseID`);

--
-- Indexes for table `warehousemember`
--
ALTER TABLE `warehousemember`
  ADD PRIMARY KEY (`memberID`);

--
-- Indexes for table `warehouseupdate`
--
ALTER TABLE `warehouseupdate`
  ADD PRIMARY KEY (`warehouseID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `consignororder`
--
ALTER TABLE `consignororder`
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `employeeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoiceID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `reportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shelf`
--
ALTER TABLE `shelf`
  MODIFY `shelfID` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shelfaddress`
--
ALTER TABLE `shelfaddress`
  MODIFY `shelfID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipment`
--
ALTER TABLE `shipment`
  MODIFY `shipmentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `vehicleID` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `warehouseID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `warehouseupdate`
--
ALTER TABLE `warehouseupdate`
  ADD CONSTRAINT `warehouseupdate_ibfk_1` FOREIGN KEY (`warehouseID`) REFERENCES `warehouse` (`warehouseID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
