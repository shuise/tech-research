<?php
	sleep(3);
	
   if(empty($_GET['a'])){
	$a = "emptyA";
   }else{
	$a = $_GET['a'];
   }
   
   if(empty($_POST['b'])){
	$b = "emptyB";
   }else{
	$b = $_POST['b'];
   }
   
   echo "'".$a."---".$b."'";
?>