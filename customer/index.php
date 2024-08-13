<?php

	// include script for the database connection
	include('server/cruds_read.php');

?>

<!doctype html>
<html>
	<head>
	    <meta charset="utf-8">
	    <meta name="description" content="">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
		
		<!-- link external CSS stylesheet (Bootstrap 3 from www.getbootstrap.com) -->
	    <link rel="stylesheet" href="../css/bootstrap.css">

	    <title>My Customers</title>
	</head>
	<body>
	    	
		<div class="container">
			
			<h1>My Store</h1>
			<br/>
			<header>
				<ul class="nav nav-tabs">
					<li><a href="../index.php">Products</a></li>
					<li class="active"><a href="index.php">Customers</a></li>
					<li><a href="../transaction/index.php">Transactions</a></li>
				</ul>
			</header>

			<br/>
				
				<a href="create.php" class="btn btn-default btn-sm">+ Add Customer</a>
				<br/>
				<br/>

				<!-- list product items here -->

				<?php
					displayItems();
				?>
			
		</div>
		
	</body>
</html>