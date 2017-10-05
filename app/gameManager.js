let player, players, radius, canvas;

let gameManager = (function(){
	
	let instance;
	let audio;
	let display;
	let input;
	let network;
	
	function createInstance() {
		audio = audioManager.getInstance();
		display = displayManager.getInstance();
		input = inputManager.getInstance();
		network = networkManager.getInstance();
		
		let object = new Object();
		
		/*
		All game related methods if they need to be accessible by the client
		*/
		
		canvas = document.querySelector('#primaryCanvas');
		init();
		
		console.log("Game Manager Instance created");
		return object;
	}
	
	/*
	Game related methods (not accessible outside of this class)
	*/
	
	function init(){
		
		radius = 10;
		
		player = {	
			x: -10,
			y: -10,
			mouseX: 0,
			mouseY: 0
		}
		
		players = [];
		
		input.setMouseMoveCallback(onMouseMove);
		
		update();
	}
	
	function update(){
		
		display.clearCanvas();
		display.drawPlayers(players);
		
		requestAnimationFrame(update);
	}
	
	function onMouseMove(event){
		var rect = canvas.getBoundingClientRect();
		player.x = event.clientX - rect.left;
		player.y = event.clientY - rect.top;
		network.sendPlayerInfo(player);
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