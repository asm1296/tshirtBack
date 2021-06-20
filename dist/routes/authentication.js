"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controllers/authentication");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
//Routes
router.post('/signup', [
    express_validator_1.check('firstName').isLength({ min: 3 }).withMessage('First Name must be having 3 characters'),
    express_validator_1.check('email').isEmail().withMessage('Please enter valid email ID'),
    express_validator_1.check('virtualPassword').isLength({ min: 8 }).withMessage('Password must be 8 characters')
], authentication_1.signup);
router.post('/signin', [
    express_validator_1.check('email').isEmail().withMessage('Please enter valid email ID'),
    express_validator_1.check('virtualPassword').isLength({ min: 8 }).withMessage('Password must be 8 characters')
], authentication_1.signin);
router.get('/signout', authentication_1.signout);
router.get('/testRoute', authentication_1.isSign, (req, res) => {
    res.json({
        message: req.auth
    });
});
exports.default = router;
