import express from "express";
import connectDB from "./config/db.js";
import cors from "cors"
import userModal from "./model/userModel.js";
import bcrypt from "bcryptjs"
import userRouter from "./routes/userRoute.js";
import applicationRoute from "./routes/applicationRoute.js";

const app = express();
const PORT = 5000;


// CONNECT DB

connectDB()



// MIDDLEWARE

app.use(express.json())
app.use(cors({
    origin: "https://subash-hotel.vercel.app", // React app origin
    credentials: true,
  }));




// ROUTES

app.use("/api",userRouter);
app.use("/api",applicationRoute)
app.get("/",(req,res)=>{
    res.send("hello world")
})
// CREATE THE SERVER

app.listen(PORT,()=>{
    console.log(`Server start at http://localhost:${PORT}`)
})









// ADD ADMIN 

app.post("/api/register",async(req,res)=>{

    const {name,password,email,mobile}=req.body;
   
    const getSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,getSalt);

    const newData = userModal({
        name,
        email,
        password:hashedPassword,
        mobile
    })
   await newData.save();
  if(newData) res.json({success:true,message:"ok!"});
})
