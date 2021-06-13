import { getModelForClass,prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import * as crypto from 'crypto';
import { v1 as uuidv1} from 'uuid';


export class Users extends Base{
    @prop({required:true,trim:true,maxlength:32})
    public firstName!: string;

    @prop({trim:true,maxlength:32})
    public lastName?:string;

    @prop({required:true,unique:true,trim:true})
    public email!:string;

    @prop({trim:true})
    public userInfo?:string;

    @prop({required:true})
    public securePassword!:string;

    @prop()
    public salt?:string;

    @prop({default:0})
    public role?:number;

    @prop({type:String,default:[]})
    public purchases?:string[];

    @prop()
    private _pwd?: string;

    public set virtualPassword(password:string){
        this._pwd = password;
        this.salt = uuidv1();
        this.securePassword = this.encryptPwd(password);
    }
    public get virtualPassword(){
        if(!this._pwd){
            return "";
        }
        return this._pwd;
    }

    public authenticate(password:string){
        return this.encryptPwd(password) === this.securePassword;
    }

    public encryptPwd(password:string){
        if(!password || !this.salt){
            return "";
        }
        try {
            const hash=crypto.createHmac('sha256',this.salt)
                            .update(password)
                            .digest('hex');
            return hash;
            
        } catch (error) {
            return "";
        }
    }
    
}

export const User = getModelForClass(Users,{schemaOptions:{timestamps:true}});

