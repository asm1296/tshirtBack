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
exports.isAdmin = exports.isAuthenticated = exports.isSign = exports.signin = exports.signup = exports.signout = void 0;
const user_1 = require("../models/user");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_jwt_1 = __importDefault(require("express-jwt"));
//Route auth Controllers
const signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "signout successfull"
    });
};
exports.signout = signout;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = express_validator_1.validationResult(req);
        if (!error.isEmpty()) {
            console.log(error);
            return res.status(400).json({
                error: error.array()[0].msg
            });
        }
        let document = yield user_1.User.create(req.body);
        //console.log(document);
        return res.json({
            message: "User signup success"
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Something went wrong for Creating User"
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = express_validator_1.validationResult(req);
        const { email, virtualPassword } = req.body;
        if (!error.isEmpty()) {
            console.log(error);
            return res.status(400).json({
                error: error.array()[0].msg
            });
        }
        user_1.User.findOne({ email }, (errors, user) => {
            if (errors || !user) {
                return res.status(400).json({
                    error: "email doesn't exist"
                });
            }
            if (!user.authenticate(virtualPassword)) {
                return res.status(400).json({
                    error: "email and password doesn't match"
                });
            }
            if (process.env.SECRET) {
                const token = jsonwebtoken_1.default.sign(user.firstName, process.env.SECRET);
                res.cookie("token", token, { expires: new Date(Date.now() + (10 * 60 * 1000)) });
                const { firstName, email, role, _id } = user;
                return res.json({
                    token: token,
                    user: { _id, firstName, email, role }
                });
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: "Something went wrong with Signin process, check after some time"
        });
    }
});
exports.signin = signin;
const secretFrom = process.env.SECRET || 'hello';
exports.isSign = express_jwt_1.default({
    secret: secretFrom,
    algorithms: ['HS256'],
    requestProperty: 'auth'
});
const isAuthenticated = (req, res, next) => {
    let checker = req.auth && req.profile && req.profile.firstName == req.auth;
    if (!checker) {
        res.status(403).json({
            error: "You are not Authorized to access this"
        });
    }
    next();
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        res.status(403).json({
            error: "No Admin permission to you.. ACCESS DENIED"
        });
    }
    next();
};
exports.isAdmin = isAdmin;
/* export const isSignedIn =()=> {
    if(!process.env.SECRET){
        console.log("No JWT Secret is available. Please set it first");
    }else{
        expressJwt({
            secret:process.env.SECRET,
            algorithms: ['HS256'],
            userProperty:'auth'
        })
    }
} */
