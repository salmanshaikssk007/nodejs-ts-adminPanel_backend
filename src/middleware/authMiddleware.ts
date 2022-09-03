import {Request , Response , NextFunction} from 'express';
import * as jwt from "jsonwebtoken";
import { User } from "../modals/userModal";

// @description type of the function 
type authFC = (req : Request , res : Response , next : NextFunction)=>void

/**
 * function used to check access for the inner routes
 *
 * @param  Request req
 * @param  Response res
 * @param  NextFunction next
 * @throws token failed
 * @throws No token
 */

const authenticate:authFC = async(req ,res ,next)=>{

    let token ;
   
    if(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")){
            try{
                token = req.headers.authorization.split(" ")[1]
                const decoded = jwt.verify(token, <string>process.env.JWT_KEY) ;
                (<any>req).user = <object> await User.findById((<any>decoded)._id).select("-password"); 
                next()
            }catch(error){
                res.send(
                    {
                        "success": false,
                        "message": "token failed",
                        "error_code": 401
                    }
                );
                 throw new Error("Not authorized, token failed");
            }
        }
        if(!token){
            res.status(401).send(
                {
                    "success": false,
                    "message": "no token",
                    "error_code": 401
                }
            );
             throw new Error("Not authorized, no token");
        }
}

export {authenticate}