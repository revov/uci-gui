var express = require('express'),
    responseObjectHelper = require( '../helpers/responseObjectHelper' );

module.exports = function(passport, socketioService) {
    var router = express.Router();

    router.post('/', function(req, res) {
        // check if we have sockets opened and only then unsubscribe from them
        // else we will not be able to logout unless we had at least one socket opened
        if( req.session.socketIds ) {
            req.session.socketIds.forEach(function(socketId) {
                var socketNamespace = socketId.split('#')[0];

                if(socketioService.socketIO.nsps[socketNamespace].sockets[socketId]) {
                    console.log('disconnecting socket ' + socketId);
                    socketioService.socketIO.nsps[socketNamespace].sockets[socketId].disconnect(true);
                }
            });
        }

        req.logout();
        req.session.destroy();
        res.status(200);
        res.end();
    });

    return router;
};