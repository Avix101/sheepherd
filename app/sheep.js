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

			// might want to move these to globals for tweaking/balancing
			let playerFleeWeight = 1;
			let separateWeight = 10;
			let cohereWeight = 1;
            let leaderFollowWeight = 1;
            let sheepSlow = 1.1; // must be > 1

            // add all forces to acceleration here
			if (calcVectorLength(getVectorto(closestPlayer, this.position)) < 500) {
                this.acceleration = addVector(flee(closestPlayer), this.acceleration);
            }

            this.acceleration = addVector(multiplyVector(cohere(), cohereWeight), this.acceleration);
            this.acceleration = addVector(multiplyVector(separate(), separateWeight), this.acceleration);

            // calculates sheep movement
            this.velocity = addVector(this.velocity, this.acceleration);

            // slows sheep
            if (this.acceleration.x === 0 && this.acceleration.y === 0) {
                this.velocity = divideVector(this.velocity, 1.1);
                if (this.velocity.x < 0.1 && this.velocity.y < 0.1) {
                    this.velocity = { x: 0, y: 0 };
                }
            }
            // limit sheep speed
            else if (calcVectorLength(this.velocity) > 1) {
                this.velocity = normalizeVector(this.velocity);
                this.velocity = multiplyVector(this.velocity, sheepSpeed);
            }

            // retain rotation
            if (this.velocity.x !== 0 && this.velocity.y !== 0) {
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }

            // update position
			this.position = addVector(this.velocity, this.position);
		};
	


		// sheep flocking algorithms

		let seek = function(seekPoint){
			let desiredVelocity = subtractVector(seekPoint, this.position);
			desiredVelocity = normalizeVector(desiredVelocity);
			desiredVelocity = multiplyVector(desiredVelocity, sheepSpeed);
            
			let steeringForce = subtractVector(desiredVelocity, this.velocity);
            return steeringForce;
            //seekVec = subtractVector(seekPoint, this.position);
            //seekVec = normalizeVector(seekVec);
            //return seekVec;

		}.bind(this);

		let flee = function(fleePoint){
			return multiplyVector(seek(fleePoint), -1);
		}.bind(this);

		let flock = function(){

		}.bind(this);


		let separate = function(){
			let separateRad = 150;
			let separateVec = {x:0, y:0};

			if(sheeps === undefined){
				return separateVec;
			}

            for (let i = 0; i < sheeps.length; i++){
                // calculate distance
				let dist = subtractVector(sheeps[i].position, this.position);
                let distSqr = Math.pow(dist.x, 2) + Math.pow(dist.y, 2);

                // if it's the same sheep, skip
                if (sheeps.indexOf(this) == i) continue;

                // if too close flee
                if (distSqr < Math.pow(separateRad, 2)) {
                    separateVec = addVector(flee(sheeps[i].position), separateVec);
				}
            }

            separateVec = normalizeVector(separateVec);
            //console.log(separateVec);
            return separateVec;

		}.bind(this);

		let cohere = function(){
			let coherePoint = {x:0, y:0};

			if(sheeps === undefined){
				return coherePoint;
			}

			for(let i = 0; i < sheeps.length; i++){
				coherePoint = addVector(coherePoint, sheeps[i]. position);
			}

			coherePoint = divideVector(coherePoint, sheeps.length);

            let dist = subtractVector(coherePoint, this.position);
            let distSqr = Math.pow(dist.x, 2) + Math.pow(dist.y, 2);

            if (distSqr < 500) {
                return { x: 0, y: 0 };
            }

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
	
	//Let's put spawning here for now
	function spawnSheep(){
        let newSheep = new sheep(Math.random() * 5000, Math.random() * 5000);
		newSheep.velocity = {x:0, y:0};
		newSheep.acceleration = {x:0, y:0};
		newSheep.angle = Math.random()*Math.PI*2;

		//Append from the right side of the array
		let newIndex = sheeps.length;
        sheeps[newIndex] = newSheep;
		
		return newIndex;
    };

