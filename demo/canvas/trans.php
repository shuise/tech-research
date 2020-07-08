<?php
$image_data = $_POST['imageBase64'];
// echo '{"result":"","data":{}}';
echo '"'.saveCanvasImage($image_data).'"';



function saveCanvasImage($image_data){
    $image_data = explode(',',$image_data);
    $image_data[0] = explode(';',$image_data[0]);
    // if($image_data[0][1] != 'base64'){
    //     return false;
    // }
    $image = base64_decode($image_data[1]);

    $name = 'res/'.mt_rand(1000,9999);
    switch($image_data[0][0]){
        case 'data:image/jpeg':
            $name .= '.jpg';
            break;
        case 'data:image/png':
            $name .= '.png';
            break;
        case 'data:image/gif':
            $name .= '.gif';
            break;
        default:
            $name .= '.jpg';
            break;
    }
    
    if(!file_put_contents($name,$image)){
        return $name;
    }
    return $name;
}
?>