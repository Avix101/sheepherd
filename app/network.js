/*
Initialize socket connection, describe any constants used
*/
const socket = io();

//Network Manager Instance
let networkManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		/*
		Methods that send information to the server
		*/
		
		object.sendPlayerInfo = function(playerObj){
			socket.emit('playerUpdate', playerObj.x, playerObj.y);
		}
		
        object.spawnSheep = function(){
            socket.emit('spawnSheep');
        }
		/*
		Methods that receive information from the server
		*/
	
		console.log("Network Manager Instance created");
		return object;
	}
	
	socket.on('connect', function(){
		console.log("Connected to server...");
	});

	socket.on('gamestate', function(gameData){
		players = gameData.playerData;
	});
    
	socket.on('sheepstate', function(gameData){
        sheep = gameData.sheepData;
	});
	
	return {
		getInstance: function() {
			if(!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
	
})();

