import express,{ Request,Response,NextFunction } from 'express';
import { User,Users } from '../models/user';
import {check, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

//Route auth Controllers

export const signout=(req:Request,res:Response)=>{
    res.clearCookie("token");
    res.json({
        message:"signout successfull"
    })
}

export const signup=async(req:Request,res:Response)=>{
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
            console.log(error);
            return res.status(400).json({
                error:error.array()[0].msg
            })
        }
        let document = await User.create(req.body);
        //console.log(document);
        return res.json({
            message:"User signup success"
        })
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Something went wrong for Creating User"
        })        
    }
}

export const signin=async(req:Request,res:Response)=>{
    try{
        const error = validationResult(req);
        const { email, virtualPassword } = req.body;
        if(!error.isEmpty()){
            console.log(error);
            return res.status(400).json({
                error:error.array()[0].msg
            })
        }
        User.findOne({email},(errors:string, user:Users)=>{
            if(errors || !user){
                return res.status(400).json({
                    error:"email doesn't exist"
                })
            }
            if(!user.authenticate(virtualPassword)){
                return res.status(400).json({
                    error:"email and password doesn't match"
                })
            }
            if(process.env.SECRET){
                const token = jwt.sign(user.firstName,process.env.SECRET);
                res.cookie("token",token,{expires:new Date(Date.now()+(10*60*1000))});
                const {firstName, email, role,_id} = user;
                return res.json({
                    token : token,
                    user:{_id,firstName,email,role}
                })
            }
        })


    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Something went wrong with Signin process, check after some time"
        })
    }
}

const secretFrom = process.env.SECRET || 'hello';

export const isSign=expressJwt({
    secret:secretFrom,
    algorithms: ['HS256'],
    requestProperty:'auth'
})

export const isAuthenticated = (req:Request,res:Response,next:NextFunction)=>{
    let checker = req.auth && req.profile && req.profile.firstName == req.auth;
    if(!checker){
        res.status(403).json({
            error:"You are not Authorized to access this"
        })
    }
    next();
}

export const isAdmin = (req:Request,res:Response,next:NextFunction)=>{
    if(req.profile.role === 0){
        res.status(403).json({
            error:"No Admin permission to you.. ACCESS DENIED"
        })
    }
    next();
}

/* export const isSignedIn =()=> {
    if(!process.env.SECRET){
        console.log("No JWT Secret is available. Please set it first"); 
    }else{
        expressJwt({
            secret:process.env.SECRET,
            algorithms: ['HS256'],
            userProperty:'auth'
        })
    }
} */
