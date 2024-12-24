-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 24, 2024 at 07:45 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_universal`
--

-- --------------------------------------------------------

--
-- Table structure for table `car_modal`
--

CREATE TABLE `car_modal` (
  `id` int(11) NOT NULL,
  `manufacturer_id` int(11) NOT NULL,
  `modal_name` varchar(80) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `car_modal`
--

INSERT INTO `car_modal` (`id`, `manufacturer_id`, `modal_name`, `status`, `created_at`) VALUES
(1, 1, 'X1 SUV', 0, '2024-12-21 19:34:31'),
(2, 1, 'X2 Coupe SUV', 0, '2024-12-21 19:34:39'),
(3, 1, 'X3 SUV', 0, '2024-12-21 19:34:46'),
(4, 2, 'Audi A4', 0, '2024-12-21 19:35:13'),
(5, 2, 'Audi A6', 0, '2024-12-21 19:35:20');

-- --------------------------------------------------------

--
-- Table structure for table `car_parts`
--

CREATE TABLE `car_parts` (
  `id` int(11) NOT NULL,
  `manufacturer` varchar(11) NOT NULL,
  `c_modal` varchar(11) NOT NULL,
  `c_gen` varchar(30) NOT NULL,
  `engine_name` varchar(80) NOT NULL,
  `seo_url` varchar(150) NOT NULL,
  `description` varchar(30) NOT NULL,
  `price` varchar(30) NOT NULL,
  `discount` varchar(30) NOT NULL,
  `main_price` varchar(30) NOT NULL,
  `main_image_path` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customer_address`
--

CREATE TABLE `customer_address` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `mobile` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` varchar(120) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `postcode` varchar(11) NOT NULL,
  `delivery_date` varchar(20) NOT NULL,
  `delivery_time` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer_address`
--

INSERT INTO `customer_address` (`id`, `user_id`, `full_name`, `mobile`, `email`, `address`, `city`, `state`, `postcode`, `delivery_date`, `delivery_time`, `created_at`) VALUES
(1, 1, 'John', 2147483647, 'divjonny58@gmail.com', 'New Delhi', 'Delhi', '', '110085', '2024-12-25', '14:35', '2024-12-22 07:05:51');

-- --------------------------------------------------------

--
-- Table structure for table `customer_appointment`
--

CREATE TABLE `customer_appointment` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` int(11) NOT NULL,
  `address` varchar(100) NOT NULL,
  `message` varchar(255) NOT NULL,
  `manufacturer` varchar(80) NOT NULL,
  `car_model` varchar(80) NOT NULL,
  `generation` varchar(80) NOT NULL,
  `service_date` varchar(30) NOT NULL,
  `service_time` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `cu_cart`
--

CREATE TABLE `cu_cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `product_size` varchar(20) NOT NULL,
  `product_price` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `product_image` varchar(250) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cu_cart`
--

INSERT INTO `cu_cart` (`id`, `user_id`, `product_id`, `product_name`, `product_size`, `product_price`, `quantity`, `product_image`, `created_at`) VALUES
(18, 1, 5, 'X1 SUV New Brand ', 'M', '96 ', 1, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734816612/engine-images/dqbon18fu1d7rxnc64zq.webp', '2024-12-22 20:56:23');

-- --------------------------------------------------------

--
-- Table structure for table `cu_users`
--

CREATE TABLE `cu_users` (
  `id` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `status` varchar(11) NOT NULL,
  `otp` int(11) NOT NULL,
  `otp_expiry` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cu_users`
--

INSERT INTO `cu_users` (`id`, `name`, `email`, `password`, `status`, `otp`, `otp_expiry`, `created_at`) VALUES
(1, 'John Aryan', 'divjonny58@gmail.com', '$2b$10$l2imBk0.30tle6Ff.jXdO.T2GAOJHXRx1J7vXpst0Jq1M2hlWVIxy', '0', 0, '', '2024-12-22 06:58:17');

-- --------------------------------------------------------

--
-- Table structure for table `engines`
--

