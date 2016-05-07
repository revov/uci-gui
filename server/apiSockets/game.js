module.exports = function(socketioService) {
    var gameNamespace = socketioService.socketIO.of('game');
    
    socketioService.applyMiddleware(gameNamespace);

    gameNamespace.use(function(socket, next) {
        if(socket.request.isAuthenticated()) {
            return next();
        }

        next(new Error('Authentication error'));
    });
    
    gameNamespace.on('connection', function(socket) {
        socket.on('subscribe', function(gameId) {
            // TODO: run a db query to verify that the user is not trying to subscribe to a game he can't see.
            socket.join(gameId);
        });
        socket.on('unsubscribe', function(gameId) {
            socket.leave(gameId);
        });
    });
};