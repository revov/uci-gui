var responseObjectHelper = require( '../helpers/responseObjectHelper' );

module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json(responseObjectHelper.getUnauthorizedResponseObject( 'Unauthorized', {} ));
        res.end();
    }
};