const jwt = require('jsonwebtoken');
const Token = {
  encrypt:function(data,time){ //data加密数据，time过期时间
    return jwt.sign(data, 'token', {expiresIn:time})
  },
  decrypt:function(token){
    if (!token) {
      return {
        token:false
      }
    }
    try {
      let data = jwt.verify(token, 'token');
      console.log(data); // { id: '15113509470', iat: 1588345300, exp: 1589641300 }
      return {
        token:true,
        id: data.id
      };
    } catch (e) {
      return {
        token:false,
        data:e
      }
    }
  }
}
module.exports = Token;