"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Users = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const crypto = __importStar(require("crypto"));
const uuid_1 = require("uuid");
class Users extends defaultClasses_1.Base {
    set virtualPassword(password) {
        this._pwd = password;
        this.salt = uuid_1.v1();
        this.securePassword = this.encryptPwd(password);
    }
    get virtualPassword() {
        if (!this._pwd) {
            return "";
        }
        return this._pwd;
    }
    authenticate(password) {
        return this.encryptPwd(password) === this.securePassword;
    }
    encryptPwd(password) {
        if (!password || !this.salt) {
            return "";
        }
        try {
            const hash = crypto.createHmac('sha256', this.salt)
                .update(password)
                .digest('hex');
            return hash;
        }
        catch (error) {
            return "";
        }
    }
}
__decorate([
    typegoose_1.prop({ required: true, trim: true, maxlength: 32 }),
    __metadata("design:type", String)
], Users.prototype, "firstName", void 0);
__decorate([
    typegoose_1.prop({ trim: true, maxlength: 32 }),
    __metadata("design:type", String)
], Users.prototype, "lastName", void 0);
__decorate([
    typegoose_1.prop({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], Users.prototype, "userInfo", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Users.prototype, "securePassword", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Users.prototype, "salt", void 0);
__decorate([
    typegoose_1.prop({ default: 0 }),
    __metadata("design:type", Number)
], Users.prototype, "role", void 0);
__decorate([
    typegoose_1.prop({ type: String, default: [] }),
    __metadata("design:type", Array)
], Users.prototype, "purchases", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Users.prototype, "_pwd", void 0);
exports.Users = Users;
exports.User = typegoose_1.getModelForClass(Users, { schemaOptions: { timestamps: true } });
