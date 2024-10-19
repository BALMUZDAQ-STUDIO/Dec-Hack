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
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAll = void 0;
const create_thread_with_pdf_1 = require("./create-thread-with-pdf");
const run_1 = require("./run");
const readRun_1 = require("./readRun");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const callAll = (pdfUrl, promt) => __awaiter(void 0, void 0, void 0, function* () {
    const thread = yield (0, create_thread_with_pdf_1.createThread)(pdfUrl, promt);
    // console.log('thread: ', thread);
    const runs = [];
    for (let i = 0; i < 10; i++) {
        const run = yield (0, run_1.launchRun)(thread.id, i);
        runs.push(run);
    }
    yield sleep(30000);
    console.log('runs after waiting:', runs);
    return Promise.all(runs.map((response) => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield (0, readRun_1.readRun)(thread.id, response.run.id);
        console.log('callAll messages: ', messages);
        return messages;
    })));
    // const res = await readRun(thread.id, run.id);
    // console.log('res: ', res);
});
exports.callAll = callAll;
// callAll('../public/book.pdf', 'generate a course about development via Phaser.js');
exports.default = exports.callAll;
