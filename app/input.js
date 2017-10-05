/*
Constants describing keys / controls
*/

//Input Manager Instance
let inputManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		/*
		Method to get local mouse coordinates (relative to the canvas)
		*/

		/*
		Listeners to detect input (Only detect)
		*/
		object.setMouseMoveCallback = function(callback){
			canvas.onmousemove = callback;
		}

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