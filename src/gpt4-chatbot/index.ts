import readline from 'node:readline';
import { ChatOpenAI } from '@langchain/openai';
import chalk from 'chalk';
import { oneLine } from 'common-tags';
import dotenv from 'dotenv';
import inquirer, { Answers } from 'inquirer';

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
    oneLine`
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
const chat = new ChatOpenAI({
  azureOpenAIApiKey: AOAI_API_KEY,
  azureOpenAIBasePath: `${AOAI_BASE_PATH}openai/deployments/`,
  azureOpenAIApiVersion: '2023-12-01-preview',
  azureOpenAIApiDeploymentName: AOAI_GPT4_DEPLOYMENT_NAME,
  temperature: 0,
  maxTokens: 2000,
});

console.clear();
console.log(
  '📡',
  chalk.bold.italic.green('Connection established... begin chatting!')
);

const systemMessage = [
  'system',
  'You are an AI assistant that helps people find information.',
];

// const systemMessage = [
//   'system',
//   oneLine`
//     You are a level 1 technical support assistant for central information
//     technology at an ivy league university. You do a wonderful job but
//     have a bad attitude and usually provide helpful information in a
//     sarcastic way.
//   `,
// ];

const messages = [systemMessage];

const chatPrompt = async (): Promise<void> => {
  const answer: Answers = await inquirer.prompt({
    type: 'input',
    name: 'message',
    prefix: '',
    message: '> ',
  });

  const { message } = answer;

  messages.push(['user', (message as string).trim()]);

  const stream = await chat.stream(messages);

  if (stream) {
    // console.log(stream);
    let fullResponse = '';
    process.stdout.write('🤖  ');
    for await (const chunk of stream) {
      const textPart = chunk?.content || '';
      fullResponse += textPart;
      process.stdout.write(chalk.blue(textPart));
    }
    if (fullResponse.length) {
      messages.push(['assistant', fullResponse]);
    }
    console.log('');
  }

  await chatPrompt();
};

await chatPrompt();
