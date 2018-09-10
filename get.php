<?php
//get 
 header("Content-Type: text/xml; charset=utf-8");
// ini_set('display.errors',1);
// error_reporting(-1);//E_ALL
// header("HTTP/1.0 200 OK");

 $url=@$_GET['url'];
 //echo 'url='.$url;//[19:21:15.756] url=http://192.168.0.10/web/getservices?sRef=1:7:1:0:0:0:0:0:0:0:FROM BOUQUET "userbouquet.favourites.tv" ORDER BY bouquet
 $linien=@file($url); //HTMl-Seite einlesen
 if($linien ===  FALSE)
        {
        //Datei konnte nicht gelesen werden
            echo 'nodata';
        } 
        else
        {
            foreach ($linien as $line_num => $line) 
                {
                echo $line;
                }  
        }      
?>