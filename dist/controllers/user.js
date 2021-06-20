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
exports.pushOrderInPurchaseList = exports.userPurchaseList = exports.updateUser = exports.getUser = exports.getUserByID = void 0;
const user_1 = require("../models/user");
const order_1 = require("../models/order");
const getUserByID = (req, res, next, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findById(userId);
        //console.log(user);
        if (!user) {
            return res.status(400).json({
                error: "No User Found"
            });
        }
        else {
            const { firstName, email, role, _id } = user;
            if (role === 0 || role === 1) {
                req.profile._id = _id;
                req.profile.firstName = firstName;
                req.profile.email = email;
                req.profile.role = role;
                //console.log(req.profile);
                next();
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Something went wrong with User ID route"
        });
    }
});
exports.getUserByID = getUserByID;
const getUser = (req, res) => {
    res.json(req.profile);
};
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        user_1.User.findByIdAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true, useFindAndModifty: false }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Update Operation failed for User"
                });
            }
            user.securePassword = "";
            user.virtualPassword = "";
            user.salt = "";
            return res.json({
                user: user,
                message: "Update Successful for User"
            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Something went wrong with Update operation"
        });
    }
});
exports.updateUser = updateUser;
const userPurchaseList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        order_1.Order.find({ user: req.profile._id })
            .populate("user", "_id email")
            .populate("products")
            .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "NO Orders found for this user account"
                });
            }
            res.json(order);
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Something went wrong.. with Order-user List"
        });
    }
});
exports.userPurchaseList = userPurchaseList;
const pushOrderInPurchaseList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let purchaseArr = [];
    /* req.body.order.products.forEach((item:Orderedproducts)=>{
        purchaseArr.push({
            _id:item._id,
            name:item.name,
            description:item.description,
            category:item.category,
            quantity:item.quantity,
            amount:item.amount,
            transactionId:req.body.order.transactionId
        })
    }) */
    purchaseArr.push(req.body.order._id);
    user_1.User.findOneAndUpdate({ _id: req.profile._id }, { $push: { purchases: purchaseArr } }, { new: true }, ((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Unable to Save orders in User's Purchases"
            });
        }
        return res.json(req.body.order);
        //next();
    }));
});
exports.pushOrderInPurchaseList = pushOrderInPurchaseList;
