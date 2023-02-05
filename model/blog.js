const  mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  title: String,
  description: {type:String , unique:true},
  contant: String,
  image:{type:String,default:'https://th.bing.com/th/id/OIP.Zm40oDDzRm_QjjejHTH35AHaFc?pid=ImgDet&rs=1'},
  slugTitle:String,
  UserName:{type:String},
  userId:String,
},{timestamps:true}
)

module.exports = mongoose.models.Blog || mongoose.model('Blog', UserSchema)