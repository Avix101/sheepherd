const express = require('express');
const app = express();
const server = require('http').Server(app);

const port = process.env.PORT || 5000;

const views = __dirname + "/views/";
app.use(express.static(views));

app.get("/", function(request, response/*, next */) {

	response.send("index.html");
});

server.listen(port, function(){
	console.log("herd.io launched...");
});