import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getReocrds } from '../middleware/applicationController.js';




const applicationRoute = express.Router();



applicationRoute.get("/get-records",authMiddleware,getReocrds);



export default applicationRoute;