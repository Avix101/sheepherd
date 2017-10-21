"use strict"
//UI Manager Instance
let uiManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		var input = inputManager.getInstance();
		input.addListenerForKeys( [input.KEYS.C]);
		
		object.startScreen = {
			show: function(){
				this.element.style.opacity = 1; // for fade in
				this.element.style.display = "block";
			},
			hide: function(){
				this.element.style.opacity = 0; // for fade out
				//need timeout on this
				this.element.style.display = "none"; 
			},
			nameInput: document.querySelector("#nameInput"),
			colorInput: {},
			element: document.querySelector('#startScreen'),
			validateName:function(){

			}.bind(nameInput), //should already happen with an oninput function, but this makes it explicit
		};

		object.startScreen.nameInput.oninput = object.startScreen.validateName();
		object.startScreen.nameInput.onchange = function(){
			// set the player name

			// hide the start screen, start the game!
			this.hide();
		}.bind(object.startScreen);

		object.controls = { 	// a popup dialogue explaining controls
			
			element: document.querySelector('#controlsMenu'),
			visible: true,
			toggle: function(){	// toggled with 'c' key at the moment
				//console.dir(this);
				if(this.controls.visible){						
					this.controls.element.style.opacity = 0;
					this.controls.visible = false;
				}
				else{
					this.controls.element.style.opacity = 1;
					this.controls.visible = true;
				}
			}.bind(object),
			// possibly want to be able to alter keybinds here?
			// stretch goal
		};

		input.setKeyCallback(input.KEYS.C, object.controls.toggle);

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
			update: function(score, following, herdPosition){

			}
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

