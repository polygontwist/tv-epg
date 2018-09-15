<?php
$cache="cache/";
//http://rp1/tvepg/getepg.php?url=http://192.168.0.10/web/epgservice?sRef=1:0:19:2B5C:41B:1:FFFF014A:0:0:0:
//cache/1_0_19_2B5C_41B_1_FFFF014A_0_0_0_

header("Content-Type: text/xml; charset=utf-8");
// ini_set('display.errors',1);
// error_reporting(-1);//E_ALL

date_default_timezone_set('Europe/Dublin');

$url=@$_GET['url'];

$cacheurl= explode("sRef=",$url)[1]; 				//1:0:19:2B5C:41B:1:FFFF014A:0:0:0:
$cacheurl=$cache.implode("_", explode(":",$cacheurl) ).".xml"; 	//1_0_19_2B5C_41B_1_FFFF014A_0_0_0_

$getfromcache=false;
 
if(file_exists($cacheurl)){ 
	 //check alter
	 $dateitime= filectime($cacheurl);	//int
	 $jetzt = strtotime("-0 days");		//int
	 $alter=floor( (date("U", $jetzt)-date("U", $dateitime)) /60);//min	 
	 if($alter<60*24){
		 //aus chache
		 $getfromcache=true;
		 
		 //checken ob Inhalt vorhanden
		 $linien=@file($cacheurl);
		 if($linien ===  FALSE){
			 $getfromcache=false;
		 }
		 else{	
			$anzahldaten=0;
			foreach ($linien as $line_num => $line) {
				if(stripos ($line,"e2eventid")>0){ 
					$anzahldaten++;
				}
			}
			if($anzahldaten<10)$getfromcache=false;	
		 }
	 }
}


if($getfromcache)
 $linien=@file($cacheurl);
else
 $linien=@file($url);


if($linien ===  FALSE)
	{
		//Datei konnte nicht gelesen werden
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		echo '<e2eventlist nodata="nodata">';
		echo '</e2eventlist>';
	} 
	else
	{
		if(!$getfromcache){
			$newfile = @fopen($cacheurl, "w");
		}
		
		foreach ($linien as $line_num => $line) 
			{
				$s=$line;
				if($getfromcache){
					if(stripos($s,"e2eventlist")==1){
						$s = str_replace(">", ' dateialter_min="'.$alter.'">', $s);
					}
				}
				else{
					//speichern
					if ($newfile){
						fwrite($newfile, $s);
					}
					if(stripos($s,"e2eventlist")==1){
						$s = str_replace(">", ' neu="true">', $s);
					}
				}
				echo $s;
			} 
		if ($newfile)fclose($newfile);
		
	} 
?>