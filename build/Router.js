"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var express_1 = __importDefault(require("express"));
var Router = /** @class */ (function () {
    function Router() {
    }
    Router.getInstance = function () {
        if (!Router.instance) {
            Router.instance = express_1.default.Router();
        }
        return Router.instance;
    };
    return Router;
}());
exports.Router = Router;
