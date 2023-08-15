import chalk from 'chalk';
import dotenv from 'dotenv';
import { oneLineTrim } from 'common-tags';
import readline from 'node:readline';
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
    `,
  );
  process.exit(1);
}

readline.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (ch, key: KeyPressKey) => {
  if (key.ctrl && key.name == 'c') {
    process.stdin.pause();
    console.log(showGoodbye());
    process.exit(0);
  }
});

// instantiate the OpenAI client for Azure OpenAI
const openAI = new OpenAI({
  apiKey: OPENAI_GPT4_API_KEY,
  baseURL: `${OPENAI_GPT4_BASE_PATH}openai/deployments/${OPENAI_GPT4_AZURE_MODEL_DEPLOYMENT}`,
  defaultQuery: { 'api-version': '2023-06-01-preview' },
  defaultHeaders: { 'api-key': OPENAI_GPT4_API_KEY },
});

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.clear();
console.log(
  '📡',
  chalk.bold.italic.green('Connection established... begin chatting!'),
);
userInterface.prompt();

const systemMessage = {
  role: 'system',
  content: 'You are a helpful AI assistant.',
};

const messages = [systemMessage];

// eslint-disable-next-line @typescript-eslint/no-misused-promises
userInterface.on('line', async (input) => {
  messages.push({ role: 'user', content: input });

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
    process.stdout.write('🤖\n');
    for await (const part of stream) {
      const textPart = part.choices[0]?.delta?.content || '';
      fullResponse += textPart;
      process.stdout.write(chalk.blue(textPart));
    }
    if (fullResponse.length) {
      messages.push({ role: 'assistant', content: fullResponse });
    }
    stream = null;
    process.stdout.write('\n🔚\n');
  }
});
