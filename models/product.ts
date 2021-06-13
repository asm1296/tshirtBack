import {getModelForClass,prop, Ref} from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import * as mongoose from 'mongoose';
import { Categories } from './category';

/* export class Photo{
    @prop()
    public data?:Buffer

    @prop()
    public contentType?:string
} */

export class Products extends Base{

    @prop({required:true,trim:true,maxlength:32})
    public name!:string;

    @prop({required:true,trim:true,maxlength:2000})
    public description!:string;

    @prop({required:true})
    public price!:number;

    @prop({required:true,ref:()=>Categories})
    public category!:Ref<Categories>;

    @prop()
    public availableUnits?:number;

    @prop({default:0})
    public soldUnits?:number;

    @prop({required:true})
    public photo!:Buffer

    @prop({required:true})
    public photoType!:string

    /* @prop({default:{data:null,contentType:null}})
    public photo!:{data:Buffer,contentType:string} */

    /* @prop({required:true})
    public photo!:Photo */

    /* @prop({required:true, type:()=> Photo})
    public photo!:Photo[] */
}

export const Product = getModelForClass(Products,{schemaOptions:{timestamps:true}})
