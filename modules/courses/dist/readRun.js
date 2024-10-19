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
exports.readRun = void 0;
const openai_1 = require("openai");
const openai = new openai_1.OpenAI({ apiKey: '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' });
const readRun = (threadId, runId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('readRun threadId: ', threadId);
    // console.log('readRun runId: ', runId);
    const messages = yield openai.beta.threads.messages.list(threadId, {
        run_id: runId,
    });
    // console.log('readRun messages: ', JSON.stringify(messages));
    const message = messages.data.pop();
    // console.log('readRun message: ', message);
    if (message.content[0].type === 'text') {
        const { text } = message.content[0];
        const { annotations } = text;
        // const citations: string[] = [];
        // console.log('annotations: ', annotations);
        // const index = 0;
        // eslint-disable-next-line no-restricted-syntax
        // for (const annotation of annotations) {
        // text.value = text.value.replace(annotation.text, `[${index}]`);
        // const { file_citation } = annotation;
        // if (file_citation) {
        //   const citedFile = await openai.files.retrieve(file_citation.file_id);
        //   citations.push(`[${index}]${citedFile.filename}`);
        // }
        // index++;
        // }
        // console.log(text.value);
        // console.log(citations.join('\n'));
        return text.value;
    }
});
exports.readRun = readRun;
exports.default = exports.readRun;