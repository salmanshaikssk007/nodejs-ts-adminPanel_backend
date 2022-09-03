import express = require('express')
import { paginate } from '../middleware/paginationMiddleware';
import { superAdminAuth } from '../middleware/superAdminMiddleware';
import { User } from '../modals/userModal';
import {createUser , authUser , updateUser , deleteUser ,searchUser , paginatedData ,sortData ,getAllUsers} from './../controllers/userControllers'
import {authenticate} from './../middleware/authMiddleware'


const userRouter = express.Router();

// @description  userRoutes
userRouter.route('/').post([authenticate , superAdminAuth ],createUser).get(authenticate , searchUser)
userRouter.route('/login').post(authUser)
userRouter.route('/sort').get(authenticate,sortData)
userRouter.route('/:requiredUserId').put([authenticate , superAdminAuth] , updateUser).delete([authenticate , superAdminAuth] , deleteUser)
userRouter.route('/paginated').get([authenticate,paginate(User)],paginatedData )
userRouter.route('/getAllUsers').get(authenticate,getAllUsers)

export{userRouter}




