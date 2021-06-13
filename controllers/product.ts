import express, { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose'
import _ from 'lodash';
import formidable,{ } from 'formidable';
import fs from 'fs';

import { Product, Products } from '../models/product';
import { Orderedproducts } from '../models/order';
import { validationResult } from 'express-validator';

//Param Get Prd
export const getProductByID = async(req:Request,res:Response,next:NextFunction,productId:Types.ObjectId)=>{
    try{
        Product.findById(productId)
        .populate("category")
        .exec((err:string,product:Products)=>{
            if(err || !product){
                return res.status(400).json({
                    error:"No Product Found"
                })
            }
            req.product = product;
            next();
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            error:"Something Went Wrong..Try again Later"
        })
    }
}

// Create Product
export const createProduct = async(req:Request,res:Response) =>{
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
            console.log(error);
            return res.json({
                error:error.array()[0].msg
            })
        }
        let form = new formidable.IncomingForm({ keepExtensions:true, maxFileSize:2*1024*1024});
        let product = new Products();

        form.parse(req,(err:string,fields,file)=>{
            if(err){
                return res.status(400).json({
                    error:"There is an issue with files"
                })
            }
            const {name, description, price, category, availableUnits} = fields
            if(
                !name ||
                !description ||
                !price ||
                !category ||
                !availableUnits
            ){
                return res.status(400).json({
                    error:"Please provide every field as they are mandatory"
                })
            }
            product.name = name, product.description=description, product.price=price
            product.category = category, product.availableUnits = availableUnits;

            /* if(file.photo.path && file.photo.type){
                console.log(file.photo.path)
                console.log(typeof(product.photo));
                console.log(typeof(product.photo.data))
                product.photo.contentType = file.photo.type
                product.photo.data = fs.readFileSync(file.photo.path);
            } */

            Product.create(product,(error:string,prd:Products)=>{
                if(error || !prd){
                    return res.json({
                        error:"Product saving Unsuccessful"
                    })
                }
                return res.json({
                    message:"Product saved successfully",
                    Product:{name, description, price}
                })
            })
            
        })

        form.on('file',(fileName,file)=>{
            if(file.path && file.type){
                product.photoType = file.type
                product.photo = fs.readFileSync(file.path);
            }
        })
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Something Went Wrong. Please check after some time"
        })
    }
}

// Get Product
export const getProduct = async(req:Request,res:Response)=>{
    try{
        const { name, description, category, availableUnits, price } = req.product
        return res.json({
            ProductSearched :{name, description, category, availableUnits, price}
        })
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Something Went Wrong. Please try again Later"
        })
    }
}

// MiddleWare for read photo
export const getPhoto = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        if(req.product.photo){
            res.set('Content-Type', req.product.photoType);
            return res.send(req.product.photo)
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Something Went Wrong"
        })
    }
}

// Delete Product
export const removeProduct = async(req:Request, res:Response)=>{
    try{
        Product.findOneAndDelete(
            {_id:req.product._id},
            (err:string, deletedPrd:Products)=>{
                if(err){
                    return res.json({
                        error:"Delete Operation Failed"
                    })
                }
                return res.json({
                    message:`Delete Operation successful for ${deletedPrd.name}`
                })
            }
        )
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Remove Product Operation stopped. Please check after some time"
        })
    }
}

// Update Product
export const updateProduct = async(req:Request, res:Response)=>{
    try{
        let form = new formidable.IncomingForm({ keepExtensions:true, maxFileSize:2*1024*1024});

        form.parse(req, (err:string,fields,file)=>{
            if(err){
                return res.status(400).json({
                    error:"There is an issue with files"
                })
            }
            const {name, description, price, category, availableUnits} = fields
            
            req.product.name = name, req.product.description=description, req.product.price=price
            req.product.category = category, req.product.availableUnits = availableUnits;

            Product.findOneAndUpdate(
                {_id:req.product._id},
                {$set:req.product},
                (err:string,updatedPrd:Products)=>{
                    if(err){
                        return res.json({
                            error:"Update Operation Failed"
                        })
                    }
                    return res.json({
                        message:`Update Operation successful for ${updatedPrd.name}`
                    })
                }
            )

        })
        form.on('file',(fileName,file)=>{
            if(file.path && file.type){
                req.product.photoType = file.type
                req.product.photo = fs.readFileSync(file.path);
            }
        })
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Update Product Operation stopped. Please check after some time"
        })
    }
}

// Get All Products
export const getAllProducts = async(req:Request, res:Response)=>{
    let limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err:string, products:Products[])=>{
        if(err){
            return res.json({
                error:"Issue with Product List !!!"
            })
        }
        return res.json(products);
    })
}

export const updateUnits = async(req:Request, res:Response, next:NextFunction)=>{
    let myUnitsUpdate = req.body.order.products.map((product:Orderedproducts) =>{
        return {
            updateOne:{
            filter:{_id:product.product},
            update:{$inc:{soldUnits:(product.quantity || 1), availableUnits:-(product.quantity || 1)}}
            }
        }
    })

    Product.bulkWrite(myUnitsUpdate, {}, (err:string, resultedPrd:Products)=>{
        if(err){
            console.log(err);
            return res.json({
                error:"Bulk Operation Failed"
            })
        }
        next();
    })
}

export const getAllUniqueCategory = (req:Request, res:Response)=>{
    Product.distinct('category', {}, (err:string, category:Types.ObjectId)=>{
        if(err){
            return res.status(400).json({
                error:"No Category Found"
            })
        }
        res.json(category);
    })
}