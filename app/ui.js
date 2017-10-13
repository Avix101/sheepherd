
//UI Manager Instance
let uiManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		object.leaderboard = {
			update: function(){

			},
		}

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

