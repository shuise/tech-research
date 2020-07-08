<?php
	header("Content-Type:application/json; charset=utf-8");
	
	header("Access-Control-Allow-Origin: http://dev.f2e.163.com");
	// header("Access-Control-Allow-Methods: GET, POST");
	
	$get_params = array();
	foreach($_GET as $key => $value) {
		$get_params[$key] = $value;
	}

	$post_params = array();
	foreach($_POST as $key => $value) {
		$post_params[$key] = $value;
	}

	$data = array(
		"code" => "1",
		"data" => array(
			"get_params" => $get_params,
			"post_params" => $post_params
		)
	);

	echo json_encode($data);
?>