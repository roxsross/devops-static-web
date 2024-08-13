<?php


	/*
	*	Script to read items from the database
	*
	*/

	// include the script for database connection
	include('server/db_connect.php');

	// function to display the items from the database table
	
	function displayItems()
	{
		// set mySQL SELECT query

		global $db_connect;	// create instance of the database connection

		$query_select = "SELECT * FROM `transaction`";

		// execute query

		$result = mysqli_query($db_connect, $query_select);

		// extract data from query result and display them in an HTML Table

		echo "<table class='table table-hover'>";	// start the table

			echo"
				<tr>
					<td><h4>#</h4></td>
					<td><h4>Transaction ID</h4></td>
					<td><h4>Customer ID</h4></td>
					<td><h4>Product ID</h4></td>
					<td><h4>Date</h4></td>
					<td><h4>Time</h4></td>
					<td><h4>Action</h4></td>
				</tr>
			";
			$i = 1;
			while( $row = mysqli_fetch_array($result) )
			{
				echo "
					<tr>
						<td>$i</td>
						<td>".$row['id']."</td>
						<td>".$row['customer_id']."</td>
						<td>".$row['product_id']."</td>
						<td>".$row['date_transaction']."</td>
						<td>".$row['time_transaction']."</td>
						<td>
							<a href='server/cruds_delete.php?id=".$row['id']."'>Delete</a>
						</td>
					</tr>
				";
			$i++;
			}

		echo "</table>";	//end the table
	}

/* END of script */
?>