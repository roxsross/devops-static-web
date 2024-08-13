<?php

    // include script for the database connection
    include('server/cruds_update.php');
    include('server/db_connect.php');

    // get if of item to update

    if($_GET)
    {
        $id = $_GET['id'];
        $product_name = getProductName($id);
        $product_price = getProductPrice($id);
        $product_description = getProductDescription($id);
    }

    function getProductName($itemId)
    {
        global $db_connect;
        // set SELECT query
        $query_select =
        "SELECT product_name
        FROM `product`
        WHERE
        (
            id=".$itemId."
        )
        ";
        // execute SELECt query
        $result = mysqli_query($db_connect, $query_select);
        $row = mysqli_fetch_array($result);

        return $row['product_name'];
    }

    function getProductPrice($itemId)
    {
        global $db_connect;
        // set SELECT query
        $query_select =
        "SELECT price
        FROM `product`
        WHERE
        (
            id=".$itemId."
        )
        ";
        // execute SELECt query
        $result = mysqli_query($db_connect, $query_select);
        $row = mysqli_fetch_array($result);

        return $row['price'];
    }

    function getProductDescription($itemId)
    {
        global $db_connect;
        // set SELECT query
        $query_select =
        "SELECT description
        FROM `product`
        WHERE
        (
            id=".$itemId."
        )
        ";
        // execute SELECt query
        $result = mysqli_query($db_connect, $query_select);
        $row = mysqli_fetch_array($result);

        return $row['description'];
    }

?>


<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- link external CSS stylesheet (Bootstrap 3 from www.getbootstrap.com) -->
        <link rel="stylesheet" href="css/bootstrap.css">

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
                    <label for="product_id" class="col-sm-2 control-label">Product ID</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control"
                            id="product_id"
                            name="product_id"
                            value="<?php echo $id; ?>"
                            readonly
                        >
                    </div>
                </div>
                <div class="form-group">
                    <label for="product_name" class="col-sm-2 control-label">Product Name</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            class="form-control"
                            id="product_name"
                            name="product_name"
                            placeholder="Product Name"
                            value="<?php echo $product_name; ?>"
                        >
                    </div>
                </div>
                <div class="form-group">
                    <label for="product_price" class="col-sm-2 control-label">Price</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            class="form-control"
                            id="product_price"
                            name="product_price"
                            placeholder="Price"
                            maxlength="10"
                            value="<?php echo $product_price; ?>"
                        >
                    </div>
                </div>
                <div class="form-group">
                    <label for="product_price" class="col-sm-2 control-label">Description</label>
                    <div class="col-sm-10">
                        <textarea
                            class="form-control"
                            id="product_description"
                            name="product_description"
                            placeholder="Product description"
                            rows="5"
                        ><?php echo $product_description; ?></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-success">Update Product</button>
                        <a href="index.php" class="btn btn-danger">Cancel</a>
                        <button type="reset" class="btn btn-default">Clear</button>
                    </div>
                </div>
            </form>

        </div>
        
    </body>
</html>