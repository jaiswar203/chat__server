"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = void 0;
function Packet(message, data) {
    if (!data)
        return { message: message };
    return { message: message, data: data };
}
exports.Packet = Packet;
