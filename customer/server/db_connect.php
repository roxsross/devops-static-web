<?php

	/*
	 *	PHP Script to connect to the database
	 *	using mysqli_connect()
	 *
	*/

	// Configure database connection

	$db_host 		=	"localhost";	// specify host name | default is "localhost"
	$db_name 		=	"example_crud";			// specify database name
	$db_username 	=	"user_crud";			// specify database username | default is "root"
	$db_password 	=	"pass_crud";	 // specify database password | leave as blank if database has no password set 

	//Connect to the database server

	$db_connect = mysqli_connect($db_host, $db_username, $db_password, $db_name);
	
	//check connection

	if( mysqli_connect_errno() )
	{
		// terminate the whole script if the program could not connect to the database and display the error message
		die('<br/>Failed to connect to the database. Check database.' . mysqli_connect_error());
	}
	
?>
