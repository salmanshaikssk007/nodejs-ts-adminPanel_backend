import { IProduct } from "./productInteface"
import { IUser } from "./userInterfaces"

// types for result object
interface resultType {
    results : Array<IUser|IProduct>
    next : object ,
    previous : object
}

export{resultType}