var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String
});

UserSchema.methods.isValidPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.setPassword = function(password){
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = mongoose.model('User',UserSchema);