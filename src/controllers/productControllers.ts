import mongoose, { ObjectId } from "mongoose";
import { fnType } from "../global/globalTypes";
import { resultType } from "../global/paginationInterfaces";
import { IProduct } from "../global/productInteface";
import { Category } from "../modals/categoryModal";
import { Product } from "../modals/productModal";

//@description     create a Product
//@route           POST /api/v1/products/:categoryId
//@access          Public

/**
 * create a product
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws please enter all the details
 * @throws product already exist
 * @throws creating new product failed
 */

const createProduct : fnType = async(req , res)=>{

    const {categoryId:category_id} = req.params;
    const {product_name , product_desc , product_price , product_quantity }:IProduct = req.body
    if(!product_name || !product_price || !product_quantity){
        res.status(400).send(
            {
                "success": false,
                "message": "Enter all the fields",
                "error_code": 400,
                "data": {}
            }
        ) 
        throw new Error('Please enter all the details')
    }
    const productExists = await Product.findOne({product_name})

    if(productExists){
        res.status(400).send(
            {
                "success": false,
                "message": "Product already exists",
                "error_code": 400,
                "data": {}
            }
        )
        throw new Error('product already exists')
    }
    const product = await Product.create({
        product_name ,
        product_desc ,
        product_price ,
        product_quantity ,
        category_id
    })
    if(category_id){
        const category = await Category.findById(category_id)
        category?.products.push(product)
        await category?.save()
    }
    if(product){
        res.status(201).send(
            {
                "success" :true ,
                "message" : "product created" ,
                "data" : product
            }
        )
    }else{
        res.status(401).send(
            {
                "success": false,
                "message": "Creating new product failed",
                "error_code": 401,
                "data": {}
            }
        )
        throw new Error('user not created')
    }
   
}

//@description     update a Product
//@route           PUT /api/v1/products/:productId
//@access          Public

/**
 * update a product
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws edit any of the fields
 * @throws product already exists
 */

const updateProduct : fnType = async(req,res)=>{

    const {productId : _id} =(<any> req).params ;
    const product = <any> await Product.findById(_id);
    const {product_name : updatedName , product_desc : updatedDesc , product_price : updatedPrice , product_quantity : updatedQuantity , category_id:updatedId}:IProduct = req.body;

    if(!updatedName && !updatedDesc && !updatedPrice && !updatedQuantity && !updatedId){
        res.status(400).send(
            {
                "success" : false ,
                "message" : "edit any of the field" ,
                "error_code" : 400 
            }
        )
        throw new Error('Error : enter any of the field')
    }

    const existingProductCheck = await Product.findOne({product_name : updatedName})

    if( existingProductCheck && updatedName !== product.product_name){
        res.status(400).send(
            {
                success : false ,
                error_code : 400 ,
                message : "product already exists"
            }
        )
        throw new Error('Error : product already exists')
    }

    product.product_name = updatedName;
    product.product_desc = updatedDesc?updatedDesc : product.product_desc;
    product.product_price = updatedPrice?updatedPrice : product.product_price;
    product.product_quantity = updatedQuantity?updatedQuantity : product.product_quantity;

    if(updatedId && await Category.findById(updatedId)){

        // removing product from existing category
        const existingCategory = <any> await Category.findById(product.category_id)
        const reStructureProducts = existingCategory.products.filter((product: { _id: ObjectId })=> String(product._id) !== _id);
        existingCategory.products = reStructureProducts;
        await existingCategory.save()
        // adding it to new category
        product.category_id = updatedId
        const category = await Category.findById(product.category_id)
        category?.products.push(product)
        await category?.save()
    }

    const updatedProduct = await product.save();

    res.status(200).send(
        {
            "success" : true ,
            "message" : "product got updated" ,
            "data" : updatedProduct
        }
    )
}

//@description     delete a Product
//@route           DELETE /api/v1/products/:productId
//@access          Public

/**
 * delete a product
 *
 * @param  Request req
 * @param  Response res
 * @return void
 */

const deleteProduct : fnType = async(req,res)=>{

    const {productId : _id } = req.params ;
    const product = await Product.findById(_id)

     // removing product from existing category
     const existingCategory = <any> await Category.findById(product?.category_id)
     const reStructureProducts = existingCategory.products.filter((product: { _id: ObjectId })=> String(product._id) !== _id);
     existingCategory.products = reStructureProducts;
     await existingCategory.save()

    await Product.deleteOne({_id : _id})
    res.status(200).send(
        {
            "success" : true ,
            "message" : `Product  got deleted` ,
        }
    )
}

