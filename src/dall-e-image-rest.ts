import { oneLineTrim } from 'common-tags';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import fs from 'node:fs';
import got from 'got';

import {
  ImageOperationResponse,
  ImageOperationResponseResult,
} from './lib/dall-e.js';
import { wait } from './lib/helpers.js';

// define typescript resources
interface ImageOperationResponseResult {
  caption: string;
  contentUrl?: string;
  contentUrlExpiresAt?: string;
  createdDateTime: string;
}

interface ImageOperationResponse {
  id: string;
  result: ImageOperationResponseResult;
  status: string;
}

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const { OPENAI_BASE_PATH, OPENAI_API_KEY, OPENAI_AZURE_DALLE_API_VERSION } =
  process.env;

if (!OPENAI_BASE_PATH || !OPENAI_API_KEY || !OPENAI_AZURE_DALLE_API_VERSION) {
  throw new Error(
    'Missing one or more required environment variables: OPENAI_BASE_PATH, OPENAI_API_KEY, OPENAI_AZURE_DALLE_API_VERSION',
  );
  process.exit(1);
}

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
const imagePrompt = oneLineTrim`
    Detailed image of a clocktower with a pumpkin on the very top of it's spire
  `;

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
// request completed image
await got({
  url: imageUrl,
  method: 'GET',
  responseType: 'text',
  encoding: 'base64',
  headers: {
    ...requestHeaders,
  },
}).then((response) => {
  // write image to local file
  fs.writeFileSync(`./generated-images/${imageId}.png`, response.body, {
    encoding: 'base64',
  });
  // output original prompt and image location
  console.log(imagePrompt);
  console.log(`Image saved to: '../generated-images/${imageId}.png'`);
});

// set and output debug/timing info
const debugEndTime = hrtime(debugStartTime);
const debugOutput = `\nExecution time: ${
  debugEndTime[0] * 1000 + debugEndTime[1] / 1000000
}ms`;
console.log(debugOutput);
