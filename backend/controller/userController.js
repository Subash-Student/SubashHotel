
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator"
import CryptoJS from "crypto-js";
import dotenv from 'dotenv';
import userModal from "../model/userModel.js";
dotenv.config(); 









export const logIn = async(req,res)=>{

    const {userName,password} = req.body;
    let user;

    if(validator.isEmail(userName)){
        const email = userName;
        try {
           user = await userModal.findOne({email}); 
        } catch (error) {
            console.log(error);
        }
    }else{
        const mobile = userName;
        try {
           user = await userModal.findOne({mobile}); 
        } catch (error) {
            console.log(error);
        }
    }


    if(!user){
        return res.json({success:false,message:"User Does't Exist!"});
    }

    const isMatch = await bcrypt.compare(password,user.password);
    
    if(!isMatch){
        return res.json({success:false,message:"Password does't match"});

    }

    const token = createToken(user._id);
    const encryptedToken = setEncryptedToken(token);
   

    return res.status(200).json({success:true,token:encryptedToken,message:"Successfully loged in"});

}




export const getUser = async (req, res) => {
    const userId = req.id;
    try {
        const user = await userModal.findById(userId, "-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
















const createToken = (id)=>{
    return jwt.sign({id},process.env.SECRETKEY1,{
    });
}

export function setEncryptedToken(token) {
    const encryptedToken = CryptoJS.AES.encrypt(token, process.env.SECRETKEY2).toString();
    return encryptedToken;
  }