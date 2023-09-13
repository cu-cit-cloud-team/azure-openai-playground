/**
 * NOTE: this example works best with a text-davinci based model,
 * code tested against text-davinci-003
 */

import { oneLineTrim, stripIndents } from 'common-tags';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const {
  OPENAI_BASE_PATH,
  OPENAI_API_KEY,
  OPENAI_AZURE_MODEL_DEPLOYMENT,
  OPENAI_AZURE_API_VERSION,
  NODE_ENV,
} = process.env;

// check that all required environment variables are set
if (
  !OPENAI_BASE_PATH ||
  !OPENAI_API_KEY ||
  !OPENAI_AZURE_API_VERSION ||
  !OPENAI_AZURE_MODEL_DEPLOYMENT
) {
  throw new Error(
    oneLineTrim`
      Missing one or more required environment variables:

      OPENAI_BASE_PATH, OPENAI_API_KEY, OPENAI_AZURE_DALLE_API_VERSION, OPENAI_AZURE_MODEL_DEPLOYMENT
    `,
  );
}

// get current high-resolution real-time from process in nanoseconds
const { hrtime } = process;
const debugStartTime = hrtime();

// instantiate the OpenAI client for Azure OpenAI
const openAI = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: `${OPENAI_BASE_PATH}openai/deployments/${OPENAI_AZURE_MODEL_DEPLOYMENT}`,
  defaultQuery: { 'api-version': '2023-06-01-preview' },
  defaultHeaders: { 'api-key': OPENAI_API_KEY },
});

// set to the text you want to analyze (default is CU mission)
const textToAnalyze = oneLineTrim`
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
  Analyze the text delimited by triple quotes and return a JSON array of objects containing unique unicode
  v15 emojis that best represent it.
  - Each object in the array should contain the emoji, the markdown short code for the emoji, and the reasoning for choosing it
  - JSON response should have a shape of: ${JSON.stringify(resultsShape)}.
  - Each emoji should be unique, do NOT return duplicate emojis even if the reason is different.

  ---
  """${textToAnalyze}"""
  ---
`;

// make request to generate the completion
const gptExample = await openAI.completions
  .create({
    prompt,
    temperature: 0,
    max_tokens: 1000,
    model: OPENAI_AZURE_MODEL_DEPLOYMENT,
  })
  .then((response) => response.choices[0].text)
  .catch((error) => {
    // output error and stop processing
    console.error(error);
    process.exit(1);
  });

// assume output is good and parse it
// const results = gptExample.trim();
console.log(JSON.parse(gptExample));

if (NODE_ENV === 'development') {
  // output execution time in milliseconds
  const debugEndTime = hrtime(debugStartTime);
  const debugOutput = `\nExecution time: ${
    debugEndTime[0] * 1000 + debugEndTime[1] / 1000000
  }ms`;
  console.log(debugOutput);
}
