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
            let closestPlayer = getClosestPlayer(this.position);
            let vector = getNormalizedVectorto(closestPlayer, this.position);
            this.acceleration = { x: 0, y: 0 };

			if(closestPlayer.id === undefined){
				return;
            }

            

			// // might want to move these to globals for tweaking/balancing
			// let playerFleeWeight = 1;
			// let separateWeight = 1;
			// let cohereWeight = 1;
			// let leaderFollowWeight = 1;

			// this.velocity = addVector(this.velocity, this.acceleration);
			// this.position = addVector(this.velocity, this.position);
			// this.angle = Math.atan2(this.velocity.x, this.velocity.y);
			
			if (calcVectorLength(getVectorto(closestPlayer, this.position)) < 500) {
                this.acceleration = addVector(flee(closestPlayer), this.acceleration);
				//this.angle = Math.atan2(-vector.y, -vector.x);
            }

            this.velocity = addVector(this.velocity, this.acceleration);

            // slows sheep
            if (this.acceleration.x === 0 && this.acceleration.y === 0) {
                this.velocity = divideVector(this.velocity, 1.1);
                if (this.velocity.x < 0.01 && this.velocity.y < 0.01) {
                    this.velocity = { x: 0, y: 0 };
                }
            }
            // moves sheep
            else {
                this.velocity = normalizeVector(this.velocity);
                this.velocity = multiplyVector(this.velocity, sheepSpeed);
            }

            // retain rotation
            if (this.velocity.x !== 0 && this.velocity.y !== 0) {
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }
			this.position = addVector(this.velocity, this.position);
		};
	


		// sheep flocking algorithms

		let seek = function(seekPoint){
			//let desiredVelocity = subtractVector(seekPoint, this.position);
			//desiredVelocity = normalizeVector(desiredVelocity);
			//desiredVelocity = multiplyVector(desiredVelocity, sheepSpeed);
            //
			//let steeringForce = subtractVector(desiredVelocity, this.velocity);
            //return steeringForce;
            seekVec = subtractVector(seekPoint, this.position);
            seekVec = normalizeVector(seekVec);
            return seekVec;

		}.bind(this);

		let flee = function(fleePoint){
			return multiplyVector(seek(fleePoint), -1);
		}.bind(this);

		let flock = function(){

		}.bind(this);


		let separate = function(){
			let separateRad = 40;
			let separateVec = {x:0, y:0};

			if(this.flock === undefined){
				return separateVec;
			}

			for(let i = 0; i < this.flock.length; i++){
				let dist = subtractVector(flock[i].position, this.position);
				let distSqr = Math.pow(dist.x, 2) + Math.pow(dist.y, 2);
				if(distSqr < Math.pow(separateRad, 2)){
					separateVec = addVector(flee(flock[i]));
				}
			}

		}.bind(this);

		let cohere = function(){
			let coherePoint = {x:0, y:0};

			if(this.flock === undefined){
				return coherePoint;
			}

			for(let i = 0; i < this.flock.length; i++){
				coherePoint = addVector(coherePoint, this.flock[i]. position);
			}

			coherePoint = divideVector(coherePoint, this.flock.length);

			return seek(coherePoint);

		}.bind(this);

		let leaderFollow = function(){
			if(this.shepherd === undefined){
				let zeroVec = { x:0, y:0 };
				return zeroVec;
			}

			return seek(shepherd.position);

		}.bind(this);

		// further properties cannot be added outside of this constructor, to keep code
		// easier to read/trace/debug
		Object.seal(this);
	}

