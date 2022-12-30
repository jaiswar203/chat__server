"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
require("reflect-metadata");
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var mongoose_1 = __importDefault(require("mongoose"));
var Router_1 = require("./Router");
require("./controller/User");
require("./controller/Chat");
require("./controller/Conversation");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var Server = /** @class */ (function () {
    function Server() {
        this.users = [];
        this.PORT = process.env.PORT;
        this.app = (0, express_1.default)();
        this.MONGO_URI = process.env.MONGO_URI;
        this.HTTP = (0, http_1.createServer)(this.app);
        this.IO = new socket_io_1.Server(this.HTTP, {
            cors: { origin: "http://localhost:3000" },
        });
    }
    Server.prototype.init = function () {
        this.middleware();
        this.database();
        this.io();
    };
    Server.prototype.middleware = function () {
        this.app.use((0, cors_1.default)());
        this.app.use(body_parser_1.default.json({ limit: "50mb" }));
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use(Router_1.Router.getInstance());
    };
    Server.prototype.database = function () {
        var _this = this;
        mongoose_1.default.connect(this.MONGO_URI).then(function () {
            _this.HTTP.listen(_this.PORT, function () {
                console.log("Server Running on http://localhost:".concat(_this.PORT));
            });
        });
    };
    Server.prototype.addUser = function (userId, socketId) {
        var isUserExist = this.users.filter(function (obj) { return obj.userId === userId; });
        if (isUserExist.length !== 0) {
            this.users.map(function (obj) {
                return obj.userId === userId ? __assign(__assign({}, obj), { socketId: socketId }) : obj;
            });
        }
        else {
            this.users.push({ userId: userId, socketId: socketId });
        }
        this.users = this.users.filter(function (obj) { return obj.userId !== null; });
    };
    Server.prototype.removeUser = function (socketId) {
        this.users = this.users.filter(function (user) { return user.socketId !== socketId; });
    };
    Server.prototype.getUser = function (userId) {
        return this.users.find(function (user) { return user.userId === userId; });
    };
    Server.prototype.io = function () {
        var _this = this;
        this.IO.on("connection", function (socket) {
            /**@ON_CONNECTION */
            socket.on("addUser", function (userId) {
                _this.addUser(userId, socket.id);
                _this.IO.emit("getUsers", _this.users);
            });
            socket.on("sendMessage", function (_a) {
                var sender = _a.sender, receiver = _a.receiver, message = _a.message;
                var user = _this.getUser(receiver);
                if (!user)
                    return;
                _this.IO.to(user.socketId).emit("getMessage", {
                    sender: sender,
                    message: message,
                });
            });
            /**@ON_DISCONNECTION */
            socket.on("disconnect", function () {
                _this.removeUser(socket.id);
                _this.IO.emit("getUsers", _this.users);
            });
        });
    };
    return Server;
}());
exports.Server = Server;
