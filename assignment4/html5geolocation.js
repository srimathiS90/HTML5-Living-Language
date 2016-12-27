//Getting latitude and longitude
function loading(){
	 getMyLocation();
	 getMyLocationHandler();
}
window.onload = loading;

var map; //write this at top of page
var ourCoords = {
	latitude: 37.383116,
	longitude: -121.971931
};
var options = {
	enableHighAccuracy: true,
	timeout:300000,
	maximumAge:200
};

function getMyLocation(){
	
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayLocation,displayError);
	}
	else {
		alert("Sorry, there is no geolocation support");
	}
}
function getMyLocationHandler(){
	
	if(navigator.geolocation) {
	//	navigator.geolocation.getCurrentPosition(displayLocationHandler,displayError);
	var watchButton = document.getElementById("watch");
    watchButton.onclick = watchLocation;
	var clearWatchButton = document.getElementById("clearWatch");
	 clearWatchButton.onclick = clearWatch;
	}
	else {
		alert("Sorry, there is no geolocation support");
	}
}
//clear watch function
function clearWatch(){
	if(watchID){
		navigator.geolocation.clearWatch(watchID);
		watchID = null;
	}
};
// create watch location function
function watchLocation(){
	
	watchID = navigator.geolocation.watchPosition(displayLocationHandler,displayError,options);
}
function displayLocationHandler(position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var div = document.getElementById("location");
		div.innerHTML = "You are at Latitude: "+latitude+", Longitude: "+longitude;
		div.innerHTML += "(with " +position.coords.accuracy+ "meter accuracy)";
		
		var km = computeDistance(position.coords , ourCoords);
		var distance = document.getElementById("distance");
		distance.innerHTML = "You are "+km+" km from UCSC Extension";
		showMapHandler(position.coords);
}
function displayLocation(position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var div = document.getElementById("location");
		div.innerHTML = "You are at Latitude: "+latitude+", Longitude: "+longitude;
		
		var km = computeDistance(position.coords , ourCoords);
		var distance = document.getElementById("distance");
		distance.innerHTML = "You are "+km+" km from UCSC Extension";
		showMap(position.coords);
}
//displaying errors
function displayError(error) {
	var errorTypes =  {
		0: "Unknown error",
		1: "Permission denied by user",
		2: "Position is not available",
		3: "Request timed out"
	};
	var errorMessage = errorTypes[error.code];
	if(error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.message;
		
	}
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
	
}
//calculating distance
function computeDistance(startCoords,destCoords){
		var  startLatRads = degreesToRadians(startCoords.latitude);
		var  startLongRads = degreesToRadians(startCoords.longitude);
		var  destLatRads = degreesToRadians(destCoords.latitude);
		var  destLongRads = degreesToRadians(destCoords.longitude);
		var Radius = 6371; // radius of the earth in km
		var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads)*Math.cos(startLongRads - destLongRads)) * Radius;
		 return distance;
		}
function degreesToRadians(degrees){
			var radians = (degrees * Math.PI)/180;
			return radians;
}
//Apply google Map API
function showMap(coords){
	var googleLatAndLong = new google.maps.LatLng(coords.latitude,coords.longitude);
	var mapOptions = {
		zoom: 10,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv,mapOptions);
	//Addmarker
	var title = "UCSC Extension Location";
	var content = "You are here " +coords.latitude+", "+coords.longitude;
	addMarker(map,googleLatAndLong,title,content);
}
//Apply google Map API
function showMapHandler(coords){
	var googleLatAndLong = new google.maps.LatLng(coords.latitude,coords.longitude);
	var mapOptions = {
		zoom: 10,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map1");
	map = new google.maps.Map(mapDiv,mapOptions);
	//Addmarker
	var title = "UCSC Extension Location";
	var content = "You are here " +coords.latitude+", "+coords.longitude;
	addMarker(map,googleLatAndLong,title,content);
}
function addMarker(map,latlong,title,content){
	var markerOptions = {
		position: latlong,
		map:map,
		title: title,
		clickable: true
	};
	var marker = new google.maps.Marker(markerOptions);
	var  infoWindowOptions = {
		content: content,
		position: latlong
	}
	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
	google.maps.event.addListener(marker,"click",function(){
		infoWindow.open(map);
	});
}
