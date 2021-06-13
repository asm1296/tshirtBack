import {addModelToTypegoose, getModelForClass,prop,Ref} from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose from 'mongoose';
import { Types} from 'mongoose'
import { Products } from './product';
import { Users } from './user';

export class Orderedproducts extends Base{
    @prop({required:true,ref:()=>Products})
    public product!:Ref<Products>;

    @prop({trim:true,maxlength:32})
    public name?:string;

    @prop({trim:true,maxlength:32})
    public category?:string

    @prop({trim:true,maxlength:2000})
    public description?:string

    @prop()
    public quantity?:number;

    @prop()
    public price?:number
}
export const OrderProduct = getModelForClass(Orderedproducts,{schemaOptions:{timestamps:true}});

export class Orders extends Base{
    @prop({ref:()=>Orderedproducts})
    public products?:Ref<Orderedproducts>[];

    @prop()
    transactionId?:string;

    @prop()
    public amount?:number;

    @prop()
    public address?:string;

    @prop({default:"Received", enum:["Cancelled", "Delivered", "Shipped", "Processing", "Received"]})
    public status?:string;

    @prop()
    public updated?:mongoose.Date;

    @prop({type:Types.ObjectId, ref:()=>Users})
    public user?:Ref<Users>;
}

export const Order=getModelForClass(Orders,{schemaOptions:{timestamps:true}});