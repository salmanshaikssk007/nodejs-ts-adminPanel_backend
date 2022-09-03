import { ICategory } from "../global/categoryInterfaces"
import { fnType } from "../global/globalTypes"
import { Category } from "../modals/categoryModal"

//@description     Creates category
//@route           POST /api/v1/categories
//@access          Public

/**
 * Creates the category by Admin
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws enter the name of the category
 * @throws category name already exists
 */

const createCategory :fnType = async(req,res) =>{

    const {category_name  }:ICategory = req.body
    if(!category_name){
        res.send(
            {
                success : "false" ,
                message : "enter the name of the category" ,
                error_code : 400 ,
                data : {}
            }
        )
        throw new Error ('Error : enter the name of the category')
    }
    const category = await Category.findOne({category_name})
    if(category){
        res.send(
            {
                success : "false" ,
                message : "category name already exists"
            }
        )
    }
    const newCategory = await Category.create(
        {
            category_name
        }
    )
    res.status(201).send(
        {
            success : "true" ,
            message : "category is created" ,
            data : newCategory

        }
    )
}

//@description     Updates category
//@route           POST /api/v1/category/:categoryId
//@access          Public

/**
 * Updates the category by admin
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws no category with that id exists
 * @throws Either its empty or name already exists
 */
const updateCategory : fnType = async(req,res)=>{

    const {categoryId} = req.params;
    const {category_name : updatedCategoryName}:ICategory = req.body
    const category =<any> await Category.findOne({_id:categoryId})
    if(!category){
        res.send(
            {
                success : "false" ,
                message : "no category with that id exists"
            }
        
        )
        throw new Error('Error : no category with that id exists')
    }
    const originalCategory = await Category.findOne({category_name : updatedCategoryName})

    if( !updatedCategoryName || originalCategory){
        res.send(
            {
                success : 'false' ,
                message : "Either its empty or name already exists"
            }
        )
        throw new Error('Error : Either its empty or name already exists')
    }

    category.category_name = updatedCategoryName
   const newCategory = await category.save();
    res.status(200).send(
        {
            success : "true" ,
            message : "category name is updated" ,
            data : newCategory
        }
    )
}

//@description     gets all the categories
//@route           GET /api/v1/category
//@access          Public

/**
 * Gets all the category by admin
 *
 * @param  Request req
 * @param  Response res
 * @return void
 * @throws no categories to display
 */
const getAllCategories :fnType = async(req,res)=>{
    console.log('logged ');
    const categories = await Category.find();
    if(!categories){
        res.send(
            {
                success : "false" ,
                message : "no categories to display" ,
                data : {}
            }
        )
        throw new Error ('Error : no categories to display')
    }
    res.status(200).send(
        {
            success : "true" ,
            message : "Categories fetched" ,
            data : categories
        }
    )

}
//@description     search for the  category
//@route           GET /api/v1/category?search=
//@access          Public

/**
 * get or search for the Categories
 *
 * @param  Request req
 * @param  Response res
 * @return void
 */
const searchCategory:fnType = async(req,res)=>{
    const keyword = req.query.search
    ? {
        $or: [
          { category_name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

    const categories = await Category.find(keyword)
    res.status(200).send(
        {
            "success" : true ,
            "message" : "Search completed" ,
            "data" : categories
        }
    )
}
export{createCategory , updateCategory , getAllCategories , searchCategory}