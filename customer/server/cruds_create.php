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

		$customer_name		=	$_POST['customer_name'];
		$customer_address	=	$_POST['customer_address'];
		$customer_age		=	$_POST['customer_age'];

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
			header("location: ../index.php");

		}
		else
		{
			// the failed.
			echo 'Failed to update item...';
		}

		// close database connection now

		mysqli_close($db_connect);
	}

/* END of script */

?>