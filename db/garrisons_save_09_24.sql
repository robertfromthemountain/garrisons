-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 24, 2024 at 04:16 PM
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
-- Database: `garrisons`
--

-- --------------------------------------------------------

--
-- Table structure for table `confirmed_events`
--

CREATE TABLE `confirmed_events` (
  `confirmed_event_id` int(11) NOT NULL COMMENT 'A megerősített esemény egyedi azonosítója. / The unique identifier of the confirmed event.',
  `confirmed_event_title` varchar(30) NOT NULL COMMENT 'A szolgáltatás neve. / The name of the service.',
  `confirmed_event_date` varchar(255) NOT NULL COMMENT 'A megerősített esemény dátuma. / The date of the confirmed event.',
  `confirmed_event_start` varchar(255) NOT NULL COMMENT 'A megerősített esemény kezdete. / The start of the confirmed event.',
  `confirmed_event_end` varchar(255) NOT NULL COMMENT 'A megerősített esemény vége. / The end of the confirmed event.',
  `reserving_user_id` int(11) DEFAULT NULL COMMENT 'Az eseményt lefoglaló ember egyedi azonosítója. / The unique identifier of the person booking the event.',
  `confirming_user_id` int(11) NOT NULL COMMENT 'Az eseményt megerősítő személy egyedi azonosítója. / The unique identifier of the person confirming the event.',
  `confirmed_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Az esemény megerősítésének pontos időpontja. / The exact timestamp of the confirmed event.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `confirmed_events`
--

INSERT INTO `confirmed_events` (`confirmed_event_id`, `confirmed_event_title`, `confirmed_event_date`, `confirmed_event_start`, `confirmed_event_end`, `reserving_user_id`, `confirming_user_id`, `confirmed_at`) VALUES
(38, 'Fresh cut', '2024-09-23T09:00:00Z', '2024-09-23T09:00:00.000Z', '2024-09-23T09:30:00.000Z', 6, 1, '2024-09-24 12:49:18'),
(39, 'Full cut', '2024-09-23T11:00:00Z', '2024-09-23T11:00:00.000Z', '2024-09-23T11:45:00.000Z', 6, 1, '2024-09-24 12:52:41'),
(40, 'Fresh cut', '2024-09-25T09:30:00Z', '2024-09-25T09:30:00.000Z', '2024-09-25T10:00:00.000Z', 6, 1, '2024-09-24 12:52:47');

-- --------------------------------------------------------

--
-- Table structure for table `modified_events`
--

CREATE TABLE `modified_events` (
  `modification_id` int(11) NOT NULL COMMENT 'A módosított esemény egyedi azonosítója. / The modified event''s unique identifier.',
  `modified_event_id` int(11) NOT NULL COMMENT 'A módosítandó esemény idegen kulcsa ami a confirmed_events/confirmed_event_id-ra mutat. / The foreign key of the event that needs to be modified, it represents the confirmed_events/confirmed_event_id.',
  `modified_service_title` varchar(30) NOT NULL COMMENT 'A szolgáltalás neve. / The name of the service.',
  `original_event_date` varchar(255) NOT NULL COMMENT 'Az esemény eredeti dátuma. / The original date of the event.',
  `modified_event_date` varchar(255) NOT NULL COMMENT 'Az esemény új dátuma. / The new date of the event.',
  `original_event_start` varchar(255) NOT NULL COMMENT 'A módosított esemény eredeti kezdete. / The original start of the event that needs to be modified.',
  `original_event_end` varchar(255) NOT NULL COMMENT 'A módosított esemény eredeti vége. / The original end of the event that needs to be modified.',
  `modified_event_start` varchar(255) NOT NULL COMMENT 'A módosított esemény új kezdete. / The new start of the event that needs to be modified.',
  `modified_event_end` varchar(255) NOT NULL,
  `modified_reserving_user_id` int(11) NOT NULL,
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='This table holds the modifications to the existing events.';

--
-- Dumping data for table `modified_events`
--

INSERT INTO `modified_events` (`modification_id`, `modified_event_id`, `modified_service_title`, `original_event_date`, `modified_event_date`, `original_event_start`, `original_event_end`, `modified_event_start`, `modified_event_end`, `modified_reserving_user_id`, `modified_at`) VALUES
(22, 39, 'Full cut', '2024-09-23T11:00:00Z', '2024-09-25T11:15:00.000Z', '2024-09-23T11:00:00.000Z', '2024-09-23T11:45:00.000Z', '2024-09-25T11:15:00.000Z', '2024-09-25T12:00:00.000Z', 6, '2024-09-24 13:26:04'),
(23, 40, 'Fresh cut', '2024-09-25T09:30:00Z', '2024-09-26T10:30:00.000Z', '2024-09-25T09:30:00.000Z', '2024-09-25T10:00:00.000Z', '2024-09-26T10:30:00.000Z', '2024-09-26T11:00:00.000Z', 6, '2024-09-24 13:26:04');

-- --------------------------------------------------------

--
-- Table structure for table `pending_events`
--

CREATE TABLE `pending_events` (
  `pending_event_id` int(11) NOT NULL COMMENT 'A kérelmezett esemény egyedi azonosítója. / The primary key of the requested event.',
  `pending_service_title` varchar(30) NOT NULL COMMENT 'A szolgáltatás elnevezése. / Title of the service.',
  `pending_date` varchar(255) NOT NULL COMMENT 'A kérelmezett esemény dátuma. / Date of the requested event.',
  `pending_start_of_event` varchar(255) NOT NULL COMMENT 'A kérelmezett esemény kezdete. / Start of the requested event.',
  `pending_end_of_event` varchar(255) NOT NULL COMMENT 'A kérelmezett esemény vége. / End of the requested event.',
  `user_id` int(11) NOT NULL COMMENT 'Az esemény kérelmező felhasználó egyedi azonosítója. / The unique identifier of the user requesting the event.',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Az esemény kérelmezésének pontos időpontja. / The exact timestamp of the event request.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pending_events`
--

INSERT INTO `pending_events` (`pending_event_id`, `pending_service_title`, `pending_date`, `pending_start_of_event`, `pending_end_of_event`, `user_id`, `created_at`) VALUES
(41, 'Fresh cut', '2024-09-23', '08:30:00.000000', '09:00:00.000000', 6, '2024-09-23 12:29:51'),
(42, 'Fresh cut', '2024-09-23', '09:30:00.000000', '10:00:00.000000', 6, '2024-09-23 12:31:14'),
(43, 'Fresh cut', '2024-09-23', '10:00:00.000000', '10:30:00.000000', 6, '2024-09-23 12:31:28'),
(44, 'Fresh cut', '2024-09-23', '07:00:00.000000', '07:30:00.000000', 6, '2024-09-23 12:56:59'),
(45, '1', '2024-09-23', '09:30:00.000000', '10:00:00.000000', 6, '2024-09-23 13:42:08'),
(46, 'Full cut', '2024-09-23', '10:00:00.000000', '10:45:00.000000', 6, '2024-09-23 13:42:56'),
(47, 'Fresh cut', '2024-09-23', '07:30:00.000000', '08:00:00.000000', 6, '2024-09-23 14:07:07');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL COMMENT 'A szolgáltatás egyedi azonosítója. / The unique id of the service.',
  `title` varchar(30) NOT NULL COMMENT 'A szolgáltatás neve. / The name of the service.',
  `price` smallint(6) NOT NULL COMMENT 'A szolgáltatás ára. / The price of the service.',
  `duration` tinyint(3) NOT NULL COMMENT 'A szolgáltatás időtartama percben mérve. / The duration of the service in minutes.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `price`, `duration`) VALUES
(1, 'Fresh cut', 4500, 30),
(2, 'Full cut', 6500, 45);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `phoneNumber`, `password`) VALUES
(1, 'Teszt', 'Teszt', 't@t.t', '123123123', '$2a$10$.1XJbEZnkOSqFn8ujLdF9eBySOxNBYEE/DsLVqAoQp4ULKmCZ4ESu'),
(2, 'Login', 'Login', 's@s.s', '123123123', '$2a$10$urjRpAN3y2sYys8bed4Kauf0sK8Vt61ywxlHpwD9GFkKQzmF5SO2q'),
(3, 'ASD', 'ASD', 'asd@asd.asd', '123123123', '$2a$10$cefHCDx2zsHJUO7bJZS43.orjQVKPACOmdAWXTZzgvvHhF70m61VG'),
(6, 'Teszt', 'Teszt', 'v@v.v', '123123121', '$2a$10$GvHGNj9ZJuQiDTKzN.M3UeqClOCxgoX7Q5Snt1/ubbMkq2hgFU/U6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `confirmed_events`
--
ALTER TABLE `confirmed_events`
  ADD PRIMARY KEY (`confirmed_event_id`),
  ADD KEY `fk_events_users` (`reserving_user_id`);

--
-- Indexes for table `modified_events`
--
ALTER TABLE `modified_events`
  ADD PRIMARY KEY (`modification_id`);

--
-- Indexes for table `pending_events`
--
ALTER TABLE `pending_events`
  ADD PRIMARY KEY (`pending_event_id`),
  ADD KEY `fk_events_users` (`user_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `confirmed_events`
--
ALTER TABLE `confirmed_events`
  MODIFY `confirmed_event_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A megerősített esemény egyedi azonosítója. / The unique identifier of the confirmed event.', AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `modified_events`
--
ALTER TABLE `modified_events`
  MODIFY `modification_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A módosított esemény egyedi azonosítója. / The modified event''s unique identifier.', AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `pending_events`
--
ALTER TABLE `pending_events`
  MODIFY `pending_event_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A kérelmezett esemény egyedi azonosítója. / The primary key of the requested event.', AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A szolgáltatás egyedi azonosítója. / The unique id of the service.', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pending_events`
--
ALTER TABLE `pending_events`
  ADD CONSTRAINT `fk_events_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
