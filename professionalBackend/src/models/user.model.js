import mongoose , {Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import brcypt from 'bcrypt';
import { use } from 'react';

const userSchema=new Schema(
    {
        userName:{
            type:String,    
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String,
            required:true,
        },
        coverImage:{
            type:String,
        },
        watchHistory:{
            type:Schema.Types.ObjectId,
            ref:'video',
        },
        password:{
            type:String,
            required:[true,'password is required'],
            minlength:[6,'password must be at least 6 characters'],
        },
        refreshToken:{
            type:String,
        },
    },
    {timestamps:true}
)

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=await brcypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect=async function(Password){
    return await brcypt.compare(Password,this.password);
}   

userSchema.methods.generateaccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN || '1d',
        },
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN || '10d',
        },
    )
}

export const User=mongoose.model('User',userSchema);