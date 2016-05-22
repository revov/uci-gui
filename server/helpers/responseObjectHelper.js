function getResponseObject( status, message, data ) {
    return {
        status: status,
        message: message,
        data: data
    };
};

module.exports = {
    getSuccessResponseObject: function( message, data ) {
        return getResponseObject( 200, message, data );
    },
    getCreatedResponseObject: function( message, data ) {
        return getResponseObject( 201, message, data );
    },
    getNotFoundResponseObject: function( message, data ) {
        return getResponseObject( 400, message, data );
    },
    getUnauthorizedResponseObject: function( message, data ) {
        return getResponseObject( 401, message, data );
    }
};