

	// --------------------------------------------------
	//
	// VECTOR MATH
	//
	// --------------------------------------------------

    function calcPointDistance(point1, point2) {
        return Math.sqrt(Math.abs(Math.pow((point1.x - point2.x), 2) - Math.pow((point1.y - point2.y), 2)));
    }

    function calcVectorDistance(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    function getNormalizedVectortoPlayer(playerObj, pointX, pointY) {
        let vector = {
            x: playerObj.x - pointX,
            y: playerObj.y - pointY
        };

        let norm = calcVectorDistance(vector);
        if (norm != 0) {
            vector.x /= norm;
            vector.y /= norm;
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