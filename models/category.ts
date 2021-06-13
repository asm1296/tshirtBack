import {getModelForClass,prop} from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class Categories extends Base{
    @prop({required:true,unique:true,trim:true,maxlength:32})
    public name!:string;
}

export const Category = getModelForClass(Categories,{schemaOptions:{timestamps:true}});
