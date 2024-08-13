<?php

	/*
	 *	Server script to delete an item using from an HTTP GET method
	 *
	*/

	// Check if the Request is an HTTP GET method.
	// If GET, collect the data from the GET variable

	if($_GET)
	{

		include('db_connect.php');

		// collect the data from the HTTP GET

		$get_id			=	$_GET['id'];

		// set/initialize the mySQL insert query

		$query_insert = 
		"DELETE FROM `product`
		WHERE
		(
			id=".$get_id."
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
			echo 'Database query failed...';
		}

		// close database connection now

		mysqli_close($db_connect);
	}

/* END of script */

?>