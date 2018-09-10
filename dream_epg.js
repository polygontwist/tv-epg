"use strict";

//TODO: Zeitwahlbutton


//https://dream.reichholf.net/e2web/#epgservice
/*
 http://192.168.0.10/web/getservices?sRef=1:7:1:0:0:0:0:0:0:0:FROM%2520BOUQUET%2520%2522userbouquet.favourites.tv%2522%2520ORDER%2520BY%2520bouquet
 Favoritenliste
 
 http://192.168.0.10/web/epgservicenow?sRef=1:0:19:2B70:271E:F001:FFFF0000:0:0:0:
 was läuft gerade in $SenderID		 1:0:19:2B70:271E:F001:FFFF0000:0:0:0: =arteHD
 
 http://192.168.0.10/web/epgservicenext?sRef=1:0:19:2B70:271E:F001:FFFF0000:0:0:0:
 was läuft demnächt auf $SenderID
 
 
 http://192.168.0.10/web/epgservice?sRef=1:0:19:2B70:271E:F001:FFFF0000:0:0:0:
 EPEG-Daten vom $SenderID
 es können auch Daten von Sender des selben bouquet enthalten sein!
 ->e2eventservicereference checken!
 
 http://192.168.0.10/web/about
 http://192.168.0.10/web/deviceinfo
 Infos über die Box, Plattenplatz, etc.
 
 http://192.168.0.10/web/currenttime
 aktuelle Uhrzeit
 
 http://192.168.0.10/web/epgnow?bRef=1:0:19:2B70:271E:F001:FFFF0000:0:0:0:
 aktuelle Sendungen
 
 http://192.168.0.10/web/timerlist
 aktuelle Timer
 
*/



