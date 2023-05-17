import dotenv from 'dotenv';
import yargs from 'yargs';

import { Arguments, randomNum } from '../lib/helpers.js';
import { doTextCompletion } from '../lib/openai.js';
import { PoeticForm, poeticForms } from '../lib/poetry.js';

const argv = yargs(process.argv.slice(2)).argv as unknown as Arguments;

// load environment variables from .env file
dotenv.config();

// destructure environment variables we need
const { NODE_ENV } = process.env;

// get current high-resolution real-time from process in nanoseconds
const { hrtime } = process;
const debugStartTime = hrtime();

const requestedForm =
  argv.poemType && typeof argv.poemType === 'string'
    ? argv.poemType
    : poeticForms[randomNum(poeticForms.length)].type;

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
  - Here's an example ${poemType.type}:
    - ${poemType.example}
  - Generate an original ${poemType.type} poem about ${
  poemSubject as string
} that follows the provided rules. Don't use the words in the example.
`;

// eslint-disable-next-line @typescript-eslint/await-thenable
const completion = await doTextCompletion({ prompt, temperature: 0 });

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
