import fs from 'node:fs';
import { oneLineTrim } from 'common-tags';
import dotenv from 'dotenv';
import got, { Headers } from 'got';
import { v4 as uuid } from 'uuid';

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const {
  AOAI_BASE_PATH,
  AOAI_API_KEY,
  AOAI_API_VERSION,
  AOAI_COMPLETIONS_DEPLOYMENT_NAME,
  AOAI_DALLE_API_VERSION,
  AOAI_DALLE_DEPLOYMENT_NAME,
  AOAI_GPT35_DEPLOYMENT_NAME,
  AOAI_GPT4_DEPLOYMENT_NAME,
  AOAI_WHISPER_API_KEY,
  AOAI_WHISPER_BASE_PATH,
  AOAI_WHISPER_MODEL_DEPLOYMENT,
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

export interface GenerateImageParams {
  prompt: string;
  apiUrl?: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  response_format?: 'url' | 'b64_json';
  quality?: 'standard' | 'hd';
  style?: 'natural' | 'vivid';
  numImages?: number;
  requestHeaders?: Headers;
}

export interface GenerateImageResponseData {
  url: string;
  revised_prompt: string;
}

export interface GenerateImageResponse {
  created: number;
  data: GenerateImageResponseData[];
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
  userAgent = 'cloud-team-automation'
): Headers => {
  if (!AOAI_API_KEY) {
    throw new Error(
      oneLineTrim`
      Missing one or more required environment variables:

      AOAI_API_KEY
    `
    );
  }
  return {
    'api-key': AOAI_API_KEY,
    'User-Agent': userAgent,
  };
};

/**
 * @function
 * @description This function returns the URL for generating images using Azure OpenAI's DALL-E API.
 * @returns {string} The URL for generating images.
 */
export const imageGenerationUrl = (): string => {
  if (!AOAI_BASE_PATH || !AOAI_DALLE_API_VERSION) {
    throw new Error(
      oneLineTrim`
      Missing one or more required environment variables:

      AOAI_BASE_PATH, AOAI_DALLE_API_VERSION
    `
    );
  }

  return `${AOAI_BASE_PATH}openai/deployments/${AOAI_DALLE_DEPLOYMENT_NAME}/images/generations?api-version=${AOAI_DALLE_API_VERSION}`;
};

/**
 * @function
 * @description This function returns the URL for text completion using Azure OpenAI's API.
 * @returns {string} The URL for text completion.
 */
export const textCompletionUrl = (modelDeploymentName = 'gpt-4'): string => {
  // check that all required environment variables are set
  if (!AOAI_BASE_PATH || !AOAI_API_VERSION) {
    throw new Error(
      oneLineTrim`
      Missing one or more required environment variables:

      AOAI_BASE_PATH, AOAI_API_VERSION
    `
    );
  }

  return `${AOAI_BASE_PATH}/openai/deployments/${modelDeploymentName}/completions?api-version=${AOAI_API_VERSION}`;
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
export const createImage = async ({
  prompt,
  apiUrl: url = imageGenerationUrl(),
  size = '1024x1024',
  quality = 'standard',
  response_format = 'url',
  numImages: n = 1, // only 1 supported at this time
  style = 'natural',
  requestHeaders = defaultHeaders(),
}: GenerateImageParams): Promise<GenerateImageResponse> => {
  const createImageResponse = await got({
    method: 'POST',
    url,
    headers: {
      ...requestHeaders,
      'Content-Type': 'application/json',
    },
    json: {
      n,
      prompt,
      quality,
      response_format,
      size,
      style,
    },
  }).json();

  return createImageResponse;
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
  apiUrl: url = textCompletionUrl(AOAI_COMPLETIONS_DEPLOYMENT_NAME),
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
    completionResponseBody
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
  const imageGenerationResponse = await createImage({
    prompt,
  });
  // console.log(imageGenerationResponse);

  const imageUrl = imageGenerationResponse.data[0].url;

  const savedImagePath = await saveImageGenerationResult({
    imageUrl,
  });
  // console.log(savedImagePath);

  return savedImagePath;
};
