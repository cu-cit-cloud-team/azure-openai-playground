import { oneLineTrim } from 'common-tags';
import dotenv from 'dotenv';
import terminalImage from 'terminal-image';
import yargs from 'yargs';

import { Arguments } from '../lib/helpers.js';
import { generateAndSaveImage } from '../lib/openai.js';

const argv = yargs(process.argv.slice(2)).argv as unknown as Arguments;

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const { NODE_ENV } = process.env;

const { hrtime } = process;
const debugStartTime = hrtime();

// set the prompt for the DALL-E image generation
const prompt =
  argv.prompt ??
  oneLineTrim`
    Detailed image of a clock tower with a pumpkin on the very top of it's spire
  `;

// set whether or not to display the image in the terminal
const suppressImageDisplay = argv.display === 'false';

// set whether or not to display the prompt in the terminal output
const suppressPrompt = suppressImageDisplay;

const savedImagePath = await generateAndSaveImage(prompt as string);

// output original prompt, image location, and image preview
if (!suppressPrompt) {
  console.log(`Prompt: ${prompt as string}`);
}
console.log(`Image saved to: '${savedImagePath}'`);
if (!suppressImageDisplay) {
  const imagePreview = await terminalImage.file(savedImagePath, {
    width: '50%',
    height: '50%',
    preserveAspectRatio: true,
  });
  console.log(imagePreview);
}

if (NODE_ENV === 'development') {
  // set and output debug/timing info
  const debugEndTime = hrtime(debugStartTime);
  const debugOutput = `\nExecution time: ${
    debugEndTime[0] * 1000 + debugEndTime[1] / 1000000
  }ms`;
  console.log(debugOutput);
}
