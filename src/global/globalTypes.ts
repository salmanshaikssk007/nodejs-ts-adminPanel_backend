import {Request ,Response} from 'express'

// @description types for all controller functions
type fnType = (req:Request , res:Response)=>void;

export{fnType}
