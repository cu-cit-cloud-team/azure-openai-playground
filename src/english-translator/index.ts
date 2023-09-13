import dotenv from 'dotenv';
import yargs from 'yargs';

import { stripIndents } from 'common-tags';
import { Arguments, randomNum } from '../lib/helpers.js';
import { doTextCompletion } from '../lib/openai.js';
import { Language, languages } from '../lib/translator.js';

const argv = yargs(process.argv.slice(2)).argv as unknown as Arguments;

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const { NODE_ENV } = process.env;

// get current high-resolution real-time from process in nanoseconds
const { hrtime } = process;
const debugStartTime = hrtime();

const requestedLanguage =
  argv.language && typeof argv.language === 'string'
    ? argv.language
    : languages[randomNum(languages.length)].name;

const language: Language = languages.filter(
  (language) => language.name.toLowerCase() === requestedLanguage.toLowerCase()
)[0];

const textToTranslate = argv.text ?? 'Where can I find some good tacos?';

const prompt = stripIndents`
  You are an English language translator that will accept English text
  and translate it to the requested language. Translate the following
  text into ${requestedLanguage}:

  ---
  ${textToTranslate}
  ---
`;

const completion = await doTextCompletion({ prompt, temperature: 0 });

console.log(
  `English to ${language.name} translation:\n\n${
    textToTranslate as string
  }\n\n${completion}`
);

if (NODE_ENV === 'development') {
  // output execution time in milliseconds
  const debugEndTime = hrtime(debugStartTime);
  const debugOutput = `\nExecution time: ${
    debugEndTime[0] * 1000 + debugEndTime[1] / 1000000
  }ms`;
  console.log(debugOutput);
}
