
var World = quack.createClass({

	// Init function
	constructor: function (initSettingsObj){
		if ( initSettingsObj !== undefined ){
			this.name = initSettingsObj.name;
		}
	}



	/* 
	 * Properties
	 */

	// Navigation
	offset = {
		x: 0,
		y: 0,
		z: 0
	};

	// Physics
	gravity = 9.80665; // m/s²
	frictionOnLand = 0.9;
	frictionInAir = 0.2;

});



    var sel = "#copter";
    var step = 1;
    var copter = {
    	rotationsTröghet : 0.5,
    	rattVinkel: 0,
    	målVinkel : 0,
    	verkligVinkel : 0,
    	x:270,
    	y:230,
    	height: 20,
    	width: 40,
    	speed: 0,
    	maxSpeed: 10,
    	acceleration: 0.8,
    	decceleration: 0.5
    }

    function moveSteeringWheel(degrees){
		copter.rattVinkel = rattVinkel + degrees;
    }

	function runCopter(gasBrake){

		// UPDATE DIRECTION

		// Verklig vinkel är vinkeln på kraften. 
		// Verklig vinkel = målvinkel - verklig vinkel * rotationsTröghet, tills dess att målvinkeln uppnåtts.
		copter.målVinkel = copter.verkligVinkel + copter.rattVinkel * copter.rotationsTröghet * (1-copter.speed/10);

		$(sel).css("-webkit-transform", "rotate(" + copter.målVinkel + "deg)");

		copter.verkligVinkel += (copter.målVinkel - copter.verkligVinkel) * copter.rotationsTröghet;
		// copter.verkligVinkel += degrees;
		// console.log(copter.verkligVinkel);

		if(copter.verkligVinkel >= 180){copter.verkligVinkel = copter.verkligVinkel - 360};
		if(copter.verkligVinkel < -180){copter.verkligVinkel = copter.verkligVinkel + 360};
		if(copter.målVinkel >= 180){copter.målVinkel = copter.målVinkel - 360};
		if(copter.målVinkel < -180){copter.målVinkel = copter.målVinkel + 360};

		$(sel + 2).css("-webkit-transform", "rotate(" + copter.verkligVinkel + "deg)");


		// debug
/*		for (i = 10; i>0; i--){
			addX = 10/i * Math.cos(Math.PI*(copter.verkligVinkel/180));
			addY = 10/i * Math.sin(Math.PI*(copter.verkligVinkel/180));

			xarr[i] = Math.round(addX*1000);
			yarr[i] = Math.round(addY*1000);

			// $("#c" + i).css({"left": copter.x + addX*step + "px", "top": copter.y + addY*step + "px"});
		}
*/		// if (xarr[5] == xarr[10] || yarr[5] == yarr[10] ) {
		// 	console.log("##### VNKL " + copter.verkligVinkel )
		// }


		// UPDATE SPEED 
		if(gasBrake !== undefined){
			if (gasBrake > 0){
				copter.speed = copter.speed + gasBrake * copter.acceleration;		
			}
			if (gasBrake < 0){
				copter.speed = copter.speed + gasBrake * copter.decceleration;		
			}
		} 
		
		addX = copter.speed * Math.cos(Math.PI*(copter.verkligVinkel/180));
		addY = copter.speed * Math.sin(Math.PI*(copter.verkligVinkel/180));
		
		copter.x = copter.x + addX;
		copter.y = copter.y + addY;

		$(sel).css({"left": (copter.x*step)-copter.width + "px", "top": (copter.y*step)-copter.height + "px"});
		$(sel+2).css({"left": (copter.x*step)-copter.width + "px", "top": (copter.y*step)-copter.height + "px"});

	}

	copter.rattVinkel = 20;

	setInterval(function(){
  		if(copter.verkligVinkel > 80 && copter.verkligVinkel < 100  ) {
  			copter.rattVinkel = copter.rattVinkel * -1;
  		}
		runCopter(0)
	}, 20);
