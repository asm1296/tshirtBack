import express,{Request, Response, NextFunction} from 'express';

const router = express.Router();

import {isSign, isAuthenticated} from '../controllers/authentication';
import {getUserByID} from '../controllers/user';
import {getToken, processPayment} from '../controllers/payment';

router.param('userId', getUserByID);

router.get('/payment/getToken/:userId',isSign,isAuthenticated, getToken);

router.post('/payment/processPayment/:userId', isSign,isAuthenticated,processPayment);

export default router;