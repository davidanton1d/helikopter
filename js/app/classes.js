
define(["jquery", "quack"], function($, quack) {
	var World = quack.createClass({

		// Init function
		constructor: function (initSettingsObj){
			if ( initSettingsObj !== undefined ){
				this.name = initSettingsObj.name;
				if ( initSettingsObj.fps ) {
					this.startFrameRunner( initSettingsObj.fps );
				}else{
					this.startFrameRunner( 1 );
				}
			}
		},



		/* 
		 * Properties
		 */

		// Navigation
		offset: {
			x: 0,
			y: 0,
			z: 0
		},

		// Physics
		gravity: 9.80665, // m/s²
		frictionOnLand: 0.9,
		frictionInAir: 0.2,



		/* 
		 * Methods
		 */

		startFrameRunner: function(fps){
			var evt = document.createEvent("Event");

			evt.initEvent("updateFrame",true,true);
			// custom param
			evt.trigger = "World";

			//register
			// document.addEventListener("updateFrame",myEventHandler,false);
			// document.addEventListener("updateFrame",function(e){console.log('Triggered! Trigger: ' + e.trigger)},false);

			window.setInterval(function(){
				
				//invoke
				document.dispatchEvent(evt);

			}, 1000/fps)
		},

		stopFrameRunner: function(){
			// TODO: Implement
		}
	});






	var Vehicle = quack.createClass({

		/*
		 * Init
		 */

		constructor: function(name){

			// Set properties
			this.statics.sizeX = 20;	// cm
			this.statics.sizeY = 40;	// cm
			this.statics.sizeZ = 10;	// cm

			this.statics.weight = 4; 	// kg

			this.statics.maxThrottle = 11; // cm/frame. 20 km/h -> translated to -> cm/frame at 50 fps: x*1000*100/60/60/50
			this.statics.name = name;

			// Add to canvas
			var vehicleObj = this;
			document.addEventListener("updateFrame", function(e){vehicleObj.updateFrame()}, false);
			this.createVehicle();

			// Add keyboard controls
			document.onkeydown = function(e){
				var left = 37;
				var up = 38;
				var right = 39;
				var down = 40;
				switch ( e.keyCode ){
					// Left
					case left:
						vehicleObj.turn(-1);
						break;
					case right:
						vehicleObj.turn(1);
						break;
					case up:
						vehicleObj.gasBrake(1);
						break;
					case down:
						vehicleObj.gasBrake(-1);
						break;
					default: return;
				}
			}
			document.onkeyup = function(e){
				var left = 37;
				var up = 38;
				var right = 39;
				var down = 40;
				switch ( e.keyCode ){
					// Left
					case left:
						vehicleObj.turn(0);
						break;
					case right:
						vehicleObj.turn(0);
						break;
					case up:
						vehicleObj.gasBrake(0);
						break;
					case down:
						vehicleObj.gasBrake(0);
						break;
					default: return;
				}
			}

		},


		/*
		 * Properties
		 */

		// About the X, Y and Z axis
		// X = sideways, the left- and right-hand side of vehicle
		// Y = the direction of the vehicle, front and back
		// Z = top and bottom
		// Rotation axises always means a clockwise rotation around that axis. 
		// A car turning right, for instance, therefore has a positive 
		// rotation value on the Z axis of between 1-90 degrees.
		// 
		// An aeroplane turning left would have something like
		// rotY = -45; rotX = -10; - tilting to the left and slightly backwards.

		statics: {
			// Size
			sizeX: 0,
			sizeY: 0,
			sizeZ: 0,

			// Weight
			weight: 0,

			// Color
			color: 'green',

			// Name, also the id of the DOM element
			name: undefined,

			// Limits
			maxThrottle: 0,
			minZ: 0 // If less than 0, the vehicle can submerge under the horizon plane
		},

		// Controls - The gas, brake and wheel positions of the vehicle 
		// (in the range -1 to 1, where 1 equals 180 degrees or max speed)
		controls: {
			gasBrakePedal: 0,
			steeringWheel: 0,
			steeringWheelRange: 45 // Max left = 45deg left.
		},

		// Position
		posX: 50,
		posY: 50,
		posZ: 0,

		rotX: 0,
		rotY: 0,
		rotZ: 0,

		// Speed
		// Describes how the vehicle is currently moving or drifting/gliding.
		speedX: 0,
		speedY: 0,
		speedZ: 0,

		accelerationX: 0,
		accelerationY: 1,
		accelerationZ: 0,


		// Throttle
		// Negative means braking, positive means accelerating. 
		// The amount is added to the speed each frame.
		throttleX: 0,
		throttleY: 0,
		throttleZ: 0,

		// Friction - 0 = outer space, 1 = inside a block of concrete
		// Each direction has it's own friction. 
		//  - A car has high friction sideways (x), but low friction straight ahead.
		//  - A helicopter has low friction in all directons.
		//  - An aeroplane has higher friction towards the z-plane than x or y.
		// 
		// The speed is reduced with the friction amount each frame, counterbalancing 
		// the throttle. Without throttle, the vehicle eventually stops.
		frictionX: 0.2,
		frictionY: 0.8,
		frictionZ: 0.8,

		// Friction when rotating
		// Some vehicles might have friction when turning as well.
		frictionRotX: 0,
		frictionRotY: 0,
		frictionRotZ: 0,



		/*
		 * Methods
		 */

		createVehicle: function(name){
			$('#content').append('<div class="vehicle" id="' + this.statics.name + '"></div>');
			$('#' + this.statics.name).css({
				'width': this.statics.sizeX + 'px',
				'height': this.statics.sizeY + 'px',
				'background': this.statics.color,
				'border': '1px solid black',

				// Defaults for all objects
				'position':'absolute',
				'top': this.posY + 'px',
				'left': this.posX + 'px'

			})
		},



		updateFrame: function(){
			// Update rotation
				// this.controls.steeringWheel = (Math.random()*2 - 1);
				this.rotZ += this.controls.steeringWheel * this.controls.steeringWheelRange * (1 - this.frictionRotZ) * 0.05
			
			// Update throttle
				// Throttle is "drivet" och speed is "glidet"
				this.throttleY = this.controls.gasBrakePedal * Math.cos(Math.PI*((360-this.rotZ)/180)) * this.accelerationY;
				this.throttleX = this.controls.gasBrakePedal * Math.sin(Math.PI*((360-this.rotZ)/180)) * this.accelerationY;
		
			// Update speed
				// Update speed with throttle
				this.speedX = (this.speedX - this.throttleX) * 0.95 ;
				this.speedY = (this.speedY - this.throttleY) * 0.95 ;
				this.speedZ = (this.speedZ - this.throttleZ) * 0.95 ;

			// Update position
			
				this.posX += this.speedX;
				this.posY += this.speedY;
				this.posZ += this.speedZ;
			this.updateDOM();

			// console.log('updated frame for ' + this.statics.name);
		},



		updateDOM: function(){

			// Loop the environment
			if( this.posX < 0 ){	this.posX = $(window).width();	}
			if( this.posX > $(window).width() ){	this.posX = 0;	}
			if( this.posY < 0 ){	this.posY = $(window).height();	}
			if( this.posY > $(window).height() ){	this.posY = 0;	}

			$('#' + this.statics.name).css({
				'width': this.statics.sizeX + 'px',
				'height': this.statics.sizeY + 'px',
				'background': this.statics.color,
				'border': '1px solid black',

				// Position
				'position':'absolute',
				'top': this.posY + 'px',
				'left': this.posX + 'px',

				// Rotation - -90 degrees since default rotation 0 in CSS actually is at 3 o'clock
				'-ms-transform': 		'rotate(' + (this.rotZ - 90) + 'deg)', 
				'-webkit-transform': 	'rotate(' + (this.rotZ - 90) + 'deg)', 
				'transform': 			'rotate(' + (this.rotZ - 90) + 'deg)'
			}).text(this.throttleY);
		},

		

		// Functions for driving
		
		turn: function (val){

			this.controls.steeringWheel = val;
		},



		gasBrake: function (val){
			this.controls.gasBrakePedal = val;
		}


	});

	return {
		"World": World,
		"Vehicle": Vehicle
	}
});