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

        $customer_id            =   $_POST['customer_id'];
        $customer_name          =   $_POST['customer_name'];
        $customer_address       =   $_POST['customer_address'];
        $customer_age           =   $_POST['customer_age'];

        // set/initialize the mySQL insert query

        $query_update = 
        "UPDATE `customer`
        SET
            name        =   '$customer_name',
            address     =   '$customer_address',
            age         =   $customer_age
        
        WHERE
            id=$customer_id
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