//@description     search a Product
//@route           GET /api/v1/products?search=
//@access          Public

/**
 * search a product
 *
 * @param  Request req
 * @param  Response res
 * @return void
 */

const searchProducts : fnType = async(req,res) => {

    const keyword = req.query.search
    ? {
        $or: [
          { product_name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

    const products = await Product.find(keyword)
    res.status(200).send(
        {
            "success" : true ,
            "message" : "Search completed" ,
            "data" : products
        }
    )
}
//@description     paginated the Products data
//@route           GET /api/v1/products/paginate:categoryId?limit=&page=
//@access          Public

/**
 * paginate the products data
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws no data arrived for pagination
 */

const paginatedData : fnType = (req,res) => {

    const pageObject  = <resultType>((<any>res).paginatedResult)

    if(!pageObject){
        res.status(400).send(
            {
                "success" : false ,
                "message" : "no data arrived for pagination" ,
                "error_code" : 400 
            }
        )
        throw new Error ("Error : no data arrived for pagination")
    }
    res.status(200).send(
        {
            "success" : true ,
            "message" : "paginated Data arrived" ,
            "data" : pageObject.results
        }
    )
}

//@description     sort the data based on creation date , price on category data
//@route           GET /api/v1/products/sort/:categoryId?date=&price=
//@access          Public

/**
 * sort the products data based on creation date(recent or old ) , price(High to low , low to high)
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws no data from products
 */

const sortData : fnType = async(req , res) => {

    const {date = 'recent' , price = 'low_to_high'} = req.query ;
    const {categoryId : _id} = req.params
 
    console.log(date,price);
    let products ;
    
    if(date ==='recent' && price === 'low_to_high'){
        products = await Product.find({category_id : _id }).sort({"product_price":1})
    }else if (date === 'recent' && price === 'high_to_low'){
        products = await Product.find({category_id : _id}).sort({"product_price":-1})
    }else if (date === 'old' && price === 'low_to_high'){
        products = await Product.find({category_id : _id}).sort({"createdAt":-1})
    }else if (date === 'old' && price === 'high_to_low'){
        products = await Product.find({category_id : _id}).sort({"createdAt":-1}).sort({"product_price":-1})
    }

    //  if(!products){
    //     res.send(
    //         {
    //             "success" : false ,
    //             "message" : "no data from products" ,
    //             "error_code" : 400 
    //         }
    //     )
    //     throw new Error("Error : no data from products")
    // }

    res.status(200).send(
        {
            "success" : true ,
            "message" : "Data been sorted as required" ,
            "data" : products 
        }
    )
}
//@description     filter the data based on created date  , price on category data
//@route           GET /api/v1/products/filter/:categoryId
//@access          Public

/**
 * filter the data based on created date  , price
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws no data from products
 */

const filteredData : fnType = async(req,res) => {
    
    const {lowPrice = 0 , highPrice = Number.MAX_SAFE_INTEGER , startDate = new Date(2020 , 1 , 1) , endDate = new Date() } = req.body;
    const {categoryId : category_id} = req.params;
    const price = {$gte : lowPrice , $lte : highPrice}
    const filterDate = {$gte : new Date(startDate)  , $lte : new Date(endDate) }
    const products = await Product.find({category_id , product_price : price , createdAt : filterDate});
    console.log(filterDate);
    console.log(products);
    
    if(!products){
        res.send(
            {
                "success" : false ,
                "message" : "no data from products" ,
                "error_code" : 400 
            }
        )
        throw new Error("Error : no data from products")
    }
    res.status(200).send(
        {
            "success" : true ,
            "message" : "Data been filtered as required" ,
            "data" : products 
        }
    )
} 
const getAllProduct : fnType = async (req,res) =>{
    const products = await Product.find();
    res.status(200).send(
        {
            "success" : true ,
            "message" : "got all the data" ,
            "data" : products
        }
    )
}
export {filteredData , sortData , createProduct ,deleteProduct , searchProducts ,paginatedData , updateProduct , getAllProduct}