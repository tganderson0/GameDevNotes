'use strict';

let net = require('net');
const port = 3000;

function handleRequest(connection) {
	connection.on('data', function(data) {
		console.log(data.toString());
		connection.write('Hi Mom!');
		connection.end();
	});
}

net.createServer(handleRequest).listen(port, function() {
	console.log(`Server is listening on port ${port}`);
});
