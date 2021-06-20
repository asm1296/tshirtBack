"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCategory = exports.updateCategory = exports.getAllCategories = exports.getCategory = exports.createCategory = exports.getCategoryByID = void 0;
const category_1 = require("../models/category");
const getCategoryByID = (req, res, next, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        category_1.Category.findById(id, (err, category) => {
            if (err || !category) {
                return res.status(400).json({
                    error: "NO Category Found"
                });
            }
            req.category = category;
            next();
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Something Went Wrong..Please Try Again"
        });
    }
});
exports.getCategoryByID = getCategoryByID;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield category_1.Category.create(req.body);
        return res.json(category);
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Something Went Wrong...Please try again"
        });
    }
});
exports.createCategory = createCategory;
const getCategory = (req, res) => {
    return res.json(req.category);
};
exports.getCategory = getCategory;
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        category_1.Category.find().exec((err, categories) => {
            if (err || !categories) {
                return res.json({
                    error: "NO categories found"
                });
            }
            res.json(categories);
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Someting Went Wrong..No categories Received. Try again later"
        });
    }
});
exports.getAllCategories = getAllCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        category_1.Category.findOneAndUpdate({ _id: req.category._id }, { $set: { name: req.body.categoryName } }, { new: true }, (err, updatedCategory) => {
            if (err || !updatedCategory) {
                return res.json({
                    error: err
                });
            }
            return res.json(updatedCategory);
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Something Went Wrong..Try Again Later"
        });
    }
});
exports.updateCategory = updateCategory;
// Delete Category
const removeCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        category_1.Category.findOneAndDelete({ _id: req.category._id }, (err, deletedCategory) => {
            if (err || !deletedCategory) {
                return res.json({
                    error: "Delete operation failed"
                });
            }
            return res.json({
                message: `Successfull Deleted ${deletedCategory.name}`
            });
        });
    }
    catch (error) {
        console.log(error);
        ;
        return res.json({
            error: "Something Went Wrong.. Try Again Later"
        });
    }
});
exports.removeCategory = removeCategory;
