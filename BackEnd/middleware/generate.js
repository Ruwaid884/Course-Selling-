const jwt = require('jsonwebtoken');

const GenerateJwt = (user,secretkey)=>{
    const payload = {username: user.username};
    return jwt.sign(payload,secretkey,{expiresIn:'1h'});
    };

    module.exports = {
        GenerateJwt
    }