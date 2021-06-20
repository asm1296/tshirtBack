"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.Orders = exports.OrderProduct = exports.Orderedproducts = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const product_1 = require("./product");
const user_1 = require("./user");
class Orderedproducts extends defaultClasses_1.Base {
}
__decorate([
    typegoose_1.prop({ required: true, ref: () => product_1.Products }),
    __metadata("design:type", Object)
], Orderedproducts.prototype, "product", void 0);
__decorate([
    typegoose_1.prop({ trim: true, maxlength: 32 }),
    __metadata("design:type", String)
], Orderedproducts.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ trim: true, maxlength: 32 }),
    __metadata("design:type", String)
], Orderedproducts.prototype, "category", void 0);
__decorate([
    typegoose_1.prop({ trim: true, maxlength: 2000 }),
    __metadata("design:type", String)
], Orderedproducts.prototype, "description", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Orderedproducts.prototype, "quantity", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Orderedproducts.prototype, "price", void 0);
exports.Orderedproducts = Orderedproducts;
exports.OrderProduct = typegoose_1.getModelForClass(Orderedproducts, { schemaOptions: { timestamps: true } });
class Orders extends defaultClasses_1.Base {
}
__decorate([
    typegoose_1.prop({ ref: () => Orderedproducts }),
    __metadata("design:type", Array)
], Orders.prototype, "products", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Orders.prototype, "transactionId", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Orders.prototype, "amount", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Orders.prototype, "address", void 0);
__decorate([
    typegoose_1.prop({ default: "Received", enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"] }),
    __metadata("design:type", String)
], Orders.prototype, "status", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object)
], Orders.prototype, "updated", void 0);
__decorate([
    typegoose_1.prop({ type: mongoose_2.Types.ObjectId, ref: () => user_1.Users }),
    __metadata("design:type", Object)
], Orders.prototype, "user", void 0);
exports.Orders = Orders;
exports.Order = typegoose_1.getModelForClass(Orders, { schemaOptions: { timestamps: true } });
