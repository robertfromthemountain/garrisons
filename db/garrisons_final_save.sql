-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2024 at 07:18 PM
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
-- Table structure for table `business_hours`
--

CREATE TABLE `business_hours` (
  `id` int(11) NOT NULL,
  `daysOfWeek` tinyint(4) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_hours`
--

INSERT INTO `business_hours` (`id`, `daysOfWeek`, `startTime`, `endTime`) VALUES
(1, 1, '09:30:00', '13:30:00'),
(2, 2, '10:00:00', '14:30:00'),
(3, 3, '08:00:00', '16:00:00'),
(4, 4, '09:00:00', '16:00:00'),
(5, 5, '10:30:00', '16:30:00'),
(6, 6, '09:00:00', '14:00:00'),
(7, 7, '00:00:00', '00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL COMMENT 'Primary key of the event.',
  `service_id` int(11) NOT NULL COMMENT 'Foreign key referring to the service.',
  `event_date` varchar(255) NOT NULL COMMENT 'Date of the event.',
  `event_start` varchar(255) NOT NULL COMMENT 'Start time of the event.',
  `event_end` varchar(255) NOT NULL COMMENT 'End time of the event.',
  `user_id` int(11) NOT NULL COMMENT 'User who booked the event.',
  `confirmed_at` varchar(30) DEFAULT NULL,
  `status` enum('pending','confirmed') NOT NULL DEFAULT 'pending' COMMENT 'Event status, either pending or confirmed.',
  `event_classes` varchar(255) DEFAULT 'pending_event_bg' COMMENT 'CSS class for event styling.',
  `reserved_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `service_id`, `event_date`, `event_start`, `event_end`, `user_id`, `confirmed_at`, `status`, `event_classes`, `reserved_at`) VALUES
