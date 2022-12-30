"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
var Router_1 = require("../Router");
var constant_1 = require("../constant");
function bodyValidators(keys) {
    return function (req, res, next) {
        if (!req.body) {
            res.status(422).send("Invalid Request");
            return;
        }
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (!req.body[key]) {
                res.status(422).send("Missing Property ".concat(key));
                return;
            }
        }
        next();
    };
}
function controller(prefix) {
    return function (target) {
        var router = Router_1.Router.getInstance();
        for (var key in target.prototype) {
            var handler = target.prototype[key];
            var path = Reflect.getMetadata(constant_1.Metadata.path, target.prototype, key);
            var method = Reflect.getMetadata(constant_1.Metadata.method, target.prototype, key);
            var middlewares = Reflect.getMetadata(constant_1.Metadata.middleware, target.prototype, key) || [];
            var bodyProps = Reflect.getMetadata(constant_1.Metadata.validator, target.prototype, key) || [];
            var validator = bodyValidators(bodyProps);
            if (path) {
                router[method].apply(router, __spreadArray(__spreadArray(["".concat(prefix).concat(path)], middlewares, false), [validator, handler], false));
            }
        }
    };
}
exports.controller = controller;
