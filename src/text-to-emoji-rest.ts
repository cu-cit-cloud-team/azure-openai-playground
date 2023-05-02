import { oneLineTrim } from 'common-tags';
import dotenv from 'dotenv';
import got from 'got';

interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: CompletionChoice[];
}

interface CompletionChoice {
  text: string;
  index: number;
  logprobs: unknown;
  finish_reason: string;
}

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const {
  OPENAI_BASE_PATH,
  OPENAI_API_KEY,
  OPENAI_AZURE_MODEL_DEPLOYMENT,
  OPENAI_AZURE_API_VERSION,
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

const textToAnalyze = oneLineTrim`
  Cornell’s mission is to discover, preserve and disseminate knowledge, to educate the next
  generation of global citizens, and to promote a culture of broad inquiry throughout and
  beyond the Cornell community. Cornell also aims, through public service, to enhance the
  lives and livelihoods of students, the people of New York and others around the world.
`;

// prompt that will be sent to (Azure) OpenAI for a completion
const prompt = oneLineTrim`
  Analyze the following text and return a JSON array of objects containing unique unicode v15
  emojis that best represent it. Each object in the array should contain the emoji, the
  markdown short code for the emoji, and the reasoning for choosing it. Don't return any
  duplicate emojis.

  Analyze the following text and return only the JSON array of objects:

  ${textToAnalyze}
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
    temperature: 0.2,
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

console.log(completion);

// output execution time in milliseconds
const debugEndTime = hrtime(debugStartTime);
const debugOutput = `\nExecution time: ${
  debugEndTime[0] * 1000 + debugEndTime[1] / 1000000
}ms`;
console.log(debugOutput);
