import {Request , Response , NextFunction} from 'express';
import { resultType } from '../global/paginationInterfaces';
import { UserModel } from '../global/userInterfaces';
import { Product } from '../modals/productModal';
import { User } from '../modals/userModal';
import { ProductModel } from './../global/productInteface'

// @description type of the function
// eslint-disable-next-line @typescript-eslint/ban-types
type FC = (model : UserModel|ProductModel )=> (req : Request , res : Response , next : NextFunction)=>void;


/**
 * function used to paginate the user
 * @param  UserModel||ProductModel model
 * @returns function (req , res , next)=> void
 * @throws token failed
 * @throws No token
 */

const paginate : FC = (model) =>{

    return async(req , res , next)=>{

        const user = (<any>req).user;
        const {categoryId : category_id} = req.params
        const {page = 1 , limit = 2 } = req.query ;
        const startIndex = (<number>page  - 1) * <number>limit;
        const endIndex =  <number>page * <number>limit;
        const result : resultType = {} as resultType;
        // change model.length to model.countDocuments() because you are counting directly from mongodb
            if (endIndex < (await model.countDocuments().exec())) {
              result.next = {
                page: <number>page + 1,
                limit: limit,
              };
            }
            if (startIndex > 0) {
              result.previous = {
                page: <number>page - 1,
                limit: limit,
              };
            }
        try{
            result.results = ((model === User) ? await User.find({ _id: { $ne: user._id } }).select("-password").limit(<number>limit).skip(startIndex): await Product.find({category_id}).limit(<number>limit).skip(startIndex));
            (<any>res).paginatedResult = result;
            next();
        }catch(err){
            res.status(500).send(
                {
                    "success": false,
                    "message": "pagination failed" ,
                    "error_code": 500,
                    "data": {}
                }
            )
        }
    }
}

export{paginate}

