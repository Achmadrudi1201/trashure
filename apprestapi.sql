-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 09, 2024 at 03:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `apprestapi`
--

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Cardboard` float DEFAULT NULL,
  `Glass` float DEFAULT NULL,
  `Metal` float DEFAULT NULL,
  `Paper` float DEFAULT NULL,
  `Plastic` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `image`
--

INSERT INTO `image` (`id`, `path`, `userId`, `createdAt`, `updatedAt`, `Cardboard`, `Glass`, `Metal`, `Paper`, `Plastic`) VALUES
(1, 'https://storage.googleapis.com/trashure-image/uploads/2024-06-09/de81014651e20addf50ecd8631007be4.jpg', 5, '2024-06-09 04:20:25', '2024-06-09 04:20:25', 0.999963, 0.0000000482415, 0.00000156167, 0.0000352786, 0.000000540541),
(2, 'https://storage.googleapis.com/trashure-image/uploads/2024-06-09/de81014651e20addf50ecd8631007be4.jpg', 6, '2024-06-09 04:32:14', '2024-06-09 04:32:14', 0.999963, 0.0000000482415, 0.00000156167, 0.0000352786, 0.000000540541),
(3, 'https://storage.googleapis.com/trashure-image/uploads/2024-06-09/de81014651e20addf50ecd8631007be4.jpg', 6, '2024-06-09 04:33:26', '2024-06-09 04:33:26', 0.999963, 0.0000000482415, 0.00000156167, 0.0000352786, 0.000000540541),
(4, 'https://storage.googleapis.com/trashure-image/uploads/2024-06-09/test2.jpeg', 6, '2024-06-09 19:10:26', '2024-06-09 19:10:26', 0.000291117, 0.0000610552, 0.0000483714, 0.997809, 0.00178999),
(5, 'https://storage.googleapis.com/trashure-image/uploads/2024-06-09/test2.jpeg', 7, '2024-06-09 19:19:47', '2024-06-09 19:19:47', 0.000291117, 0.0000610552, 0.0000483714, 0.997809, 0.00178999);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'testuser', '', '$2b$08$XEDYCIUKzrSrN1izI83OHudmYajiu9gkkOQFUcfc73yjBk0LfJSdW', '2024-06-04 17:10:27'),
(2, 'testuser', '', '$2b$08$h.Xl9jlBO3CrirmN66WgleyKYzYeitzeI2ezfxfwBJ6bJgKb0IaGa', '2024-06-04 17:12:38'),
(3, 'testuser', '', '$2b$08$yXDFJuV/ya7Pz0V.VXyDdOj7yViZggqkDLY6.lNoel.l.5myHkTj2', '2024-06-04 17:12:43'),
(4, 'rudi', '', '$2b$08$I/cqwXCe7BN41.uTWT4xpugIPoQvAcu2Ng05BtOYjpYL/MdrcBVR2', '2024-06-04 17:24:40'),
(5, 'ananta', '', '$2b$08$JDcxHqAg8WisIPx4h/5aOer2J.qt4aOnuy3wSyTfhWLJ4c0UbM6py', '2024-06-08 21:09:49'),
(6, 'testusers', '', '$2b$08$iYFa3gO3WmruXWVda4I9t.iquSVTBMRnaPVN5OIn.EFB4mxktlDJO', '2024-06-08 21:31:49'),
(7, 'testusers1', 'testusers1@gmail.com', '$2b$08$5VsGxH7lcUlCnRhy892QROhrQb8W0ruhTbea9enQZ41akL7UglUZ2', '2024-06-09 12:15:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
