<?php

    // include script for the database connection
    include('server/cruds_update.php');
    include('server/db_connect.php');

    // get if of item to update

    if($_GET)
    {
        $id = $_GET['id'];
        $customer_name = getCustomerName($id);
        $customer_address = getCustomerAddress($id);
        $customer_age = getCustomerAge($id);
    }

    function getCustomerName($itemId)
    {
        global $db_connect;
        // set SELECT query
        $query_select =
        "SELECT name
        FROM `customer`
        WHERE
        (
            id=".$itemId."
        )
        ";
        // execute SELECt query
        $result = mysqli_query($db_connect, $query_select);
        $row = mysqli_fetch_array($result);

        return $row['name'];
    }

    function getCustomerAddress($itemId)
    {
        global $db_connect;
        // set SELECT query
        $query_select =
        "SELECT address
        FROM `customer`
        WHERE
        (
            id=".$itemId."
        )
        ";
        // execute SELECt query
        $result = mysqli_query($db_connect, $query_select);
        $row = mysqli_fetch_array($result);

        return $row['address'];
    }

    function getCustomerAge($itemId)
    {
        global $db_connect;
        // set SELECT query
        $query_select =
        "SELECT age
        FROM `customer`
        WHERE
        (
            id=".$itemId."
        )
        ";
        // execute SELECt query
        $result = mysqli_query($db_connect, $query_select);
        $row = mysqli_fetch_array($result);

        return $row['age'];
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

        <title>Update Product</title>
    </head>
    <body>
            
        <div class="container">
            
            <h1>Update Product</h1>

            <br/>
                
            <a href="index.php" class="btn btn-default btn-sm">View Products</a>

            <br/>
            <br/>

            <form class="form-horizontal" role="form" method="post" action="server/cruds_update.php">
                <div class="form-group">
                    <label for="customer_id" class="col-sm-2 control-label">Customer ID</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control"
                            id="customer_id"
                            name="customer_id"
                            value="<?php echo $id; ?>"
                            readonly
                        >
                    </div>
                </div>
                <div class="form-group">
                    <label for="customer_name" class="col-sm-2 control-label">Customer Name</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            class="form-control"
                            id="customer_name"
                            name="customer_name"
                            placeholder="customer name..."
                            value="<?php echo $customer_name; ?>"
                        >
                    </div>
                </div>
                <div class="form-group">
                    <label for="customer_address" class="col-sm-2 control-label">Address</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            class="form-control"
                            id="customer_address"
                            name="customer_address"
                            placeholder="customer address..."
                            maxlength="10"
                            value="<?php echo $customer_address; ?>"
                        >
                    </div>
                </div>
                <div class="form-group">
                    <label for="customer_age" class="col-sm-2 control-label">Age</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            class="form-control"
                            id="customer_age"
                            name="customer_age"
                            placeholder="customer age..."
                            value="<?php echo $customer_age; ?>"
                        >
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-success">Update Customer</button>
                        <a href="index.php" class="btn btn-danger">Cancel</a>
                        <button type="reset" class="btn btn-default">Clear</button>
                    </div>
                </div>
            </form>

        </div>
        
    </body>
</html>