const router = require ('express').Router();
const Gallery = require('../../model/gallery')



var title = ''
var discription = ''

router.get('/gallery', async (req,res) => {
   title = "Gallery"
   discription = " See all Images in the gallery of all years with PSSG"

    const gallery = await Gallery.find({})
    const imgData = gallery
    try {
        res.render('gallery' ,{ error:req.flash('error')
        ,info:req.flash('info'),gallery:imgData , title,discription})
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('back')
    }
})

module.exports = router