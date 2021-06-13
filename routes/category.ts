import express,{Request,Response,NextFunction} from 'express';

import { getUserByID } from '../controllers/user';
import { getCategoryByID, createCategory, getCategory, getAllCategories, updateCategory, removeCategory } from '../controllers/category';
import { isAdmin, isAuthenticated, isSign} from '../controllers/authentication';

const router = express.Router();

// Params..
router.param("userId",getUserByID);
router.param("categoryId", getCategoryByID);

// Router for Category

// Create Route
router.post("/category/create/:userId",isSign,isAuthenticated,isAdmin,createCategory);

// Get Route
router.get("/category/getCategory/:categoryId",getCategory);
router.get("/category/getCategories",getAllCategories);

// Update Route
router.put("/category/:categoryId/:userId", isSign,isAuthenticated,isAdmin, updateCategory);

// Delete Route
router.delete("/category/:categoryId/:userId", isSign,isAuthenticated,isAdmin, removeCategory)

export default router;