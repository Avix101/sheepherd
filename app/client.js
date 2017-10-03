//(function(){
	
	const socket = io();
	window.onload = init;
	
	var canvas, ctx, player, players, radius;
	
	socket.on('connect', function(){
		console.log("Connected to server...");
	});
	
	socket.on('gamestate', function(playersObj){
		players = playersObj;
	});
	
	function init(){
	
		canvas = document.querySelector('#primaryCanvas');
		ctx = canvas.getContext('2d');
		
		radius = 10;
		
		player = {	
			x: -10,
			y: -10
		}
		
		players = [];
		
		canvas.onmousemove = function(event){
			
			var rect = canvas.getBoundingClientRect();
			player.x = event.clientX - rect.left;
			player.y = event.clientY - rect.top;
			sendPlayerInfo(player);
		};
		
		update();
	}
	
	function update(){
		
		clearCanvas();

		for(var i = 0; i < players.length; i++){
			drawPlayer(players[i]);
		}
		
		requestAnimationFrame(update);
	}
	
	function clearCanvas(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	function drawPlayer(playerObj){
	
		ctx.beginPath();
		ctx.arc(playerObj.x, playerObj.y, radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
	}
	
	function sendPlayerInfo(playerObj){
	
		socket.emit('playerUpdate', playerObj.x, playerObj.y);
	}

//}());