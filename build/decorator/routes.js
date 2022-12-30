"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.patch = exports.post = exports.get = void 0;
var methods_1 = require("../constant/methods");
var Metadata_1 = require("../constant/Metadata");
function routeBinder(method) {
    return function (path) {
        return function (target, key, desc) {
            Reflect.defineMetadata(Metadata_1.Metadata.path, path, target, key);
            Reflect.defineMetadata(Metadata_1.Metadata.method, method, target, key);
        };
    };
}
exports.get = routeBinder(methods_1.Methods.get);
exports.post = routeBinder(methods_1.Methods.post);
exports.patch = routeBinder(methods_1.Methods.patch);
exports.del = routeBinder(methods_1.Methods.delete);
