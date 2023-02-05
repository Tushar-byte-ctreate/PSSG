
const router = require ('express').Router()
const Contact = require('../../model/contactus')




const title = " Dashboard"
const description = " Parshuram Sangharsh Samiti Gomat"
router.get('/contact',async(req,res) => {

    const contactus = await Contact.find({}).sort({ _id: -1 })
    const  error= req.flash('error')
    const info = req.flash('info')
    res.render('dashboard/contacts',{title:title,description:description , error , info ,contactus})
})
router.get('/contact/:id',async (req,res) => {
const id = req.params.id
const  error= req.flash('error')
const info = req.flash('info')
const dataH = await Contact.findOne({_id:id})

try {
    await Contact.findOneAndUpdate({_id:dataH._id},{$set:{status:'old'}})
    
     res.render('dashboard/singalCon',{error,info,contact:dataH})
} catch (error) {
    req.flash('error', error.message)
    res.redirect('/my-dashboard/contact')
}
})
router.get('/contact/delete/:id',async (req,res) => {
    const id = req.params.id

    const dataH = await Contact.findOneAndDelete({_id:id})
    
    try {
        req.flash('info','Deleted !')
        res.redirect('/my-dashboard/contact')
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/my-dashboard/contact')
    }
    })

module.exports = router