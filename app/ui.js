"use strict"
//UI Manager Instance
let uiManager = (function(){
	
	let instance;
	
	function createInstance() {
		let object = new Object();
		var input = inputManager.getInstance();
		var network = networkManager.getInstance();
		var display = displayManager.getInstance();
		input.addListenerForKeys( [input.KEYS.C]);
		input.addListenerForKeys( [input.KEYS.V]);
		

		object.updatePlayerScore = function(score){
			document.querySelector("#playerScore").innerHTML = score;
		};

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
			dog: 0,
			element: document.querySelector('#startScreen'),
			validateName:function(e){ // enforces a character limit (and possibly other limits in the future) on name
				let name = e.target.value;
				if(name.length > 100){
					name = name.slice(0,100);
					e.target.value = name;
				}
			}, 
		};

		var dogicons = document.querySelector(".iconPicker").querySelectorAll('img');
		for(let i = 0; i < dogicons.length; i++){
			dogicons[i].onclick = function(e){
				dogicons.forEach(function(icon){icon.className = ""});
				e.target.className="selected";
				this.dog = e.target.name;
			}.bind(object.startScreen);
		}
		object.startScreen.nameInput.oninput = function(e){object.startScreen.validateName(e)};
		document.querySelector("#startSubmit").onclick = function(){
			player.name = this.nameInput.value;
			player.dog = this.dog;
			console.log(this.dog);
			network.joinGame({name: player.name, dog: player.dog});
			game = true;
			this.element.style.opacity = 0;
			document.querySelector("#leaderboard").style.opacity = 1;
			document.querySelector("#playerName").innerHTML = player.name;
			document.querySelector("#playerScore").innerHTML = 0;
		}.bind(object.startScreen)

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
        input.setKeyCallback(input.KEYS.V, function(){
            display.toggleShepherdLine();
        });

		object.leaderboard = {
			update: function(){
				var indices = new Array(players.length);
				for(let i = 0; i < players.length; i++) indices[i] = i;

				indices.sort(function(a,b){
					return players[b].score - players[a].score;

				});

				this.firstPlace.name.innerText = indices[0] != undefined ? getTruncatedName(playersInfo[indices[0]].name) : "";
				this.firstPlace.score.innerText = indices[0] != undefined? players[0].score : "";
				this.secondPlace.name.innerText = indices[1] != undefined? getTruncatedName(playersInfo[indices[1]].name) : "";
				this.secondPlace.score.innerText = indices[1] != undefined? players[1].score : "";
				this.thirdPlace.name.innerText = indices[2] != undefined? getTruncatedName(playersInfo[indices[2]].name) : "";
				this.thirdPlace.score.innerText = indices[2] != undefined? players[2].score : "";
				this.fourthPlace.name.innerText = indices[3] != undefined? getTruncatedName(playersInfo[indices[3]].name) : "";
				this.fourthPlace.score.innerText = indices[3] != undefined? players[3].score : "";
				this.fifthPlace.name.innerText = indices[4] != undefined? getTruncatedName(playersInfo[indices[4]].name) : "";
				this.fifthPlace.score.innerText = indices[4] != undefined? players[4].score : "";

				function getTruncatedName(name){
					var truncName = name;
					if(name.length > 20){
						truncName = name.slice(0,17)
						truncName += "...";
					}
					return truncName;
				}


			},
			firstPlace: {name: document.querySelector("#FirstPlace").querySelector(".leaderboardName"), score: document.querySelector("#FirstPlace").querySelectorAll(".leaderboardScore") },
			secondPlace: {name: document.querySelector("#SecondPlace").querySelector(".leaderboardName"), score: document.querySelector("#SecondPlace").querySelector(".leaderboardScore")},
			thirdPlace: {name: document.querySelector("#ThirdPlace").querySelector(".leaderboardName"), score: document.querySelector("#ThirdPlace").querySelector(".leaderboardScore")},
			fourthPlace: {name: document.querySelector("#FourthPlace").querySelector(".leaderboardName"), score: document.querySelector("#FourthPlace").querySelector(".leaderboardScore")},
			fifthPlace: {name: document.querySelector("#FifthPlace").querySelector(".leaderboardName"), score: document.querySelector("#FifthPlace").querySelector(".leaderboardScore")},

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

