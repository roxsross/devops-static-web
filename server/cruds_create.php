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

		$post_name			=	$_POST['product_name'];
		$post_price			=	$_POST['product_price'];
		$post_description	=	$_POST['product_description'];

		// set/initialize the mySQL insert query

		$query_insert = 
		"INSERT INTO `product`
		(
			product_name,
			price,
			description
		)
		VALUES
		(
			'".$post_name."',
			'".$post_price."',
			'".$post_description."'
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
			// the query failed.
			echo 'Failed to update item...';
		}

		// close database connection now

		mysqli_close($db_connect);
	}

/* END of script */

?>