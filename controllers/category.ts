import express,{Request,Response,NextFunction} from 'express';
import {Types} from 'mongoose';
import { Category,Categories } from '../models/category';

export const getCategoryByID = async(req:Request,res:Response,next:NextFunction,id:Types.ObjectId)=>{
    try{
        Category.findById(id,(err:string,category:Categories)=>{
            if(err || !category){
                return res.status(400).json({
                    error:"NO Category Found"
                })
            }
            req.category = category;
            next();
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            error:"Something Went Wrong..Please Try Again"
        })
    }
}

export const createCategory = async(req:Request,res:Response)=>{
    try{
        let category = await Category.create(req.body);
        return res.json(category);

    }catch(error){
        console.log(error)
        return res.json({
            error:"Something Went Wrong...Please try again"
        })
    }
}

export const getCategory =(req:Request,res:Response)=>{
    return res.json(req.category)
}

export const getAllCategories = async(req:Request,res:Response)=>{
    try{
        Category.find().exec((err:string,categories:Categories[])=>{
            if(err || !categories){
                return res.json({
                    error:"NO categories found"
                })
            }
            res.json(categories);
        })
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Someting Went Wrong..No categories Received. Try again later"
        })
    }
}

export const updateCategory = async(req:Request, res:Response)=>{
    try{      
        Category.findOneAndUpdate(
            {_id:req.category._id},
            {$set:{name:req.body.categoryName}},
            {new:true},
            
            (err:string,updatedCategory:Categories)=>{
                if(err || !updatedCategory){
                    return res.json({
                        error:err
                    })
                }
                return res.json(updatedCategory)
            }
        )
    }
    catch(error){
        console.log(error);
        return res.json({
            error:"Something Went Wrong..Try Again Later"
        })
    }
}

// Delete Category
export const removeCategory = async(req:Request, res:Response)=>{
    try{
        Category.findOneAndDelete(
            {_id:req.category._id},
            (err:string,deletedCategory:Categories)=>{
                if(err || !deletedCategory){
                    return res.json({
                        error:"Delete operation failed"
                    })
                }
                return res.json({
                    message:`Successfull Deleted ${deletedCategory.name}`
                })
            }
        )
    }
    catch(error){
        console.log(error);;
        return res.json({
            error:"Something Went Wrong.. Try Again Later"
        })
    }
}