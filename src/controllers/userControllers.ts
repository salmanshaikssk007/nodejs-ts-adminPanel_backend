import {User} from './../modals/userModal'
import {generateToken} from './../config/generateToken'
import {IUser} from './../global/userInterfaces'
import { resultType } from '../global/paginationInterfaces';
import { fnType } from '../global/globalTypes';

//@description     Register new user
//@route           POST /api/v1/user/
//@access          Public

/**
 * creates an user 
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws Enter all fields
 * @throws user already exists
 * @throws user not created
 */
const createUser:fnType  = async (req  , res)=>{

    const {username , email , phone , password , isAdmin , isSuperAdmin}:IUser = req.body;
    
    if(!username || !email  || !password || !(isAdmin || isSuperAdmin)){
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
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400).send(
            {
                "success": false,
                "message": "User already exists",
                "error_code": 400,
                "data": {}
            }
        )
        throw new Error('user already exists')
    }

    const user = await User.create({
        username , 
        email ,
        phone , 
        password ,
        isAdmin ,
        isSuperAdmin
    })

    if(user){
        res.status(201).send(
            {
                "success" :true ,
                "message" : "user created" ,
                "data" : {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    phone : user.phone,
                    isAdmin : user.isAdmin ,
                    isSuperAdmin : user.isSuperAdmin ,
                    token: generateToken(user._id),
                }
            }
        )
    }else{
        res.status(401).send(
            {
                "success": false,
                "message": "Creating new user failed",
                "error_code": 401,
                "data": {}
            }
        )
        throw new Error('user not created')
    }
}

//@description     Authenticate  user
//@route           POST /api/v1/user/login
//@access          Public

/**
 * authenticates user 
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws Enter all the fields
 * @throws user doesn't exist
 */

const authUser:fnType = async(req  , res )=>{

    const {email , password}:IUser= req.body ;
    if(!email || !password){
        res.status(400).send(
            {
                "success" : false ,
                "message" : "enter all the fields" ,
                "error_code" : 400 ,
                "data" : {}
            }
        )
        throw new Error('Error : enter all the fields')
    }
    const user = await User.findOne({email});
    if(user && await user.matchPassword(password)){
        res.status(202).send(
            {
                "success" : true ,
                "message" : "User logged in" ,
                "data" : {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    phone : user.phone,
                    isAdmin : user.isAdmin ,
                    isSuperAdmin : user.isSuperAdmin ,
                    token: generateToken(user._id),
                }
            }
        )
    }else{
        console.log('logged');
        
        res.send(
            {
                "success" : false ,
                "message" : "user doesn't exist" ,
                "error_code" :401 ,
                "data" : {}
            }
        )
        throw new Error("Error : user doesn't exist")
    }

}

//@description     Updates  user
//@route           PUT /api/v1/user:requiredUserId
//@access          Public

/**
 * Updates the User by superAdmin
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws enter all the fields
 */

const updateUser:fnType =async (req , res)=>{

    const { requiredUserId : _id  } = req.params;
    const user = <any>await User.findById(_id)    
    const { username : updatedName , phone : updatedPhone , isSuperAdmin :updatedSuperAdminStatus , isAdmin : updatedAdminStatus}:IUser = req.body
    if(!updatedName && !updatedPhone && !updatedSuperAdminStatus && !updatedAdminStatus){
        res.send(
            {
                "success" : false ,
                "message" : "edit any of the field" ,
                "error_code" : 400 
            }
        )
        throw new Error('Error : enter any of the field')
    }
    user.username = updatedName?updatedName :user.username ;
    user.phone = updatedPhone?updatedPhone:user.phone ;
    user.isSuperAdmin = updatedSuperAdminStatus;
    user.isAdmin = updatedAdminStatus;
    const newUser = await user.save()
    res.status(200).send(
        {
            "success" : true ,
            "message" : "User got updated" ,
            "data" : newUser
        }
    )
}

//@description     deletes the  user
//@route           DELETE /api/v1/user:requiredUserId
//@access          Public

/**
 * deletes the User 
 *
 * @param  Request req
 * @param  Response res
 * @return void
 */
const deleteUser:fnType = async(req , res) =>{
    
    const { requiredUserId   } = req.params;
    await User.deleteOne({_id : requiredUserId})
    res.status(200).send(
        {
            "success" : true ,
            "message" : `User  got deleted` ,
        }
    )

} 
//@description     search for the  user
//@route           GET /api/v1/user?search=
//@access          Public

/**
 * get or search for the Users
 *
 * @param  Request req
 * @param  Response res
 * @return void
 */
const searchUser:fnType = async(req , res)=>{

    const user  = (<any>req).user;
    const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
    
    const users = await User.find(keyword).find({ _id: { $ne: user._id } });
    res.status(200).send(
        {
            "success" : true ,
            "message" : "Search completed" ,
            "data" : users
        }
    )
}

//@description     paginate the data from the modal
//@route           GET /api/v1/user/paginated?limit=&page=
//@access          Public

/**
 * paginate the user data
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws 
 */
const paginatedData : fnType = async(req,res)=>{

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
//@description     sorting data based on time
//@route           GET /api/v1/user/sort?search=
//@access          Public

/**
 * sort the data according to the creation date (recent , old)
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws nodata from users
 */
const sortData : fnType = async(req,res)=>{

    const user = (<any>req).user
    const keyword = req.query.search;
    let users;
    if(keyword === 'recent'){
        users = await User.find({ _id: { $ne: user._id }})
    }else if (keyword === 'old'){
        users = await User.find({ _id: { $ne: user._id }}).sort({"createdAt":-1})
    }else {
        res.status(500).send(
            {
                "success" : false ,
                "message" : "needed to use keyword like recent or old" ,
                "error_code" : 400 
            }
        )
        throw new Error("Error : needed to use keyword like recent or old")
    }
    if(!users){
        res.status(400).send(
            {
                "success" : false ,
                "message" : "no data from users" ,
                "error_code" : 400 
            }
        )
        throw new Error("Error : no data from users")
    }

    res.status(200).send(
        {
            "success" : true ,
            "message" : "Data been sorted as required" ,
            "data" : users 
        }
    )

}
const getAllUsers : fnType = async(req,res)=>{
    const user = (<any>req).user
    const users = await User.find({ _id: { $ne: user._id }});
    res.status(200).send(
        {
            "success" : true ,
            "message" : "Data been sorted as required" ,
            "data" : users
        }
    )
} 

export{createUser , authUser , updateUser , deleteUser , searchUser , paginatedData , sortData , getAllUsers}