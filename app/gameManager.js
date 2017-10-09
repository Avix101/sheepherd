let player, players, sheep, radius, canvas;

let gameManager = (function(){
	
	let instance;
	let audio;
	let display;
	let input;
	let network;
    
    let cameraSpeed = {x: 0, y: 0};
    let playerSpeed;
	
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
        
        playerSpeed = {
            x: 2,
            y: 2
        }
		
		players = [];
        sheep = [];
		
		input.setMouseMoveCallback(onMouseMove);
		input.setMouseWheelCallback(onMouseScroll);
		input.addListenerForKeys([input.KEYS.RIGHT, input.KEYS.LEFT, input.KEYS.UP, input.KEYS.DOWN, input.KEYS.S]);
		
		update();
	}
	
	function update(){
		
		checkInput();
		
		display.clearCanvas();
		display.update();
		display.drawBG();
		display.drawPlayers(players);
        display.drawSheep(sheep);
        //display.translateCamera(cameraSpeed.x, cameraSpeed.y);
        
        let localPlayerPosition = display.getLocalPosition(player.x, player.y);
        var localMouse = input.getLocalMouseCoords();
        let playerDirection = input.getVectorToMouse(localPlayerPosition.x, localPlayerPosition.y);
        
        let addX = playerDirection.x * playerSpeed.x;
        let addY = playerDirection.y * playerSpeed.y;
        
        if(Math.abs(localPlayerPosition.x - localMouse.x) < 4){
            addX = 0;
        }
        
        if(Math.abs(localPlayerPosition.y - localMouse.y) < 4){
            addY = 0;
        }
        
        player.x += addX;
        player.y += addY;
        
        //input.addToGlobalMouse(addX, addY, world);
        
        display.translateToCamera(player.x, player.y);
        network.sendPlayerInfo(player);
		
		requestAnimationFrame(update);
	}
	
	function onMouseMove(event){
		
		let globalFrame = display.getGlobalFrame();
		let rect = canvas.getBoundingClientRect();
		//player.x = ((event.clientX - rect.left) / globalFrame.scale) + globalFrame.x;
		//player.y = ((event.clientY - rect.top) / globalFrame.scale) + globalFrame.y;
		//
        
        let mouseLocation = input.calcLocalMouseCoords(event, globalFrame, rect);
        //let mouseLocation = input.getGlobalMouseCoords(event, globalFrame, rect);
        
        /*cameraSpeed = {
            x: ((canvas.width / 2) - mouseLocation.x) / 15,
            y: ((canvas.height / 2) - mouseLocation.y) / 15
        };*/
        //console.dir(cameraSpeed);
        
	}
	
	function onMouseScroll(result){
		display.scaleCamera(result ? -0.1 : 0.1);
	}
	
	function checkInput(){
		
		if(input.isPressed(input.KEYS.RIGHT)){
			display.translateCamera(-5, 0);
		} else if (input.isPressed(input.KEYS.LEFT)){
			display.translateCamera(5, 0);
		}
		
		if(input.isPressed(input.KEYS.UP)){
			display.translateCamera(0, 5);
		} else if (input.isPressed(input.KEYS.DOWN)){
			display.translateCamera(0, -5);
		}
        
        if(input.isPressed(input.KEYS.S)){
            network.spawnSheep();
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