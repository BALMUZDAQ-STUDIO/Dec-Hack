import { OpenAI } from 'openai';

import configJson from '../../../config/config.json';

const openai = new OpenAI({ apiKey: configJson.ai.token });

export const readRun = async (threadId: string, runId: string) => {
  // console.log('readRun threadId: ', threadId);
  // console.log('readRun runId: ', runId);
  const messages = await openai.beta.threads.messages.list(threadId, {
    run_id: runId,
  });

  // console.log('readRun messages: ', JSON.stringify(messages));
  const message = messages.data.pop()!;

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
};

export default readRun;
