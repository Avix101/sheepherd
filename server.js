//NPM Modules
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//Ephemeral DB, basically just free memory - no long term storage!
const redis = require('redis-js'); 

const DELETE = "DELETE";

//Custom Modules
const log = require(__dirname + '/server_modules/log.js');

const port = process.env.PORT || 5000;

const views = __dirname + "/views";
const scripts = __dirname + "/app";
const styles = __dirname + "/styles";
app.use('/', express.static(views));
app.use('/app', express.static(scripts));
app.use('/styles', express.static(styles));

app.get("/", function(request, response/*, next */) {
	response.send("index.html");
});

app.get("/app/", function(req, res) {});

server.listen(port, function(){
	log.success("herd.io launched...");
});

function getPlayerIndex(socket){
	var playerData = redis.lrange('playerIDs', 0, -1);
	return playerData.indexOf(socket.id);
};

function sendGamestate(){
    var gameData = {
        playerData: redis.lrange('players', 0, -1),
    };
	io.sockets.emit('gamestate', gameData);
};
function sendSheepstate(){
    var gameData = {
        sheepData: redis.lrange('sheep', 0, -1)
    };
	io.sockets.emit('sheepstate', gameData);
};

//let updateCallsPerFrame = 0;

function update(){
	
	//updateCallsPerFrame++;
	
	sendGamestate();
	//sendSheepstate();
	setTimeout(function(){
		update();
	}, 1000 / 60);
}

update();

/*function clearUpdateCalls(){
	log.magic("Update calls per frame: " + updateCallsPerFrame);
	updateCallsPerFrame = 0;
	setTimeout(function(){
		clearUpdateCalls();
	}, 1000/60);
}

clearUpdateCalls();
*/

let host;

io.on('connection', function(socket){
	
	log.notify(socket.request.connection.remoteAddress + " connected!");
	
	var player = {
		x: 0,
		y: 0,
		id: socket.id
	};
	
	if(!host){
		host = socket.id;
		io.sockets.connected[host].emit('host', true);
	}
	
	redis.lpush('playerIDs', socket.id);
	redis.lpush('players', player);
    
    var playerSheep = {
        position:{
              x: Math.random() * 5000,
              y: Math.random() * 5000
          },
          velocity:{
            x:0,
            y:0
          },
          acceleration:{
            x:0,
            y:0
          },
          angle: Math.random()*Math.PI*2
    };
    redis.lpush('sheep', playerSheep);
	
	sendGamestate();
	sendSheepstate();
	
	socket.on('playerUpdate', function(x, y,angle){
			
		var playerObj = {
		
			x: x,
			y: y,
			angle: angle,
			id: socket.id
		};
		
		var index = getPlayerIndex(socket);
		redis.lset('players', index, playerObj);
		//sendGamestate();
	});
    
    socket.on('spawnSheep', function(){
        var sheep = {
        	position:{
            	x: Math.random() * 5000,
            	y: Math.random() * 5000
        	},
        	velocity:{
        		x:0,
        		y:0
        	},
        	acceleration:{
        		x:0,
        		y:0
        	},
        	angle: Math.random()*Math.PI*2
        };
        redis.rpush('sheep', sheep);
		sendSheepstate();
    });
    
    socket.on('updateSheep', function(sheep, index){
        redis.lset('sheep', index, sheep);
        //sendSheepstate();
    });
	
	socket.on('updateAllSheep', function(packet){
		for(let i = 0; i < packet.sheep.length; i++){
			redis.lset('sheep', packet.indicies[i], packet.sheep[i]);
		}
		sendSheepstate();
	});
	
	socket.on('rejectHost', function(){
		log.notify("Switching Hosts");
		
		redis.lpush('rejectedHosts', host);
		let players = redis.lrange('playerIDs', 0, -1);
		let oldHost = host;
		let oldHostIndex = players.indexOf(oldHost);
		
		for(let i = 0; i < players.length; i++){
			
		
			if(redis.lindex('rejectedHosts', players[i]) != -1){
				continue;
			}
		
			host = redis.lindex('playerIDs', i);
			
			if(io.sockets.connected[oldHost]){
				io.sockets.connected[oldHost].emit('host', false);
			}
			
			if(io.sockets.connected[host]){
				io.sockets.connected[host].emit('host', true);
			}
			
			return;
		}
		
		host = undefined;
	});
	
	socket.on('acceptHost', function(){
		redis.lrem('rejectedHosts', -1, socket.id);
		if(!host){
			host = socket.id;
			
			if(io.sockets.connected[host]){
				io.sockets.connected[host].emit('host', true);
			}
		}
	});
	
	socket.on('disconnect', function(){
		
        log.info(socket.request.connection.remoteAddress + " disconnected.");

        if (redis.lrange('players', 0, -1).length == 1) {
            redis.del('sheep');
        }
		
		var index = getPlayerIndex(socket);
		redis.lset('players', index, DELETE);
		redis.lrem('players', -1, DELETE);
		redis.lrem('playerIDs', -1, socket.id);
		
		if(host == socket.id){
			host = redis.lindex('playerIDs', 0);
			if(host){
				io.sockets.connected[host].emit('host', true);
			}
		}
	});
});

