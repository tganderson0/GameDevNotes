// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
'use strict';

let present = require('present');
let Player = require('./player');

const UPDATE_RATE_MS = 500;
let quit = false;
let activeClients = {};
let inputQueue = [];
let lastUpdateTime = present();

//------------------------------------------------------------------
//
// Process the network inputs we have received since the last time
// the game loop was processed.
//
//------------------------------------------------------------------
function processInput() {
    //
    // Double buffering on the queue so we don't asynchronously receive inputs
    // while processing.
    let processMe = inputQueue;
    inputQueue = [];

    for (let inputIndex in processMe) {
        let input = processMe[inputIndex];
        let client = activeClients[input.clientId];
        client.lastMessageId = input.message.id;
        switch (input.message.type) {
            case 'thrust':
                // Need to compute the difference since the last update and when the thrust
                // input was received.  This time difference needs to be simulated before the
                // thrust input is processed in order to keep the client and server thinking
                // the same thing about the player's ship.
                client.player.thrust(input.message.elapsedTime, input.receiveTime - lastUpdateTime);
                lastUpdateTime = input.receiveTime;
                break;
            case 'rotate-left':
                client.player.rotateLeft(input.message.elapsedTime);
                break;
            case 'rotate-right':
                client.player.rotateRight(input.message.elapsedTime);
                break;
        }
    }
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime) {
    for (let clientId in activeClients) {
        activeClients[clientId].player.update(elapsedTime, false);
    }
}

//------------------------------------------------------------------
//
// Send state of the game to any connected clients.
//
//------------------------------------------------------------------
function updateClients(elapsedTime) {
    for (let clientId in activeClients) {
        let client = activeClients[clientId];
        let update = {
            clientId: clientId,
            lastMessageId: client.lastMessageId,
            momentum: client.player.momentum,
            direction: client.player.direction,
            position: client.player.position,
            updateWindow: elapsedTime
        };
        if (client.player.reportUpdate) {
            client.socket.emit('update-self', update);

            //
            // Notify all other connected clients about every
            // other connected client status...but only if they are updated.
            for (let otherId in activeClients) {
                if (otherId !== clientId) {
                    activeClients[otherId].socket.emit('update-other', update);
                }
            }
        }
    }

    for (let clientId in activeClients) {
        activeClients[clientId].player.reportUpdate = false;
    }
    lastUpdateTime = present();
}

//------------------------------------------------------------------
//
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
    processInput();
    update(elapsedTime);
    updateClients(elapsedTime);

    if (!quit) {
        setTimeout(() => {
            let now = present();
            gameLoop(now, now - currentTime);
        }, UPDATE_RATE_MS);
    }
}

//------------------------------------------------------------------
//
// Get the socket.io server up and running so it can begin
// collecting inputs from the connected clients.
//
//------------------------------------------------------------------
function initializeSocketIO(httpServer) {
    let io = require('socket.io')(httpServer);

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the arrival of this
    // new client.  Plus, tell the newly connected client about the
    // other players already connected.
    //
    //------------------------------------------------------------------
    function notifyConnect(socket, newPlayer) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (newPlayer.clientId !== clientId) {
                //
                // Tell existing about the newly connected player
                client.socket.emit('connect-other', {
                    clientId: newPlayer.clientId,
                    momentum: newPlayer.momentum,
                    direction: newPlayer.direction,
                    position: newPlayer.position,
                    rotateRate: newPlayer.rotateRate,
                    thrustRate: newPlayer.thrustRate,
                    size: newPlayer.size
                });

                //
                // Tell the new player about the already connected player
                socket.emit('connect-other', {
                    clientId: client.player.clientId,
                    momentum: client.player.momentum,
                    direction: client.player.direction,
                    position: client.player.position,
                    rotateRate: client.player.rotateRate,
                    thrustRate: client.player.thrustRate,
                    size: client.player.size
                });
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the disconnect of
    // another client.
    //
    //------------------------------------------------------------------
    function notifyDisconnect(playerId) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (playerId !== clientId) {
                client.socket.emit('disconnect-other', {
                    clientId: playerId
                });
            }
        }
    }
    
    io.on('connection', function(socket) {
        console.log('Connection established: ', socket.id);
        //
        // Create an entry in our list of connected clients
        let newPlayer = Player.create()
        newPlayer.clientId = socket.id;
        activeClients[socket.id] = {
            socket: socket,
            player: newPlayer
        };
        socket.emit('connect-ack', {
            momentum: newPlayer.momentum,
            direction: newPlayer.direction,
            position: newPlayer.position,
            size: newPlayer.size,
            rotateRate: newPlayer.rotateRate,
            thrustRate: newPlayer.thrustRate
        });

        socket.on('input', data => {
            inputQueue.push({
                clientId: socket.id,
                message: data,
                receiveTime: present()
            });
        });

        socket.on('disconnect', function() {
            delete activeClients[socket.id];
            notifyDisconnect(socket.id);
        });

        notifyConnect(socket, newPlayer);
    });
}

//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {
    initializeSocketIO(httpServer);
    gameLoop(present(), 0);
}

//------------------------------------------------------------------
//
// Public function that allows the game simulation and processing to
// be terminated.
//
//------------------------------------------------------------------
function terminate() {
    this.quit = true;
}

module.exports.initialize = initialize;
