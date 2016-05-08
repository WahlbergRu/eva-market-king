var serverFactory = require('spa-server');

var server = serverFactory.create({
    path: './app/',
    port: 5000,
    fallback: {
        'text/html' : 'index.html'
    }
});

server.start();
 