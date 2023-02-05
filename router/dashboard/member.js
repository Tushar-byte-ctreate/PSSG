
const router = require ('express').Router()
const Member = require('../../model/memeber')
const slugify = require('slugify')



const title = " Dashboard"
const description = " Parshuram Sangharsh Samiti Gomat"
router.get('/member',async(req,res) => {

    const contactus = await Member.find({})
    const  error= req.flash('error')
    const info = req.flash('info')
    res.render('dashboard/member',{title:title,description:description , error , info ,members:contactus})
})

router.get('/create/member',(req,res) => {
    res.render('dashboard/createMember',{idData:''})
})
router.post('/member/craete',async (req, res) => {
    const id = req.params.id

    const slug = slugify(req.body.name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
      })
        const data = {
       name: req.body.name,
       description:req.body.discription,
       about: req.body.about,
       image:req.body.image,
       slugTitle:slug,
       position:req.body.position
        }
        const blog = await Member.create(data)
        console.log(blog)
        try {
            req.flash('info',"Member has been created successfully")
            res.redirect('/my-dashboard/member')
        } catch (error) {
            req.flash('error',error)
            res.redirect('/my-dashboard/member')
        }
})

router.get('/member/edit/:id',async (req,res) => {
const id = req.params.id
const idData = await Member.findById(id)
    res.render('dashboard/createMember', {idData})
})
router.post('/member/edit/:id',async (req, res) => {
    const id = req.params.id
    const slug = slugify(req.body.name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
      })
        const data = {
     name: req.body.name,
      description:req.body.discription,
      about: req.body.about,
      image:req.body.image,
      position:req.body.position,
      slugTitle:slug,
        }
       
        
        const blog = await Member.findByIdAndUpdate(id,{$set:{data}})
       
        try {
            req.flash('info',"Member data has been updated successfully")
            res.redirect('/my-dashboard/member')
        } catch (error) {
            req.flash('error',error)
            res.redirect('/my-dashboard/member')
        }
})
router.get('/member/delete/:id',async (req,res) => {
    const id = req.params.id
    const dataH = await Member.findOneAndDelete({_id:id})
    try {
        req.flash('info','Deleted !')
        res.redirect('/my-dashboard/member')
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/my-dashboard/member')
    }
    })

module.exports = router