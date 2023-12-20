import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { oneLineTrim } from 'common-tags';
import dotenv from 'dotenv';
import got from 'got';
import OpenAI from 'openai';

import { showGoodbye } from '../lib/helpers.js';

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const {
  AOAI_WHISPER_API_KEY,
  AOAI_WHISPER_BASE_PATH,
  AOAI_WHISPER_MODEL_DEPLOYMENT,
  AOAI_WHISPER_API_VERSION,
} = process.env;

if (
  !AOAI_WHISPER_API_KEY ||
  !AOAI_WHISPER_BASE_PATH ||
  !AOAI_WHISPER_MODEL_DEPLOYMENT ||
  !AOAI_WHISPER_API_VERSION
) {
  // check that all required environment variables are set
  throw new Error(
    oneLineTrim`
      Missing one or more required environment variables:

      AOAI_WHISPER_API_KEY, AOAI_WHISPER_BASE_PATH, AOAI_WHISPER_MODEL_DEPLOYMENT, AOAI_WHISPER_API_VERSION
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
  apiKey: AOAI_WHISPER_API_KEY,
  baseURL: `${AOAI_WHISPER_BASE_PATH}openai/deployments/${AOAI_WHISPER_MODEL_DEPLOYMENT}`,
  defaultQuery: { 'api-version': AOAI_WHISPER_API_VERSION },
  defaultHeaders: { 'api-key': AOAI_WHISPER_API_KEY },
});

// source (30s starting at 5s): https://www.youtube.com/watch?v=UxuzJ-NJ1yQ&t=5s

const audioFile = await fs.createReadStream(
  path.resolve('./src/whisper-transcribe-mp3/audio/martha-pollack.mp3')
);

const text = await openAI.audio.transcriptions.create({
  file: audioFile,
  language: 'en',
  response_format: 'json',
  temperature: 0,
});

console.log(text);

process.exit(0);
