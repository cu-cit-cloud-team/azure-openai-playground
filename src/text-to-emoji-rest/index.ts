import { oneLineTrim, stripIndents } from 'common-tags';
import dotenv from 'dotenv';
import yargs from 'yargs';

import { Arguments } from '../lib/helpers.js';
import { doTextCompletion } from '../lib/openai.js';

const argv = yargs(process.argv.slice(2)).argv as unknown as Arguments;

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const { NODE_ENV } = process.env;

// get current high-resolution real-time from process in nanoseconds
const { hrtime } = process;
const debugStartTime = hrtime();

const textToAnalyze =
  argv.prompt ??
  oneLineTrim`
    Cornell's mission is to discover, preserve and disseminate knowledge, to educate the next
    generation of global citizens, and to promote a culture of broad inquiry throughout and
    beyond the Cornell community. Cornell also aims, through public service, to enhance the
    lives and livelihoods of students, the people of New York and others around the world.
`;

// example shape of JSON response we want to get back
const resultsShape = [
  {
    emoji: '',
    shortCode: '',
    reason: '',
  },
];

// prompt that will be sent to (Azure) OpenAI for a completion
const prompt = stripIndents`
  Analyze the supplied text and return a JSON array of objects containing unique unicode
  v15 emojis that best represent it. Each object in the array should contain the emoji,
  the markdown short code for the emoji, and the reasoning for choosing it. Do NOT return
  any duplicate emojis. JSON response should have a shape of: ${JSON.stringify(
    resultsShape,
  )}.

  Analyze this text:

  ---
  ${textToAnalyze}
  ---
`;

const completion = await doTextCompletion({ prompt });

console.log(completion);

if (NODE_ENV === 'development') {
  // output execution time in milliseconds
  const debugEndTime = hrtime(debugStartTime);
  const debugOutput = `\nExecution time: ${
    debugEndTime[0] * 1000 + debugEndTime[1] / 1000000
  }ms`;
  console.log(debugOutput);
}
