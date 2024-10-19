"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThread = void 0;
const openai_1 = require("openai");
const fs_1 = __importDefault(require("fs"));
const config_json_1 = __importDefault(require("../../../config/config.json"));
const createThread = (pdfUrl, promt) => __awaiter(void 0, void 0, void 0, function* () {
    const openai = new openai_1.OpenAI({ apiKey: config_json_1.default.ai.token });
    // A user wants to attach a file to a specific message, let's upload it.
    const file = yield openai.files.create({
        file: fs_1.default.createReadStream(pdfUrl),
        purpose: 'assistants',
    });
    const thread = yield openai.beta.threads.create({
        messages: [
            {
                role: 'user',
                content: promt,
                // Attach the new file to the message.
                attachments: [{ file_id: file.id, tools: [{ type: 'file_search' }] }],
            },
        ],
    });
    // console.log(' createThread: ', JSON.stringify(thread));
    return thread;
});
exports.createThread = createThread;
exports.default = exports.createThread;
