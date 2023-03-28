const router = require('express').Router()
const User = require('../../model/user')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer')





let transporter = nodemailer.createTransport({
    service: ' Gmail', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  });
  


  router.get('/forget/password',(req,res)=>{

    const error= req.flash('error')
    const info = req.flash('info')
    res.render('forgetEmail',{error,info})
  })

router.post('/password/email/auth',async (req,res)=>{
const email = req.body.email
const uid = uuidv4();
const user = await User.findOneAndUpdate({email: email},{$set:{token:uid}})

if(!user){
    req.flash('error'," User dose not exist with this email address")
    res.redirect('back')
}

var mailOptions = {
    to: user.email,
    from: '"PSSG" <PSSG.noreply>',
    subject: 'Password Forget',
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/reset/auth/' + uid + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  };
  transporter.sendMail(mailOptions, function (err) {
    console.log('email')

    if(err){
      
        req.flash('info', 'Something went wront ,Plz try After sometime');
        res.redirect('back')
    }
    
    req.flash('info', 'An e-mail has been sent to ' + user.email + '.');
    res.redirect('back')
  });

})


router.get('/reset/auth/:uid',(req,res)=>{
    const uid = req.params.uid;
    const error= req.flash('error')
    const info = req.flash('info')
    res.render('forgetPass',{uid ,error,info})
})


  router.post('/reset/auth/:uid' ,async (req, res) => {
    
    const uid = req.params.uid 
    const password  = req.body.password
    const cPass = req.body.cPass
    console.log(password)
    let hash = "";
    const salt = await bcrypt.genSalt(12);
    hash = await bcrypt.hash(password, salt);

    const checkUser = await User.findOne({token:uid})
    if(!checkUser){
        req.flash('error',"You are not Validate for this request")
        res.redirect('/login')
    }
  
    if(password === cPass) {
       
      const user = await User.findOneAndUpdate({_id:checkUser._id},{$set:{password:hash},token:"123"})
      if(!user){
  
        req.flash('error',"something went wrong, try after some time ")
        res.redirect('back')
      }else{
  
      req.flash('info',"Password has been update successfully")
      console.log('password has been update"')
      res.redirect('back')}
    }else{
  
    req.flash('error',"Password dose not macthed")
    console.log('password dose not matched "')
    res.redirect('back')}
  
  })


module.exports = router