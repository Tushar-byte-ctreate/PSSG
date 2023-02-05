const router = require ('express').Router();
const Member = require ('../../model/memeber')

var title = ''
var discription = ''
router.get('/members', async (req,res) => {
    title = 'Members'
    discription = ' Here is all our Members'
    const members = await Member.find({})
    res.render('members' ,{ error:req.flash('error')
    ,info:req.flash('info'),members,title,discription})
})
router.get('/member/:id',async (req,res) => {
    const id = req.params.id
    const member = await Member.findOne({_id:id})

    title = member.name
    discription = member.discription
    res.render('mProfile',{ error:req.flash('error'),info:req.flash('info'),member ,title,discription})
})
module.exports = router