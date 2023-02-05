const User = require('../../model/user')
const Blog = require('../../model/blog')
const router = require ('express').Router()
var slugify = require('slugify')

slugify('some string', {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: false,     // strip special characters except replacement, defaults to `false`
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
  })

const title = " Dashboard"
const description = " Parshuram Sangharsh Samiti Gomat"
router.get('/blogs',async (req,res) => {
   const  error= req.flash('error')
    const info = req.flash('info')
    const blog = await Blog.find({})
    res.render('dashboard/blogs',{title:title,description:description , error , info,blogs:blog  })
})

router.get('/create/blog',async (req,res)=>{
    const  error= req.flash('error')
    const info = req.flash('info')
    res.render('dashboard/composeBlogs',{title:title,description:description , error , info  })
})

router.post('/comprse/blog',async (req,res) => {
  const user = req.user
 const slug = slugify(req.body.title, {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: false,     // strip special characters except replacement, defaults to `false`
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
  })
    const data = {
 title: req.body.title,
  description:req.body.discription,
  contant: req.body.content,
  image:req.body.image,
  slugTitle:slug,
  UserName:req.body.name,
  userId:req.body.userId,
    }
    const blog = await Blog.create(data)
    if(!blog){
        req.flash('error',"somethig went wrong")
        res.redirect('/my-dashboard/blogs')
    }
    req.flash('info'," blog has been created")
    res.redirect('/my-dashboard/blogs')
})

router.get('/blogs/delete/:id',async (req,res) => {
    const id = req.params.id
    const blog = await Blog.findOneAndDelete({_id:id})
    try{
req.flash('info',"Post has been deleted successfully")
res.redirect('back')
    }
    catch(error){
        req.flash('error',error.message)
        res.redirect('back')
    }
})
router.get('/blog/edit/:id',async (req,res) => {
    const id = req.params.id
    const blog = await Blog.findOne({_id:id})

    const  error= req.flash('error')
    const info = req.flash('info')
    try{
req.flash('info',"Post has been deleted successfully")
res.render('dashboard/editBlogs',{title:title,description:description , error , info  ,blog})
    }
    catch(error){
        req.flash('error',error.message)
        res.redirect('back')
    }
})
router.post('/edit/blog/:id',async (req, res) => {
    const id = req.params.id

    const slug = slugify(req.body.title, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
      })
        const data = {
     title: req.body.title,
      description:req.body.discription,
      contant: req.body.content,
      image:req.body.image,
      slugTitle:slug,
        }
        
        const blog = await Blog.findByIdAndUpdate(id,{$set:{data}})
        console.log(blog)
        try {
            req.flash('info',"blog has been updated successfully")
            res.redirect('/my-dashboard/blogs')
        } catch (error) {
            req.flash('error',error)
            res.redirect('/my-dashboard/blogs')
        }
})




module.exports = router