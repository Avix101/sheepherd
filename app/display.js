// ------------------------------------------------------------------------
// 
// display.js
//
// the display manager handles the camera and canvas rendering
//
// -------------------------------------------------------------------------
"use strict"

let displayManager = (function(){
	let mapPattern,sheepSprite,dogSprites;
	var ctx, camera, canvas;
	let radius = 20;
	let instance;

	function createInstance(){
		let obj = new Object();

		// initialize canvas

		canvas = document.querySelector('#primaryCanvas');
		ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		obj.getBoundingClientRect = function(){return canvas.getBoundingClientRect()};

		//initialize camera

		camera = cameraInit.getInstance();
		camera.init(canvas.width/2, canvas.height/2, canvas.width, canvas.height);
		camera.defineWorld(-1000, -1000, 4500, 4500);
		obj.getLocalPosition = function(x,y){return camera.getLocalPos(x,y);};
		obj.getGlobalFrame = function(){return camera.getGlobalFrame();};
		obj.translateToCamera = function(x,y){camera.translateTo(x,y);};
		obj.translateCamera = function(x,y){camera.translate(x,y);};
		obj.scaleCamera = function(scale){camera.scale(scale, canvas);};

		// initialize background
		let mapImage = new Image();
		mapImage.src = "app/resources/grass.jpg";
		mapImage.onload = function(){
			mapPattern = ctx.createPattern(mapImage, "repeat");
		}

		//initialize sprites
		// sheep
		let sheepSpriteSrc = new Image();
		sheepSpriteSrc.src = "app/resources/sheep.png"
		sheepSprite = {
			src: sheepSpriteSrc,
			width: 256,
			height: 151,
			drawWidth: 55,
			drawHeight: 35
		};

		// dogs
		let greyDogSpriteSrc = new Image();
		greyDogSpriteSrc.src = "app/resources/greydog.png";
		let blackSpotDogSpriteSrc = new Image();
		blackSpotDogSpriteSrc.src = "app/resources/blackspotdog.png";
		let brownDogSpriteSrc = new Image();
		brownDogSpriteSrc.src = "app/resources/browndog.png";
		let darkBrownDogSpriteSrc = new Image();
		darkBrownDogSpriteSrc.src = "app/resources/darkbrowndog.png";
		let redDogSpriteSrc = new Image();
		redDogSpriteSrc.src = "app/resources/reddog.png";
		let tanSpotDogSpriteSrc = new Image();
		tanSpotDogSpriteSrc.src = "app/resources/tanspotdog.png";
		let whiteDogSpriteSrc = new Image();
		whiteDogSpriteSrc.src = "app/resources/whitedog.png";
		let whiteSpotDogSpriteSrc = new Image();
		whiteSpotDogSpriteSrc.src = "app/resources/whitespotdog.png";

		dogSprites = {
			src:{}, // sprite changes based on the player
			width: 48,
			height: 60,
			drawWidth: 48,
			drawHeight: 60 // maintain aspect ratio, 60/48 = 1.25
		};

		// when the window gets resized, update everything to scale with it 
		// (both the canvas and things sized /positioned relative to the canvas)
		window.onresize = function(){
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			camera.defineViewPort(canvas.width/2, canvas.height/2, canvas.width, canvas.height, canvas);
		}

		// display update (draw loop)
		obj.update = function(){
			clearCanvas();
			ctx.save();
			camera.setRenderTransform(ctx);
			drawBG();
			drawSheeps(sheeps);
			drawPlayers(players);
			ctx.restore();
		}


		// helper functions for drawing

		function clearCanvas(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		function drawBG(){
			// can fill the entire canvas irrespective of the camera
			var viewPort = camera.getViewPort();
			ctx.save();
			ctx.fillStyle = mapPattern;
			ctx.fillRect(viewPort.left,viewPort.top,viewPort.width,viewPort.height);
			ctx.restore();
		}

		function drawPlayers(players){
			var viewPort = camera.getViewPort();
			ctx.save();
			for (let i = 0; i < players.length; i++){
				drawPlayer(players[i]);
			}
			ctx.restore();

			function drawPlayer(playerObj){
				// ctx.beginPath();
				// ctx.arc(playerObj.x, playerObj.y, radius, 0, 2*Math.PI, false);
				// ctx.fillStyle = 'black';
				// ctx.fill();
				dogSprites.src = greyDogSpriteSrc;
				//hacky to test
				let drawobj = {
					position: {x:playerObj.x, y:playerObj.y},
					angle: 0
				};
				drawSprite(drawobj, dogSprites);
			}
		}

		function drawSheeps(sheeps){
			var viewPort = camera.getViewPort();
			for(let i = 0; i < sheeps.length; i++){
				drawSprite(sheeps[i], sheepSprite);
			}

		}

		function drawSprite(drawObj, sprite){
			ctx.save();
			ctx.translate(drawObj.position.x, drawObj.position.y);
			ctx.rotate(drawObj.angle);
			ctx.drawImage(
				sprite.src,				// spritesheet source
				0,						// x position on spritesheet
				0,						// y position on spritesheet
				sprite.width,			// width on spritesheet
				sprite.height, 			// height on spritesheet
				-sprite.drawWidth/2,	// top left corner x on canvas
				-sprite.drawHeight/2,	// top left corner y on canvas
				sprite.drawWidth,		// width on canvas
				sprite.drawHeight		// height on canvas
			);
			ctx.restore();
		}

		console.log("Display Manager Instance created");
		Object.seal(obj);
		return obj;
	}

	return {
		getInstance: function(){
			if(!instance){
				instance = createInstance();
			}
			return instance;
		}
	}




})();


// Camera class

let cameraInit = (function(){

	let instance;
	const MAX_SCROLL = 1.0;
	const MIN_SCROLL = 0.5;

	let viewPort = {
		centerX: 0,
		centerY: 0,
		width: 0,
		height: 0,
		left: 0,
		top: 0,
		scale: 1
	};

	let world = {
		left: 0,
		top: 0,
		width: 0,
		height: 0
	};

	function createInstance(){
		let cameraObj = {};

		cameraObj.init = function(centerX,centerY,width,height){
			viewPort.centerX = centerX;
			viewPort.centerY = centerY;
			viewPort.width = width;
			viewPort.height = height;
			viewPort.left = centerX - (width / 2);
			viewPort.top = centerY - (height / 2);
			
			// this might be redundant, testing - Margaret
			// ctx.translate(-viewPort.left, -viewPort.top);
		};
		
		cameraObj.defineViewPort = function(centerX, centerY, width, height, canvas){
			cameraObj.scale(1, canvas);
			cameraObj.init(centerX, centerY, width, height);
		}

		cameraObj.defineWorld = function(left,top,width,height){
			world.left = left;
			world.top = top;
			world.width = width;
			world.height = height;
		};

		cameraObj.getViewPort = function(){return viewPort};

		cameraObj.translate = function(x,y){
			viewPort.left -= x;
			viewPort.top -= y;
			keepInBounds();
		};
		cameraObj.translateTo = function(x,y){
        	let left = x - (viewPort.width / 2);
        	let top = y - (viewPort.height / 2);
        	viewPort.left = left;
        	viewPort.top = top;
        	keepInBounds();
		};
		cameraObj.scale = function(amount, canvas){
			let factor = viewPort.scale + amount;
			factor = Math.min(factor, MAX_SCROLL);
			factor = Math.max(factor, MIN_SCROLL);
			scale(factor);

			function scale(newScale){
				var scaleFactor = newScale - viewPort.scale;	
				viewPort.scale = newScale;
				viewPort.left += canvas.width * scaleFactor;
				viewPort.top += canvas.height * scaleFactor;
				viewPort.width -= canvas.width * scaleFactor * 2;
				viewPort.height -= canvas.height * scaleFactor * 2;
				keepInBounds();
			}
		};

		cameraObj.getLocalPos = function(globalX, globalY){
			let position = {
				x: globalX - viewPort.left,
				y: globalY - viewPort.top
			};
			return position;
		};

		cameraObj.getGlobalFrame = function(){
			let frame = {};
			frame.x = viewPort.left;
			frame.y = viewPort.top;
			frame.scale = viewPort.scale;
			return frame;
		};

		cameraObj.setRenderTransform = function(ctx){
			ctx.setTransform(1,0,0,1,0,0);
			ctx.scale(viewPort.scale, viewPort.scale);
			ctx.translate(-viewPort.left, -viewPort.top);
		}

		function keepInBounds(){
			if (viewPort.left < world.left){
				viewPort.left = world.left;
			} 
			else if (viewPort.left + viewPort.width > world.left + world.width){
				viewPort.left = world.left + world.width - viewPort.width;
			}
			
			if (viewPort.top < world.top){
				viewPort.top = world.top;
			} 
			else if (viewPort.top + viewPort.height > world.top + world.height){
				viewPort.top = world.top + world.height - viewPort.height;
			}
		}

		Object.seal(cameraObj);
		return cameraObj;
	}

	return {
		getInstance: function(){
			if(!instance){
				instance = createInstance();
			}
			return instance;
		}
	}
})();