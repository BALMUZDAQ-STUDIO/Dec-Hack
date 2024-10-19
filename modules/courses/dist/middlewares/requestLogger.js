"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
// создадим логер запросов
const requestLogger = express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.simple(),
        }),
        new winston_1.default.transports.File({
            filename: 'request.log',
        }),
    ],
    format: winston_1.default.format.json(),
});
exports.default = requestLogger;
