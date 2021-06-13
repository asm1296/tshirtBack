import express, {Request, Response, NextFunction} from 'express';
import { check, validationResult} from 'express-validator'

import { getProductByID,
         createProduct,
         getProduct,
         getPhoto,
         removeProduct,
         updateProduct,
         getAllProducts,
         getAllUniqueCategory } from '../controllers/product';
import { getUserByID} from '../controllers/user';
import { isSign, isAuthenticated, isAdmin} from '../controllers/authentication';

const router = express.Router();

// Params
router.param("userId",getUserByID);
router.param("productId", getProductByID);

// actual Routes
// Create Prd 
router.post('/product/create/:userId',[
    check("name").isEmpty().withMessage('Name is missing. Name must be provided with minimum 5 characters'),
    check('price').isEmpty().withMessage('Price must be Numeric with minimum 3 digits'),
    check('category').isEmpty().withMessage('Category is missing. Please provide Object ID of category'),
    check('availableUnits').isEmpty().withMessage('Please provide available Units in Integer'),
    check('photo').isEmpty().withMessage('Product image is missing')
],isSign, isAuthenticated, isAdmin, createProduct)

// Get  Prd
router.get('/product/:productId', getProduct)
router.get('/product/photo/:productId', getPhoto);

// Delete Prd
router.delete('/product/remove/:productId/:userId', isSign, isAuthenticated, isAdmin, removeProduct);

// Update Prd
router.put('/product/update/:productId/:userId', isSign, isAuthenticated, isAdmin, updateProduct)

// Get All Products
router.get('/products', getAllProducts)
router.get('/product/category', getAllUniqueCategory)

export default router;
