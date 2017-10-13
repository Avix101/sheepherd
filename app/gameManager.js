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

        //Remove comment
		ui = uiManager.getInstance();
		
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
			id: 0,
			score: 0
		}
        
        playerSpeed = {
            x: 4,
            y: 4
        }
		
		players = [];
        sheep = [];
		
		input.setMouseMoveCallback(onMouseMove);
		input.setMouseWheelCallback(onMouseScroll);
		input.addListenerForKeys([input.KEYS.RIGHT, input.KEYS.LEFT, input.KEYS.UP, input.KEYS.DOWN, input.KEYS.S]);
		input.setWindowActiveCallback(rejectHost, acceptHost);
		network.setIsHostCallback(checkHostViability);
		
		update();
	}
	
	function update(){
		
		checkInput();
		
		display.clearCanvas();
		display.update();
		display.drawBG();
		
        display.drawSheep(sheep);
        display.drawPlayers(players);
        //display.translateCamera(cameraSpeed.x, cameraSpeed.y);
        
        let localPlayerPosition = display.getLocalPosition(player.x, player.y);
        var localMouse = input.getLocalMouseCoords();
        let playerDirection = input.getVectorToMouse(localPlayerPosition.x, localPlayerPosition.y);
        
        let addX = playerDirection.x * playerSpeed.x;
        let addY = playerDirection.y * playerSpeed.y;
        
        let globalFrame = display.getGlobalFrame();
        if(Math.abs(localPlayerPosition.x - localMouse.x) < 4 / globalFrame.scale){
            addX = 0;
        }
        
        if(Math.abs(localPlayerPosition.y - localMouse.y) < 4 / globalFrame.scale){
            addY = 0;
        }
        
        player.x += addX;
        player.y += addY;

		if(network.isHost()){
			let sheepPacket = network.createSheepPacket();
		
			//sheep movement
			for (let i = 0; i < sheep.length; i++) {
				 let closestPlayer = getClosestPlayer(sheep[i]); 
				 let vector = getNormalizedVectortoPlayer(closestPlayer, sheep[i].x, sheep[i].y);

				 if(closestPlayer.id == undefined){
					 continue;
				 }
				 
				 if (calcVectorDistance(getVectortoPlayer(closestPlayer, sheep[i].x, sheep[i].y)) < 500) {
					 sheep[i].x += vector.x;
					 sheep[i].y += vector.y;
					 //network.updateSheep(sheep[i], i);
					 network.appendSheepPacket(sheepPacket, sheep[i], i);
				 }
			 }
			 
			 network.sendSheepPacket(sheepPacket);
		}
		
        //input.addToGlobalMouse(addX, addY, world);
        
        display.translateToCamera(player.x, player.y);
        network.sendPlayerInfo(player);
		
		// update leaderboard
		ui.leaderboard.update();
		requestAnimationFrame(update);
	}
	
	function rejectHost(windowActive){
		if(!windowActive && network.isHost()){
			network.rejectHost();
		}
	}
	
	function acceptHost(windowActive){
		if(windowActive){
			network.acceptHost();
		}
	}
	
	function checkHostViability(){
		if(!input.isWindowActive()){
			network.rejectHost();
		}
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

        if(input.isPressed(input.KEYS.C)){
        	// toggle controls screen
        }
    }

    function calcPointDistance(point1, point2) {
        return Math.sqrt(Math.abs(Math.pow((point1.x - point2.x), 2) - Math.pow((point1.y - point2.y), 2)));
    }

    function calcVectorDistance(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    function getNormalizedVectortoPlayer(playerObj, pointX, pointY) {
        let vector = {
            x: playerObj.x - pointX,
            y: playerObj.y - pointY
        };

        let norm = calcVectorDistance(vector);
        if (norm != 0) {
            vector.x /= norm;
            vector.y /= norm;
        }

        return vector;
    }

    function getClosestPlayer(point) {
        let closest = 10000;
        let playNum = 0;
        for (let i = 0; i < players.length; i++) {
            let dist = calcPointDistance(point, players[i]);
            if (dist < closest) {
                closest = dist;
                playNum = i;
            }
        }
        return players[playNum];
    }

    function getVectortoPlayer(playerObj, pointX, pointY) {
        let vector = {
            x: playerObj.x - pointX,
            y: playerObj.y - pointY
        };

        return vector;
    }

    function sheepSeek(sheep) {
        
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