import express,{ Request,Response } from 'express';
import {signout, signup, signin,isSign} from '../controllers/authentication';
import { check } from 'express-validator';

const router = express.Router();

//Routes

router.post('/signup',[
    check('firstName').isLength({min:3}).withMessage('First Name must be having 3 characters'),
    check('email').isEmail().withMessage('Please enter valid email ID'),
    check('virtualPassword').isLength({min:8}).withMessage('Password must be 8 characters')
], signup)

router.post('/signin',[
    check('email').isEmail().withMessage('Please enter valid email ID'),
    check('virtualPassword').isLength({min:8}).withMessage('Password must be 8 characters')
], signin)

router.get('/signout', signout);

router.get('/testRoute', isSign, (req:Request,res:Response)=>{
    res.json({
        message:req.auth
    })
})


export default router;