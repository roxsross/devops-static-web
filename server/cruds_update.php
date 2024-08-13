<?php

    /*
     *  Server script to update records from incomming POSTs methods
     *
    */

    // Check if the Request is an HTTP POST method.
    // If POST, collect the data from the POST variable

    if($_POST)
    {
        include('db_connect.php');

        // collect the data from the HTTP POST

        $product_id            =   $_POST['product_id'];
        $product_name          =   $_POST['product_name'];
        $product_price         =   $_POST['product_price'];
        $product_description   =   $_POST['product_description'];

        // set/initialize the mySQL insert query

        echo $product_id."<br/>";
        echo $product_name."<br/>";
        echo $product_price."<br/>";
        echo $product_description."<br/>";

        $query_update = 
        "UPDATE `product`
        SET
            product_name    =   '$product_name',
            price           =   $product_price,
            description     =   '$product_description'
        
        WHERE
            id=$product_id
        ";

        // execute and verify query

        if( mysqli_query($db_connect, $query_update) )
        {
            // the query was successful.
            header("location: ../index.php");

        }
        else
        {
            // the failed.
            echo 'Database query failed...';
        }

        // close database connection

        mysqli_close($db_connect);
    }

/* END of script */

?>