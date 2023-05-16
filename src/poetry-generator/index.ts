import { oneLineTrim } from 'common-tags';
import dotenv from 'dotenv';
import got from 'got';
import yargs from 'yargs';

import { PoeticForm, poeticForms } from '../lib/helpers.js';

export interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: CompletionChoice[];
}

export interface CompletionChoice {
  text: string;
  index: number;
  logprobs: unknown;
  finish_reason: string;
}

interface Arguments {
  [x: string]: unknown;
  a: boolean;
  b: string;
  c: number | undefined;
  d: (string | number)[] | undefined;
  e: number;
  f: string | undefined;
}

const argv = yargs(process.argv.slice(2)).argv as unknown as Arguments;

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
  !OPENAI_AZURE_MODEL_DEPLOYMENT ||
  !OPENAI_AZURE_API_VERSION
) {
  throw new Error(
    oneLineTrim`
      Missing one or more required environment variables:

      OPENAI_BASE_PATH, OPENAI_API_KEY, OPENAI_AZURE_MODEL_DEPLOYMENT, OPENAI_AZURE_API_VERSION
    `,
  );
  process.exit(1);
}

// get current high-resolution real-time from process in nanoseconds
const { hrtime } = process;
const debugStartTime = hrtime();

// set common request headers used in multiple requests
const requestHeaders = {
  'api-key': OPENAI_API_KEY,
  'User-Agent': 'cloud-team-automation',
};

// build the endpoint URL
const apiUrl = `${OPENAI_BASE_PATH}/openai/deployments/${OPENAI_AZURE_MODEL_DEPLOYMENT}/completions?api-version=${OPENAI_AZURE_API_VERSION}`;

const requestedForm =
  argv.poemType && typeof argv.poemType === 'string'
    ? argv.poemType
    : poeticForms[Math.floor(Math.random() * poeticForms.length)].type;

const poemType: PoeticForm = poeticForms.filter(
  (poeticForm) => poeticForm.type.toLowerCase() === requestedForm.toLowerCase(),
)[0];

const poemSubject = argv.poemSubject ?? 'Cornell University';

const prompt = `You are a poetry generator with the following parameters:

  - Users submit the poetic form they want and the subject matter for the poem.
  - You should adhere to the poetic form's rules and the subject.
  - Generate a ${poemType.type}.
  - The rules for a ${poemType.type} are:
    - ${poemType.rules}
  - Here's an example ${poemType.type} that follows the rules for a ${
  poemType.type
}:
    ${poemType.example}
  - Generate an original ${poemType.type} poem about ${
  poemSubject as string
} that follows the rules. Don't use the words in the example.
`;

const completionResponseBody = await got({
  method: 'POST',
  url: apiUrl,
  headers: {
    ...requestHeaders,
    'Content-Type': 'application/json',
  },
  json: {
    prompt,
    temperature: 0,
    max_tokens: 1000,
  },
})
  .then((response) => response.body)
  .catch((error) => {
    // output error and stop processing
    console.error(error);
    process.exit(1);
  });

const completionResponse = JSON.parse(
  completionResponseBody,
) as CompletionResponse;
const completion = completionResponse.choices[0].text.trim();

console.log(
  `${poemType.type} about ${poemSubject as string}:\n\n${completion}`,
);

if (NODE_ENV === 'development') {
  // output execution time in milliseconds
  const debugEndTime = hrtime(debugStartTime);
  const debugOutput = `\nExecution time: ${
    debugEndTime[0] * 1000 + debugEndTime[1] / 1000000
  }ms`;
  console.log(debugOutput);
}
