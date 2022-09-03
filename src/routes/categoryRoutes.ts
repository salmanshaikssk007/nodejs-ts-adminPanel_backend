import express from 'express'
import { createCategory, getAllCategories, searchCategory, updateCategory } from '../controllers/categoryControllers';
import { adminAuth } from '../middleware/adminMiddleware';
import { authenticate } from '../middleware/authMiddleware';
const categoryRouter = express.Router();

// @description Routes for category

categoryRouter.route('/').post([authenticate ,adminAuth] ,createCategory).get(authenticate , getAllCategories)
categoryRouter.route('/searchquery').get(authenticate,searchCategory)
categoryRouter.route('/:categoryId').put([authenticate ,adminAuth], updateCategory)

export{categoryRouter}