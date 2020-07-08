<?php
error_reporting(0);
if ($_FILES["file"]["error"] > 0)
  {
  echo "Error: " . $_FILES["file"]["error"] . "<br />";
  }
else
  {
//  echo "Upload: " . $_FILES["file"]["name"] . "<br />";
//  echo "Type: " . $_FILES["file"]["type"] . "<br />";
//  echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
//  echo "Stored in: " . $_FILES["file"]["tmp_name"];
  }
$file = $_FILES["file"]["tmp_name"];
if (file_exists($file)) {
	$iFileSize = filesize($file);
	$iWidth = ceil(sqrt($iFileSize / 1));
	$iHeight = $iWidth;
	$im = imagecreatetruecolor($iWidth, $iHeight);
	$fs = fopen($file, "r");
	$data = fread($fs, $iFileSize);
	fclose($fs);

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
//	echo json_encode(array('ret'=>:1,'url'=>'http://static.f2e.netease.com/demo/jspng/'.'res/'.$filename.'.png'));
//	echo '<a href="http://demo.local.163.com/jspng/'.'res/'.$filename.'.png" target="_blank">http://demo.local.163.com/jspng/'.'res/'.$filename.'.png(&#x53EF;&#x53F3;&#x952E;&#x56FE;&#x7247;&#x53E6;&#x5B58;&#x4E3A;)</a><br><img src="http://demo.local.163.com/jspng/'.'res/'.$filename.'.png"><br><a href="javascript:history.back(-1)">Back&#x8FD4;&#x56DE;</a>';
	echo '<a href="http://static.f2e.netease.com/demo/jspng/'.'res/'.$filename.'.png" target="_blank">http://static.f2e.netease.com/demo/jspng/'.'res/'.$filename.'.png(&#x53EF;&#x53F3;&#x952E;&#x56FE;&#x7247;&#x53E6;&#x5B58;&#x4E3A;)</a><br><img src="http://static.f2e.netease.com/demo/jspng/'.'res/'.$filename.'.png"><br><a href="javascript:history.back(-1)">Back&#x8FD4;&#x56DE;</a>';
}else{
//	echo json_encode(array('ret'=>0));
	echo '没提供数据/生成失败<br><a href="javascript:history.back(-1)">Back&#x8FD4;&#x56DE;</a>'; 
}

?>