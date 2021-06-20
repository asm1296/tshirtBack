"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const product_1 = require("../controllers/product");
const user_1 = require("../controllers/user");
const authentication_1 = require("../controllers/authentication");
const router = express_1.default.Router();
// Params
router.param("userId", user_1.getUserByID);
router.param("productId", product_1.getProductByID);
// actual Routes
// Create Prd 
router.post('/product/create/:userId', [
    express_validator_1.check("name").isEmpty().withMessage('Name is missing. Name must be provided with minimum 5 characters'),
    express_validator_1.check('price').isEmpty().withMessage('Price must be Numeric with minimum 3 digits'),
    express_validator_1.check('category').isEmpty().withMessage('Category is missing. Please provide Object ID of category'),
    express_validator_1.check('availableUnits').isEmpty().withMessage('Please provide available Units in Integer'),
    express_validator_1.check('photo').isEmpty().withMessage('Product image is missing')
], authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, product_1.createProduct);
// Get  Prd
router.get('/product/:productId', product_1.getProduct);
router.get('/product/photo/:productId', product_1.getPhoto);
// Delete Prd
router.delete('/product/remove/:productId/:userId', authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, product_1.removeProduct);
// Update Prd
router.put('/product/update/:productId/:userId', authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, product_1.updateProduct);
// Get All Products
router.get('/products', product_1.getAllProducts);
router.get('/product/category', product_1.getAllUniqueCategory);
exports.default = router;
