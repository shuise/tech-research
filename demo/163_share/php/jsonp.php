<?php
    $callback = $_GET['callback'];
    $a = $_GET['a'];
    $b = $_GET['b'];
    $c = $_GET['toUserId'];
    $d = $_GET['toUserIds'];
    echo $c;
    echo "<br>";
    echo json_encode($d);
    // echo $callback.'("'.$a.$b.$c'")';
?>