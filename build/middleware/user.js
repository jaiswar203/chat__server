"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var Packet_1 = require("../library/Packet");
dotenv_1.default.config();
function UserAuth(req, res, next) {
    try {
        var token = req.header("Authorization").split(" ")[1];
        if (token) {
            var decodedData = jsonwebtoken_1.default.verify(token, process.env.SECURE_KEY);
            req.token = decodedData;
        }
        next();
    }
    catch (error) {
        res.status(401).json((0, Packet_1.Packet)("Not Authorized"));
    }
}
exports.default = UserAuth;
