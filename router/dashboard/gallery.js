
const router = require ('express').Router()
const Gallery = require('../../model/gallery')




const title = " Dashboard"
const description = " Parshuram Sangharsh Samiti Gomat"

router.get('/gallery',async(req,res) => {

    const gallerys = await Gallery.find({}).sort({ _id: -1 })
    const  error= req.flash('error')
    const info = req.flash('info')
    res.render('dashboard/gallery',{title:title,description:description , error , info ,gallerys})
})

router.get('/gallery/add/',async (req,res) => {
    const  error= req.flash('error')
    const info = req.flash('info')
    res.render('dashboard/addImg',{title:title,description:description ,error,info})
    
})

router.post('/gallery/add/image',async (req,res)=>{
    const data = req.body
    const gallery = await Gallery.create(data)
    try {
        req.flash('info','Image has been added')
        res.redirect('/my-dashboard/gallery')
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('/my-dashboard/gallery')
    }
})
// router.get('/contact/:id',async (req,res) => {
// const id = req.params.id
// const  error= req.flash('error')
// const info = req.flash('info')
// const dataH = await Contact.findOne({_id:id})

// try {
//     await Contact.findOneAndUpdate({_id:dataH._id},{$set:{status:'old'}})
    
//      res.render('dashboard/singalCon',{error,info,contact:dataH})
// } catch (error) {
//     req.flash('error', error.message)
//     res.redirect('/my-dashboard/contact')
// }
// })
router.get('/gallery/delete/:id',async (req,res) => {
    const id = req.params.id
    const dataH = await Gallery.findOneAndDelete({_id:id})
    try {
        req.flash('info','Deleted !')
        res.redirect('/my-dashboard/gallery')
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/my-dashboard/gallery')
    }
    })

module.exports = router