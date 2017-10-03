module.exports.info = function(string){
	console.log(string);
}

module.exports.notify = function(string){	
	console.log("\x1b[36m%s\x1b[0m", string);
};

module.exports.success = function(string){
	console.log("\x1b[32m%s\x1b[0m", string);
};

module.exports.error = function(string){
	console.log("\x1b[31m%s\x1b[0m", string);
};

module.exports.magic = function(string){
	console.log("\x1b[35m%s\x1b[0m", string);
};