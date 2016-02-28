/*
 * URL: [protocol]://[host]/connect/[provider]/callback
 * Ex: https://seeker.io/connect/twitter/callback 
 */
console.log('Running...');


// Hapi: Routing and Server
var Hapi = require('hapi'),
    yar = require('yar');

// Authentication
var Grant = require('grant-hapi'),
    grant = new Grant();

// Create the server
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3005
});

// Configuration
var config = require('./config.json'),
    conf = config[process.env.NODE_ENV||'development'],
    grant = new Grant(conf);

// Route for facebook
server.route({
    method: 'GET',
    path: '/handle_facebook_callback',
    handler: function(req, res) {
        console.log(req.query);
        res(JSON.stringify(req.query, null, 2));
    }
});

// Main route
server.route({
    method: 'GET',
    path: '/',
    handler: function(req, res){
      res.file('./public/index.html');    
    }
});

// Register server
server.register([require('inert'), {
    register: grant,
    options: require('./config.json')
}, {
    register: yar,
    options: {
        cookieOptions: {
            password: 'thisismypassword123456789847758483920777574637483283iksk',
            isSecure: false     
        }
    }
}], function(err){
    if (err) throw err;
    // Start server
    server.start();
    console.log('Server running at:', server.info.uri);
});
