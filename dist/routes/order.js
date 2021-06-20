"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controllers/authentication");
const user_1 = require("../controllers/user");
const product_1 = require("../controllers/product");
const order_1 = require("../controllers/order");
const router = express_1.default.Router();
//params
router.param('userId', user_1.getUserByID);
router.param('orderId', order_1.getOrderById);
//routes
//create order
router.post('/order/create/:userId', authentication_1.isSign, authentication_1.isAuthenticated, product_1.updateUnits, order_1.createOrdPrd, order_1.createOrder, user_1.pushOrderInPurchaseList
/* pushOrderInPurchaseList,
 updateUnits,
 createOrder */ );
// Read Route
router.get('/order/getAllOrders/:userId', authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, order_1.getAllOrders);
// get All Orders of user
router.get('/order/getMyOrders/:userId', authentication_1.isSign, authentication_1.isAuthenticated, order_1.getMyOrders);
//get Single order
router.get('/order/:orderId/:userId', authentication_1.isSign, authentication_1.isAuthenticated, order_1.getOrderPlaced);
//Read status
router.get('order/status/:userId', authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, order_1.getOrderStatus);
// Update Status
router.put('order/status/:orderId/:userId', authentication_1.isSign, authentication_1.isAuthenticated, authentication_1.isAdmin, order_1.updateStatus);
exports.default = router;
