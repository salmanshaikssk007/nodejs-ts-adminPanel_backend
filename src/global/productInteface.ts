import { Model } from "mongoose"

// @description interface for the productmodal

interface IProduct {

    product_name : string ,
    product_price : number ,
    product_desc : string ,
    product_quantity : number ,
    category_id : object
    
}
type ProductModel = Model<IProduct>

export{IProduct , ProductModel}