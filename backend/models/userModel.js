const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ObjectId=mongoose.Types.ObjectId;

const users=new Schema({
    email:{type:String,unique:true},
    password:String,
    username:{type:String,required: true}
});

const userModel=mongoose.model("User", users);
module.exports={
    userModel
};