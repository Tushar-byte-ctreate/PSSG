const  mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:String,
    image:String,
    about:String,
    slugTitle:String,
    description:String,
    position:String
},{timestamps:true}
)

module.exports = mongoose.models.Members || mongoose.model('Members', UserSchema)