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
			socket.emit('playerUpdate', playerObj.x, playerObj.y, playerObj.angle, playerObj.score, playerObj.shepherdPosition, playerObj.flock);
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
			if(playerData.data.id == player.id){
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
			
				let index = sheepData.indicies[i];
				if(sheepData.sheep[index] == "del"){
					sheeps.splice(sheepData[index], 1);
					continue;
				}
			
				if(sheeps[index]){
					sheeps[index].position.x = sheepData.sheep[i].position.x;
					sheeps[index].position.y = sheepData.sheep[i].position.y;
					sheeps[index].velocity.x = sheepData.sheep[i].velocity.x;
					sheeps[index].velocity.y = sheepData.sheep[i].velocity.y;
					sheeps[index].acceleration.x = sheepData.sheep[i].acceleration.x;
					sheeps[index].acceleration.y = sheepData.sheep[i].acceleration.y;
					sheeps[index].angle = sheepData.sheep[i].angle;
				}
				else{
					sheeps[index] = new sheep(sheepData.sheep[i].position.x, sheepData.sheep[i].position.y);
				}
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

