"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authentication_1 = require("../controllers/authentication");
const user_1 = require("../controllers/user");
const payment_1 = require("../controllers/payment");
router.param('userId', user_1.getUserByID);
router.get('/payment/getToken/:userId', authentication_1.isSign, authentication_1.isAuthenticated, payment_1.getToken);
router.post('/payment/processPayment/:userId', authentication_1.isSign, authentication_1.isAuthenticated, payment_1.processPayment);
exports.default = router;
