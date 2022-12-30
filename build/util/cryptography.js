"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
var crypto_js_1 = __importDefault(require("crypto-js"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var SECRET = process.env.SECURE_KEY;
function encrypt(message) {
    var cipher = crypto_js_1.default.AES.encrypt(message, SECRET).toString();
    return cipher;
}
exports.encrypt = encrypt;
function decrypt(data) {
    var bytes = crypto_js_1.default.AES.decrypt(data, SECRET);
    var text = bytes.toString(crypto_js_1.default.enc.Utf8);
    return text;
}
exports.decrypt = decrypt;