(129, 6, '2024-10-23T10:00:00.000Z', '2024-10-23T10:00:00.000Z', '2024-10-23T10:30:00.000Z', 6, '2024-10-22 14:42:02', 'confirmed', 'confirmed_event_bg', '2024-10-22 12:42:02'),
(131, 6, '2024-10-23T11:15:00.000Z', '2024-10-23T11:15:00.000Z', '2024-10-23T11:45:00.000Z', 23, '2024-10-22 15:09:22', 'confirmed', 'confirmed_event_bg', '2024-10-22 12:46:38'),
(137, 6, '2024-10-23T10:30:00.000Z', '2024-10-23T10:30:00.000Z', '2024-10-23T11:00:00.000Z', 6, '2024-10-22 15:44:57', 'confirmed', 'confirmed_event_bg', '2024-10-22 13:44:57'),
(138, 6, '2024-10-21T09:30:00Z', '2024-10-21T09:30:00.000Z', '2024-10-21T10:00:00.000Z', 23, '2024-10-22 15:47:02', 'confirmed', 'confirmed_event_bg', '2024-10-22 13:46:39'),
(140, 7, '2024-10-21T10:30:00Z', '2024-10-21T10:30:00.000Z', '2024-10-21T11:15:00.000Z', 23, '2024-10-22 15:47:14', 'confirmed', 'confirmed_event_bg', '2024-10-22 13:46:48'),
(142, 6, '2024-11-04T09:30:00Z', '2024-11-04T09:30:00.000Z', '2024-11-04T10:00:00.000Z', 23, '2024-11-17 20:20:28', 'confirmed', 'confirmed_event_bg', '2024-11-09 12:53:09'),
(146, 6, '2024-11-07T09:00:00Z', '2024-11-07T09:00:00.000Z', '2024-11-07T09:30:00.000Z', 6, '2024-11-09 14:15:43', 'confirmed', 'confirmed_event_bg', '2024-11-09 13:15:43'),
(147, 6, '2024-11-06T10:30:00Z', '2024-11-06T10:30:00.000Z', '2024-11-06T11:00:00.000Z', 6, '2024-11-09 14:32:01', 'confirmed', 'confirmed_event_bg', '2024-11-09 13:32:01'),
(148, 6, '2024-11-05T11:00:00Z', '2024-11-05T11:00:00.000Z', '2024-11-05T11:30:00.000Z', 23, '2024-11-17 20:20:29', 'confirmed', 'confirmed_event_bg', '2024-11-09 14:54:12'),
(150, 6, '2024-11-13T11:15:00.000Z', '2024-11-13T11:15:00.000Z', '2024-11-13T11:45:00.000Z', 6, '2024-11-17 18:27:36', 'confirmed', 'confirmed_event_bg', '2024-11-17 17:27:36'),
(152, 29, '2024-11-11T11:00:00Z', '2024-11-11T11:00:00.000Z', '2024-11-11T11:30:00.000Z', 6, '2024-11-17 18:28:19', 'confirmed', 'confirmed_event_bg', '2024-11-17 17:28:19'),
(153, 7, '2024-11-12T11:15:00.000Z', '2024-11-12T11:15:00.000Z', '2024-11-12T12:00:00.000Z', 6, '2024-11-17 18:28:47', 'confirmed', 'confirmed_event_bg', '2024-11-17 17:28:47'),
(154, 30, '2024-11-11T11:30:00Z', '2024-11-11T11:30:00.000Z', '2024-11-11T12:20:00.000Z', 6, '2024-11-17 18:28:54', 'confirmed', 'confirmed_event_bg', '2024-11-17 17:28:54'),
(155, 24, '2024-11-11T12:30:00Z', '2024-11-11T12:30:00.000Z', '2024-11-11T13:30:00.000Z', 6, '2024-11-17 18:29:01', 'confirmed', 'confirmed_event_bg', '2024-11-17 17:29:01'),
(156, 6, '2024-11-14T11:15:00.000Z', '2024-11-14T11:15:00.000Z', '2024-11-14T11:45:00.000Z', 23, '2024-11-17 20:20:29', 'confirmed', 'confirmed_event_bg', '2024-11-17 19:19:17'),
(157, 6, '2024-11-28T12:00:00.000Z', '2024-11-28T12:00:00.000Z', '2024-11-28T12:30:00.000Z', 6, '2024-11-25 08:56:09', 'confirmed', 'confirmed_event_bg', '2024-11-25 07:56:09'),
(158, 29, '2024-11-26T10:15:00.000Z', '2024-11-26T10:15:00.000Z', '2024-11-26T10:45:00.000Z', 6, '2024-11-25 08:56:17', 'confirmed', 'confirmed_event_bg', '2024-11-25 07:56:17'),
(159, 24, '2024-11-28T12:30:00.000Z', '2024-11-28T12:30:00.000Z', '2024-11-28T13:30:00.000Z', 6, '2024-11-25 08:56:22', 'confirmed', 'confirmed_event_bg', '2024-11-25 07:56:22'),
(160, 30, '2024-11-28T10:00:00.000Z', '2024-11-28T10:00:00.000Z', '2024-11-28T10:50:00.000Z', 6, '2024-11-25 08:56:29', 'confirmed', 'confirmed_event_bg', '2024-11-25 07:56:29'),
(162, 6, '2024-11-27T11:30:00.000Z', '2024-11-27T11:30:00.000Z', '2024-11-27T12:00:00.000Z', 23, '2024-12-01 14:42:29', 'confirmed', 'confirmed_event_bg', '2024-11-25 07:56:53'),
(163, 24, '2024-11-28T13:45:00.000Z', '2024-11-28T13:45:00.000Z', '2024-11-28T14:45:00.000Z', 23, '2024-12-01 14:42:30', 'confirmed', 'confirmed_event_bg', '2024-11-25 07:56:58'),
(164, 24, '2024-11-29T10:45:00.000Z', '2024-11-29T10:45:00.000Z', '2024-11-29T11:45:00.000Z', 6, '2024-11-25 08:57:16', 'confirmed', 'confirmed_event_bg', '2024-11-25 07:57:16'),
(167, 6, '2024-12-03T12:15:00.000Z', '2024-12-03T12:15:00.000Z', '2024-12-03T12:45:00.000Z', 23, '2024-12-01 14:59:37', 'confirmed', 'confirmed_event_bg', '2024-12-01 13:43:03'),
(169, 24, '2024-12-04T10:15:00.000Z', '2024-12-04T10:15:00.000Z', '2024-12-04T11:15:00.000Z', 6, '2024-12-01 15:00:34', 'confirmed', 'confirmed_event_bg', '2024-12-01 14:00:34'),
(170, 6, '2024-12-05T11:30:00.000Z', '2024-12-05T11:30:00.000Z', '2024-12-05T12:00:00.000Z', 6, '2024-12-01 15:00:36', 'confirmed', 'confirmed_event_bg', '2024-12-01 14:00:36'),
(171, 6, '2024-12-02T11:30:00Z', '2024-12-02T11:30:00.000Z', '2024-12-02T12:00:00.000Z', 36, '2024-12-01 15:08:56', 'confirmed', 'confirmed_event_bg', '2024-12-01 14:08:48'),
(173, 30, '2024-12-02T10:15:00Z', '2024-12-02T10:15:00.000Z', '2024-12-02T11:05:00.000Z', 6, '2024-12-01 16:07:18', 'confirmed', 'confirmed_event_bg', '2024-12-01 15:07:18'),
(174, 6, '2024-12-02T13:00:00Z', '2024-12-02T13:00:00.000Z', '2024-12-02T13:30:00.000Z', 23, '2024-12-01 16:07:53', 'confirmed', 'confirmed_event_bg', '2024-12-01 15:07:42'),
(177, 6, '2024-11-26T10:45:00.000Z', '2024-11-26T10:45:00.000Z', '2024-11-26T11:15:00.000Z', 6, '2024-12-01 18:07:35', 'confirmed', 'confirmed_event_bg', '2024-12-01 17:07:35'),
(180, 6, '2024-11-27T09:30:00Z', '2024-11-27T09:30:00.000Z', '2024-11-27T10:00:00.000Z', 23, '2024-12-03 18:45:47', 'confirmed', 'confirmed_event_bg', '2024-12-01 17:23:21'),
(182, 6, '2024-12-04T09:00:00Z', '2024-12-04T09:00:00.000Z', '2024-12-04T09:30:00.000Z', 23, NULL, 'pending', 'pending_event_bg', '2024-12-03 17:46:21'),
(183, 6, '2024-12-09T10:00:00Z', '2024-12-09T10:00:00.000Z', '2024-12-09T10:30:00.000Z', 23, NULL, 'pending', 'pending_event_bg', '2024-12-10 18:16:58');

