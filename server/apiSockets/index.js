module.exports = function(socketioService) {
    // Handle default namespace
    socketioService.applyMiddleware(socketioService.socketIO);

    socketioService.socketIO.use(function(socket, next) {
        if(socket.request.isAuthenticated()) {
            return next();
        }

        next(new Error('Authentication error'));
    });
   
    // Handle the rest of our namespaces
    require ('./game')(socketioService);
};