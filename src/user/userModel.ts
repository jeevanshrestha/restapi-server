import mongoose, { Mongoose }  from "mongoose";
import { User } from "./userTypes";

//Define schema

const userSchema = new mongoose.Schema<User>({

    name: {
        type:String,
        required:true
        },
    email: {
        type:String,
        required:true,
        unique:true,
        },
    password:{
        type:String,
        required:true,

        }, 
    },
    {timestamps: true}
    
);

export default mongoose.model<User>('User', userSchema)
 