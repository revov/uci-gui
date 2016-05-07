var express = require('express');

module.exports = function(passport, socketioService) {
    var router = express.Router();

    router.post('/', function(req, res) {
        req.session.socketIds.forEach(function(socketId) {
            var socketNamespace = socketId.split('#')[0];

            if(socketioService.socketIO.nsps[socketNamespace].sockets[socketId]) {
                console.log('disconnecting socket ' + socketId);
                socketioService.socketIO.nsps[socketNamespace].sockets[socketId].disconnect(true);
            }
        });
        
        req.logout();
        req.session.destroy();
        res.end();
    });

    return router;
};