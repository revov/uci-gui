module.exports = function (socketIO, sessionMiddleware, passportMiddleware, passportSessionMiddleware) {
    
    return {
        socketIO: socketIO,
        applyMiddleware: function(socketIoNamespace) {
            socketIoNamespace.use(function(socket, next) {
                sessionMiddleware(socket.request, socket.request.res, next);
            });
            socketIoNamespace.use(function(socket, next) {
                passportMiddleware(socket.request, socket.request.res, next);
            });
            socketIoNamespace.use(function(socket, next) {
                passportSessionMiddleware(socket.request, socket.request.res, next);
            });

            socketIoNamespace.on("connection", function(socket){
                // Save socket IDs in session so that we can close them when user logs out
                if(!socket.request.session.socketIds) {
                    socket.request.session.socketIds = [];
                }
                socket.request.session.socketIds.push(socket.id);
                socket.request.session.save();
            });
        }
    }
};