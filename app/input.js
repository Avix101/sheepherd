/*
Constants describing keys / controls
*/
const KEYCODES = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
    S: 83
}

let keys;
let localMousePos;
let globalMousePos;

//Input Manager Instance
let inputManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		object.KEYS = KEYCODES;
		keys = {};
        localMousePos = {x: 0, y: 0};
        globalMousePos = {x: 0, y: 0};
		
		/*
		Method to get local mouse coordinates (relative to the canvas)
		*/

        object.getGlobalMouseCoords = function(event, globalFrame, rect){
            let globalMouse = {
                x: ((event.clientX - rect.left) / globalFrame.scale) + globalFrame.x,
                y: ((event.clientY - rect.top) / globalFrame.scale) + globalFrame.y
            };
            globalMousePos = globalMouse;
            return globalMouse;
        }
        
        object.addToGlobalMouse = function(x, y){
            globalMousePos.x += x;
            globalMousePos.y += y;
        }
        
        object.calcLocalMouseCoords = function(event, globalFrame, rect){
            let localMouse = {
                x: (event.clientX - rect.left) / globalFrame.scale,
                y: (event.clientY - rect.top) / globalFrame.scale
            };
            localMousePos = localMouse;
            return localMouse;
        }
        
        object.getLocalMouseCoords = function(){
            return localMousePos;
        }
        
        object.getVectorToMouse = function(pointX, pointY){
            let mouse = localMousePos;
            let vector = {
                x: mouse.x - pointX,
                y: mouse.y - pointY
            };
            
            /*let distance  = vector.x * vector.x + vector.y * vector.y;
            let normVector = {
                x: (vector.x * vector.x) / distance,
                y: (vector.y * vector.y) / distance
            };*/
            let norm = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            if(norm != 0){
                vector.x /= norm;
                vector.y /= norm;
            }
            
            return vector;
        }
        
		/*
		Listeners to detect input (Only detect)
		*/
		object.setMouseMoveCallback = function(callback){
            canvas.onmousemove = callback;
		}
		
		object.setMouseWheelCallback = function(callback){
			canvas.onwheel = function(event){
				let result = event.deltaY > 0;
				callback(result);
			}
		}
		
		object.addListenerForKeys = function(keyCodes){
			
			for(let i = 0; i < keyCodes.length; i++){
				keys[keyCodes[i]] = {};
				keys[keyCodes[i]].pressed = false;
			}
		}
		
		object.isPressed = function(key){
			if(keys[key]){
				return keys[key].pressed;
			}
		}
		
		document.addEventListener('keydown', function(event){
			if(keys[event.keyCode]){
				keys[event.keyCode].pressed = true;
			}
		});
		
		document.addEventListener('keyup', function(event){
			if(keys[event.keyCode]){
				keys[event.keyCode].pressed = false;
			}
		});

		/*
		Methods that carry out actions based on the input
		*/

		/*
		Method to ignore input
		*/
		
		console.log("Input Manager Instance created");
		return object;
	}
	
	return {
		getInstance: function() {
			if(!instance) {
				instance = createInstance();
			}
			return instance;
		}
		
		
	};
	
})();