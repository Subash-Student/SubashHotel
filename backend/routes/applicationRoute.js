import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addRecordDetails, getReocrds } from '../middleware/applicationController.js';
import multer from "multer"



const applicationRoute = express.Router();



applicationRoute.get("/get-records",authMiddleware,getReocrds);
applicationRoute.post("/add-record-details",multer().fields([
    {name:"image",maxCount:1},
    {name:"audio",maxCount:1}
]),authMiddleware,addRecordDetails);



export default applicationRoute;