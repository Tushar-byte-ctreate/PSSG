const express = require("express");
const path = require("path");
const ejs = require("ejs");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');

const flash = require('connect-flash')
const session = require('express-session')

const bodyParser = require('body-parser');

// request All files here
const app = express();



dotenv.config();


//   app.use(cookieParser('keyboard cat'));
app.use(session({
    secret:process.env.SESSION_SECRET,
    secure:"true",
    resave:true,
    saveUninitialized:true,
    
}))
    app.use(flash());
    app.use(cookieParser())
//   app.use(flash());

//   app.use(function (req, res, next) {
//     res.locals.session = req.session;
//     next();
//   });

mongoose.set('strictQuery', true);
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
mongoose.connect('mongodb+srv://iam_tushar:' + process.env.PASS_WORD + '@cluster0.9uywv.mongodb.net/PSSG').then(() => { console.log('db connected') }).catch(err => console.log(err))
// app.use("/static", path.join(__dirname, "static"));


app.use(express.static((__dirname, 'public')));
app.use("/dashCss", express.static(__dirname + "/public/dashCss"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/images", express.static(__dirname + "/public/images"));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.resolve('./public')));


// router file import 
const home = require('./router/client/home')
const contactus = require('./router/client/contact')
const User = require('./model/user')
const gallery = require('./router/client/gallery')
const dashboard = require('./router/dashboard/dashBoard')
const adminAuth = require('./admin')





app.get('*', async (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function (err, data) {
            if (err) {
                console.log(err)
                res.locals.user = null
                res.locals.dash=null
                next()
            } else {
                
                const userData = await User.findOne({ _id: data.id })


                if(userData.email === process.env.ADMIN_EMAIL){
                   res.locals.dash = "/my-dashboard"
                }else{
                    res.locals.dash = null
                }
                
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
        res.locals.dash = null
        res.locals.user = null
        next()
    }
});


app.use('/my-dashboard', adminAuth, dashboard)

// using router files 


app.use(home)
app.use(contactus);
app.use(gallery)




const port = '3000' || process.env.PORT

app.listen(port, (req, res) => {
    console.log("you are running a posrt 3000")
})
