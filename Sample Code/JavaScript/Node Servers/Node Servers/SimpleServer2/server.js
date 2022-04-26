'use strict';

let http = require('http');
const port = 3000;

function handleRequest(request, response) {
	response.writeHead(200);
	response.end('Hi Mom!');
}

http.createServer(handleRequest).listen(port, function() {
	console.log(`Server is listening on port ${port}`);
});
