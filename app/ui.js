
//UI Manager Instance
let uiManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		
		object.startScreen = {
			show: function(){

			},
			hide: function(){

			},
			nameInput: document.querySelector("nameInput"),
			colorInput: {},
			element: document.querySelector('#startScreen')
		};

		object.controls = { 	// a popup dialogue explaining controls
			show: function(){	// toggled with 'c' key at the moment

			},
			hide: function(){

			},
			element: document.querySelector('#controlsMenu'),
			visible: false,
			// possibly want to be able to alter keybinds here?
			// stretch goal
		};

		object.leaderboard = {
			update: function(){

			}
		};
		object.hud = {
			herdindicator: {},		// an arrow pointing towards your herd
			playerInfo:{
				nameDisplay: {},		// displays your personal name
				scoreDisplay: {}, 		// displays your personal score
				followingIndicator: {}  // indicates whether or not the shepherd is following you
			},
		};

		

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

