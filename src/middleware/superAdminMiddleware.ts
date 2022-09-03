import {Request , Response , NextFunction} from 'express';
import { IUser } from '../global/userInterfaces';

// @description type of the function 
type authFC = (req : Request , res : Response , next : NextFunction)=>void

/**
 * function used to is user super admin or not
 *
 * @param  Request req
 * @param  Response res
 * @param  NextFunction next
 */

const superAdminAuth : authFC = (req,res,next)=>{

    const user = <IUser>(<any>req).user;
    if(!user.isSuperAdmin){
        res.status(401).send(
            {
                "success": false,
                "message": "is not super admin",
                "error_code": 401
            }
        )
    }
    next();
}

export{superAdminAuth}
