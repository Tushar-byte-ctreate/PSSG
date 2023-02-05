const  mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  email: {type:String , unique:true},
  password: String,
  varify:{type:String, default:"false"},
  token:String,
  profile:{type:String, default:"https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/000000/external-user-interface-kiranshastry-lineal-color-kiranshastry-1.png"}
},{timestamps:true}
)

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)