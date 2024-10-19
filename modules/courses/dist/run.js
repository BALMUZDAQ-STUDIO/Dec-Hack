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
exports.launchRun = void 0;
const openai_1 = require("openai");
const launchRun = (threadId, lessonNumber) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('launchRun threadId: ', threadId);
    const openai = new openai_1.OpenAI({ apiKey: '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' });
    const message = yield openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: `generate content for lesson #${lessonNumber}`,
    });
    // console.log('launchRun message: ', JSON.stringify(message));
    const run = yield openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: 'asst_E8uWdZq9BQYgDA5xJ8sjRlzz',
    });
    // console.log('launchRun run:', JSON.stringify(run));
    const messages = yield openai.beta.threads.messages.list(threadId, {
        run_id: run.id,
    });
    // console.log('launchRun messages: ', JSON.stringify(messages));
    return { run, messages };
});
exports.launchRun = launchRun;
// run('thread_KZVMHRg5Yx66cgbrMZndztgz');
