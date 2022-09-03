import { Model } from "mongoose";

// @description interface for the usermodal

interface IUser {
    username: string;
    email: string;
    phone?: number ;
    password : string;
    isSuperAdmin : boolean ;
    isAdmin : boolean ;
}
// interface for user methods
interface IUserMethods  {
    matchPassword  (ePassword : string): Promise<boolean>
}
// put all the instances methods in the interface
// eslint-disable-next-line @typescript-eslint/ban-types
type UserModel = Model<IUser , { } , IUserMethods>

export {IUser , IUserMethods , UserModel}