
const router = require ('express').Router()
const User = require('../../model/user')
const title = " Dashboard"
const description = " Parshuram Sangharsh Samiti Gomat"
router.get('/user',async (req,res) => {
    const users = await User.find({})
    try {
        const  error= req.flash('error')
    const info = req.flash('info')
    res.render('dashboard/user',{title:title,description:description , error , info, myUser:users })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('back')
    }
})

router.get('/user/delete/:id',async (req,res) => {
    const id = req.params.id
    const user = await User.findOneAndDelete({_id:id})
    try {
        req.flash('info', ' User Deleted !')
        res.redirect('/my-dashboard/user')
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/my-dashboard/user')
    }
    })


module.exports = router