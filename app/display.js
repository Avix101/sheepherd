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
		
		camera = cameraInit.getInstance();
		camera.init(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
		let mapImage = new Image();
		mapImage.src = "app/resources/grass.jpg";
		mapImage.onload = function(){
			mapPattern = ctx.createPattern(mapImage, "repeat");
		}
		
		/*
		Method to Clear the canvas
		*/
		
		object.clearCanvas = function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		/*
		Method to Update the canvas
		*/
		
		object.drawBG = function(){
			var viewPort = camera.getViewPort();
			ctx.save();
			ctx.fillStyle = mapPattern;
			ctx.fillRect(viewPort.left, viewPort.top, viewPort.width, viewPort.height); 
			ctx.restore();
		}
		
		object.drawPlayers = function(players){
			for(var i = 0; i < players.length; i++){
				drawPlayer(players[i]);
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
		
		console.log("Display Manager Instance created");
		return object;
	}
	
	function drawPlayer(playerObj){
		
		ctx.beginPath();
		ctx.arc(playerObj.x, playerObj.y, radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
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

	let viewPort = {
		centerX: 0,
		centerY: 0,
		width: 0,
		height: 0,
		left: 0,
		top: 0
	}
	
	function createInstance(){
		let cameraObj = {};
		
		cameraObj.init = function(centerX, centerY, width, height){
			init(centerX, centerY, width, height);
		}
		
		cameraObj.getViewPort = function(){return viewPort;};
		cameraObj.translate = function(x, y){translate(x, y);};
		
		return cameraObj;
	}
	
	function init(centerX, centerY, width, height){
		viewPort.centerX = centerX;
		viewPort.centerY = centerY;
		viewPort.width = width;
		viewPort.height = height;
		viewPort.left = centerX - (width / 2);
		viewPort.top = centerY - (height / 2);
	}
	
	function translate(x, y){
		ctx.translate(x, y);
		viewPort.left -= x;
		viewPort.top -= y;
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


