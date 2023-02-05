
const router = require ('express').Router()
const jwt = require('jsonwebtoken')



const User = require('../../model/user')
const Contect = require('../../model/contactus')
const user = require ('./user')
const blog = require ('./blog')
const contact = require ('./contact')
const gallery = require ('./gallery')
const member = require ('./member')


router.get('*', async (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, data) {
            if (err) {
                console.log(err)
                res.locals.user = null
                next()
            } else {
                
                const userData = await User.findOne({ _id: data.id })
                
                res.locals.user = {
                    name:userData.name,
                    email:userData.email,
                    id:userData._id,
                    img:userData.profile
                }
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
});



router.use(user,blog,contact,gallery,member)

const title = " Dashboard"
const description = " Parshuram Sangharsh Samiti Gomat"
router.get('/',async(req,res) => {

     const contactus = await Contect.find({}).sort({ _id: -1 })

       const  error= req.flash('error')
       const info = req.flash('info')
    res.render('dashboard/home',{title:title,description:description , error , info ,contact:contactus })
})


module.exports = router