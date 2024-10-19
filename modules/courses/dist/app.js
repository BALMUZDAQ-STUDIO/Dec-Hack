"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const requestLogger_1 = __importDefault(require("./middlewares/requestLogger"));
const call_all_1 = require("./call-all");
mongoose_1.default.connect('mongodb://127.0.0.1:27017/mestodb');
const { PORT = 3000 } = process.env;
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.use(requestLogger_1.default);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.post('api/pdf', () => {
    (0, call_all_1.callAll)();
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
