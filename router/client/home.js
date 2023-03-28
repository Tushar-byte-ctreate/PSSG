const router = require ('express').Router()

const Member = require ('../../model/memeber')

const login = require('../../router/client/login-auth')
const members = require('../../router/client/member')
const user = require('../../router/client/user')
const blog = require('../../router/client/blog')
const forgetPass = require('../../router/client/forgetPass')

router.use(login)
router.use(members)
router.use(user)
router.use(blog)
router.use(forgetPass)

const title = " PSSG - Home"
const description = " Parshuram Sangharsh Samiti Gomat"
router.get('/',async (req,res) => {

    const  error= req.flash('error')
    const info = req.flash('info')
    const members = await Member.find({})
   
    res.render('home',{title:title,description:description , error , info, members  })
})

router.get('/two/',(req,res) =>{
    res.send(req.flash('error'))
})

router.get('/qr/code',(req,res) =>{

    const  error= req.flash('error')
    const info = req.flash('info')
    res.render('qrcode',{title:title,description:description , error , info, members })
})

module.exports = router