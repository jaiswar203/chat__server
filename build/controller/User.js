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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = __importDefault(require("../model/User"));
var Packet_1 = require("../library/Packet");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var decorator_1 = require("../decorator");
var user_1 = __importDefault(require("../middleware/user"));
dotenv_1.default.config();
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.getUserByUsername = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var username, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = req.params.username;
                        return [4 /*yield*/, User_1.default.findOne({ username: username })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, res.status(404).json((0, Packet_1.Packet)("No User Founded"))];
                        res.status(201).json((0, Packet_1.Packet)("User found", { user: user }));
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, isUser, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, User_1.default.findOne({ email: email }).populate("contacts")];
                    case 1:
                        isUser = _b.sent();
                        if (!User_1.default)
                            return [2 /*return*/, res.status(201).json((0, Packet_1.Packet)("No User with this Email ID"))];
                        try {
                            token = jsonwebtoken_1.default.sign({ email: email, password: password, _id: isUser._id }, process.env.SECURE_KEY);
                            res.status(201).json((0, Packet_1.Packet)("User LoggedIn", { user: isUser, token: token }));
                        }
                        catch (error) {
                            console.log({ error: error });
                            res.status(501).json((0, Packet_1.Packet)("Message"));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, name, username, isUserExist, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password, name = _a.name, username = _a.username;
                        console.log(req.body);
                        return [4 /*yield*/, User_1.default.findOne({ email: email })];
                    case 1:
                        isUserExist = _b.sent();
                        if (isUserExist) {
                            return [2 /*return*/, res.status(401).json({ message: "User Exist with this email" })];
                        }
                        user = new User_1.default({ email: email, password: password, name: name, username: username });
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent();
                        res.status(201).json((0, Packet_1.Packet)("User Created Succesfully", { user: user }));
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, body, isUserExist, updatedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        body = req.body;
                        return [4 /*yield*/, User_1.default.findById(id)];
                    case 1:
                        isUserExist = _a.sent();
                        if (!isUserExist) {
                            return [2 /*return*/, res.status(401).json({ message: "User Exist with this email" })];
                        }
                        return [4 /*yield*/, User_1.default.findByIdAndUpdate(id, __assign({}, body), { new: true })];
                    case 2:
                        updatedData = _a.sent();
                        updatedData === null || updatedData === void 0 ? void 0 : updatedData.encrypt();
                        res.status(201).json((0, Packet_1.Packet)("User Updated Succesfully", updatedData));
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, isUserExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, User_1.default.findById(id)];
                    case 1:
                        isUserExist = _a.sent();
                        if (!isUserExist) {
                            return [2 /*return*/, res.status(401).json({ message: "User Exist with this email" })];
                        }
                        return [4 /*yield*/, isUserExist.delete()];
                    case 2:
                        _a.sent();
                        res.status(201).json((0, Packet_1.Packet)("Deleted"));
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, decorator_1.get)("/:username"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "getUserByUsername", null);
    __decorate([
        (0, decorator_1.post)("/"),
        (0, decorator_1.bodyValidator)("email", "password"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "login", null);
    __decorate([
        (0, decorator_1.post)("/create"),
        (0, decorator_1.bodyValidator)("email", "password", "name", "username"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "create", null);
    __decorate([
        (0, decorator_1.patch)("/:id"),
        (0, decorator_1.use)(user_1.default),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "update", null);
    __decorate([
        (0, decorator_1.del)("/:id"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "delete", null);
    AuthController = __decorate([
        (0, decorator_1.controller)("/user")
    ], AuthController);
    return AuthController;
}());
