const router = require ('express').Router();
const Blog = require('../../model/blog')


var title = ''
var discription = ''

router.get('/blog',async (req,res) => {


    title = "PSSG Blogs"
    discription = "PSSG Blogs know about them"
    const blogs = await Blog.find({})
    res.render('blog/blog' ,{ error:req.flash('error')
    ,info:req.flash('info'),blogs:blogs, title,discription})
})
router.get('/blog/:slug', async(req,res) =>{
    const slug = req.params.slug
    const blogs = await Blog.findOne({slugTitle:slug})
    title = blogs.title
    discription = blogs.discription

    if(!blogs){
        req.flash('error',"somethig went wrong, please report us")
        res.redirect('back')
    }
    res.render('blog/singleBlog' ,{ error:req.flash('error')
    ,info:req.flash('info'),blog:blogs, title,discription})
})
module.exports = router