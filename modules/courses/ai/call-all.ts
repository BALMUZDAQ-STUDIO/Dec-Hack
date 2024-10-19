import { createThread } from './create-thread-with-pdf';
import { launchRun } from './run';
import { readRun } from './readRun';

import configJson from '../../../config/config.json';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const callAll = async (pdfUrl: string, promt: string) => {
  const thread = await createThread(pdfUrl, promt);
  // console.log('thread: ', thread);
  const runs = [];
  for (let i = 0; i < 10; i++) {
    const run = await launchRun(thread.id, i);
    runs.push(run);
  }
  await sleep(30_000);
  console.log('runs after waiting:', runs);

  return Promise.all(runs.map(async (response) => {
    const messages = await readRun(thread.id, response.run.id);
    console.log('callAll messages: ', messages);
    return messages;
  }));
  // const res = await readRun(thread.id, run.id);
  // console.log('res: ', res);
};

// callAll('../public/book.pdf', 'generate a course about development via Phaser.js');

export default callAll;
