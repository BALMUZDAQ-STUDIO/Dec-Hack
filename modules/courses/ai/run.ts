import { OpenAI } from 'openai';


import configJson from '../../../config/config.json';

export const launchRun = async (threadId: string, lessonNumber: number) => {
  // console.log('launchRun threadId: ', threadId);
  const openai = new OpenAI({ apiKey: configJson.ai.token });

  const message = await openai.beta.threads.messages.create(
    threadId,
    {
      role: 'user',
      content: `generate content for lesson #${lessonNumber}`,
    },
  );

  // console.log('launchRun message: ', JSON.stringify(message));

  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: 'asst_E8uWdZq9BQYgDA5xJ8sjRlzz',
  });
  // console.log('launchRun run:', JSON.stringify(run));

  const messages = await openai.beta.threads.messages.list(threadId, {
    run_id: run.id,
  });

  // console.log('launchRun messages: ', JSON.stringify(messages));

  return { run, messages };
};

// run('thread_KZVMHRg5Yx66cgbrMZndztgz');