CREATE TABLE `engines` (
  `id` int(11) NOT NULL,
  `manufacturer` varchar(11) NOT NULL,
  `c_modal` varchar(11) NOT NULL,
  `c_gen` varchar(30) NOT NULL,
  `engine_name` varchar(80) NOT NULL,
  `seo_url` varchar(150) NOT NULL,
  `description` varchar(30) NOT NULL,
  `price` varchar(30) NOT NULL,
  `discount` varchar(30) NOT NULL,
  `main_price` varchar(30) NOT NULL,
  `main_image_path` varchar(250) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `engines`
--

INSERT INTO `engines` (`id`, `manufacturer`, `c_modal`, `c_gen`, `engine_name`, `seo_url`, `description`, `price`, `discount`, `main_price`, `main_image_path`, `created_at`) VALUES
(5, 'BMW', 'X1 SUV', 'xyx', 'X1 SUV New Brand', 'x1-suv-new-brand', 'dsf', '120', '20', '96', 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734816612/engine-images/dqbon18fu1d7rxnc64zq.webp', '2024-12-21 21:31:45'),
(6, 'BMW', 'X2 Coupe SU', 'xyx2', 'X2 SUV New Brand', 'x2-suv-new-brand', 'asf sdgsfdgfdb dfg', '250', '20', '200', 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734816755/engine-images/apjnsngrlmtzm5cgqjzn.webp', '2024-12-21 21:32:36'),
(7, 'Audi', 'Audi A6', 'xyx2', 'Audi A6 New Brand', 'audi-a6-new-brand', 'dasdsa', '450', '20', '360', 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734871948/engine-images/ndn07sswdcmcg39ccuok.png', '2024-12-22 12:52:29'),
(8, 'Audi', 'Audi A6', 'xyx2', 'X1 SUV New Brandasd', 'audi-a4-new-brandasda', 'dasd', '120', '20', '96', 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937240/engine-images/yfcuvhgps411vm7gltik.webp', '2024-12-23 07:00:40'),
(9, 'Audi', 'Audi A6', 'xyx2', 'X1 SUV New Brandasd', 'audi-a4-new-brandasda', 'dasd', '120', '20', '96', 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937284/engine-images/m0i5lqe7dloas1tfgq8x.webp', '2024-12-23 07:01:25'),
(10, 'BMW', 'X1 SUV', 'xyx', 'X1 SUV New Brand safdas', 'x1-suv-new-brandfasfas', 'fsaf', '220', '10', '198', 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937575/engine-images/uhhnyfcg3tbfsfzc7q8n.jpg', '2024-12-23 07:06:15'),
(11, 'BMW', 'X1 SUV', 'xyx', 'X1 SUV New Brand safdas', 'x1-suv-new-brandfasfas', 'fsaf', '220', '10', '198', 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937605/engine-images/khlh0gx9lucozzeq2ljj.jpg', '2024-12-23 07:06:45');

-- --------------------------------------------------------

--
-- Table structure for table `manufacturer`
--

CREATE TABLE `manufacturer` (
  `id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `manufacturer`
--

INSERT INTO `manufacturer` (`id`, `name`, `status`, `created_at`) VALUES
(1, 'BMW', 1, '2024-12-21 19:33:59'),
(2, 'Audi', 1, '2024-12-21 19:34:56');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address_id` int(11) NOT NULL,
  `total_price` varchar(50) NOT NULL,
  `order_status` varchar(50) NOT NULL,
  `payment_status` varchar(50) NOT NULL,
  `payment_type` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `user_id`, `address_id`, `total_price`, `order_status`, `payment_status`, `payment_type`, `created_at`) VALUES
(2, 'CU__00001', 1, 1, '392.00', 'PENDING', 'PENDING', 'PAYPAL', '2024-12-22 20:43:51'),
(3, 'CU__00002', 1, 1, '360.00', 'PENDING', 'PENDING', 'PAYPAL', '2024-12-22 20:44:34');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_size` varchar(20) NOT NULL,
  `price` varchar(40) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `user_id`, `product_id`, `product_size`, `price`, `quantity`, `created_at`) VALUES
(4, 'CU__00001', 1, 5, 'S', '96 ', 1, '2024-12-22 20:43:51'),
(5, 'CU__00001', 1, 6, '30', '200 ', 1, '2024-12-22 20:43:51'),
(6, 'CU__00001', 1, 5, '3XL', '96 ', 1, '2024-12-22 20:43:51'),
(7, 'CU__00002', 1, 7, 'L', '360 ', 1, '2024-12-22 20:44:34');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_image` varchar(120) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `product_image`, `status`, `created_at`) VALUES
(1, 9, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937285/engine-images/op5ygmuqyzoqsixmhrh1.png', 0, '2024-12-23 07:01:29'),
(2, 9, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937287/engine-images/akbcanvp8jcdkscxyuvn.png', 0, '2024-12-23 07:01:29'),
(3, 9, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937288/engine-images/qsrryxwkxzvmftmwia3p.webp', 0, '2024-12-23 07:01:29'),
(4, 9, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937289/engine-images/cbn63cs0htfk0vjjeh2f.png', 0, '2024-12-23 07:01:29'),
(5, 11, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937606/engine-images/rpsnv54yrcorgwnddhxt.png', 0, '2024-12-23 07:06:50'),
(6, 11, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937607/engine-images/vnkiphf2d20shl7rd1xu.jpg', 0, '2024-12-23 07:06:50'),
(7, 11, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937608/engine-images/r2d4vgyqtzlvtvppottj.png', 0, '2024-12-23 07:06:50'),
(8, 11, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937609/engine-images/bqpucyll7201sqpfsxv3.jpg', 0, '2024-12-23 07:06:50'),
(9, 11, 'https://res.cloudinary.com/dqqfisfji/image/upload/v1734937610/engine-images/qdmpe3fmufklu3qrpquk.jpg', 0, '2024-12-23 07:06:50');

-- --------------------------------------------------------

--
-- Table structure for table `size`
--

CREATE TABLE `size` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `size`
--

INSERT INTO `size` (`id`, `product_id`, `size`, `quantity`, `status`, `created_at`) VALUES
(17, 5, 'S', 10, 0, '2024-12-21 21:30:13'),
(18, 5, 'M', 10, 0, '2024-12-21 21:30:13'),
(19, 5, 'L', 3, 0, '2024-12-22 15:45:42'),
(20, 5, 'XL', 0, 0, '2024-12-22 14:50:14'),
(21, 5, '2XL', 10, 0, '2024-12-21 21:30:13'),
(22, 5, '3XL', 10, 0, '2024-12-21 21:30:13'),
(23, 6, '28', 10, 0, '2024-12-21 21:32:36'),
(24, 6, '30', 10, 0, '2024-12-21 21:32:36'),
(25, 6, '32', 0, 0, '2024-12-22 14:26:23'),
(26, 7, 'S', 4, 0, '2024-12-22 15:04:52'),
(27, 7, 'M', 0, 0, '2024-12-22 14:26:18'),
(28, 7, 'L', 5, 0, '2024-12-22 15:05:10'),
(29, 7, 'XL', 10, 0, '2024-12-22 12:52:29'),
(30, 9, '28', 10, 0, '2024-12-23 07:01:29'),
(31, 11, 'XS', 10, 0, '2024-12-23 07:06:50'),
(32, 11, 'S', 10, 0, '2024-12-23 07:06:50'),
(33, 11, 'M', 10, 0, '2024-12-23 07:06:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car_modal`
--
ALTER TABLE `car_modal`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_parts`
--
ALTER TABLE `car_parts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_address`
--
ALTER TABLE `customer_address`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_appointment`
--
ALTER TABLE `customer_appointment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cu_cart`
--
ALTER TABLE `cu_cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cu_users`
--
ALTER TABLE `cu_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `engines`
--
ALTER TABLE `engines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `manufacturer`
--
ALTER TABLE `manufacturer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_modal`
--
ALTER TABLE `car_modal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `car_parts`
--
ALTER TABLE `car_parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_address`
--
ALTER TABLE `customer_address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_appointment`
--
ALTER TABLE `customer_appointment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cu_cart`
--
ALTER TABLE `cu_cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `cu_users`
--
ALTER TABLE `cu_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `engines`
--
ALTER TABLE `engines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `manufacturer`
--
ALTER TABLE `manufacturer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `size`
--
ALTER TABLE `size`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
