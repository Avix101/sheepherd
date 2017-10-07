/*
Constants describing keys / controls
*/
const KEYCODES = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39
}

let keys;

//Input Manager Instance
let inputManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		object.KEYS = KEYCODES;
		keys = {};
		
		/*
		Method to get local mouse coordinates (relative to the canvas)
		*/

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