import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../global/categoryInterfaces';


/**
 * Category Schema
 */

const CategorySchema : Schema= new mongoose.Schema(
    {
        category_name : {type : String , required : true , unique : true} ,
        products : [{type : mongoose.Schema.Types.ObjectId , ref:"Product" , default:[]}]
    },
    {
        timestamps : true
    }
)

const Category = mongoose.model<ICategory>("Category" , CategorySchema);

export{Category}