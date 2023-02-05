const router = require('express').Router();
const jwt = require('jsonwebtoken')
const User = require('../../model/user')
// const Convert = require("mongo-image-converter")

//check user middelware





const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, data) {
            if (err) {
                console.log(err)
                req.flash('error', 'please login first')
                res.redirect('/')
            } else {
                next()
            }
        })

    } else {
        req.flash('error', 'please login first')
                res.redirect('/')
    }
}

router.get('/my-profile/:id', checkUser ,(req, res) => {
    


    
    res.render('userProfile', {
        error: req.flash('error')
        , info: req.flash('info'),
        title:"user profile",
        discription:''
    })
})
//getting image shere and stor into the databse
router.post('/edit/images/:id',checkUser , async (req, res) => {
    const id = req.params.id
    const img = req.body.imgData

  const user = await User.findOneAndUpdate({_id:id},{$set:{profile:img}})
  
  if(!user){
    req.flash('error', "something went wrong, try again later")
    console.log("error")
    res.redirect('back')
  }
  req.flash('info', "images has been changed successfully")
  console.log("done")
  res.redirect('back')   
})
//remove the images from the database 
router.post('/remove/images/:id',async (req,res)=>{
    const id = req.params.id
    const user = await User.findOneAndUpdate({_id: id},{$set:{profile:""}})
    if(!user){
        req.flash('error',"something went wrong")
        res.redirect('back')
    }
  req.flash('info',"image has  been deleted ")
        res.redirect('back')
})
//change the nam of user
router.post('/change/name/:id',checkUser , async (req, res) => {
    const id = req.params.id
    const user = await User.findOneAndUpdate({ _id: id }, { $set: { name: req.body.name } })
    console.log(user, id)
    req.flash('info', "Name has been changed ")
    res.redirect('back')
})
// chnage password 
module.exports = router