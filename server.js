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
app.use('/', express.static(views));
app.use('/app', express.static(scripts));

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

function update(){
	
	sendGamestate();
	//sendSheepstate();
	setTimeout(function(){
		update();
	}, 1000 / 60);
}

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
        x: Math.random() * 500,
        y: Math.random() * 500
    };
    redis.lpush('sheep', playerSheep);
	
	update();
	//sendGamestate();
	sendSheepstate();
	
	socket.on('playerUpdate', function(x, y){
			
		var playerObj = {
		
			x: x,
			y: y,
			id: socket.id
		};
		
		var index = getPlayerIndex(socket);
		redis.lset('players', index, playerObj);
		//sendGamestate();
	});
    
    socket.on('spawnSheep', function(){
        var sheep = {
            x: Math.random() * 5000,
            y: Math.random() * 5000
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