var dream_epg=function(){
	var gethelper="get.php?url=";
	var ip="http://192.168.0.10";//IP von Dreambox
	var urlsender=gethelper+ip+"/web/getservices?sRef=1:7:1:0:0:0:0:0:0:0:FROM%2520BOUQUET%2520%2522userbouquet.favourites.tv%2522%2520ORDER%2520BY%2520bouquet";
	var urlepeg=gethelper+ip+"/web/epgservice?sRef=";//1:0:1:D175:2718:F001:FFFF0000:0:0:0:
	var urlstream=ip+"/web/stream.m3u?ref=";
	
	var zielid="epgcontainer";
	
	var senderdata=[];//."e2servicereference": ,."e2servicename":
				
	var namensfilter=["/","_","-","sanhalt",".","&amp;"];
	
	var makerliste=[
		{"m":"Lucifer","s":"prosieben"},
		{"m":"The Orville"},
		{"m":"Snowfall","s":"fox"},
		{"m":"Expanse"},
		{"m":"Zärtlichkeiten im Bus"},
		{"m":"Game of Thrones"},
		{"m":"Incorporated","s":"syfy"},
		{"m":"Doctor Who","s":"fox"},
		{"m":"Class","s":"one"},
		{"m":"Marvel's","s":"syfy"},
		{"m":"Supernatural","s":"prosiebenmaxx"},
		{"m":"Legion","s":"fox"},
		{"m":"The Big Bang Theory","s":"prosieben"},
		{"m":"Young Sheldon","s":"prosieben"},
		{"m":"2 Broke Girls","s":"prosieben"},
		{"m":"Lesch"},
		{"m":"Die Wilden Siebziger"},
		{"m":"Limitless"},
		{"m":"NEO MAGAZIN ROYALE"},
		{"m":"Robot Wars"},
		{"m":"Killjoys"},
		{"m":"quer"},
		{"m":"BattleBots"},
		{"m":"Legends of Tomorrow"},
		{"m":"Lesedüne"},
		{"m":"Quantico"},
		{"m":"Die Erbschaft"},
		{"m":"Arrow"},
		{"m":"The 100"},
		{"m":"The Strain"},
		{"m":"Sherlock"},
		{"m":"Dark Matter","s":"syfy"},
		{"m":"Marvel's Agent Carter"},
		{"m":"heute-show"},
		{"m":"Der Klügere kippt nach"},
		{"m":"Vikings"},
		{"m":"The Flash"},
		{"m":"Gotham"},
		{"m":"Sold"},
		{"m":"Pufpaffs"},
		{"m":"Ugly Americans"},
		{"m":"black sails"},
		{"m":"Trödel"},
		{"m":"Helix"},
		{"m":"Da Vinci's Demons"},
		{"m":"Under the Dome","s":"syfy(kd)"},
		{"m":"Nicht nachmachen"},
		{"m":"Real Humans"},
		{"m":"Defiance"},
		{"m":"Computer"},
		{"m":"Haven"},
		{"m":"Tatortreiniger"},
		{"m":"Spartacus"},
		{"m":"Shameless"},
		{"m":"extra 3"},
		{"m":"hitec"},
		{"m":"Sanctuary"},
		{"m":"Warehouse"},
		{"m":"bauerfeind"},
		{"m":"torchwood"},
		{"m":"Primeval"},
		{"m":"Genial daneben"},
		{"m":"Drawn Together"},
		{"m":"Andromeda"},
		{"m":"NightWash"},
		{"m":"simpsons","s":"prosieben"},
		{"m":"enterprise"},
		{"m":"futurama"},
		{"m":"South Park"},
		{"m":"Lexx"},
		{"m":"Farscape"},
		{"m":"Heroes"},
		{"m":"American Chopper"},
		{"m":"Dittsche"},
		{"m":"c't"},
		{"m":"Krempel"},
		{"m":"seaQuest"},
		{"m":"Comedy"},
		{"m":"Zimmer frei!"},
		{"m":"einfach genial"},
		{"m":"Moonlight"},
		{"m":"Eureka"},
		{"m":"was liest du"},
		{"m":"CeBIT"},
		{"m":"echt antik"},
		{"m":"der dritte bildungsweg"},
		{"m":"fun(k)haus"},
		{"m":"dr. house"},
		{"m":"Die internationale Show"},
		{"m":"Krömer"},
		{"m":"Inas Nacht"},
		{"m":"Falling Skies"},
		{"m":"V - Die Besucher"},
		{"m":"Fringe"},
		{"m":"Doctor Who","s":"syfy"},
		
		{"m":"Voyager","s":"syfy"}
	];
	
	var zeigeZeitabH=-1;
	var zeigeZeitabM=0;
	
	//helper
	
	var htmlloader=function(url,refunc,errorFunc){
		var loader;
		try{
			loader = new XMLHttpRequest();
		}
		catch(e) {
			try {                        
				loader  = new ActiveXObject("Microsoft.XMLHTTP");// MS Internet Explorer (ab v6)
			} 
			catch(e){
				try {                                
						loader  = new ActiveXObject("Msxml2.XMLHTTP");// MS Internet Explorer (ab v5)
				} catch(e) {
						loader  = null;
						console.log('XMLHttp nicht möglich.');
				}
			}
		}
		var startloading=function(){
			if(loader!=null){
				loader.open('GET',url,true);//open(method, url, async, user, password)
				loader.responseType='text'; //!                
				loader.setRequestHeader('Content-Type', 'text/plain'); 
				loader.setRequestHeader('Cache-Control', 'no-cache'); 
				loader.setRequestHeader('Access-Control-Allow-Headers', '*');
				loader.setRequestHeader('Access-Control-Allow-Origin', '*');
				loader.onreadystatechange = function(e){                
					if (this.readyState == 4) {
						if(loader.status!=200){}
					}
				};
				loader.onload=function(e){
					if(typeof refunc==="function")refunc(this.responseText);
				}				
				loader.onabort = loader.onerror = function(e){
					if(typeof errorFunc==="function")errorFunc(e);
				}
				// loader.timeout=  //ms
				loader.send(null);
 
			}
		}
		//--API--
		this.reload=function(){
			startloading();
		}
 
		startloading();
	}

	var cE=function(ziel,e,id,cn){
		var newNode=document.createElement(e);
		if(id!=undefined && id!="")newNode.id=id;
		if(cn!=undefined && cn!="")newNode.className=cn;
		if(ziel)ziel.appendChild(newNode);
		return newNode;
		}
	var gE=function(id){if(id=="")return undefined; else return document.getElementById(id);}
	var addClass=function(htmlNode,Classe){	
		var newClass;
		if(htmlNode!=undefined){
			newClass=htmlNode.className;
	 
			if(newClass==undefined || newClass=="")newClass=Classe;
			else
			if(!istClass(htmlNode,Classe))newClass+=' '+Classe;	
	 
			htmlNode.className=newClass;
		}			
	}
	var subClass=function(htmlNode,Classe){
			var aClass,i;
			if(!istClass(htmlNode,Classe))return;
			if(htmlNode!=undefined && htmlNode.className!=undefined){
				aClass=htmlNode.className.split(" ");	
				var newClass="";
				for(i=0;i<aClass.length;i++){
					if(aClass[i]!=Classe){
						if(newClass!="")newClass+=" ";
						newClass+=aClass[i];
						}
				}
				htmlNode.className=newClass;
			}
	}
	var istClass=function(htmlNode,Classe){
		if(htmlNode.className){
			var i,aClass=htmlNode.className.split(' ');
			for(i=0;i<aClass.length;i++){
					if(aClass[i]==Classe)return true;
			}	
		}		
		return false;
	}
	var addNullen=function(zahl,anzahl){
		var re=""+zahl,i,rel=re.length;
		for(i=0;i<anzahl-rel;i++){
			re="0"+re;
		}
		return re;
	}
	
	var getNodesByData=function(Dataname,liste){//<div data-name=""></div>
		var i,t,htmlNode,re=[],rre=[];
		if(liste==undefined)liste=document.getElementsByTagName('body')[0].childNodes;
		for(i=0;i<liste.length;i++){
			htmlNode=liste[i];
			if(typeof htmlNode.getAttribute==='function')
				if(htmlNode.getAttribute(Dataname)!=undefined)re.push(htmlNode);
 
			if(htmlNode.childNodes.length>0){
				rre=getNodesByData(Dataname,htmlNode.childNodes);
				for(t=0;t<rre.length;t++){
					re.push(rre[t]);
				}
			}
		}
		return re;
	}
	//system
	
	var ismaker=function(data){
		var i,m,re=false,
			sender=data.e2eventservicename,
			titel=data.e2eventtitle;
		//todo: data.e2eventdescription if !=undefined
		if(titel==undefined)return re;
		
		for(i=0;i<makerliste.length;i++){
			m=makerliste[i];
			if(titel.toLowerCase().indexOf(m.m.toLowerCase())>-1){
				re=true;
				if(m.s!=undefined){
					if(sender.toLowerCase().indexOf(m.s.toLowerCase())<0){
						re=false;
					}
				}
			}
		}
		return re;
	}
	
	
	var bildchecker=function(node,url){
		var bld=new Image();
		bld.onload=function(){  
			node.style.backgroundImage="url("+url+")";
			addClass(node,"hatbgimg");
		}
		bld.onerror=function(){}
		bld.src=url;
	}
	
	var parsesenderliste=function(data){//xml-string
		var i,s,o,tmp;
		
		var tab=data.split("</e2service>");
		//<e2servicereference>1:0:19:2B70:271E:F001:FFFF0000:0:0:0:</e2servicereference>\n\t\t<e2servicename>arte HD</e2servicename>
		
		for(i=0;i<tab.length;i++){
			s=tab[i].split("<e2servicereference>");
			if(s.length>1){
				
				tmp=s[1].split('<e2servicename>');
				
				o={
					"e2servicereference":tmp[0].split("</e2servicereference>")[0],
					"e2servicename":tmp[1].split("</e2servicename>")[0]
				}
				senderdata.push(o);
			}
		}
		createHTMLliste();		
	}
	
	var openstream=function(e) {
	  //console.log(this.getAttribute("href"));
	  window.open(this.getAttribute("href"), '_blank');
	  e.stopPropagation();
	  e.preventDefault();
	}
	
	var getName=function(name){
		var i,re=name.toLowerCase();
		for(i=0;i<namensfilter.length;i++){
			re=re.split(namensfilter[i]).join("");
		}
		
		re=re.split("ö").join("oe");
		re=re.split("ä").join("ae");
		re=re.split("ü").join("ue");
		re=re.split("ß").join("ss");
		
		if(re.indexOf("(")>-1){
			re=re.split("(")[0];
		}
		re=re.split(" ").join("");
		return re;
	}
	
	var getJSONfData=function(s){
		var i,tmp,tmp2,name,data,p,
			re={};
		
		tmp=s.split("><");
		for(i=0;i<tmp.length;i++){
			tmp2=tmp[i].split("</")[0];
			p=tmp2.lastIndexOf(">");
			name=tmp2.substring(0,p);
			data=tmp2.substring(p+1);//
			
			name=name.split("<").join("");
			
			if(!isNaN(data))data=parseInt(data);
			
			re[name]=data;
			
			
		}
		return re;
	}
	
	
	var UnixzeitToUTC=function(unixtime){
		var re={
				pJahr:0,
				pMonat:0,
				pTag:0,
				pStunde:0,
				pMinute:0,
				pSekunde:0,
				pdate:new Date()
			};
		
		var SEKUNDEN_PRO_TAG   =  86400; //  24* 60 * 60 
		var TAGE_IM_GEMEINJAHR =    365; // kein Schaltjahr 
		var TAGE_IN_4_JAHREN   =   1461; //   4*365 +   1 
		var TAGE_IN_100_JAHREN =  36524; // 100*365 +  25 - 1 
		var TAGE_IN_400_JAHREN = 146097; // 400*365 + 100 - 4 + 1 
		var TAGN_AD_1970_01_01 = 719468; // Tagnummer bezogen auf den 1. Maerz des Jahres "Null" 

		var TagN = TAGN_AD_1970_01_01 + Math.floor(unixtime/SEKUNDEN_PRO_TAG);
		var Sekunden_seit_Mitternacht = unixtime%SEKUNDEN_PRO_TAG;
		var temp;

		/* Schaltjahrregel des Gregorianischen Kalenders:
		   Jedes durch 100 teilbare Jahr ist kein Schaltjahr, es sei denn, es ist durch 400 teilbar. */
		temp =Math.floor( 4 * (TagN + TAGE_IN_100_JAHREN + 1) / TAGE_IN_400_JAHREN) - 1;
		re.pJahr = 100 * temp;
		TagN -= TAGE_IN_100_JAHREN * temp + Math.floor(temp / 4);

		/* Schaltjahrregel des Julianischen Kalenders:
		   Jedes durch 4 teilbare Jahr ist ein Schaltjahr. */
		temp =Math.floor( 4 * (TagN + TAGE_IM_GEMEINJAHR + 1) / TAGE_IN_4_JAHREN) - 1;
		re.pJahr += temp;
		TagN -= TAGE_IM_GEMEINJAHR * temp + Math.floor(temp / 4);

		//TagN enthaelt jetzt nur noch die Tage des errechneten Jahres bezogen auf den 1. Maerz. 
		re.pMonat = Math.floor((5 * TagN + 2) / 153);
		re.pTag = TagN - Math.floor((re.pMonat * 153 + 2) / 5) + 1;
		/*  153 = 31+30+31+30+31 Tage fuer die 5 Monate von Maerz bis Juli
			153 = 31+30+31+30+31 Tage fuer die 5 Monate von August bis Dezember
				  31+28          Tage fuer Januar und Februar (siehe unten)
			+2: Justierung der Rundung
			+1: Der erste Tag im Monat ist 1 (und nicht 0).
		*/

		re.pMonat += 3; //vom Jahr, das am 1. Maerz beginnt auf unser normales Jahr umrechnen: 
		if (re.pMonat > 12)
		{   // Monate 13 und 14 entsprechen 1 (Januar) und 2 (Februar) des naechsten Jahres 
			re.pMonat -= 12;
			re.pJahr++;
		}

		re.pStunde  = Math.floor(Sekunden_seit_Mitternacht / 3600);
		re.pMinute  = Math.floor(Sekunden_seit_Mitternacht % 3600 / 60);
		re.pSekunde = Math.floor(Sekunden_seit_Mitternacht        % 60);
		
		re.pdate=new Date();
		re.pdate.setMilliseconds(0);
		re.pdate.setFullYear(re.pJahr);
		re.pdate.setMonth(re.pMonat-1);
		re.pdate.setDate(re.pTag);
		re.pdate.setHours(re.pStunde);
		re.pdate.setMinutes(re.pMinute);
		re.pdate.setSeconds(re.pSekunde);
		
		return re;
	}
	
	
	var aufgabenliste=[];
	var aufgabenlistepos=0;
	var loadepegdata=function(){
		if(aufgabenlistepos==aufgabenliste.length)return;
		
		var aufgabe=aufgabenliste[aufgabenlistepos];
		new epegloader(aufgabe.node,aufgabe.dat);
		aufgabenlistepos++;
		
	}
	
	var setJetzt=function(hh,mm){
		zeigeZeitabH=hh;
		zeigeZeitabM=mm;
	}
	
	var getJetzt=function(){
		var jetzt = new Date();
		var jStd = jetzt.getHours();
		var jMin = jetzt.getMinutes(); 
		if(zeigeZeitabH!=-1){
			jStd=zeigeZeitabH;
			jMin=zeigeZeitabM;
		}		
		var testdate=new Date(
						jetzt.getFullYear(),
						jetzt.getMonth(),
						jetzt.getDate(),
						jStd,
						jMin,
						0,0
				);
		return testdate;
	}
	
	
	var epegloader=function(node,senderdata){
		var _this=this;
		var url=urlepeg+senderdata.e2servicereference;
		var loader;
		var sendungen=[];
		
		var reloaddata=function(e){
			loader.reload();
			e.preventDefault();
		}
		
		var sendungklick=function (e){
			if(istClass(this,"sendungSelect"))
				subClass(this,"sendungSelect")
				else
				addClass(this,"sendungSelect");
			e.preventDefault();
		}
		
		var createHTML=function(data,ziel){
			var  time=data.starttime,//alles
				 dtime=time.pdate,//date-object
				 zeigetime=new Date(dtime),
				 li,n,sp,
				 heute=new Date(),
				 zeitdiff=heute.getHours()-heute.getUTCHours();
			
			zeigetime=new Date(dtime);
			zeigetime.setTime(zeigetime.getTime()+zeitdiff*60*60*1000);
			
			li=cE(ziel,"li");
			n=cE(li,"h4");
			
			n.innerHTML=""+
				addNullen(zeigetime.getHours(),2)
				+":"+
				addNullen(zeigetime.getMinutes(),2)
				+" ";
			sp=cE(n,"span");
			sp.innerHTML=data.e2eventtitle;//
				
			if(ismaker(data))addClass(sp,"maker");
				
			if(data.e2eventdescriptionextended!=undefined)
				li.title= data.e2eventdescriptionextended;
			
			n=cE(li,"p");
			if(data.e2eventdescription!=undefined)
				n.innerHTML=data.e2eventdescription;
			else
				n.innerHTML="&nbsp;";
			
			data.node=li;			
			
			//e2eventduration: 		"3300" 				Dauer in Sekunden
			//e2eventstart: 		"1536500100"		UNIX-Zeitstempel
			//e2eventcurrenttime: 	"1536503003"		UNIX-Zeitstempel 
			//e2eventid: "43362"
			//e2eventservicename: "arte HD"
			//e2eventservicereference: "1:0:19:2B70:271E:F001:FFFF0000:0:0:0:"
			//e2eventtitle: "Bildhauerinnen"
			//e2eventdescription: "Schöpferinnen von Kunst in Stein"
			//e2eventdescriptionextended: "...."

			li.addEventListener('click',sendungklick);
			
			return li;
		}
		
		var zeitchecken=function(){
			var i,o,dtime;
			//TODO: +alternativzeit
			//checken ob nodes ausgeblendet werden sollen
			//console.log("checktime",senderdata.e2servicename,sendungen);
			
			var jetzt=getJetzt();
			var zeitdiff=jetzt.getHours()-jetzt.getUTCHours();
			var isset=false;
			for(i=0;i<sendungen.length;i++){
				o=sendungen[i];
				//o.starttime.pdate
				dtime=o.starttime.pdate;//date-object
					
				if(
					dtime.getTime()>=(jetzt.getTime() - zeitdiff*60*60*1000)  //jetzt 
					&&
					dtime.getTime()<(jetzt.getTime()+(24+zeitdiff)*60*60*1000) //jetzt +24h
				){
					subClass(o.node,"ausgeblendet");
					if(!isset && i>0)subClass(sendungen[i-1].node,"ausgeblendet");
					isset=true;
				}
				else{
					
					addClass(o.node,"ausgeblendet");
				}
			}
			
		}
		
		//api
		this.checktime=function(){
			zeitchecken();
		}
		
		var parser=function(data){
			var i,liste,n,o,ul,li, zeit,titel,beschr,time,dtime,zeigetime;
			node.innerHTML="";			
			var heute=new Date(),
				zeitdiff=heute.getHours()-heute.getUTCHours();
			
			liste=data.split("</e2event>");
			for(i=0;i<liste.length;i++){
				liste[i]=liste[i].split("<e2event>")[1];
				if(liste[i]!=undefined){
					liste[i]=liste[i].split("\n").join("");
					liste[i]=liste[i].split("\t").join("");
					o=getJSONfData(liste[i]);
					if(o.e2eventservicereference==senderdata.e2servicereference)
						sendungen.push(o);
					else{
						console.log(o.e2eventservicereference);
					}
					//if(i==0)console.log(sendungen[0]);
				}
			}
			
			ul=cE(node,"ul");
			var anz=sendungen.length;
			var isadd=false;
			for(i=0;i<anz;i++){//
				o=sendungen[i];
				o.starttime=UnixzeitToUTC(o.e2eventstart);
				o.node=undefined;
				
				time=o.starttime;//alles
				dtime=time.pdate;//date-object
				
				
				if(
					dtime.getTime()>=(heute.getTime() - zeitdiff*60*60*1000)  //jetzt 
					&&
					dtime.getTime()<(heute.getTime()+(24+zeitdiff)*60*60*1000) //jetzt +24h
				)
				{
					if(!isadd && i>0){//aktuelleSendung
						li=sendungen[i-1].node;
						subClass(li,"ausgeblendet");
					}
										
					li=createHTML(o,ul);
					isadd=true;
				}
				else{
					li=createHTML(o,ul);
					addClass(li,"ausgeblendet");
				}
				
			}
			if(sendungen.length<10){
				if(sendungen.length<1){
						node.innerHTML="keine Sendungen gefunden";
						n=cE(node,"a");
						
					}
					else{
						li=cE(ul,"li");
						addClass(li,"hgtrans");
						n=cE(li,"a");
					}
				
				
				n.innerHTML="reload";
				n.href="#";
				n.className="buttreload";
				n.addEventListener("click",reloaddata);
				
			}
			else
				senderdata.sendungen=sendungen;
			
			loadepegdata();
		}
		
		var error=function(e){
			node.innerHTML="";
			console.log("konnte nicht geladen werden",url);
			
			loadepegdata();
		}
		
		
		loader=new htmlloader(url,parser,error);
		senderdata.epegloader=_this;
	}
	
	var timerid;
	var zeitchecker=function(){
		var i;
		if(timerid!=undefined)clearTimeout(timerid);
		
		//console.log("zeitchecker",senderdata);
		
		for(i=0;i<senderdata.length;i++){
			if(senderdata[i].epegloader!=undefined){
				senderdata[i].epegloader.checktime();
			}
		}
		
		//senderdata of (.e2servicename .e2servicereference 
		//				.sendungen 
		//				.epegloader		of epegloader.checktime
		//				)
		//sendungen of (
		//		.e2eventcurrenttime .e2eventdescription .e2eventdescriptionextended
		//		.e2eventduration .e2eventid .e2eventservicename .e2eventservicereference
		//		.e2eventstart .e2eventtitle
		//		.node
		//		.starttime
		//		
		//		)
		//
		//starttime of(
		//		.pJahr .pMinute .pMonat .pSekunde .pStunde .pTag -lokaltime
		//		.pdate of Date()	-UTC
		//		)
		
		timerid=setTimeout(function(){zeitchecker()}, 30000);//30sec
	}
	
	
	var createHTMLliste=function(){
		var i,o,table,tr,td,th,a;
		var ziel=gE(zielid);
		if(ziel==undefined){console.log("keit ziel gefunden",zielid);return;}
		
		
		table=cE(ziel,"table");
		var anz=senderdata.length;
//anz=2;
		for(i=0;i<anz;i++){
			o=senderdata[i];
			tr=cE(table,"tr");
			th=cE(tr,"th");
			a=cE(th,"a");
			a.href=urlstream+o.e2servicereference;
			a.target="_tv";
			a.innerHTML=o.e2servicename;
			a.addEventListener("click",openstream);
						
			new bildchecker(a,"pic/"+getName(o.e2servicename)+".png");
			
			td=cE(tr,"td");
			td.innerHTML="load...";
			
			aufgabenliste.push( {"node":td,"dat":o} );
			//new epegloader(td,o.e2servicereference);
		}
		if(anz==0){
			ziel.innerHTML="no data";
		}
		
		//1x 41.86sec
		//2x 45.92sec
		//loadepegdata();
		loadepegdata();
		zeitchecker();
	}
	
	var oldzeigeButt=undefined;		
	var zeigeZeitAbClick=function (e){
		var z=this.getAttribute('data-tvzeit').split(':');
		var zh=Number(z[0]);
		var zm=Number(z[1]);
		if(zeigeZeitabH!=zh){
				if(oldzeigeButt!=undefined){
				  subClass(oldzeigeButt,'buttaktiv');
				}		
				addClass(this,'buttaktiv');
				zeigeZeitabH=zh;
				zeigeZeitabM=zm;
				oldzeigeButt=this;
			}
			else{
				subClass(this,'buttaktiv');
				zeigeZeitabH=-1;
				zeigeZeitabM=0;
				oldzeigeButt=undefined;
			}		
		zeitchecker();
		e.preventDefault();
	}
	
	var initButtons=function(){
		var i,liste=getNodesByData('data-tvzeit',undefined);
		for(i=0;i<liste.length;i++){
			liste[i].addEventListener('click',zeigeZeitAbClick);
		}
	}
	
	var ini=function(){
		new htmlloader(urlsender,parsesenderliste,function(e){console.log("ERR",e);});
		
		initButtons();
		
	}
	
	window.addEventListener('load', function (event){ini();});
}

dream_epg();
