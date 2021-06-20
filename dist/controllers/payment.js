"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = exports.getToken = void 0;
const braintree_1 = __importDefault(require("braintree"));
const gateway = new braintree_1.default.BraintreeGateway({
    environment: braintree_1.default.Environment.Sandbox,
    merchantId: "ftxwvg7rcsqjjg8r",
    publicKey: "65tyf8y2kpcq25v8",
    privateKey: "a5fd5d6ee70a137ec76ab20819e7775b"
});
const getToken = (req, res) => {
    gateway.clientToken.generate({}).then((response) => {
        return res.json(response);
    }).catch(error => { return res.status(500).json(error); });
};
exports.getToken = getToken;
const processPayment = (req, res) => {
    const { nonceFromTheClient, totalAmount } = req.body;
    gateway.transaction.sale({
        amount: totalAmount,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }).then((response) => {
        return res.json(response);
    }).catch(error => { return res.status(500).json(error); });
};
exports.processPayment = processPayment;
