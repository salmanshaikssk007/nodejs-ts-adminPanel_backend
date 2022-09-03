import mongoose, { Schema } from 'mongoose'
import { IProduct, ProductModel } from '../global/productInteface'

/**
 * Schema of the products
 */

const productSchema : Schema = new mongoose.Schema<IProduct >(
    {
        product_name : {type : String , required: true , unique : true} ,
        product_desc : {type : String , default : 'No description to show'},
        product_price : {type : Number , required: true},
        product_quantity : {type : Number , required : true} ,
        category_id : {type :mongoose.Schema.Types.ObjectId , ref:"Category" } 
    },{
        timestamps : true
    }
)

const Product = mongoose.model<IProduct , ProductModel>("Product" ,productSchema );

export{Product}