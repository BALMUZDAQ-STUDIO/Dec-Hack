import OpenAI from 'openai';

// const openai = new OpenAI({ apiKey: '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' });

(async () => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text', text: `You are an expert software engineer and course creator.
         Use you knowledge to create a micro-learning course for a beginner software engineer.
         When user enter a name a lesson you should return the first lesson in JSON format.
         Then user can ask for the next lesson and you should generate next lesson with format:
         {"lessonTitle": "string", "paragraphs": [{"subtitle": "string", "text": "string"}]}.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: 'http://localhost:3000/book.pdf',
            },
          },
        ],
      },
    ],
  });

  console.log(completion.choices[0].message);
})();



// Тестовый файл
