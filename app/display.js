//Possible variables needed: canvas, ctx, global graphics settings
//Modular data isn't stored here, it's passed in

let ctx, camera, mapPattern;

/*
Constant Data that describes sprite info
*/

//Display Manager Instance
let displayManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		canvas = document.querySelector('#primaryCanvas');
		ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// setup canvas resize to window
		window.onresize =function() {
        		canvas.width = window.innerWidth;
        		canvas.height = window.innerHeight;
    		};

		

		//Initialize Camera
		camera = cameraInit.getInstance();
		camera.init(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
		camera.defineWorld(-1000, -1000, 4500, 4500);
		
		let mapImage = new Image();
		mapImage.src = "app/resources/grass.jpg";
		mapImage.onload = function(){
			mapPattern = ctx.createPattern(mapImage, "repeat");
		}
        
        let sheepSprite = new Image();
        sheepSprite.src = "app/resources/sheep.png";
		
		/*
		Method to Clear the canvas
		*/
		
		object.clearCanvas = function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		/*
		Method to Update the canvas
		*/
		
		object.update = function(){	
			camera.render();
		}
		
		object.drawBG = function(){
			var viewPort = camera.getViewPort();
			ctx.save();
			ctx.fillStyle = mapPattern;
			ctx.fillRect(viewPort.left, viewPort.top, viewPort.width, viewPort.height); 
			ctx.restore();
		}
		
		object.drawPlayers = function(players){
			var viewPort = camera.getViewPort();
			for(var i = 0; i < players.length; i++){
				drawPlayer(players[i]);
			}
		}
        
        object.drawSheep = function(sheep){
			var viewPort = camera.getViewPort();
			for(var i = 0; i < sheep.length; i++){
				drawSheep(sheep[i]);
			}
        }
		
		/*
		Methods to Render / Draw objects onscreen
			-Specifically draw sprites (use spritesheets) use ctx.drawImage();
		*/
		
		/*
		Camera controls
		*/
		object.translateCamera = function(x, y){camera.translate(x, y);};
        object.translateToCamera = function(x, y){camera.translateTo(x, y);};
		object.scaleCamera = function(amount){camera.scale(amount);};
		object.getGlobalFrame = function(){return camera.getGlobalFrame();};
        object.getLocalPosition = function(globalX, globalY){return camera.getLocalPos(globalX, globalY);};
		
		console.log("Display Manager Instance created");
		return object;
	}
	
	function drawPlayer(playerObj){
		
		ctx.beginPath();
		ctx.arc(playerObj.x, playerObj.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
		ctx.fill();
		//ctx.stroke();
	}
    
    function drawSheep(sheepObj){
        ctx.beginPath();
		ctx.arc(sheepObj.x, sheepObj.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
		ctx.fill();
		//ctx.stroke();
    }
    
    function drawSprite(drawObj, sprite){
        ctx.drawImage(
                sprite.src,                     // spritesheet
                0,                              // x pos on spritesheet
                0,                              // y pos on spritesheet
                sprite.width,                   // width on spritesheet
                sprite.height,                  // height on spritesheet
                drawObj.x - drawObj.width / 2,  // top left corner x on canvas
                drawObj.y - drawObj.height / 2, // top left corner y on canvas
                drawObj.width,                  // width on canvas
                drawObj.height                  // height on canvas
            );
    }
	
	return {
		getInstance: function() {
			if(!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
	

	
})();

//Camera class
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
	}
	
	let world = {
		left: 0,
		top: 0,
		width: 0,
		height: 0
	}
	
	function createInstance(){
		let cameraObj = {};
		
		cameraObj.init = function(centerX, centerY, width, height){
			init(centerX, centerY, width, height);
		}
		
		cameraObj.defineWorld = function(left, top, width, height){
			defineWorld(left, top, width, height);
		}
		
		cameraObj.getViewPort = function(){return viewPort;};
		cameraObj.translate = function(x, y){translate(x, y);};
        cameraObj.translateTo = function(x, y){translateTo(x, y);};
		cameraObj.scale = function(amount){
			let factor = viewPort.scale + amount;
			factor = Math.min(factor, MAX_SCROLL);
			factor = Math.max(factor, MIN_SCROLL);
			scale(factor);
		}
        
        cameraObj.getLocalPos = function(globalX, globalY){
            let position = {
                x: globalX - viewPort.left,
                y: globalY - viewPort.top
            }
            return position;
        }
		
		cameraObj.getGlobalFrame = function(){
			let frame = {};
			frame.x = viewPort.left;
			frame.y = viewPort.top;
			frame.scale = viewPort.scale;
			return frame;
		}
		
		cameraObj.render = function(){
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(viewPort.scale, viewPort.scale);
			ctx.translate(-viewPort.left, -viewPort.top);
		}
		
		return cameraObj;
	}
	
	function init(centerX, centerY, width, height){
		viewPort.centerX = centerX;
		viewPort.centerY = centerY;
		viewPort.width = width;
		viewPort.height = height;
		viewPort.left = centerX - (width / 2);
		viewPort.top = centerY - (height / 2);
		ctx.translate(-viewPort.left, -viewPort.top);
	}
	
	function defineWorld(left, top, width, height){
		world.left = left;
		world.top = top;
		world.width = width;
		world.height = height;
	}
	
	function translate(x, y){
		viewPort.left -= x;
		viewPort.top -= y;
		keepInBounds();
	}
    
    function translateTo(x, y){
        let left = x - (canvas.width / 2);
        let top = y - (canvas.height / 2);
        viewPort.left = left;
        viewPort.top = top;
        keepInBounds();
    }
	
	function scale(newScale){
		var scaleFactor = newScale - viewPort.scale;	
		viewPort.scale = newScale;
		viewPort.left += canvas.width * scaleFactor;
		viewPort.top += canvas.height * scaleFactor;
		viewPort.width -= canvas.width * scaleFactor * 2;
		viewPort.height -= canvas.height * scaleFactor * 2;
		keepInBounds();
	}
	
	function keepInBounds(){
		if (viewPort.left < world.left){
			viewPort.left = world.left;
		} else if (viewPort.left + viewPort.width > world.left + world.width){
			viewPort.left = world.left + world.width - viewPort.width;
		}
		
		if (viewPort.top < world.top){
			viewPort.top = world.top;
		} else if (viewPort.top + viewPort.height > world.top + world.height){
			viewPort.top = world.top + world.height - viewPort.height;
		}
	}
	
	return {
		getInstance: function() {
			if(!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
})();


