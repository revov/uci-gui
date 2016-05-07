var express = require('express');

module.exports = function(passport, socketioService) {
    var router = express.Router();

    router.post('/', function(req, res) {
        // FIXME: clean all namespaces
        req.session.socketIds.forEach(function(socketId) {
            if(socketioService.socketIO.sockets.sockets[socketId]) {
                console.log('disconnecting socket ' + socketId);
                socketioService.socketIO.sockets.sockets[socketId].disconnect(true);
            }
        });
        
        req.logout();
        req.session.destroy();
        res.end();
    });

    return router;
};