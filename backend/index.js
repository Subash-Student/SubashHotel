import express from "express";
import connectDB from "./config/db.js";
import cors from "cors"
import userModal from "./model/userModel.js";
import bcrypt from "bcrypt"
import userRouter from "./routes/userRoute.js";

const app = express();
const PORT = 5000;


// CONNECT DB

connectDB()



// MIDDLEWARE

app.use(express.json())
app.use(cors())


// Dynamic CORS Configuration
// const allowedOrigins = [
//  
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,POST,PUT,DELETE,PATCH',
//   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
//   credentials: true,
// };
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Handle preflight



// ROUTES

app.use("/api",userRouter);


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
