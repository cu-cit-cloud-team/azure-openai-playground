import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { oneLine } from 'common-tags';
import dotenv from 'dotenv';
import OpenAI from 'openai';

import { showGoodbye } from '../lib/helpers.js';

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const {
  AOAI_API_KEY,
  AOAI_BASE_PATH,
  AOAI_GPT4_VISION_DEPLOYMENT_NAME,
  AOAI_API_VERSION,
} = process.env;

if (
  !AOAI_API_KEY ||
  !AOAI_BASE_PATH ||
  !AOAI_GPT4_VISION_DEPLOYMENT_NAME ||
  !AOAI_API_VERSION
) {
  // check that all required environment variables are set
  throw new Error(
    oneLine`
      Missing one or more required environment variables:

      AOAI_API_KEY, AOAI_BASE_PATH, AOAI_GPT4_VISION_DEPLOYMENT_NAME, AOAI_API_VERSION
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

const openAI = new OpenAI({
  apiKey: AOAI_API_KEY,
  baseURL: `${AOAI_BASE_PATH}openai/deployments/${AOAI_GPT4_VISION_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': AOAI_API_VERSION },
  defaultHeaders: { 'api-key': AOAI_API_KEY },
});

const imageFile = await fs.readFileSync(
  path.resolve(
    './src/dall-e-image-rest/generated-images/5d811f1e-5ad7-4d88-bb46-09ae474003b4.png'
  ),
  'base64'
);

// console.log(imageFile);

const description = await openAI.chat.completions.create({
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe this image' },
        {
          type: 'image_url',
          image_url: {
            // url: 'https://raw.githubusercontent.com/CU-CommunityApps/ct-azure-openai-playground/main/src/dall-e-image-rest/generated-images/496d7a9c-b5bb-43a6-9d06-0d4475a6c939.png',
            detail: 'auto',
            url: `data:image/png;base64,${imageFile}`,
          },
        },
      ],
    },
  ],
});

console.log(description.choices[0].message.content);

process.exit(0);
