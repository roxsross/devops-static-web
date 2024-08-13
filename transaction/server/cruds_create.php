<?php

	/*
	 *	Server script to create new records from incomming POSTs methods
	 *
	*/

	// Check if the Request is an HTTP POST method.
	// If POST, collect the data from the POST variable

	if($_POST)
	{

		include('db_connect.php');

		// collect the data from the HTTP POST

		$product_id			=	$_POST['product_id'];
		
		// determin if new or existing customer

		$customer_id		=	$_POST['customer_id'];

		if($customer_id == "new-customer")
		{
			// get customer is new
			$customer_name		=	$_POST['customer_name'];
			$customer_address	=	$_POST['customer_address'];
			$customer_age		=	$_POST['customer_age'];

			// call the function to register the new customer

			registerCustomer($customer_name, $customer_address, $customer_age);

			// get the id of the newly registered customer

			$customer_id = getLastCustomerId();
		}

		// get current time and date of transaction from system time

		$date_today = date("Y-m-d");

		// set/initialize the mySQL insert query

		$query_insert = 
		"INSERT INTO `transaction`
		(
			product_id,
			customer_id,
			date_transaction,
			time_transaction
			
		)
		VALUES
		(
			'".$product_id."',
			'".$customer_id."',
			'".$date_today."',
			now()
		)
		";

		// execute and verify query

		if( mysqli_query($db_connect, $query_insert) )
		{
			// the query was successful.
			header("location: ../index.php");

		}
		else
		{
			// the failed.
			echo 'Failed to add transaction item...';
		}

		// close database connection now

		mysqli_close($db_connect);
	}

	function registerCustomer($customer_name, $customer_address, $customer_age)
	{
		// collect the data from the HTTP POST

		global $db_connect;

		// set/initialize the mySQL insert query

		$query_insert = 
		"INSERT INTO `customer`
		(
			name,
			address,
			age
		)
		VALUES
		(
			'".$customer_name."',
			'".$customer_address."',
			'".$customer_age."'
		)
		";

		// execute and verify query

		if( mysqli_query($db_connect, $query_insert) )
		{
			// the query was successful.
		}
		else
		{
			// the failed.
			echo 'Failed to update item...';
		}
	}


	// function to get the last id from the last row of the customer table

	function getLastCustomerId()
	{
		global $db_connect;

		$query_last = "SELECT id FROM customer ORDER BY id DESC LIMIT 0, 1";

		$result = mysqli_query($db_connect, $query_last);

		$row = mysqli_fetch_array($result);

		return $row['id'];

	}

/* END of script */

?>