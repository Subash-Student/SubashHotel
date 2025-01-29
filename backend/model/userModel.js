import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:8},
    defaultRecords:{type:Array,default:[]}
})

const userModal = mongoose.model.user || mongoose.model("user",userSchema);

export default userModal;