// ---------------------------------------------------------------------------
//
// gameManager.js
//
// The game manager handles all game logic - behavior, score, updates, etc.
//
// ----------------------------------------------------------------------------

let player, players, playersInfo, sheeps, game= false;

const MAX_SHEEP = 300;

let gameManager = ( function(){

	let instance;
	let audio;
	let display;
	let input;
	let network;


	sheeps = []; 	// array of all sheep in the game (can't overload the name sheep, so screw you English)
	players = []; 	// array of all players in the game
	playersInfo = [];

	let sheepTime = 0;
	let nextSheepSpawn = 0;
	let lastTime = 0;

	player = {
		
		position: { x: -10, y: -10},
		speed: { x: 4, y: 4},
		angle: 0,
		id: 0,
		score: 0,
		dog: 0,
		shepherd: {
			flock: [], // array of sheep objects, at some point
			speed: {x: 2, y: 2},
			position: {x: 0, y: 0},
			// shepherd update logic goes here!
			update: function(){

				if(calcVectorLength(getVectorto(player.position, this.position)) > 150){
					
					let direction = getNormalizedVectorto(player.position, this.position);
					
					let addX = direction.x * this.speed.x;
					let addY = direction.y * this.speed.y;
					
					this.position.x += addX;
					this.position.y += addY;
				}
			}
		},
		name: "Player Name",
		color: "red", // don't know how this will work yet
		update: function(){
			let localPosition = display.getLocalPosition(player.position.x, player.position.y);
			let localMouse = input.getLocalMouseCoords();
			let direction = input.getVectorToMouse(localPosition.x, localPosition.y);

			let addX = direction.x *this.speed.x;
			let addY = direction.y *this.speed.y;

			let globalFrame = display.getGlobalFrame();
			if(Math.abs(localPosition.x - localMouse.x) < 4 / globalFrame.scale){
				addX = 0;
			}

			if(Math.abs(localPosition.y - localMouse.y) < 4 / globalFrame.scale){
				addY = 0;
			}

			this.position.x += addX;
			this.position.y += addY;
			
			this.angle = Math.atan2(addY, addX);

			this.shepherd.update();
		}
	};
	// player cannot be extended, to prevent hard to find bugs
	Object.seal(player);

	function createInstance(){
		audio = audioManager.getInstance();
		display = displayManager.getInstance();
		input = inputManager.getInstance();
		network = networkManager.getInstance();
		ui = uiManager.getInstance();

		let object = {};
		init();

		console.log("Game Manager Instance created");
		return object;
	}

	function init(){

		input.setMouseMoveCallback(onMouseMove);
		input.setMouseWheelCallback(onMouseScroll);
		input.addListenerForKeys([input.KEYS.RIGHT, input.KEYS.LEFT, input.KEYS.UP, input.KEYS.DOWN, input.KEYS.S]);
		input.setWindowActiveCallback(rejectHost, acceptHost);
		network.setIsHostCallback(checkHostViability);
		
		lastTime = performance.now();

		update();
	}
	
    function update() {

		checkInput();
		display.update(players, sheeps);
		// the player also updates their shepherd
		player.update();

		if(network.isHost()){

			hostUpdate();
		}

		let playerInfo = { x: player.position.x, y: player.position.y, id: player.id, angle: player.angle, score: player.score, shepherdPosition: player.shepherd.position};
		network.sendPlayerInfo(playerInfo);

		display.translateToCamera(player.position.x, player.position.y);

		ui.leaderboard.update();
		requestAnimationFrame(update);

	}
	
	function calcDeltaTime(){
		let now, fps;
		now = performance.now();
		fps = 1000 / (now - lastTime);
		fps = clamp(fps, 15, 60);
		lastTime = now;
		return 1 / fps;
	}
	
	/*
	Function Name: clamp(val, min, max)
	Author: Web - various sources
	Return Value: the constrained value
	Description: returns a value that is
	constrained between min and max (inclusive) 
	*/
	function clamp(val, min, max){
		return Math.max(min, Math.min(max, val));
	}

	// ------------------------------------
	//
	// HOST LOGIC
	//
	// ------------------------------------

	function hostUpdate(){
		let sheepPacket = network.createSheepPacket();

		// update all the sheep
		for(let i = 0; i < sheeps.length; i++){
			sheeps[i].update();
            if (sheeps[i].position.x < -1000 || sheeps[i].position.y < -1000 || sheeps[i].position.x > 3500 || sheeps[i].position.y > 3500){   // REPLACE WITH MAP SIZE VARIABLES
				network.stageSheepDelete(sheepPacket, sheeps[i], i);
				sheeps.splice(i, 1);
            } else{
                network.appendSheepPacket(sheepPacket, sheeps[i], i);
            }
		}

		network.sendSheepPacket(sheepPacket);
		
		//Spawn sheep if necessary
		if(sheeps.length < MAX_SHEEP){
			sheepTime += calcDeltaTime();
			nextSheepSpawn = 0.05 * sheeps.length;
			
			if(sheepTime > nextSheepSpawn){
				let newSheepIndex = spawnSheep();
				sheepTime = 0;
				
				let packet = network.createSheepPacket();
				network.appendSheepPacket(packet, sheeps[newSheepIndex], newSheepIndex);
				network.sendSheepPacket(packet);
			}
		}	
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



// -----------------------------------------------
// 
// INPUT HANDLING
//
// -------------------------------------------------

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
            /*let newSheepIndex = spawnSheep();
			
			let packet = network.createSheepPacket();
			network.appendSheepPacket(packet, sheeps[newSheepIndex], newSheepIndex);
			network.sendSheepPacket(packet);*/
        }

    }

	function onMouseMove(event){
		
		let globalFrame = display.getGlobalFrame();
		let rect = display.getBoundingClientRect();
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
	

	
	return {
		getInstance: function() {
			if(!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};

}());