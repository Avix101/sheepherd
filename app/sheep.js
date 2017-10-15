	// to create a sheep, use the new keyword with this constructor.
	// ex: var sheep = new sheep(0,0);

	const sheepSpeed = 1.75;

	function sheep(xpos,ypos){
		this.position = {x: xpos, y: ypos};
		this.shepherd = undefined; // undefined when the sheep is not associated with a shepherd, a player's shepherd otherwise
		this.flock = undefined; // undefined when the sheep is not in a flock, an array of sheep otherwise

		this.velocity = { x: 0, y: 0};
		this.acceleration = { x: 0, y: 0};
		this.angle = 0;

		this.update = function(){
			let closestPlayer = getClosestPlayer(this); 
			let vector = getNormalizedVectortoPlayer(closestPlayer, this.position.x, this.position.y);

			if(closestPlayer.id == undefined){
				return;
			}

			if (calcVectorDistance(getVectortoPlayer(closestPlayer, this.position.x, this.position.y)) < 500) {
				this.position.x += vector.x;
				this.position.y += vector.y;
				this.angle = Math.atan2(vector.y, vector.x);
			}
		};
	


		// sheep flocking algorithms go here!

		function seek(){

		}

		function flee(){

		}

		function flock(){

		}

		function leaderFollow(){

		}

		// further properties cannot be added outside of this constructor, to keep code
		// easier to read/trace/debug
		Object.seal(this);
	}

