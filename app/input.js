/*
Constants describing keys / controls
*/
const KEYCODES = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
    S: 83,
    C: 67
}

let keys;
let localMousePos;
let globalMousePos;
let windowActive;

//Input Manager Instance
let inputManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		object.KEYS = KEYCODES;
		keys = {};
		keyCallbacks = [];
        localMousePos = {x: 0, y: 0};
        globalMousePos = {x: 0, y: 0};
		windowActive = true;
		
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
			// can use entire window instead of just the canvas, because the canvas takes up the entire window
            window.onmousemove = callback;
		}
		
		object.setMouseWheelCallback = function(callback){
			window.onwheel = function(event){
				let result = event.deltaY > 0;
				callback(result);
			}
		}
        
        object.setMouseClickCallback = function(callback){
            window.onclick = callback;
        }
		
		object.addListenerForKeys = function(keyCodes){
			
			for(let i = 0; i < keyCodes.length; i++){
				keys[keyCodes[i]] = {};
				keys[keyCodes[i]].pressed = false;
			}
		}

		object.setKeyCallback = function(keyCode, f){
			keyCallbacks[keyCode] = f;
		}
		
		object.isPressed = function(key){
			if(keys[key]){
				return keys[key].pressed;
			}
		}
		
		object.isWindowActive = function(){
			return windowActive;
		};
		
		object.setWindowActiveCallback = function(rejectCallback, acceptCallback){
			window.onfocus = function(){
				windowActive = true;
				acceptCallback(windowActive);
			};
			window.onblur = function(){
				windowActive = false;
				rejectCallback(windowActive);
			};
		}
		
		document.addEventListener('keydown', function(event){
			if(keys[event.keyCode]){
				if(keys[event.keyCode].pressed === false && keyCallbacks[event.keyCode] != undefined){
					keyCallbacks[event.keyCode]();
				}
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