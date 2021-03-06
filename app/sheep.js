	// to create a sheep, use the new keyword with this constructor.
	// ex: var sheep = new sheep(0,0);

        // flocking constants
        var flockingWeights = {
            playerFleeWeight: 50,
            seperateRad: 80,
            separateWeight: 1,
            cohereWeight: .09,
            alignWeight: .02,
            leaderFollowWeight: .2,
            sheepSlow: 1.1,
            forwardVectorLength: 200,
            wanderRange: 0.3,
            wanderRadius: 10,
            fleeRadius: 300,
            wanderWeight: 0.1,
			shepherdRadius: 500
        };
let sheepSpeed = 1;

	function sheep(xpos,ypos){
		this.position = {x: xpos, y: ypos};
		this.shepherd = undefined; // undefined when the sheep is not associated with a shepherd, a player's shepherd otherwise
		this.flock = undefined; // undefined when the sheep is not in a flock, an array of sheep otherwise

		this.velocity = { x: 0, y: 0};
        this.lastVelocity = {x: 0, y: 0};
        this.lastLastVelocity = {x: 0, y: 0};
		this.acceleration = { x: 0, y: 0};
        this.angle = 0;
        this.forward = { x: Math.cos(this.angle), y: Math.sin(this.angle) };
        this.frontPoint = addVector(this.forward, this.position);
        this.wanderSmooth = -1;

        this.update = function () {
            
            sheepSpeed = 1.75;

            let closestPlayer = getClosestPlayer(this.position);
            let vector = getNormalizedVectorto(closestPlayer, this.position);
            this.acceleration = { x: 0, y: 0 };
			
			let closestShepherd = getClosestShepherd(this.position);
            let vectorToShepherd = getVectorto(this.position, closestShepherd.shepherdPosition);
			
			if(calcVectorLength(vectorToShepherd) < flockingWeights.shepherdRadius){
                this.shepherd = closestShepherd;
                flockingWeights.shepherdRadius = 400 + this.shepherd.score * 10;
            }
            else {
				this.shepherd = undefined;
			}
            
            if (closestPlayer.id === undefined) {
				return;
            }


            // add all forces to acceleration here

            // calculates normalized forward vector and normalized vector in front of the object
            this.forward = { x: Math.cos(this.angle), y: Math.sin(this.angle) };
            this.forward = normalizeVector(this.forward);
            this.frontPoint = addVector(multiplyVector(this.forward, flockingWeights.forwardVectorLength), this.position);
            
            this.acceleration = addVector(multiplyVector(align(), flockingWeights.alignWeight), this.acceleration);         //alignment
            this.acceleration = addVector(multiplyVector(separate(), flockingWeights.separateWeight), this.acceleration);   //separation
            this.acceleration = addVector(multiplyVector(cohere(), flockingWeights.cohereWeight), this.acceleration);       //cohesion
            
            // drag
            this.velocity = divideVector(this.velocity, 1.1);
            if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
                this.velocity = { x: 0, y: 0 };
            }

            if (calcPointDistance(closestPlayer, this.position) < flockingWeights.fleeRadius) {

                this.acceleration = addVector(multiplyVector(flee(closestPlayer), flockingWeights.playerFleeWeight / calcPointDistance(this.position, closestPlayer)), this.acceleration);

                sheepSpeed = 1 / (calcPointDistance(this.position, closestPlayer) / (flockingWeights.fleeRadius * 1.5));
                if (sheepSpeed < 1.75) sheepSpeed = 1.75;
                if (sheepSpeed > 6) sheepSpeed = 6;
            }
            else if (this.shepherd) {
                //this.acceleration = addVector(multiplyVector(getNormalizedVectorto(this.shepherd.shepherdPosition, this.position), flockingWeights.leaderFollowWeight / calcPointDistance(this.position, this.shepherd.shepherdPosition)), this.acceleration);
                if (calcPointDistance(this.position, this.shepherd.shepherdPosition) > 50) {
                    this.acceleration = addVector(multiplyVector(seek(this.shepherd.shepherdPosition), flockingWeights.leaderFollowWeight), this.acceleration);
                }
            }
            else {
                // wandering
                this.acceleration = addVector(multiplyVector(wander(flockingWeights.wanderRange, flockingWeights.wanderRadius, this.forward), flockingWeights.wanderWeight), this.acceleration);
                
            }

            // calculates sheep movement
            //this.lastLastVelocity = this.lastVelocity;
            //this.lastVelocity = this.velocity;
            this.velocity = addVector(this.velocity, this.acceleration);
            
            // limit sheep speed
            if (calcVectorLength(this.acceleration) > 0) {
                this.velocity = normalizeVector(this.velocity);
                this.velocity = multiplyVector(this.velocity, sheepSpeed);
            }

            // retain rotation

            //if (this.velocity.x !== 0 && this.velocity.y !== 0 && this.lastVelocity.x !== 0 && this.lastVelocity.y !== 0 && this.lastLastVelocity.x !== 0 && this.lastLastVelocity.y !== 0) {
            //    this.angle = Math.atan2((this.velocity.y + this.lastVelocity.y + this.lastLastVelocity.y) / 3, (this.velocity.x + this.lastVelocity.x + this.lastLastVelocity.x) / 3);
            //}

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
            
			let steeringForce = subtractVector(desiredVelocity, this.velocity);
            return normalizeVector(steeringForce);
            //seekVec = subtractVector(seekPoint, this.position);
            //seekVec = normalizeVector(seekVec);
            //return seekVec;

		}.bind(this);

		let flee = function(fleePoint){
			return multiplyVector(seek(fleePoint), -1);
		}.bind(this);

		let flock = function(){

		}.bind(this);


        let separate = function () {
            let separateRad = 80;
			let separateVec = {x:0, y:0};

			if(sheeps === undefined){
				return separateVec;
			}

            for (let i = 0; i < sheeps.length; i++){

                // if it's the same sheep, skip
                if (sheeps.indexOf(this) == i) continue;

                // if too close flee
                if (calcPointDistance(sheeps[i].position, this.position) < separateRad) {
                    separateVec = addVector(flee(sheeps[i].position), separateVec);
				}
            }

            // separates from shepherd
            if (this.shepherd && calcPointDistance(this.shepherd.shepherdPosition, this.position) < separateRad) {
                seperateVec = addVector(flee(this.shepherd.shepherdPosition), separateVec);
            }

            separateVec = normalizeVector(separateVec);
            return separateVec;

		}.bind(this);

		let cohere = function(){
			let coherePoint = {x:0, y:0};

			if(sheeps === undefined){
				return coherePoint;
			}

            let cohereNum = 0;
			for(let i = 0; i < sheeps.length; i++){
                if (calcPointDistance(sheeps[i].position, this.position) < 200){
				    coherePoint = addVector(coherePoint, sheeps[i].position);
                    cohereNum++;
                }
			}

			coherePoint = divideVector(coherePoint, cohereNum);

            let dist = subtractVector(coherePoint, this.position);
            let distSqr = Math.pow(dist.x, 2) + Math.pow(dist.y, 2);

            if (distSqr < 500) {
                //return { x: 0, y: 0 };
            }

			return seek(coherePoint);

        }.bind(this);

        let align = function () {
            let flockDir = { x: 0, y: 0 };
            if (sheeps === undefined) {
                return flockDir;
            }
            for(let i = 0; i < sheeps.length; i++){
                if (calcPointDistance(sheeps[i].position, this.position) < 200){
                    flockDir = addVector(sheeps[i].forward, flockDir);//member.GetComponent<Human>().direction;
                }
            }

            let desiredVelocity = normalizeVector(flockDir);

            let steeringForce = subtractVector(desiredVelocity, normalizeVector(this.velocity));
            return normalizeVector(steeringForce);
        }.bind(this);

		/*let leaderFollow = function(){
			if(this.shepherd === undefined){
				let zeroVec = { x:0, y:0 };
				return zeroVec;
			}

			return seek(shepherd.position);

        }.bind(this);*/

        let wander = function (wanderRange, wanderRadius) {
            //console.log(this.forward);
            let wanderPoint = addVector(this.position, this.forward);
            let ranAngle = 0;
            if (this.wanderSmooth == -1){
                ranAngle = Math.random() * 360;
            } else {
                let min = this.wanderSmooth - wanderRange;
                let max = this.wanderSmooth + wanderRange;
                // smooth
                ranAngle = min + Math.random() * (max - min);
            }
            this.wanderSmooth = ranAngle;

            //limit the wanderSmooth between 0 and 360
            if (this.wanderSmooth < 0) this.wanderSmooth = 0;
            if (this.wanderSmooth > 2 * Math.PI) this.wanderSmooth = 2 * Math.PI;

            // set wanderPoint x and z
            wanderPoint.x = Math.cos(ranAngle) * wanderRadius;
            wanderPoint.y = Math.sin(ranAngle) * wanderRadius;
            wanderPoint = addVector(this.frontPoint, wanderPoint);

            return seek(wanderPoint);
        }.bind(this);

		// further properties cannot be added outside of this constructor, to keep code
		// easier to read/trace/debug
		Object.seal(this);
	}
	
	//Let's put spawning here for now
	function spawnSheep(){
        let newSheep = new sheep(Math.random() * 3500 - 500, Math.random() * 3500 - 500);
		newSheep.velocity = {x:0, y:0};
		newSheep.acceleration = {x:0, y:0};
		newSheep.angle = Math.random()*Math.PI*2;

		//Append from the right side of the array
		let newIndex = sheeps.length;
        sheeps[newIndex] = newSheep;
		
		return newIndex;
    };

