-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql_db_830:3306
-- Generation Time: Feb 28, 2025 at 12:08 PM
-- Server version: 5.7.44
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `task`
--

-- --------------------------------------------------------

--
-- Table structure for table `tashtable`
--

CREATE TABLE `tashtable` (
  `id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_bin,
  `status` enum('Pending','In Progress','Completed') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'Pending',
  `due_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tashtable`
--

INSERT INTO `tashtable` (`id`, `title`, `description`, `status`, `due_date`, `created_at`) VALUES
(1, 'Test Task', 'This is a test task', 'Pending', '2024-03-20 15:00:00', '2025-02-28 10:59:05'),
(3, 'test', 'test', 'In Progress', '2024-03-21 15:00:00', '2025-02-28 11:10:05'),
(5, 'ทดสอบภาษาไทย', 'ไทย', 'Completed', '2025-02-28 18:15:00', '2025-02-28 11:16:24'),
(8, 'test notification', NULL, 'Pending', NULL, '2025-02-28 11:59:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tashtable`
--
ALTER TABLE `tashtable`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tashtable`
--
ALTER TABLE `tashtable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
