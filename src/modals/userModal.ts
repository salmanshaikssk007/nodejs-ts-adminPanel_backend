import mongoose, { Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import {IUser, IUserMethods, UserModel} from './../global/userInterfaces'


/**
 *  Model for user schema
 * */ 
const userModalSchema:Schema = new mongoose.Schema<IUser , UserModel , IUserMethods>(
    {
        username : { type : String , required : true},
        email : { type : String , required : true , unique : true },
        phone : { type : Number  , default : 0},
        password : { type : String , required : true },
        isSuperAdmin : {type : Boolean , default : false},
        isAdmin : {type : Boolean , default : false}
    },
    {
        timestamps : true
    }
)
// @description to match the passwords while login
userModalSchema.methods.matchPassword = async function (enteredPassword:string){
    return await bcrypt.compare(enteredPassword , this.password)
}
// @description to bcrypt the password
userModalSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt)
    next();
});

const User =  mongoose.model<IUser , UserModel>("User" , userModalSchema)

export {User}