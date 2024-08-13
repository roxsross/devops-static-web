<?php

    // include database connection script
    include('server/db_connect.php');

    function displayProductsSelection()
    {
        global $db_connect;

        // set mySQL SELECT query

        global $db_connect; // create instance of the database connection

        $query_select = "SELECT * FROM `product`";

        // execute query

        $result = mysqli_query($db_connect, $query_select);

        // extract data from query result and display them in an HTML Table

        echo "<select name='product_id' class='form-control'>";   // start the table
        echo "<option value='x'>* Select product</option>";
            $i = 1;
            while( $row = mysqli_fetch_array($result) )
            {
                echo"
                    <option value='".$row['id']."''>".$row['product_name']." - ".$row['price']."</option>
                ";
                $i++;
            }

        echo "</select>";    //end the table
    }

    function displayCustomerSelection()
    {
        global $db_connect;

        // set mySQL SELECT query

        global $db_connect; // create instance of the database connection

        $query_select = "SELECT * FROM `customer`";

        // execute query

        $result = mysqli_query($db_connect, $query_select);

        // extract data from query result and display them in an HTML Table

        // display the select tag fileed with data from database rows

        echo "
            <select name='customer_id' class='form-control'> 
                <option value='no-selection'>* Select customer</option>
                <option value='new-customer'>* NEW customer</option>
        ";
            $i = 1;
            while( $row = mysqli_fetch_array($result) )
            {
                echo"
                    <option value='".$row['id']."''>".$row['name']."</option>
                ";
                $i++;
            }

        echo "</select>";    //end the table
    }

?>

<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- link external CSS stylesheet (Bootstrap 3 from www.getbootstrap.com) -->
        <link rel="stylesheet" href="../css/bootstrap.css">

        <!-- jQuery -->
        <script type="text/javascript" src="../js/jquery.js"></script>

        <title>New Transaction</title>
    </head>
    <body>
            
        <div class="container">
            
            <h1>My Store</h1>
            <br/>
            <header>
                <ul class="nav nav-tabs">
                    <li><a href="../index.php">Products</a></li>
                    <li><a href="../customer/index.php">Customers</a></li>
                    <li class="active"><a href="index.php">Transactions</a></li>
                </ul>
            </header>

            <br/>

            <a href="index.php" class="btn btn-default btn-sm">+ Back</a>
            
            <h3>New Transaction</h3>

            <form class="form-horizontal" role="form" method="post" action="server/cruds_create.php">
                <div class="form-group">
                    <label for="product_id" class="col-sm-2 control-label">Select Product</label>
                    <div class="col-sm-10">
                        <!-- display products in a select tag -->
                        <?php displayProductsSelection() ?>
                    </div>
                </div>

                <div class="form-group">
                    <label for="product_id" class="col-sm-2 control-label">Select Customer</label>
                    <div class="col-sm-10">
                        <!-- display products in a select tag -->
                        <?php displayCustomerSelection() ?>
                    </div>
                </div>
                
                <!-- fields for new customer -->


                <div id="new-customer">
                    <div class="form-group">
                        <label for="customer_name" class="col-sm-2 control-label"></label>
                        <div class="col-sm-10">
                            <hp class="text-info">Form for new customer</p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="customer_name" class="col-sm-2 control-label">Customer Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="customer_name" name="customer_name" placeholder="Customer Name" >
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="customer_address" class="col-sm-2 control-label">Address</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="customer_address" name="customer_address" placeholder="Customer Address" maxlength="10">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="customer_age" class="col-sm-2 control-label">Age</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="customer_age" name="customer_age" placeholder="Customer Age" maxlength="10">
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-success">Confirm Transaction</button>
                        <a href="index.php" class="btn btn-danger">Cancel</a>
                        <button type="reset" class="btn btn-default">Clear</button>
                    </div>
                </div>
            </form>

        </div>

    </body>
</html>