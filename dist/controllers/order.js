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
exports.updateStatus = exports.getOrderStatus = exports.getOrderPlaced = exports.getMyOrders = exports.getAllOrders = exports.createOrder = exports.createOrdPrd = exports.getOrderById = void 0;
const order_1 = require("../models/order");
//param getOrderbyID
const getOrderById = (req, res, next, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let order = yield order_1.Order.findById(orderId).populate("products").populate("user", "_id email");
        req.order = order;
        next();
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Read request for order failed"
        });
    }
});
exports.getOrderById = getOrderById;
// route create OrderProduct
const createOrdPrd = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let myCreateObj = req.body.order.products.map((prod) => {
        return {
            insertOne: {
                document: prod
            }
        };
    });
    order_1.OrderProduct.bulkWrite(myCreateObj, {}, (err, resultedPrd) => {
        if (err || !resultedPrd) {
            return res.json({
                message: "Bulk create order product is failed"
            });
        }
        req.body.order.products = Object.values(resultedPrd.insertedIds);
        next();
    });
});
exports.createOrdPrd = createOrdPrd;
//route create Order
const createOrder = (req, res, next) => {
    req.body.order.user = req.profile;
    let order = new order_1.Order(req.body.order);
    order_1.Order.create(order, (err, newOrder) => {
        if (err) {
            return res.status(400).json({
                error: "Save Order Operation failed"
            });
        }
        req.body.order = newOrder;
        next();
        //return res.json(newOrder)
    });
};
exports.createOrder = createOrder;
//route read order 
const getAllOrders = (req, res) => {
    order_1.Order.find()
        .populate("user", "_id email")
        .populate("products")
        .exec((err, allOrders) => {
        if (err) {
            return res.status(400).json({
                error: "Read Operation failed"
            });
        }
        return res.json(allOrders);
    });
};
exports.getAllOrders = getAllOrders;
// Read all orders of User
const getMyOrders = (req, res) => {
    order_1.Order.find({ user: req.profile._id }, (err, myOrders) => {
        if (err || !myOrders) {
            console.log(err);
            return res.status(400).json({
                error: "Issue with fetching orders"
            });
        }
        return res.json(myOrders);
    });
};
exports.getMyOrders = getMyOrders;
// Route Read Single Product
const getOrderPlaced = (req, res) => {
    return res.json(req.order);
};
exports.getOrderPlaced = getOrderPlaced;
//route read status
const getOrderStatus = (req, res) => {
    //
};
exports.getOrderStatus = getOrderStatus;
///update status
const updateStatus = (req, res) => {
    order_1.Order.findOneAndUpdate({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, updatedOrder) => {
        if (err) {
            return res.status(400).json({
                error: "Update Operation Failed"
            });
        }
        res.json(updatedOrder);
    });
};
exports.updateStatus = updateStatus;
