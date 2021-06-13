import express,{Request,Response,NextFunction} from 'express';
import { Types } from 'mongoose';
import { User,Users } from '../models/user';
import { Order,Orders,Orderedproducts } from '../models/order';

export const getUserByID = async(req:Request,res:Response,next:NextFunction,userId:Types.ObjectId) =>{
    try{
        const user = await User.findById(userId)
        //console.log(user);
        if(!user){
            return res.status(400).json({
                error:"No User Found"
            })
        }
        else{
            const { firstName,email,role,_id} = user;
            if(role === 0 || role === 1){
                req.profile._id = _id;
                req.profile.firstName = firstName;
                req.profile.email = email;
                req.profile.role = role
                //console.log(req.profile);
                next();
            }
        }
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Something went wrong with User ID route"
        })
    }
}

export const getUser = (req:Request,res:Response)=>{
    res.json(req.profile)
}

export const updateUser = async(req:Request,res:Response)=>{
    try{
        User.findByIdAndUpdate(
            {_id:req.profile._id},
            {$set:req.body},
            {new:true, useFindAndModifty:false},
            (err:string,user:Users)=>{
                if(err){
                   return res.status(400).json({
                        error:"Update Operation failed for User"
                    })
                }
                user.securePassword="";
                user.virtualPassword="";
                user.salt="";
                return res.json({
                    user:user,
                    message:"Update Successful for User"
                })
            }
        )
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            error:"Something went wrong with Update operation"
        })
    }
}

export const userPurchaseList = async(req:Request,res:Response)=>{
    try{
        Order.find({user:req.profile._id})
        .populate("user","_id email")
        .populate("products")
        .exec((err:string,order: Orders)=>{
            if(err){
                return res.status(400).json({
                    error:"NO Orders found for this user account"
                })
            }

            res.json(order);
        })

    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            error:"Something went wrong.. with Order-user List"
        })
    }
}

export const pushOrderInPurchaseList = async(req:Request,res:Response,next:NextFunction)=>{
    let purchaseArr:any = [];
    /* req.body.order.products.forEach((item:Orderedproducts)=>{
        purchaseArr.push({
            _id:item._id,
            name:item.name,
            description:item.description,
            category:item.category,
            quantity:item.quantity,
            amount:item.amount,
            transactionId:req.body.order.transactionId
        })
    }) */
    purchaseArr.push(req.body.order._id);

    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchaseArr}},
        {new:true},
        ((err:string,user:Users)=>{
            if(err || !user){
                return res.status(400).json({
                    error:"Unable to Save orders in User's Purchases"
                })
            }
            return res.json(req.body.order)
            //next();
        })
    )
}