import { Configuration, OpenAIApi } from 'openai';
import { oneLineTrim } from 'common-tags';
import dotenv from 'dotenv';

dotenv.config();

const {
  OPENAI_BASE_PATH,
  OPENAI_API_KEY,
  OPENAI_AZURE_MODEL_DEPLOYMENT,
  OPENAI_AZURE_API_VERSION,
} = process.env;

if (
  !OPENAI_BASE_PATH ||
  !OPENAI_API_KEY ||
  !OPENAI_AZURE_API_VERSION ||
  !OPENAI_AZURE_MODEL_DEPLOYMENT
) {
  throw new Error(
    'Missing one or more required environment variables: OPENAI_BASE_PATH, OPENAI_API_KEY, OPENAI_AZURE_DALLE_API_VERSION, OPENAI_AZURE_MODEL_DEPLOYMENT',
  );
  process.exit(1);
}

const clientConfig = new Configuration({
  baseOptions: {
    headers: {
      'api-key': OPENAI_API_KEY,
    },
    params: { 'api-version': OPENAI_AZURE_API_VERSION },
  },
  basePath: `${OPENAI_BASE_PATH}openai/deployments/${OPENAI_AZURE_MODEL_DEPLOYMENT}`,
});

const openAIClient = new OpenAIApi(clientConfig);

const textToAnalyze = oneLineTrim`
  Cornell’s mission is to discover, preserve and disseminate knowledge, to educate the next
  generation of global citizens, and to promote a culture of broad inquiry throughout and
  beyond the Cornell community. Cornell also aims, through public service, to enhance the
  lives and livelihoods of students, the people of New York and others around the world.
`;

const prompt = oneLineTrim`
  Analyze the following text and return a JSON array of objects containing unique unicode v15
  emojis that best represent it. Each object in the array should contain the emoji, the
  markdown short code for the emoji, and the reasoning for choosing it.

  Analyze the following text and return only the array of objects as JSON:

  ${textToAnalyze}
`;

const gptExample = await openAIClient.createCompletion({
  prompt,
  temperature: 0.2,
  max_tokens: 1000,
});

const results = gptExample.data.choices[0].text.trim();

console.log(JSON.parse(results));
