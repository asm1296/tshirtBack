"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const category_1 = require("../controllers/category");
const authentication_1 = require("../controllers/authentication");
const router = express_1.default.Router();
// Params..
router.param("userId", user_1.getUserByID);
router.param("categoryId", category_1.getCategoryByID);
// Router for Category
// Create Route
router.post("/category/create/:userId", authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, category_1.createCategory);
// Get Route
router.get("/category/getCategory/:categoryId", category_1.getCategory);
router.get("/category/getCategories", category_1.getAllCategories);
// Update Route
router.put("/category/:categoryId/:userId", authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, category_1.updateCategory);
// Delete Route
router.delete("/category/:categoryId/:userId", authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, category_1.removeCategory);
exports.default = router;
