import express, {Request, Response, NextFunction} from 'express';
import { Types, Collection } from 'mongoose';
import { Order, OrderProduct, Orders, Orderedproducts} from '../models/order';


//param getOrderbyID
export const getOrderById = async(req:Request, res:Response, next:NextFunction, orderId:Types.ObjectId)=>{
    try{
        let order = await Order.findById(orderId).populate("products").populate("user", "_id email")
        req.order = order;
        next();
    }
    catch(error){
        console.log(error)
        return res.json({
            error:"Read request for order failed"
        })
    }
}

// route create OrderProduct

export const createOrdPrd = async(req:Request, res:Response,next:NextFunction)=>{
        let myCreateObj = req.body.order.products.map((prod:Orderedproducts)=>{
            return {
                insertOne:{
                    document:prod
                }
            }
        })

        OrderProduct.bulkWrite(myCreateObj, {}, (err:string, resultedPrd:{insertedIds:[]})=>{
            if(err || !resultedPrd){
                return res.json({
                    message:"Bulk create order product is failed"
                })
            }
            req.body.order.products = Object.values(resultedPrd.insertedIds);
            next();
        })
}

//route create Order
export const createOrder = (req:Request, res:Response, next:NextFunction)=>{
        req.body.order.user = req.profile;
        let order = new Order(req.body.order);
        Order.create(order, (err:string, newOrder:Orders)=>{
            if(err){
                return res.status(400).json({
                    error:"Save Order Operation failed"
                })
            }
            req.body.order = newOrder;
            next();
            //return res.json(newOrder)
        })
}

//route read order 
export const getAllOrders = (req:Request, res:Response)=>{
    Order.find()
    .populate("user", "_id email")
    .populate("products")
    .exec((err:string, allOrders:Orders)=>{
        if(err){
            return res.status(400).json({
                error:"Read Operation failed"
            })
        }
        return res.json(allOrders)
    })
}

// Read all orders of User
export const getMyOrders = (req:Request, res:Response)=>{
    Order.find(
        {user:req.profile._id},(err:string,myOrders:Orders)=>{
            if(err || !myOrders){
                console.log(err);
                return res.status(400).json({
                    error:"Issue with fetching orders"
                })
            }
            return res.json(myOrders)
        })
}

// Route Read Single Product
export const getOrderPlaced = (req:Request, res:Response)=>{
    return res.json(req.order);
}

//route read status
export const getOrderStatus = (req:Request, res:Response)=>{
    //
}

///update status
export const updateStatus = (req:Request, res:Response)=>{
    Order.findOneAndUpdate(
        {_id:req.body.orderId},
        {$set:{status:req.body.status}},
        (err:string, updatedOrder:Orders)=>{
            if(err){
                return res.status(400).json({
                    error:"Update Operation Failed"
                })
            }
            res.json(updatedOrder)
        }
    )
}

