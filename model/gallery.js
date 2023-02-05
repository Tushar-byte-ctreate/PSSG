const  mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  image:String,
  year:String,
},{timestamps:true}
)

module.exports = mongoose.models.Gallery || mongoose.model('Gallery', UserSchema)