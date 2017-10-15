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
            let playerVec = getVectortoPlayer(closestPlayer, this.position.x, this.position.y)

            // behaviour weights
            let playerFleeWeight = 1;
            let separateWeight = 1;
            let cohereWeight = 1;
            let leaderFollowWeight = 1;
            let separateRad = 40;

			if(closestPlayer.id == undefined){
				return;
			}

            // player flee
            if (calcVectorDistance(playerVec) < 500) {
                let fleeForce = multiplyVector(flee(normalize(playerVec)), playerFleeWeight);
                addAccel(fleeForce);
            }

            addAccel(multiplyVector(separate(), separateWeight));
            addAccel(multiplyVector(cohere(), cohereWeight));
            addAccel(multiplyVector(leaderFollow(), leaderFollowWeight));

            this.angle = Math.atan2(acceleration.y, acceleration.x);
		};
	


		// sheep flocking algorithms go here!

		function seek(seekPoint){

            let desiredVelocity = {
                x: seekPoint.x - this.position.x,
                y: seekPoint.y - this.position.y
            };

            normalize(desiredVelocity);
            desiredVelocity *= sheepSpeed;


            let steeringForce = {
                x: desiredVelocity.x - velocity.x,
                y: desiredVelocity.y - velocity.y
            };

            return steeringForce;
		}

		function flee(fleePoint){
            let desiredVelocity = {
                x: this.position.x - fleepoint.x,
                y: this.position.y - fleepoint.y
            };

            normalize(desiredVelocity);
            desiredVelocity *= sheepSpeed;


            let steeringForce = {
                x: desiredVelocity.x - velocity.x,
                y: desiredVelocity.y - velocity.y
            };

            return steeringForce;
		}

		function flock(){

        }

        function separate()
        {
            let separateVec = { x: 0, y: 0 };

            if (flock.length == undefined) {
                return separateVec;
            }

            for (let i = 0; i < flock.length; i++) {
                let dist = {
                    flock[i].x - position.x,
                    flock[i].y - position.y
                };
                let distSqr = Math.pow(dist.x, 2) + Math.pow(dist.y, 2);
                if (distSqr < Math.pow(separateRad, 2)) {
                    separateVec = addVector(flee(flock[i]));
                }
            }

            separateVec = normalize(separateVec);
            return subtractVector(separateVec, velocity);
        }

        function cohere() {
            let coherePoint = { x: 0, y: 0 };

            if (flock.length == undefined) {
                return coherePoint;
            }

            for (let i = 0; i < flock.length; i++) {
                coherePoint = addVector(coherePoint, flock[i].position);
            }

            coherePoint = divideVector(coherePoint, flock.length);

            return seek(coherePoint);
        }

        function leaderFollow() {
            if (shepherd == undefined) {
                let zeroVec = { x: 0, y: 0 };
                return zeroVec;
            }

            let shepherdPos = { x: shepherd.x, y: shepherd.y };

            return seek(shepherdPos);
        }

        function addAccel(vector) {
            acceleration.x += vector.x;
            acceleration.y += vector.y;
        }

		// further properties cannot be added outside of this constructor, to keep code
		// easier to read/trace/debug
		Object.seal(this);
	}

