<?php
error_reporting(0);
$fileurl = $_REQUEST['url'];
$filename = $_REQUEST['filename'];

$datastring = file_get_contents($fileurl);
if ($datastring) {
	$iFileSize = strlen($datastring);
	$iWidth = ceil(sqrt($iFileSize / 1));
	$iHeight = $iWidth;
	$im = imagecreatetruecolor($iWidth, $iHeight);
	$data = $datastring;

	$i = 0;

	for ($y=0;$y<$iHeight;$y++) {
		for ($x=0;$x<$iWidth;$x++) {
			$ord = ord($data[$i]);
				imagesetpixel($im, $x, $y,imagecolorallocate($im,$ord,$ord,$ord));
			$i++;
		}
	}
	/*
	header("Content-Type: image/png");
	imagepng($im);
	imagedestroy($im);
	*/

	$filename = preg_replace('/[^a-z\^0-9\^.\^_]/','',$filename);
	if($filename == ''){
		$filename = time();
	}else{
	}
	imagepng($im,'res/'.$filename.'.png');
//	echo json_encode(array('ret'=>1,'url'=>'http://demo.local.163.com/jspng/'.'res/'.$filename.'.png'));
	echo json_encode(array('ret'=>1,'url'=>'http://static.f2e.netease.com/demo/jspng/'.'res/'.$filename.'.png'));
}else{
	echo json_encode(array('ret'=>0));
}

?>