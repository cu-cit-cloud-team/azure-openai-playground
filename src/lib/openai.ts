import got, { Headers } from 'got';
import { oneLineTrim } from 'common-tags';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import fs from 'node:fs';

import { wait } from './helpers.js';

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const {
  OPENAI_BASE_PATH,
  OPENAI_API_KEY,
  OPENAI_AZURE_API_VERSION,
  OPENAI_AZURE_DALLE_API_VERSION,
  OPENAI_AZURE_MODEL_DEPLOYMENT,
} = process.env;

// ts interfaces
export interface TextCompletionParams {
  prompt: string;
  apiUrl?: string;
  maxTokens?: number;
  temperature?: number;
  requestHeaders?: Headers;
}

export interface TextCompletionResponseChoice {
  text: string;
  index: number;
  logprobs: unknown;
  finish_reason: string;
}

export interface TextCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: TextCompletionResponseChoice[];
}

export interface SubmitImageGenerationRequestParams {
  prompt: string;
  apiUrl?: string;
  resolution?: '1024x1024' | '512x512' | '256x256';
  format?: 'b64_json';
  numImages?: number;
  requestHeaders?: Headers;
}

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

export interface GetImageGenerationResultParams {
  imageOperationUrl: string;
  requestHeaders?: Headers;
}

export interface SaveImageGenerationResultParams {
  imageUrl: string;
  imageName?: string;
  saveToPath?: string;
  requestHeaders?: Headers;
}

// helper methods
export const defaultHeaders = (
  userAgent = 'cloud-team-automation',
): Headers => {
  if (!OPENAI_API_KEY) {
    throw new Error(
      oneLineTrim`
      Missing one or more required environment variables:

      OPENAI_API_KEY
    `,
    );
    process.exit(1);
  }
  return {
    'api-key': OPENAI_API_KEY,
    'User-Agent': userAgent,
  };
};

export const imageGenerationUrl = (): string => {
  if (!OPENAI_BASE_PATH || !OPENAI_AZURE_DALLE_API_VERSION) {
    throw new Error(
      oneLineTrim`
      Missing one or more required environment variables:

      OPENAI_BASE_PATH, OPENAI_AZURE_DALLE_API_VERSION
    `,
    );
    process.exit(1);
  }

  return `${OPENAI_BASE_PATH}dalle/text-to-image?api-version=${OPENAI_AZURE_DALLE_API_VERSION}`;
};

export const textCompletionUrl = (): string => {
  // check that all required environment variables are set
  if (
    !OPENAI_BASE_PATH ||
    !OPENAI_AZURE_MODEL_DEPLOYMENT ||
    !OPENAI_AZURE_API_VERSION
  ) {
    throw new Error(
      oneLineTrim`
      Missing one or more required environment variables:

      OPENAI_BASE_PATH, OPENAI_AZURE_MODEL_DEPLOYMENT, OPENAI_AZURE_API_VERSION
    `,
    );
    process.exit(1);
  }

  return `${OPENAI_BASE_PATH}/openai/deployments/${OPENAI_AZURE_MODEL_DEPLOYMENT}/completions?api-version=${OPENAI_AZURE_API_VERSION}`;
};

export const submitImageGenerationRequest = async ({
  prompt: caption,
  apiUrl: url = imageGenerationUrl(),
  resolution = '1024x1024',
  format = 'b64_json',
  numImages: n = 1,
  requestHeaders = defaultHeaders(),
}: SubmitImageGenerationRequestParams): string => {
  const createImageResponse = await got({
    method: 'POST',
    url,
    headers: {
      ...requestHeaders,
      'Content-Type': 'application/json',
    },
    json: {
      caption,
      resolution,
      format,
      n,
    },
  });

  // extract operation url from the response headers
  const imageOperationUrl = createImageResponse.headers[
    'operation-location'
  ] as string;
  // console.log(imageOperationUrl);
  return imageOperationUrl;
};

export const getImageGenerationResult = async ({
  imageOperationUrl: url,
  requestHeaders = defaultHeaders(),
}: GetImageGenerationResultParams): string => {
  // set a couple variables used in the loop
  let retryNumber = 0;
  let imageUrl = undefined;

  // make requests to the operation url until the image url is returned
  while (imageUrl === undefined) {
    const imageOperationResponse = await got({
      url,
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

  return imageUrl;
};

export const saveImageGenerationResult = async ({
  imageUrl: url,
  imageName = uuid(),
  saveToPath = './src/dall-e-image-rest/generated-images/',
  requestHeaders = defaultHeaders(),
}: SaveImageGenerationResultParams): string => {
  // set full save path as var for reuse
  const fullImagePath = `${saveToPath}${imageName}.png`;

  // request completed image
  await got({
    url,
    method: 'GET',
    responseType: 'text',
    encoding: 'base64',
    headers: {
      ...requestHeaders,
    },
  }).then((response) => {
    // write image to local file
    fs.writeFileSync(fullImagePath, response.body, {
      encoding: 'base64',
    });
  });

  return fullImagePath;
};

export const doTextCompletion = async ({
  prompt,
  apiUrl: url = textCompletionUrl(),
  requestHeaders = defaultHeaders(),
  maxTokens: max_tokens = 1000,
  temperature = 0.2,
}: TextCompletionParams): string => {
  const completionResponseBody = await got({
    method: 'POST',
    url,
    headers: {
      ...requestHeaders,
      'Content-Type': 'application/json',
    },
    json: {
      prompt,
      temperature,
      max_tokens,
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
  ) as TextCompletionResponse;

  const completion = completionResponse.choices[0].text.trim();

  return completion;
};
