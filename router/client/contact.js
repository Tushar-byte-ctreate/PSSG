const router = require ('express').Router();
const Contect = require ('../../model/contactus')
var flash = require('connect-flash');
router.use(flash());
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "hotelstudy.com",
 service:'gmail',
  auth: {
    user:process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
});



var title = ''
var discription = ''

// router.get('/hs/about',(req,res)=>{
//     res.render('aboutus')
//   })
//   router.get('/about', async(req, res)=>{
//     const about = await Company.findOne({title:"About Us"})


//     const title = "About" || "HotelStudy"
//     res.render('aboutus',{title : title,description:"About Pages",data:about,user:req.user})
// })
router.get('/contact/us',(req,res)=>{
    const title = "contact" || "PSSG"
    res.render('contact',{title : title,description:"contact us", info:req.flash('info'),error:req.flash('error')})
})
// router.get('/terms/condition',async(req,res)=>{
//   const tnc = await Company.findOne({title:"Terms and Condition"})
//   const title = "contact" || "HotelStudy"
//   res.render('aboutus',{title:'T&C',description:"",data : tnc,user:req.user})
// })
// router.get('/privecy-policy/',async(req,res)=>{
//   const title = "privecy policy" || "HotelStudy"
//   const pp = await Company.findOne({title:"Privacy Policy"})
//   res.render('aboutus',{title:title,description:"",data:pp,user:req.user})
// })
router.get('/developer',async(req,res)=>{
  const title = "Developer" 
 
  res.render('dev',{title:title,description:""})
})
router.post('/contect/us', async(req,res)=>{
  const date = new Date().toLocaleDateString();
    const data ={
      name:req.body.name,
      email:req.body.email, 
      message:req.body.message,
      date:date
    };
                            
    console.log(data)
    const saveData =  await Contect.create(data);
    var mailOptions = {
      to: req.body.email,
      from: '"PSSG Contact Us"<hotelstudy.noreply>',
      subject: 'Contect US',
      text: 'Hi '+req.body.name +' ,\n\n' +
        ' Thanks! for contect us. We will contact to you soon..\n\n'+
        'Regarding... \n.'+
        'PSS Gomat team \n'+
        'Utter Pradesh'
    };
    transporter.sendMail(mailOptions, function(err) {
    });
    var mailOptions = {
      to: "thisistusharkumar@gmail.com",
      from: '"PSSR Contact us"<hotelstudy.noreply>',
      subject: 'Contect US['+req.body.name+']',
      text: 'Hi '+req.body.name +' just fill the form ,\n\n' +
        ' his/her email address is ' + req.body.email+'\n\n'+
        ' message ' + req.body.message+'\n\n'+
        'Regarding... \n.'+
        'PSS Gomat team \n'+
        'Utter Pradesh'
        
    };
    transporter.sendMail(mailOptions, function(err) {
    });
    console.log(saveData)
      req.flash('info',"Form submitted")
      let returnTo = 'back'
      res.redirect(returnTo);
})

module.exports = router