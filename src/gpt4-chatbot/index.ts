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
  // OPENAI_AZURE_API_VERSION,
  OPENAI_GPT4_API_KEY,
  OPENAI_GPT4_BASE_PATH,
  OPENAI_GPT4_AZURE_MODEL_DEPLOYMENT,
} = process.env;

// check that all required environment variables are set
if (
  !OPENAI_GPT4_API_KEY ||
  !OPENAI_GPT4_BASE_PATH ||
  !OPENAI_GPT4_AZURE_MODEL_DEPLOYMENT
) {
  throw new Error(
    oneLineTrim`
      Missing one or more required environment variables:

      OPENAI_API_KEY, OPENAI_AZURE_DALLE_API_VERSION, OPENAI_AZURE_MODEL_DEPLOYMENT
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
  apiKey: OPENAI_GPT4_API_KEY,
  baseURL: `${OPENAI_GPT4_BASE_PATH}openai/deployments/${OPENAI_GPT4_AZURE_MODEL_DEPLOYMENT}`,
  defaultQuery: { 'api-version': '2023-08-01-preview' },
  defaultHeaders: { 'api-key': OPENAI_GPT4_API_KEY },
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
      model: OPENAI_GPT4_AZURE_MODEL_DEPLOYMENT,
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
