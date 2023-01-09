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
var decorator_1 = require("../decorator");
var Chat_1 = __importDefault(require("../model/Chat"));
var Conversation_1 = __importDefault(require("../model/Conversation"));
var Packet_1 = require("../library/Packet");
var cryptography_1 = require("../util/cryptography");
var User_1 = __importDefault(require("../model/User"));
var mongoose_1 = __importDefault(require("mongoose"));
var ChatController = /** @class */ (function () {
    function ChatController() {
    }
    ChatController.prototype.getChat = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, chat, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, Chat_1.default.findById(id)];
                    case 1:
                        chat = _a.sent();
                        if (!chat)
                            return [2 /*return*/, res.status(404).json((0, Packet_1.Packet)("No Chat with this Id"))];
                        message = (0, cryptography_1.decrypt)(chat.message);
                        res.status(201).json((0, Packet_1.Packet)("Chat Founded", message));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatController.prototype.createChat = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, from, to, message, isUserExist, conversation, chat, conversation_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, from = _a.from, to = _a.to;
                        message = req.body.message;
                        return [4 /*yield*/, User_1.default.find({ $or: [{ _id: from }, { _id: to }] })];
                    case 1:
                        isUserExist = _b.sent();
                        if (isUserExist.length !== 2)
                            return [2 /*return*/, res.status(404).json((0, Packet_1.Packet)("User is Missing"))];
                        return [4 /*yield*/, Conversation_1.default.findOne({
                                $or: [
                                    { from: from, to: to },
                                    { from: to, to: from },
                                ],
                            })];
                    case 2:
                        conversation = _b.sent();
                        chat = new Chat_1.default({ from: from, to: to, message: message });
                        chat.encrypt();
                        return [4 /*yield*/, chat.save()];
                    case 3:
                        _b.sent();
                        if (!!conversation) return [3 /*break*/, 8];
                        conversation_1 = new Conversation_1.default({ from: from, to: to });
                        return [4 /*yield*/, User_1.default.updateMany({ $or: [{ _id: from }, { _id: to }] }, { $push: { conversations: conversation_1._id } })];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, User_1.default.findOneAndUpdate({ _id: from }, { $push: { contacts: to } }, { new: true })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, User_1.default.findOneAndUpdate({ _id: to }, { $push: { contacts: from } }, { new: true })];
                    case 6:
                        _b.sent();
                        conversation_1 === null || conversation_1 === void 0 ? void 0 : conversation_1.conversation.push(chat._id);
                        return [4 /*yield*/, conversation_1.save()];
                    case 7:
                        _b.sent();
                        return [2 /*return*/, res.status(201).json((0, Packet_1.Packet)("Chat Added", { chat: chat }))];
                    case 8:
                        conversation === null || conversation === void 0 ? void 0 : conversation.conversation.push(chat._id);
                        return [4 /*yield*/, conversation.save()];
                    case 9:
                        _b.sent();
                        res.status(201).json((0, Packet_1.Packet)("Chat Added", { chat: chat }));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatController.prototype.deleteChat = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!mongoose_1.default.Types.ObjectId.isValid(id))
                            return [2 /*return*/, res.status(201).json((0, Packet_1.Packet)("Invalid Id"))];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Chat_1.default.findByIdAndRemove(id)];
                    case 2:
                        _a.sent();
                        res.status(201).json((0, Packet_1.Packet)("Chat Deleted"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        res.status(501).json((0, Packet_1.Packet)("Error Occured"));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, decorator_1.get)("/:id"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], ChatController.prototype, "getChat", null);
    __decorate([
        (0, decorator_1.post)("/:from/:to"),
        (0, decorator_1.bodyValidator)("message"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], ChatController.prototype, "createChat", null);
    __decorate([
        (0, decorator_1.del)("/:id"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], ChatController.prototype, "deleteChat", null);
    ChatController = __decorate([
        (0, decorator_1.controller)("/chat")
    ], ChatController);
    return ChatController;
}());
