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

/**
 * @function
 * @description returns default headers for reuse in Azure OpenAI API requests
 * @param {string} [userAgent='cloud-team-automation']  The user agent to use in the headers.
 * @returns {Headers} An object containing the headers
 */
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
  }
  return {
    'api-key': OPENAI_API_KEY,
    'User-Agent': userAgent,
  };
};

/**
 * @function
 * @description This function returns the URL for generating images using Azure OpenAI's DALL-E API.
 * @returns {string} The URL for generating images.
 */
export const imageGenerationUrl = (): string => {
  if (!OPENAI_BASE_PATH || !OPENAI_AZURE_DALLE_API_VERSION) {
    throw new Error(
      oneLineTrim`
      Missing one or more required environment variables:

      OPENAI_BASE_PATH, OPENAI_AZURE_DALLE_API_VERSION
    `,
    );
  }

  return `${OPENAI_BASE_PATH}dalle/text-to-image?api-version=${OPENAI_AZURE_DALLE_API_VERSION}`;
};

/**
 * @function
 * @description This function returns the URL for text completion using Azure OpenAI's API.
 * @returns {string} The URL for text completion.
 */
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
  }

  return `${OPENAI_BASE_PATH}/openai/deployments/${OPENAI_AZURE_MODEL_DEPLOYMENT}/completions?api-version=${OPENAI_AZURE_API_VERSION}`;
};

/**
 * @async
 * @function
 * @description This function submits a request to generate an image using OpenAI's DALL-E API.
 * @param {SubmitImageGenerationRequestParams} params - object with parameters for the request.
 * @param {string} params.prompt - The prompt for the image generation.
 * @param {string} [params.apiUrl] - The URL for the API endpoint.
 * @param {string} [params.resolution] - The resolution of the generated image.
 * @param {string} [params.format] - The format of the generated image.
 * @param {number} [params.numImages] - The number of images to generate.
 * @param {Headers} [params.requestHeaders] - The headers for the request.
 * @returns {Promise<string>} A promise that resolves with the image generation operation URL.
 */
export const submitImageGenerationRequest = async ({
  prompt: caption,
  apiUrl: url = imageGenerationUrl(),
  resolution = '1024x1024',
  format = 'b64_json',
  numImages: n = 1,
  requestHeaders = defaultHeaders(),
}: SubmitImageGenerationRequestParams): Promise<string> => {
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

/**
 * @async
 * @function
 * @description This function gets the result of an image generation request using OpenAI's DALL-E API.
 * @param {GetImageGenerationResultParams} params - object with parameters for the request.
 * @param {string} params.operationUrl - The URL for the operation.
 * @param {Headers} [params.requestHeaders] - The headers for the request.
 * @returns {Promise<string>} A promise that resolves with the generated image.
 */
export const getImageGenerationResult = async ({
  imageOperationUrl: url,
  requestHeaders = defaultHeaders(),
}: GetImageGenerationResultParams): Promise<string> => {
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

/**
 * @async
 * @function
 * @description This function saves the generated image to a file.
 * @param {SaveImageGenerationResultParams} params - The parameters for saving the image.
 * @param {string} params.imageUrl - The URL of the generated image.
 * @param {string} [params.imageName=uuid()] - The name of the image file to save.
 * @param {string} [params.saveToPath='./src/dall-e-image-rest/generated-images/'] - The path to save the image file to.
 * @param {Record<string, string>} [params.requestHeaders=defaultHeaders()] - The headers for the image request.
 * @returns {Promise<string>} A promise that resolves with the full path to the saved image file.
 */
export const saveImageGenerationResult = async ({
  imageUrl: url,
  imageName = uuid(),
  saveToPath = './src/dall-e-image-rest/generated-images/',
  requestHeaders = defaultHeaders(),
}: SaveImageGenerationResultParams): Promise<string> => {
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

/**
 * @async
 * @function
 * @description This function provides text completion suggestions for the given prompt using OpenAI's API.
 * @param {TextCompletionParams} params - The parameters for the text completion request.
 * @param {string} params.prompt - The prompt for the text completion request.
 * @param {string} [params.apiUrl=textCompletionUrl()] - The URL for the text completion API.
 * @param {Headers} [params.requestHeaders=defaultHeaders()] - The headers for the text completion request.
 * @param {number} [params.maxTokens=1000] - The maximum number of tokens to generate for the text completion.
 * @param {number} [params.temperature=0.2] - The sampling temperature to use for the text completion.
 * @returns {Promise<string>} A promise that resolves with the generated text completion.
 */
export const doTextCompletion = async ({
  prompt,
  apiUrl: url = textCompletionUrl(),
  requestHeaders = defaultHeaders(),
  maxTokens: max_tokens = 1000,
  temperature = 0.2,
}: TextCompletionParams): Promise<string> => {
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

/**
 * @async
 * @function
 * @description This function submits a request to generate an image using OpenAI's DALL-E API and saves the result to a file.
 * @param {string} prompt - The prompt for the image generation.
 * @returns {Promise<string>} A promise that resolves with the path to the saved image.
 */
export const generateAndSaveImage = async (prompt: string): Promise<string> => {
  const imageOperationUrl = await submitImageGenerationRequest({
    prompt,
  });
  // console.log(imageOperationUrl);

  const imageUrl = await getImageGenerationResult({
    imageOperationUrl,
  });
  // console.log(imageUrl);

  const savedImagePath = await saveImageGenerationResult({
    imageUrl,
  });
  // console.log(savedImagePath);

  return savedImagePath;
};
