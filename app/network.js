/*
Initialize socket connection, describe any constants used
*/
let socket;

const TYPES = {
	VARIABLE: 0,
	ARRAY: 1,
	OBJECT: 2
}

let host = false;
let connected = false;
let isHostCallback;

//Network Manager Instance
let networkManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		socket = io();
		attachSocketFunctions();
		
		object.TYPES = TYPES;
		/*
		Methods that send information to the server
		*/
        object.getID = function(){
            return socket.io.engine.id;
        }

        object.isConnected = function(){
        	return connected;
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
			socket.emit('playerUpdate', playerObj.x, playerObj.y, playerObj.angle, playerObj.score, playerObj.shepherdPosition);
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
			packet.indices = [];
			return packet;
		}
		
		object.appendSheepPacket = function(packet, sheep, index){
			packet.sheep[index] = sheep;
			packet.indices.push(index);
		}
		
		object.stageSheepDelete = function(packet, sheep, index){
			object.appendSheepPacket(packet, 'del', index);
		}
		
		object.sendSheepPacket = function(packet){
			socket.emit('updateAllSheep', packet);
		}
		
		object.joinGame = function(info){
			socket.emit('createPlayer', info);
		}

		/*
		Methods that receive information from the server
		*/
	
		console.log("Network Manager Instance created");
		return object;
	}
	
	function attachSocketFunctions(){
		socket.on('connect', function(){
		console.log("Connected to server...");
		player.id = instance.getID();
		});

		socket.on('gamestate', function(gameData){
			players = gameData.playerData;
			playersInfo = gameData.playerInfo;
		});
		
		socket.on('playerdata', function(playerData){
			//Another anti-jitter safeguard, unless the whole gamestate is updated, just ignore server changes to local character
			if(playerData.data.id === player.id){
				players[playerData.index].score = playerData.data.score;
				return;
			}
			players[playerData.index] = playerData.data;
		});
		
		socket.on('sheepstate', function(sheepData){
			updateSheeps(sheepData);
		});
		
		socket.on('host', function(isHost){
			host = isHost;
			if(host){
				isHostCallback();
			}
		});
	}

	function updateSheeps(sheepData){
		if(game)
		{
			for(let i = 0; i < sheepData.sheep.length; i++){
			
				let index = sheepData.indices[i];
				if(sheepData.sheep[index] == "del"){
					sheeps.splice(index, 1);
					continue;
				}
			
				sheeps[index] = sheepData.sheep[index];
			}
		}
		// console.dir(sheeps);
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

