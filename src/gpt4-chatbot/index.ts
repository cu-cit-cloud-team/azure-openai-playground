import readline from 'node:readline';
import chalk from 'chalk';
import { oneLineTrim } from 'common-tags';
import dotenv from 'dotenv';
import inquirer, { Answers } from 'inquirer';
import OpenAI from 'openai';

import { showGoodbye } from '../lib/helpers.js';

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const {
  // AOAI_API_VERSION,
  AOAI_API_KEY,
  AOAI_BASE_PATH,
  AOAI_GPT4_DEPLOYMENT_NAME,
} = process.env;

// check that all required environment variables are set
if (!AOAI_API_KEY || !AOAI_BASE_PATH || !AOAI_GPT4_DEPLOYMENT_NAME) {
  throw new Error(
    oneLineTrim`
      Missing one or more required environment variables:

      AOAI_API_KEY, AOAI_BASE_PATH, AOAI_GPT4_DEPLOYMENT_NAME
    `
  );
}

readline.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (ch, key) => {
  if (key.ctrl && key.name === 'c') {
    process.stdin.pause();
    console.log('');
    console.log(showGoodbye());
    process.exit(0);
  }
});

// instantiate the OpenAI client for Azure OpenAI
const openAI = new OpenAI({
  apiKey: AOAI_API_KEY,
  baseURL: `${AOAI_BASE_PATH}openai/deployments/${AOAI_GPT4_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': '2023-08-01-preview' },
  defaultHeaders: { 'api-key': AOAI_API_KEY },
});

console.clear();
console.log(
  '📡',
  chalk.bold.italic.green('Connection established... begin chatting!')
);

const systemMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
  role: 'system',
  content: 'You are an AI assistant that helps people find information.',
};

// const systemMessage = {
//   role: 'system',
//   content: oneLineTrim`
//     You are a level 1 technical support assistant for central information
//     technology at an ivy league university. You do a wonderful job but
//     have a bad attitude and usually provide helpful information in a
//     sarcastic way.
//   `,
// };

const messages = [systemMessage];

const chatPrompt = async (): Promise<void> => {
  const answer: Answers = await inquirer.prompt({
    type: 'input',
    name: 'message',
    prefix: '',
    message: '> ',
  });

  const { message } = answer;

  messages.push({ role: 'user', content: (message as string).trim() });

  let stream;
  try {
    stream = await openAI.chat.completions.create({
      model: AOAI_GPT4_DEPLOYMENT_NAME,
      messages,
      stream: true,
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  if (stream) {
    // console.log(stream);
    let fullResponse = '';
    process.stdout.write('🤖  ');
    for await (const part of stream) {
      const textPart = part.choices[0]?.delta?.content || '';
      fullResponse += textPart;
      process.stdout.write(chalk.blue(textPart));
    }
    if (fullResponse.length) {
      messages.push({ role: 'assistant', content: fullResponse });
    }
    stream = null;
    console.log('');
  }

  await chatPrompt();
};

await chatPrompt();
