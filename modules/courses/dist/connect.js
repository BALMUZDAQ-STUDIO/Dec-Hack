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
const openai_1 = __importDefault(require("openai"));
const config_json_1 = __importDefault(require("../../../config/config.json"));
const openai = new openai_1.default({ apiKey: config_json_1.default.ai.token });
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('start connect');
    try {
        const res = yield openai.beta.assistants.update('asst_TBCTSZe88NCmawVnUgbXMoaz', {
            tool_resources: { file_search: { vector_store_ids: ['vs_tzwFHTX5i7C7I8HSP4E3BPMT'] } },
        });
        console.log('res: ', res);
    }
    catch (error) {
        console.log('error: ', error);
    }
    console.log('success!');
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('start main');
    yield connect();
});
main();
