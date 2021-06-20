import { Types } from "mongoose";
import { Categories } from "../../models/category";
import { Users } from "../../models/user";
import { Products } from '../../models/product';
import Formidable from "formidable";
import { Orderedproducts, Order } from '../../models/order'


    declare module 'Formidable'{
        export interface Fields{
            name:string; 
            description:string;
            price:number;
            category:any;
            availableUnits:number
        }
    }
