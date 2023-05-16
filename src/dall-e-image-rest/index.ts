import { oneLineTrim } from 'common-tags';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import fs from 'node:fs';
import got from 'got';
import terminalImage from 'terminal-image';
import yargs from 'yargs';

import { wait } from '../lib/helpers.js';

export interface ImageOperationResponseResult {
  caption: string;
  contentUrl?: string;
  contentUrlExpiresAt?: string;
  createdDateTime: string;
}

export interface ImageOperationResponse {
  id: string;
  result: ImageOperationResponseResult;
  status: string;
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
  OPENAI_AZURE_DALLE_API_VERSION,
  NODE_ENV,
} = process.env;

// check that all required environment variables are set
if (!OPENAI_BASE_PATH || !OPENAI_API_KEY || !OPENAI_AZURE_DALLE_API_VERSION) {
  throw new Error(
    oneLineTrim`
      Missing one or more required environment variables:

      OPENAI_BASE_PATH, OPENAI_API_KEY, OPENAI_AZURE_DALLE_API_VERSION
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
const apiUrl = `${OPENAI_BASE_PATH}dalle/text-to-image?api-version=${OPENAI_AZURE_DALLE_API_VERSION}`;

// set the prompt for the DALL-E image generation
const imagePrompt =
  argv.prompt ??
  oneLineTrim`
    Detailed image of a clocktower with a pumpkin on the very top of it's spire
  `;

// set whether or not to display the image in the terminal
const suppressImageDisplay = argv.display === 'false';

// set whether or not to display the prompt in the terminal output
const suppressPrompt = suppressImageDisplay;

// make request to generate the image
const createImageResponse = await got({
  method: 'POST',
  url: apiUrl,
  headers: {
    ...requestHeaders,
    'Content-Type': 'application/json',
  },
  json: {
    caption: imagePrompt,
    resolution: '1024x1024',
    format: 'b64_json',
  },
});

// extract operation url from the response headers
const imageOperationUrl = createImageResponse.headers[
  'operation-location'
] as string;
// console.log(imageOperationUrl);

// set a couple variables used in the loop
let retryNumber = 0;
let imageUrl = undefined;

// make requests to the operation url until the image url is returned
while (imageUrl === undefined) {
  const imageOperationResponse = await got({
    url: imageOperationUrl,
    method: 'GET',
    headers: {
      ...requestHeaders,
      'Content-Type': 'application/json',
    },
  });

  const imageOperationResponseBody = JSON.parse(
    imageOperationResponse.body,
  ) as ImageOperationResponse;

  const imageResult: ImageOperationResponseResult =
    imageOperationResponseBody.result;
  imageUrl = imageResult.contentUrl;
  // exponentially back-off based on retry number
  await wait(2 ** retryNumber * 10);
  retryNumber += 1;
}
// console.log(imageUrl);

// create unique id to use for image name
const imageId = uuid();

// set output path as var for reuse
const fullImagePath = `./src/dall-e-image-rest/generated-images/${imageId}.png`;

// request completed image
await got({
  url: imageUrl,
  method: 'GET',
  responseType: 'text',
  encoding: 'base64',
  headers: {
    ...requestHeaders,
  },
}).then(async (response) => {
  // write image to local file
  fs.writeFileSync(fullImagePath, response.body, {
    encoding: 'base64',
  });

  // output original prompt, image location, and image preview
  if (!suppressPrompt) {
    console.log(`Prompt: ${imagePrompt as string}`);
  }
  console.log(`Image saved to: '${fullImagePath}'`);
  if (!suppressImageDisplay) {
    const imagePreview = await terminalImage.file(fullImagePath, {
      width: '50%',
      height: '50%',
      preserveAspectRatio: true,
    });
    console.log(imagePreview);
  }
});

if (NODE_ENV === 'development') {
  // set and output debug/timing info
  const debugEndTime = hrtime(debugStartTime);
  const debugOutput = `\nExecution time: ${
    debugEndTime[0] * 1000 + debugEndTime[1] / 1000000
  }ms`;
  console.log(debugOutput);
}
