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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUniqueCategory = exports.updateUnits = exports.getAllProducts = exports.updateProduct = exports.removeProduct = exports.getPhoto = exports.getProduct = exports.createProduct = exports.getProductByID = void 0;
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const product_1 = require("../models/product");
const express_validator_1 = require("express-validator");
//Param Get Prd
const getProductByID = (req, res, next, productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        product_1.Product.findById(productId)
            .populate("category")
            .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: "No Product Found"
                });
            }
            req.product = product;
            next();
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Something Went Wrong..Try again Later"
        });
    }
});
exports.getProductByID = getProductByID;
// Create Product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = express_validator_1.validationResult(req);
        if (!error.isEmpty()) {
            console.log(error);
            return res.json({
                error: error.array()[0].msg
            });
        }
        let form = new formidable_1.default.IncomingForm({ keepExtensions: true, maxFileSize: 2 * 1024 * 1024 });
        let product = new product_1.Products();
        form.parse(req, (err, fields, file) => {
            if (err) {
                return res.status(400).json({
                    error: "There is an issue with files"
                });
            }
            const { name, description, price, category, availableUnits } = fields;
            if (!name ||
                !description ||
                !price ||
                !category ||
                !availableUnits) {
                return res.status(400).json({
                    error: "Please provide every field as they are mandatory"
                });
            }
            product.name = name, product.description = description, product.price = price;
            product.category = category, product.availableUnits = availableUnits;
            /* if(file.photo.path && file.photo.type){
                console.log(file.photo.path)
                console.log(typeof(product.photo));
                console.log(typeof(product.photo.data))
                product.photo.contentType = file.photo.type
                product.photo.data = fs.readFileSync(file.photo.path);
            } */
            product_1.Product.create(product, (error, prd) => {
                if (error || !prd) {
                    return res.json({
                        error: "Product saving Unsuccessful"
                    });
                }
                return res.json({
                    message: "Product saved successfully",
                    Product: { name, description, price }
                });
            });
        });
        form.on('file', (fileName, file) => {
            if (file.path && file.type) {
                product.photoType = file.type;
                product.photo = fs_1.default.readFileSync(file.path);
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Something Went Wrong. Please check after some time"
        });
    }
});
exports.createProduct = createProduct;
// Get Product
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, category, availableUnits, price } = req.product;
        return res.json({
            ProductSearched: { name, description, category, availableUnits, price }
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Something Went Wrong. Please try again Later"
        });
    }
});
exports.getProduct = getProduct;
// MiddleWare for read photo
const getPhoto = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.product.photo) {
            res.set('Content-Type', req.product.photoType);
            return res.send(req.product.photo);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Something Went Wrong"
        });
    }
});
exports.getPhoto = getPhoto;
// Delete Product
const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        product_1.Product.findOneAndDelete({ _id: req.product._id }, (err, deletedPrd) => {
            if (err) {
                return res.json({
                    error: "Delete Operation Failed"
                });
            }
            return res.json({
                message: `Delete Operation successful for ${deletedPrd.name}`
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Remove Product Operation stopped. Please check after some time"
        });
    }
});
exports.removeProduct = removeProduct;
// Update Product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let form = new formidable_1.default.IncomingForm({ keepExtensions: true, maxFileSize: 2 * 1024 * 1024 });
        form.parse(req, (err, fields, file) => {
            if (err) {
                return res.status(400).json({
                    error: "There is an issue with files"
                });
            }
            const { name, description, price, category, availableUnits } = fields;
            req.product.name = name, req.product.description = description, req.product.price = price;
            req.product.category = category, req.product.availableUnits = availableUnits;
            product_1.Product.findOneAndUpdate({ _id: req.product._id }, { $set: req.product }, (err, updatedPrd) => {
                if (err) {
                    return res.json({
                        error: "Update Operation Failed"
                    });
                }
                return res.json({
                    message: `Update Operation successful for ${updatedPrd.name}`
                });
            });
        });
        form.on('file', (fileName, file) => {
            if (file.path && file.type) {
                req.product.photoType = file.type;
                req.product.photo = fs_1.default.readFileSync(file.path);
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Update Product Operation stopped. Please check after some time"
        });
    }
});
exports.updateProduct = updateProduct;
// Get All Products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    product_1.Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, 'asc']])
        .limit(limit)
        .exec((err, products) => {
        if (err) {
            return res.json({
                error: "Issue with Product List !!!"
            });
        }
        return res.json(products);
    });
});
exports.getAllProducts = getAllProducts;
const updateUnits = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let myUnitsUpdate = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter: { _id: product.product },
                update: { $inc: { soldUnits: (product.quantity || 1), availableUnits: -(product.quantity || 1) } }
            }
        };
    });
    product_1.Product.bulkWrite(myUnitsUpdate, {}, (err, resultedPrd) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Bulk Operation Failed"
            });
        }
        next();
    });
});
exports.updateUnits = updateUnits;
const getAllUniqueCategory = (req, res) => {
    product_1.Product.distinct('category', {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "No Category Found"
            });
        }
        res.json(category);
    });
};
exports.getAllUniqueCategory = getAllUniqueCategory;
