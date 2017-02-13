<?php
    $callback = $_GET['callback'];
    $a = $_GET['a'];
    // $b = $_POST['data'];
    $b = file_get_contents('php://input');
    echo $callback.'("'.$a.'-'.$b.'")';
?>