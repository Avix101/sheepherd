/*
Initialize socket connection, describe any constants used
*/
const socket = io();

const TYPES = {
	VARIABLE: 0,
	ARRAY: 1,
	OBJECT: 2
}

let host = false;
let isHostCallback;

//Network Manager Instance
let networkManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		object.TYPES = TYPES;
		/*
		Methods that send information to the server
		*/
        object.getID = function(){
            return socket.io.engine.id;
        }
		
		object.isHost = function(){
			return host;
		}
		
		object.rejectHost = function(){
			socket.emit('rejectHost');
		}
		
		object.acceptHost = function(){
			socket.emit('acceptHost');
		}
		
		object.setIsHostCallback = function(callback){
			isHostCallback = callback;
		}
		
		object.sendPlayerInfo = function(playerObj){
			socket.emit('playerUpdate', playerObj.x, playerObj.y);
		}
		
        object.spawnSheep = function(){
            socket.emit('spawnSheep');
        }
        
        object.updateSheep = function(sheep, index){
            socket.emit('updateSheep', sheep, index);
        }
		
		object.createSheepPacket = function(){
			let packet = {};
			packet.sheep = [];
			packet.indicies = [];
			return packet;
		}
		
		object.appendSheepPacket = function(packet, sheep, index){
			packet.sheep.push(sheep);
			packet.indicies.push(index);
		}
		
		object.sendSheepPacket = function(packet){
			socket.emit('updateAllSheep', packet);
		}
		/*
		Methods that receive information from the server
		*/
	
		console.log("Network Manager Instance created");
		return object;
	}
	
	socket.on('connect', function(){
		console.log("Connected to server...");
        player.id = instance.getID();
	});

	socket.on('gamestate', function(gameData){
		players = gameData.playerData;
	});
    
	socket.on('sheepstate', function(gameData){
        sheep = gameData.sheepData;
	});
	
	socket.on('host', function(isHost){
		host = isHost;
		if(host){
			isHostCallback();
		}
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

