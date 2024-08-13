-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 08, 2024 at 09:23 AM
-- Server version: 5.5.34
-- PHP Version: 5.4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `anna`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--
user example_crud;
CREATE TABLE IF NOT EXISTS `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `address` varchar(128) NOT NULL,
  `age` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `address`, `age`) VALUES
(2, 'Rizal', 'Manila', 127),
(3, 'Don', 'Laoag', 20),
(4, 'Jesus', 'Heaven', 127),
(5, 'Jam', 'Church', 21),
(6, 'Anna', 'Laoag', 19),
(7, 'JC', 'Bacarra', 19),
(11, 'Duque', 'Laoag', 12);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(32) NOT NULL,
  `price` float NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=73 ;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `product_name`, `price`, `description`) VALUES
(59, 'iPhone 4s', 20000, 'From Apple'),
(60, 'iPhone 5', 25000, 'iPhone 5 from Apple'),
(61, 'iPhone 5s', 35000, 'iPhone 5s is too expensive.'),
(62, 'iPad Air', 22000, 'iPad Air is thin like samurai!'),
(65, 'HTC One', 32995, 'Best of 2013'),
(66, 'God', 0, 'God is not on sale. Sorry.'),
(67, 'Samurai sword', 2000, 'This sword is so sharp that it can slice itself. Good for slicing jellies.'),
(69, 'Ultimate Killing Machine', 100000, 'Built by ultimate killing machines. For ultimate killing hobies.'),
(70, 'Life Jacket', 50000, 'This jacket could save you from heart attack. And maybe heartbreaks.'),
(71, 'Flashlight', 650, 'This helps you brighten things in the dark.');

-- --------------------------------------------------------

--
-- Table structure for table `sample`
--

CREATE TABLE IF NOT EXISTS `sample` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `age` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE IF NOT EXISTS `transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `date_transaction` date NOT NULL,
  `time_transaction` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `product_id`, `customer_id`, `date_transaction`, `time_transaction`) VALUES
(4, 60, 2, '2024-07-08', '07:19:59'),
(5, 62, 3, '2024-07-08', '07:23:17'),
(6, 0, 3, '2024-07-08', '07:27:46'),
(7, 65, 6, '2024-07-08', '07:27:58'),
(9, 69, 1, '2024-07-08', '07:44:50'),
(10, 71, 11, '2024-07-08', '08:27:36'),
(11, 71, 11, '2024-07-08', '08:29:20');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