-- --------------------------------------------------------

--
-- Table structure for table `reference_images`
--

CREATE TABLE `reference_images` (
  `id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reference_images`
--

INSERT INTO `reference_images` (`id`, `image_path`, `created_at`) VALUES
(13, '/images/1729598184677-a80c8b831396728c6d4bb79ce875ee1a.jpg', '2024-10-22 11:56:24'),
(14, '/images/1733065315575-a1f5d39352489c2846e34aae15777d84.jpg', '2024-12-01 15:01:55'),
(15, '/images/1733073315685-39c6d9123ffcc86166cfe26db96dac8d.jpg', '2024-12-01 17:15:15'),
(16, '/images/1733073315686-cae1946495d88b9a2ba40507ecbf471f.jpg', '2024-12-01 17:15:15'),
(17, '/images/1733073315688-f323b2d05e2e4e684884fe0078f97b9f.jpg', '2024-12-01 17:15:15'),
(18, '/images/1733073315689-f8e4cfa883b7dfbc928bc0f88d4463de.jpg', '2024-12-01 17:15:15');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL COMMENT 'A szolgáltatás egyedi azonosítója. / The unique id of the service.',
  `title` varchar(50) NOT NULL COMMENT 'A szolgáltatás neve. / The name of the service.',
  `price` smallint(6) DEFAULT NULL COMMENT 'A szolgáltatás ára. / The price of the service.',
  `duration` tinyint(3) NOT NULL COMMENT 'A szolgáltatás időtartama percben mérve. / The duration of the service in minutes.',
  `backgroundColor` varchar(30) NOT NULL DEFAULT '#ff7b00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `price`, `duration`, `backgroundColor`) VALUES
(6, 'Barber Hajvágás', 4500, 30, '#A51919'),
(7, 'Egyszerű Hajvágás+Szakálligazítás', 6500, 45, '#2A862A'),
(24, 'Hajfestés', 7500, 60, '#1233A5'),
(26, 'Ebédszünet', NULL, 45, '#8f6a48'),
(27, 'Speciális esemény', NULL, 30, '#4F5706A3'),
(29, 'Egyszerű Hajvágás', 4000, 30, '#7B9B17'),
(30, 'Barber Hajvágás+Szakálligazítás', 7000, 50, '#8f6a48');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  `status` enum('pending','confirmed','banned') NOT NULL DEFAULT 'pending',
  `verification_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `phoneNumber`, `role`, `password`, `status`, `verification_token`) VALUES
(6, 'Confirmed', 'Admin', 'admin@admin.admin', '303456789', 'admin', '$2a$10$GvHGNj9ZJuQiDTKzN.M3UeqClOCxgoX7Q5Snt1/ubbMkq2hgFU/U6', 'confirmed', NULL),
(23, 'Confirmed', 'User', 'user@user.user', '706784567', 'user', '$2a$10$O2tU3d2TUJ2fcyAK9YFibuPN7aw.FKf9hQbRns5CDTt2vcVMyc3GC', 'confirmed', NULL),
(36, 'Banned', 'User', 'banned@banned.banned', '201231231', 'user', '$2a$10$dX5AFHJJ9LRelwBUuCLAveX13SLP.Ju6cKU5LWzkB9Q.pE96vG8rS', 'banned', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `business_hours`
--
ALTER TABLE `business_hours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `fk_event_service` (`service_id`),
  ADD KEY `fk_event_user` (`user_id`);

--
-- Indexes for table `reference_images`
--
ALTER TABLE `reference_images`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `business_hours`
--
ALTER TABLE `business_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key of the event.', AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT for table `reference_images`
--
ALTER TABLE `reference_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'A szolgáltatás egyedi azonosítója. / The unique id of the service.', AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_event_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  ADD CONSTRAINT `fk_event_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
