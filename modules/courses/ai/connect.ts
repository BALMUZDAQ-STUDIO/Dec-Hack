import OpenAI from 'openai';

import configJson from '../../../config/config.json';

const openai = new OpenAI({ apiKey: configJson.ai.token });

const connect = async () => {
  console.log('start connect');
  try {
    const res = await openai.beta.assistants.update('asst_TBCTSZe88NCmawVnUgbXMoaz', {
      tool_resources: { file_search: { vector_store_ids: ['vs_tzwFHTX5i7C7I8HSP4E3BPMT'] } },
    });

    console.log('res: ', res);
  } catch (error) {
    console.log('error: ', error);
  }

  console.log('success!');
};

const main = async () => {
  console.log('start main');
  await connect();
};

main();
