import { OpenAI } from 'openai';
import fs from 'fs';

import configJson from '../../../config/config.json';

export const createThread = async (pdfUrl: string, promt: string) => {
  const openai = new OpenAI({ apiKey: configJson.ai.token });
  // A user wants to attach a file to a specific message, let's upload it.
  const file = await openai.files.create({
    file: fs.createReadStream(pdfUrl),
    purpose: 'assistants',
  });

  const thread = await openai.beta.threads.create({
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
};

export default createThread;
