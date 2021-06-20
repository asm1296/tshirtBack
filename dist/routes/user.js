"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const authentication_1 = require("../controllers/authentication");
const user_2 = require("../models/user");
const router = express_1.default.Router();
router.use((req, res, next) => {
    req.profile = new user_2.Users();
    next();
});
router.param("userId", user_1.getUserByID);
router.get("/user/:userId", authentication_1.isSign, authentication_1.isAuthenticated, user_1.getUser);
router.put('/user/:userId', authentication_1.isSign, authentication_1.isAuthenticated, user_1.updateUser);
router.get("/orders/user/:userId", authentication_1.isSign, authentication_1.isAuthenticated, user_1.userPurchaseList);
exports.default = router;
