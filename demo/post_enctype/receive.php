<?php
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE );
// $a = $_REQUEST;
// print_r($a);

$a = $_REQUEST['a'];

if($a === ' '){
	echo "结果a：{".$a."}</br>";
	echo "真是个空格";
}else{
	echo "结果a：{".$a."}</br>";
	echo "不是空格";
}

?>