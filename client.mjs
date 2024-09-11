import io from 'socket.io-client';

// const socket = io("https://myap_name.herokuapp.com"); // to connect hosted server on heroku
const socket = io("http://localhost:3001"); // to connect with locally running Socker.io server


///////////////////////////// connection events /////////////////////////////
socket.on('connect', function () {
    console.log("connected")
});

socket.on('connect_error', (error) => {

    if (socket.active) {
        // temporary failure, the socket will automatically try to reconnect
        console.log('event connect_error: temprory disconnection occured');
    } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect

        console.error('Connection Error:', error.message);
        if (error.message.includes('Authentication')) {
            console.log('Authentication failed.');
        } else if (error.message.includes('Timeout')) {
            console.log('Connection timed out. Please check your internet connection.');
            // Optionally attempt to reconnect
            socket.connect();
        } else {
            console.log('An unexpected error occurred. Please try again later.');
            socket.connect();
        }
    }
});

socket.on('disconnect', function (reason, details) {

    if (socket.active) {
        // temporary disconnection, the socket will automatically try to reconnect
        console.log('event disconnect: temprory disconnection occured');
    } else {
        // the connection was forcefully closed by the server or the client itself
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log("Socket disconnected from server: ", reason);
        socket.connect();
    }

    switch(reason){
        case 'io server disconnect':
            console.log('The server has forcefully disconnected the socket with socket.disconnect()');
        case 'io client disconnect':
            console.log('The socket was manually disconnected using socket.disconnect()');
        case 'ping timeout':
            console.log('The server did not send a PING within the pingInterval + pingTimeout range	');
        case 'transport close':
            console.log('The connection was closed (example: the user has lost connection, or the network was changed from WiFi to 4G)');
        case 'transport error':
            console.log('The connection has encountered an error (example: the server was killed during a HTTP long-polling cycle)');
    }

    if (reason === 'io server disconnect') {
        // Server closed the connection
        console.log('The server closed the connection.');
    } else if (reason === 'transport close') {
        // Transport (e.g., WebSocket) was closed
        console.log('The connection was closed.');
    } else {
        console.log('Disconnected from the server.');
    }
});

///////////////////////////// connection events /////////////////////////////

// to subcribe to a topic
socket.on('6657032430c884e3d9d91e5a-online', function (data) {
    console.log(data);
});


// Handle custom errors sent from the server
socket.on('error', function (error) {
    console.log("Socket disconnected from server: ", message);
    if (error.type === 'validation') {
        console.error('There was a validation error: ' + error.message);
    } else if (error.type === 'server') {
        console.error('Server error: ' + error.message);
    } else {
        console.error('An error occurred: ' + error.message);
    }
});

// setTimeout(() => {
//     console.log("attemptimg to disconnect from server");
//     socket.close(); //force disconnect from server
// }, 3000)