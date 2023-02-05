var jwt = require('jsonwebtoken');
const User = require('../model/user')
const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, data){
if (err){
console.log(err)
res.locals.user = null
next()
}else{
    const userData = await User.findOne({_id:data._id})
    res.locals.user = userData
next()
}
        })

    }else{
        next()
    }
}
module.exports = {checkUser}