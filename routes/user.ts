import express,{ Request, Response, NextFunction} from 'express';

import { getUser,getUserByID,updateUser,userPurchaseList } from '../controllers/user';
import { isSign,isAuthenticated } from '../controllers/authentication';
import { Users } from '../models/user';

const router = express.Router();

router.use((req:Request,res:Response,next:NextFunction)=>{
    req.profile = new Users();
    next();
})

router.param("userId",getUserByID);

router.get("/user/:userId", isSign, isAuthenticated, getUser);

router.put('/user/:userId', isSign,isAuthenticated, updateUser);

router.get("/orders/user/:userId", isSign, isAuthenticated, userPurchaseList);

export default router;