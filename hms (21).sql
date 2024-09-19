-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 18, 2024 at 02:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hms`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `Appoint_ID` int(11) NOT NULL,
  `Scheduled_On` date NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `Doctor_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `Bill_ID` int(11) NOT NULL,
  `Date_Issued` date DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `Payment_Status` varchar(20) DEFAULT NULL,
  `Patient_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `bill`
--

INSERT INTO `bill` (`Bill_ID`, `Date_Issued`, `Description`, `Amount`, `Payment_Status`, `Patient_ID`) VALUES
(1, '2024-06-24', 'Pagesa pas kontrolles', 250.00, 'Paid', 1),
(2, '2024-06-26', 'Pagesa pas qendrimit 4 ditor', 620.00, 'Pending', 2),
(4, '2024-08-15', 'Per droge', 50.00, 'Pending', 8);

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `Dept_ID` int(11) NOT NULL,
  `Dept_head` varchar(100) DEFAULT NULL,
  `Dept_name` varchar(100) NOT NULL,
  `Emp_Count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`Dept_ID`, `Dept_head`, `Dept_name`, `Emp_Count`) VALUES
(1, 'Ilir Zeqiri', 'Kardiologjia', 10),
(2, 'Besnik Rama', 'Pediatri', 14),
(3, 'Anila Shehu', 'Radiologji', 8),
(4, 'Valbona Dervishi', 'Neorologji', 6),
(5, 'Ridvan Krasniqi', 'Ortopedi', 11);

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `Doctor_ID` int(11) NOT NULL,
  `Qualifications` varchar(255) NOT NULL,
  `Emp_ID` int(11) NOT NULL,
  `Specialization` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`Doctor_ID`, `Qualifications`, `Emp_ID`, `Specialization`) VALUES
(26, 'Profesionist', 52, 'Bokser');

-- --------------------------------------------------------

--
-- Table structure for table `emergency_contact`
--

