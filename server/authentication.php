<?php

	/*
	* script to authenticate user
	*
	*/

	// include the database connection script

	include('db_connect.php');

	// start the session

	session_start();

	// call the authentication function


	/*
		function to authenticate user.
		If the user is not logged in, redirect to the login page
		else, redirect to home/welcome/user page.
	*/
	function authenticateUser()
	{
		/*
			$_SESSION['logged'] values:
			1 = logged
			2
		*/

		if(isset($_SESSION['logged']))
		{
			if(isset($_SESSION['logged']) == 1)
			{
				
			}
		}

	}

?>