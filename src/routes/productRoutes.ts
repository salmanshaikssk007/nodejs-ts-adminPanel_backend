import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { Product } from "../modals/productModal";
import { paginate } from "../middleware/paginationMiddleware";
import { createProduct, deleteProduct, filteredData, paginatedData, searchProducts, sortData, updateProduct , getAllProduct } from "../controllers/productControllers";
import { adminAuth } from "../middleware/adminMiddleware";


const productRouter = express.Router();

// @description  productRoutes

productRouter.route('/').get(authenticate , searchProducts)
productRouter.route('/getProducts').get(getAllProduct);
productRouter.route('/filter/:categoryId').post(authenticate , filteredData) 
productRouter.route('/paginated/:categoryId').get([authenticate,paginate(Product)],paginatedData )
productRouter.route('/:categoryId').post([authenticate ,adminAuth] , createProduct).get(authenticate , sortData)
productRouter.route('/:productId').put([authenticate ,adminAuth] , updateProduct).delete([authenticate ,adminAuth] , deleteProduct)

export{productRouter}