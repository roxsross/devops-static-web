<?php

    // include script for the database connection
    include('server/cruds_create.php');

?>

<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- link external CSS stylesheet (Bootstrap 3 from www.getbootstrap.com) -->
        <link rel="stylesheet" href="../css/bootstrap.css">

        <title>New Transaction</title>
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

            <h3>Add customer</h3>

            <br/>
                
            <a href="index.php" class="btn btn-default btn-sm"><- Back</a>

            <br/>
            <br/>

            <form class="form-horizontal" role="form" method="post" action="server/cruds_create.php">
                <div class="form-group">
                    <label for="customer_name" class="col-sm-2 control-label">Customer Name</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="customer_name" name="customer_name" placeholder="Customer Name" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="customer_address" class="col-sm-2 control-label">Address</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="customer_address" name="customer_address" placeholder="Customer Address" maxlength="10" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="customer_age" class="col-sm-2 control-label">Age</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="customer_age" name="customer_age" placeholder="Customer Age" maxlength="10" required>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-success">Add Customer</button>
                        <a href="index.php" class="btn btn-danger">Cancel</a>
                        <button type="reset" class="btn btn-default">Clear</button>
                    </div>
                </div>
            </form>

        </div>
        
    </body>
</html>