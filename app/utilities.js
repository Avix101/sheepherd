

	// --------------------------------------------------
	//
	// VECTOR MATH
	//
	// --------------------------------------------------

    function calcPointDistance(point1, point2) {
        return Math.sqrt(Math.abs(Math.pow((point1.x - point2.x), 2) - Math.pow((point1.y - point2.y), 2)));
    }

    function calcVectorLength(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    function addVector(vector1, vector2){
        let vector = {};
        vector.x = vector1.x + vector2.x;
        vector.y = vector1.y + vector2.y;

        return vector;
    }

    function subtractVector(vector1, vector2){
        let vector = {};
        vector.x = vector1.x - vector2.x;
        vector.y = vector1.y - vector2.y;

        return vector;
    }

    function multiplyVector(vector, scalar){
        let scalevector = {};
        scalevector.x = vector.x*scalar;
        scalevector.y = vector.y*scalar;

        return scalevector;
    }

    function divideVector(vector, scalar){
        let scalevector = {};
        scalevector.x = vector.x*scalar;
        scalevector.y = vector.y*scalar;

        return scalevector;
    }

    function normalizeVector(vector){
        let normalized = {x: 0, y: 0};
        let length = calcVectorLength(vector);
        if(length != 0){
            normalized.x = vector.x/length;
            normalized.y = vector.y/length;
        }
        return normalized;
    }

    function getVectorto(vectorTo, vectorFrom){
        return subtractVector(vectorTo, vectorFrom);
    }

    function getNormalizedVectorto(vectorTo, vectorFrom) {
        let vector = subtractVector(vectorTo, vectorFrom);
        let length = calcVectorLength(vector);
        if (length != 0) {
            vector.x /= length;
            vector.y /= length;
        }

        return vector;
    }

    function getClosestPlayer(point) {
        let closest = 10000;
        let playNum = 0;
        for (let i = 0; i < players.length; i++) {
            let dist = calcPointDistance(point, players[i]);
            if (dist < closest) {
                closest = dist;
                playNum = i;
            }
        }
        return players[playNum];
    }

    function getVectortoPlayer(playerObj, pointX, pointY) {
        let vector = {
            x: playerObj.x - pointX,
            y: playerObj.y - pointY
        };

        return vector;
    }