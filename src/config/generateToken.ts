import jwt = require("jsonwebtoken")

// @description types for generateFn
type genFn = (id : object)=>string|undefined

/**
 * function used to generate Token
 *
 * @param  Object id
 * @return String|Undefined
 */

const generateToken:genFn = (id) =>{
    const secertKey = process.env.JWT_KEY
    return jwt.sign({_id : id} , <string>secertKey , {expiresIn : '24h'})
}

export {generateToken}