CREATE TABLE `emergency_contact` (
  `Contact_ID` int(11) NOT NULL,
  `Contact_Name` varchar(100) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Relation` varchar(50) NOT NULL,
  `Patient_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emergency_contact`
--

INSERT INTO `emergency_contact` (`Contact_ID`, `Contact_Name`, `Phone`, `Relation`, `Patient_ID`) VALUES
(1, 'Anida', '044111222', 'Mother', 1),
(2, 'Avni', '044121987', 'Friend', 2),
(5, 'Lind', '049444444', 'Father', 8);

-- --------------------------------------------------------

--
-- Table structure for table `insurance`
--

CREATE TABLE `insurance` (
  `Policy_Number` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Ins_Code` varchar(10) NOT NULL,
  `End_Date` date NOT NULL,
  `Provider` varchar(100) NOT NULL,
  `Plan` varchar(100) NOT NULL,
  `Co_Pay` varchar(100) NOT NULL,
  `Coverage` varchar(100) NOT NULL,
  `Maternity` varchar(100) NOT NULL,
  `Dental` varchar(100) NOT NULL,
  `Optical` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance`
--

INSERT INTO `insurance` (`Policy_Number`, `Patient_ID`, `Ins_Code`, `End_Date`, `Provider`, `Plan`, `Co_Pay`, `Coverage`, `Maternity`, `Dental`, `Optical`) VALUES
(1, 1, '111222333', '2025-09-16', 'Yes', 'Yes', 'Yes', '100%', 'Yes', 'Yes', 'Yes'),
(2, 3, '222113333', '2026-05-13', 'Yes', 'Yes', 'Yes', '75%', 'Yes', 'Yes', 'Yes'),
(3, 4, '999885664', '2024-10-10', 'Yes', 'Yes', 'Yes', '50%', 'Yes', 'Yes', 'Yes');

-- --------------------------------------------------------

--
-- Table structure for table `medical_history`
--

CREATE TABLE `medical_history` (
  `Record_ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Allergies` varchar(255) DEFAULT NULL,
  `Pre_Conditions` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_history`
--

INSERT INTO `medical_history` (`Record_ID`, `Patient_ID`, `Allergies`, `Pre_Conditions`) VALUES
(1, 1, 'Nuk ka', 'Dhimje koke'),
(2, 2, 'Gjalp kikirikut', 'Dhimbje barku'),
(4, 8, 'Kurgjo', ' Dhimbje barku');

-- --------------------------------------------------------

--
-- Table structure for table `medicine`
--

CREATE TABLE `medicine` (
  `Medicine_ID` int(11) NOT NULL,
  `M_name` varchar(100) NOT NULL,
  `M_Quantity` int(11) NOT NULL,
  `M_Cost` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicine`
--

INSERT INTO `medicine` (`Medicine_ID`, `M_name`, `M_Quantity`, `M_Cost`) VALUES
(1, 'Amoxicillin', 54, 3.50),
(3, 'Ibuprofen', 27, 2.80),
(4, 'Metformin ', 19, 8.70),
(5, 'Aspirin ', 67, 3.80),
(6, 'Omeprazole', 10, 5.30),
(7, 'Atorvastatin', 3, 10.60),
(8, 'Losartan', 32, 6.40),
(9, 'Levothyroxine', 21, 8.20),
(10, 'Amlodipine ', 14, 5.10),
(11, 'Clopidogrel', 21, 5.70),
(12, 'Cetirizine', 9, 7.50),
(13, 'Prednisone', 20, 3.50),
(14, 'Furosemide', 32, 7.60),
(15, 'Metoprolol', 21, 6.30);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `Patient_ID` int(11) NOT NULL,
  `Personal_Number` int(11) NOT NULL,
  `Patient_Fname` varchar(50) NOT NULL,
  `Patient_Lname` varchar(50) NOT NULL,
  `Birth_Date` date DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Blood_type` varchar(10) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`Patient_ID`, `Personal_Number`, `Patient_Fname`, `Patient_Lname`, `Birth_Date`, `Gender`, `Blood_type`, `Email`, `Phone`) VALUES
(1, 1234567890, 'Arben', 'Gashi', '1996-05-08', 'Male', 'AB+', 'arben@gmail.com', '044111222'),
(2, 987654321, 'Melisa', 'Kuqi', '2002-08-07', 'Female', 'B-', 'Melisa@gmail.com', '049111222'),
(3, 1122334455, 'Aferdita', 'Ferizi', '2007-12-12', 'Female', 'A-', 'Aferdita@gmail.com', '043222333'),
(4, 1112223334, 'Ermal', 'Berisha', '2019-01-08', 'Male', 'A+', 'Ermal@gmail.com', '044212314'),
(8, 1172711777, 'Pacienti', 'Pacienti', '2016-02-11', 'Male', 'A+', 'pacienti1@gmail.com', '099999999');

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `Account_no` int(11) NOT NULL,
  `Salary` decimal(10,2) NOT NULL,
  `Bonus` decimal(10,2) DEFAULT NULL,
  `Emp_ID` int(11) NOT NULL,
  `IBAN` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

CREATE TABLE `rating` (
  `Rating_ID` int(11) NOT NULL,
  `Emp_ID` int(11) NOT NULL,
  `Rating` tinyint(4) NOT NULL,
  `Comments` text DEFAULT NULL,
  `Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `Report_ID` int(11) NOT NULL,
  `personal_number` int(11) NOT NULL,
  `report` longblob NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `createdAt`, `updatedAt`) VALUES
(1, 'patient', '2024-06-02 12:19:18', '2024-06-02 12:19:18'),
(2, 'admin', '2024-06-02 12:19:18', '2024-06-02 12:19:18'),
(3, 'doctor', '2024-06-02 12:19:18', '2024-06-02 12:19:18');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `Room_ID` int(11) NOT NULL,
  `Room_type` varchar(20) NOT NULL,
  `Patient_ID` int(11) DEFAULT NULL,
  `Room_cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`Room_ID`, `Room_type`, `Patient_ID`, `Room_cost`) VALUES
(1, 'Four-bed room ', 1, 50.00),
(2, 'Two-bed room ', 4, 85.00),
(3, 'Three-bed room ', 3, 64.00);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `Emp_ID` int(11) NOT NULL,
  `Emp_Fname` varchar(50) NOT NULL,
  `Emp_Lname` varchar(50) NOT NULL,
  `Joining_Date` date NOT NULL,
  `Emp_type` varchar(50) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Dept_ID` int(11) DEFAULT NULL,
  `SSN` varchar(20) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `Date_Separation` date DEFAULT NULL,
  `Qualifications` varchar(50) NOT NULL,
  `Specialization` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`Emp_ID`, `Emp_Fname`, `Emp_Lname`, `Joining_Date`, `Emp_type`, `Email`, `Address`, `Dept_ID`, `SSN`, `DOB`, `Date_Separation`, `Qualifications`, `Specialization`) VALUES
(52, 'Lind', 'Geci', '2024-08-31', 'Doctor', 'lindgeci@gmail.com', 'Upiana', 4, '222222', '2024-08-30', '2024-10-05', 'Profesionist', 'Bokser');

-- --------------------------------------------------------

--
-- Table structure for table `userrole`
--

CREATE TABLE `userrole` (
  `UserRole_Id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `userrole`
--

INSERT INTO `userrole` (`UserRole_Id`, `user_id`, `role_id`, `createdAt`, `updatedAt`) VALUES
(8, 8, 2, '2024-09-10 13:06:39', '2024-09-10 13:07:13'),
(12, 12, 1, '2024-09-11 07:55:32', '2024-09-11 07:55:32'),
(14, 14, 3, '2024-09-17 15:22:02', '2024-09-17 15:23:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `username`, `password`) VALUES
(8, 'lg69462@ubt-uni.net', 'Lindi', '$2b$10$.H9Y2aolRMZ0pQz2bLCnTuZHZapkrqENp.SZHkUxS9taHPFawL9tG'),
(12, 'pacienti1@gmail.com', 'Pacienti', '$2b$10$qJg/mSBPipziVCfnEVqKseNeB65ehZogu3h5atf4ZLUuYN75RFAXC'),
(14, 'doktori@gmail.com', 'Doktori', '$2b$10$6KBXopSlkk4aHATKsSf6HuYZsog0NcbP4xEWYBSV/0WOeeISwTqlq');

-- --------------------------------------------------------

--
-- Table structure for table `visits`
--

CREATE TABLE `visits` (
  `Visit_ID` int(11) NOT NULL,
  `Patient_ID` int(11) DEFAULT NULL,
  `Doctor_ID` int(11) DEFAULT NULL,
  `date_of_visit` date DEFAULT NULL,
  `condition` varchar(255) DEFAULT NULL,
  `diagnosis` varchar(255) DEFAULT NULL,
  `therapy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`Appoint_ID`),
  ADD KEY `Doctor_ID` (`Doctor_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`Bill_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`Dept_ID`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`Doctor_ID`),
  ADD KEY `Emp_ID` (`Emp_ID`);

--
-- Indexes for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  ADD PRIMARY KEY (`Contact_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `insurance`
--
ALTER TABLE `insurance`
  ADD PRIMARY KEY (`Policy_Number`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD PRIMARY KEY (`Record_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `medicine`
--
ALTER TABLE `medicine`
  ADD PRIMARY KEY (`Medicine_ID`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`Patient_ID`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`Account_no`),
  ADD KEY `Emp_ID` (`Emp_ID`);

--
-- Indexes for table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`Rating_ID`),
  ADD KEY `Emp_ID` (`Emp_ID`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`Report_ID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`Room_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`Emp_ID`),
  ADD KEY `Dept_ID` (`Dept_ID`);

--
-- Indexes for table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`UserRole_Id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`Visit_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`),
  ADD KEY `Doctor_ID` (`Doctor_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `Appoint_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `Bill_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `Dept_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `Doctor_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  MODIFY `Contact_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `insurance`
--
ALTER TABLE `insurance`
  MODIFY `Policy_Number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `medical_history`
--
ALTER TABLE `medical_history`
  MODIFY `Record_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `medicine`
--
ALTER TABLE `medicine`
  MODIFY `Medicine_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `Patient_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `Account_no` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rating`
--
ALTER TABLE `rating`
  MODIFY `Rating_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `Report_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `Room_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `Emp_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `userrole`
--
ALTER TABLE `userrole`
  MODIFY `UserRole_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `visits`
--
ALTER TABLE `visits`
  MODIFY `Visit_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`Doctor_ID`) REFERENCES `doctor` (`Doctor_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE;

--
-- Constraints for table `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE;

--
-- Constraints for table `doctor`
--
ALTER TABLE `doctor`
  ADD CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`) ON DELETE CASCADE;

--
-- Constraints for table `emergency_contact`
--
ALTER TABLE `emergency_contact`
  ADD CONSTRAINT `emergency_contact_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE;

--
-- Constraints for table `insurance`
--
ALTER TABLE `insurance`
  ADD CONSTRAINT `insurance_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE;

--
-- Constraints for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD CONSTRAINT `medical_history_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE;

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`) ON DELETE CASCADE;

--
-- Constraints for table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `fk_rating_staff` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`Emp_ID`) REFERENCES `staff` (`Emp_ID`) ON DELETE CASCADE;

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE;

--
-- Constraints for table `userrole`
--
ALTER TABLE `userrole`
  ADD CONSTRAINT `userrole_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `userrole_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;

--
-- Constraints for table `visits`
--
ALTER TABLE `visits`
  ADD CONSTRAINT `visits_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patient` (`Patient_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `visits_ibfk_2` FOREIGN KEY (`Doctor_ID`) REFERENCES `doctor` (`Doctor_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
