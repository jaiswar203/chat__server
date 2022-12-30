"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var cryptography_1 = require("../util/cryptography");
var ChatSchema = new mongoose_1.Schema({
    from: {
        type: "ObjectId",
        required: true,
    },
    to: {
        type: "ObjectId",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
ChatSchema.methods.encrypt = function () {
    var message = (0, cryptography_1.encrypt)(this.message);
    this.message = message;
};
exports.default = (0, mongoose_1.model)("Chat", ChatSchema);
