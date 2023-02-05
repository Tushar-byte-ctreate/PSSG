const router = require('express').Router()
const User = require('../../model/user')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer')



// router.use(cookieParser({
//   name: 'sessions',
//   keys: 'dwdhkwhkbfkjshkjwbsiugwf',
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))








let transporter = nodemailer.createTransport({
  service: ' Gmail', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
});


const generateAccessToken = (user) => {
  // jwt will make sure to expire this token in 1 hour
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    'expiresIn': '1h'
  })
}
const validateToken = async (token, tokenSecret) => {
  // returns user info, if the jwt token is valid
  return await jwt.verify(token, tokenSecret,
    (error, payload) => {
      if (error) {

        throw (error)
      }
      return payload



    })
}
const validateAccessToken = async (req, res, next) => {
  // returns user info, if the jwt token is valid
  try {
    req.user = await validateToken(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    next();
  }
  catch (error) {
    res.status(401).
      json({ error: error.message || 'Invalid access token' })
  }
}
// const validateRefreshToken = async (req, res, next) => {
//   try {
//     req.user = await validateToken(req.body['refreshToken'], process.env.REFRESH_TOKEN_SECRET)
//     next();
//   }
//   catch (error) {
//     res.status(401).
//       json({ error: error.message || 'Invalid refresh token' })
//   }
// }
const title = " Login/Resister"
const description = " Parshuram Sangharsh Samiti Gomat"

router.get('/login', (req, res) => {
      const error= req.flash('error')
      const info = req.flash('info')
  res.render('login', { title: title, description: description,error,info })
})



router.post("/ragister", async (req, res) => {
  const { email, password, name } = req.body;
  let hash = "";
  const salt = await bcrypt.genSalt(12);
  hash = await bcrypt.hash(password, salt);

  const uid = uuidv4();

  const user = await User.create({ email, password: hash, name, token: uid })

  let info = await transporter.sendMail({
    from: '"Register on PSSG 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Ragister on PSSG✔", // Subject line
    text: 'Hi' + name + 'You are receiving this because you (or someone else) are Ragister for your account on PSSG .\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/verify/' + uid + '\n\n' +
      'If you did not request this, please ignore this email .\n' // plain text body
    // html body
  });

  transporter.sendMail(info, function (err) {
    if (err) console.log(err), req.flash('error', err.message), res.redirect('back')
    console.log('sent')
    req.flash('info', "We have sent a email to you for email verification")
    res.redirect('back')
  });


})


router.get('/verify/:uid', async (req, res) => {

  const uid = req.params.uid
  const data = {
    token: 'varified',
    verify: 'true'
  }
  const user = await User.updateOne({ token: uid }, { $set: { data } })
  console.log(user)
  if (!user) res.redirect('back')
  res.render('verify')
})


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email })

     if(!user){
      req.flash('error','email is incorrect please enter correct email')
      res.redirect('back')
      } else{

        const matchPassword = await bcrypt.compare(password, user.password)

        if(!matchPassword){
          req.flash('error','password is incorrect please enter correct email')
          res.redirect('back')
        }

      else{


        const accessToken = jwt.sign({ username: user.email, name: user.name, id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
          'expiresIn': '1h'
        })
        res.cookie('jwt', accessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7 // 1 week
        }).redirect('/')

      }

    }
  // authentication - checking if password is correct

})
router.get('/hello', (req, res) => {
  const tokens = req.headers['Cookie'];
  const token = tokens.split(' ')[1]
  console.log(token)
  res.send(token)
})

router.post('/change/password/:id', validateAccessToken ,async (req, res) => {
  const  id = req.params.id
  const password  = req.body.password
  const cPass = req.body.cPass
  console.log(password)
  let hash = "";
  const salt = await bcrypt.genSalt(12);
  hash = await bcrypt.hash(password, salt);

  if(password === cPass) {
     
    const user = await User.findOneAndUpdate({_id:id},{$set:{password:hash}})
    if(!user){

      req.flash('error',"something went wrong, try after some time ")
      res.redirect('back')
    }else{

    req.flash('info',"Password has been update successfully ")
    console.log('password has been update"')
    res.redirect('back')}
  }else{

  req.flash('error',"Password dose not macthed ")
  console.log('password dose not matched "')
  res.redirect('back')}

})

router.get('/token', validateAccessToken, (req, res) => {
  // generating new access token, once the refresh token is valid and exists in db
  // const { username } = req.user;
  const cooki = req.cookies.jwt
  console.log(cooki)

})

router.get("/logout", async (req, res) => {
  // deleting  token from db 
  res.cookie('jwt', "", { maxAge: 1 }).redirect('/login')
})


// router.post('/register', async (req,res) => {
// const user = req.body
//  const register = await User.create(user)
//  if(!register) res.send('somthing went wrong')
//  res.send(register)
// console.log(user)
// })


router.post('/forgot/password/', (req, res) => {

  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ username: req.body.username }, function (err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/login/auth-user/');
        }

        user.token = token;
        user.tokenExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      console.log(user + "one")
      var mailOptions = {
        to: user.username,
        from: '"HotelStudy" <hotelstudy.noreply>',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function (err) {
        console.log('email')
        req.flash('info', 'An e-mail has been sent to ' + user.username + '.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) console.log(err);
    res.redirect('/login/auth-user')
      ;
  });

})
router.get('/reset/:token', function (req, res) {

  const token = req.params.token

  User.findOne({ Token: req.params.token, tokenExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {

      req.flash('error', 'Password reset token is invalid or has expired.');

      return res.redirect('/login/auth-user');

    } else {

      res.render('changePass', {
        token: token,
        title: "Password",
        description: "password changed",
        massege: req.flash('info')
      });
    }

  });
});
router.post('/reset/', async function (req, res) {

  const token = req.body.token;



  if (!req.body.password == req.body.rePassword) {
    req.flash('error', "Password does not match")
    res.redirect('back')
  } else {
    const user = await User.findOne({ Token: token, tokenExpires: { $gt: Date.now() } })
    try {
      await user.setPassword(req.body.password)
      user.Token = undefined;
      user.tokenExpires = undefined;
      await user.save()

      var mailOptions = {
        to: user.username,
        from: '"HotelStudy" <hotelstudy.noreply>',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function (err) {


      });
      req.flash('info', 'Success! Your password has been changed.');
      res.redirect('/login/auth-user')


    } catch (error) {
      console.log(error)
      req.flash("error", 'something went wrong')
      res.redirect('/login/auth-user')
    }

  }


});


module.exports = router