const jwt = require('jsonwebtoken');
const {secretKey} = require('../config/jwtConfig');
 
function generateToken(user){
   
    const payload = {
        id:user._id,
        userName : user.firstName+user.lastName,
        email:user.email
    }
    return jwt.sign(payload,secretKey,{expiresIn:'24h'});
};
module.exports = {
    generateToken
}