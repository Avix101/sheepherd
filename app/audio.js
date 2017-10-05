/*
Constants describing audio files / locations / settings
*/

//Audio Manager Instance
let audioManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		/*
		Method to load audio
		*/

		/*
		Methods to play audio
		*/

		/*
		Method to stop all audio
		*/
		
		console.log("Audio Manager Instance  created");
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

