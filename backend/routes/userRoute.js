import express from 'express';
import { getUser, logIn } from '../controller/userController.js';
import authMiddleware from '../middleware/auth.js';




const userRouter = express.Router();



userRouter.post("/login",logIn);
userRouter.get("/user",authMiddleware,getUser)


export default userRouter;