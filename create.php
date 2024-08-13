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
        <link rel="stylesheet" href="css/bootstrap.css">

        <title>Add Product</title>
    </head>
    <body>
            
        <div class="container">
            
            <h1>Add Product</h1>

            <br/>
                
            <a href="index.php" class="btn btn-default btn-sm">View Products</a>

            <br/>
            <br/>

            <form class="form-horizontal" role="form" method="post" action="server/cruds_create.php">
                <div class="form-group">
                    <label for="product_name" class="col-sm-2 control-label">Product Name</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="product_name" name="product_name" placeholder="Product Name" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="product_price" class="col-sm-2 control-label">Price</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="product_price" name="product_price" placeholder="Price" maxlength="10" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="product_price" class="col-sm-2 control-label">Description</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" id="product_description" name="product_description" placeholder="Product description" rows="5"></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-success">Add Product</button>
                        <a href="index.php" class="btn btn-danger">Cancel</a>
                        <button type="reset" class="btn btn-default">Clear</button>
                    </div>
                </div>
            </form>

        </div>
        
    </body>
</html>