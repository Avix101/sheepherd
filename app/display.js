//Possible variables needed: canvas, ctx, global graphics settings
//Modular data isn't stored here, it's passed in

let ctx

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
		
		/*
		Method to Clear the canvas
		*/
		
		object.clearCanvas = function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		/*
		Method to Update the canvas
		*/
		
		object.drawPlayers = function(players){
			for(var i = 0; i < players.length; i++){
				drawPlayer(players[i]);
			}
		}
		
		/*
		Methods to Render / Draw objects onscreen
			-Specifically draw sprites (use spritesheets) use ctx.drawImage();
		*/
		
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

