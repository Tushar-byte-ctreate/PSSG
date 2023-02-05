  
  const jwt = require('jsonwebtoken')
  const User = require('./model/user')
  
const  adminAuth = async (req, res, next)=> {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, data) {
            if(err) return res.redirect('/')
            const user =await User.findOne({ _id: data.id })
            if(user.email === process.env.ADMIN_EMAIL){
               return  next()
            }
           return res.redirect('/')
        })

    }else{
        return res.redirect('/') 
    }
}


module.exports = adminAuth