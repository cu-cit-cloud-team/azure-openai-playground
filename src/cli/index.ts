#!/usr/bin/env npx tsx

import readline from 'node:readline';
import { oneLineTrim } from 'common-tags';
import boxen from 'boxen';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer, { Answers } from 'inquirer';
import ora from 'ora';
import terminalImage from 'terminal-image';

import {
  PoeticForm,
  execNpmCommand,
  handleError,
  poeticForms,
  showGoodbye,
} from '../lib/helpers.js';

readline.emitKeypressEvents(process.stdin);

interface Key {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

process.stdin.on('keypress', (ch, key: Key) => {
  if (key.ctrl && key.name == 'c') {
    process.stdin.pause();
    console.log('\n', showGoodbye());
    process.exit(0);
  }
});

process.stdin.setRawMode(true);

// set title text and style
const programTitle = 'Azure OpenAI Playground';
const titleStyle = chalk.bold.blue;

// output title
console.log(titleStyle(figlet.textSync(programTitle)));

// define demos available to run
const demos = [
  {
    name: 'Text to Emoji',
    value: 'text-to-emoji',
    npmCommand: 'text-completion-rest-demo',
  },
  {
    name: 'Image Generation',
    value: 'image-generation',
    npmCommand: 'image-generation-demo',
  },
  {
    name: 'Poetry Generator',
    value: 'poetry-generator',
    npmCommand: 'poetry-generation-demo',
  },
  {
    name: 'Exit',
    value: 'exit',
  },
];

// start program by prompting user to select a demo
const startChoice: string = await inquirer
  .prompt({
    type: 'list',
    name: 'answer',
    message: 'What demo would you like to run?',
    choices: demos.map((demo) => ({
      name: demo.name,
      value: demo.value,
    })),
  })
  .then((response: Answers) => response.answer as string)
  .catch(() => 'exit');

switch (startChoice.toLowerCase()) {
  case 'text-to-emoji': {
    const defaultPrompt = oneLineTrim`
      Cornell is a private, Ivy League university and the land-grant university for New York state.
      Cornell's mission is to discover, preserve and disseminate knowledge, to educate the next
      generation of global citizens, and to promote a culture of broad inquiry throughout and beyond
      the Cornell community. Cornell also aims, through public service, to enhance the lives and
      livelihoods of students, the people of New York and others around the world.
    `;

    const emojiGenerationPrompt: string = await inquirer
      .prompt({
        type: 'input',
        name: 'answer',
        message:
          'Submit the text that you would like to analyze and get emojis for',
        default: defaultPrompt,
      })
      .then((response: Answers) => response.answer as string)
      .catch((err: unknown) => {
        handleError(err);
      });

    // console.log(showPrompt(emojiGenerationPrompt));

    const emojiSpinner = ora('Generating JSON').start();
    execNpmCommand({
      command: 'text-completion-rest-demo',
      flags: `--prompt "${emojiGenerationPrompt}"`,
      callback: (stdout: string) => {
        console.log(JSON.parse(stdout));
      },
      spinnerRef: emojiSpinner,
    });

    break;
  }
  case 'image-generation': {
    const imageGenerationPrompt: string = await inquirer
      .prompt({
        type: 'input',
        name: 'answer',
        message: 'Describe the image you would like to generate',
        default:
          'Detailed image of a clocktower with a pumpkin on the very top of its spire',
      })
      .then((response: Answers) => response.answer as string)
      .catch((err: unknown) => {
        handleError(err);
      });

    const imageSpinner = ora(
      'Generating image (this can take a little while)',
    ).start();

    const imageGenCallback = async (stdout: string): Promise<void> => {
      console.log(stdout);
      const imagePath = stdout.toString().split("'")[1].replace("'", '');
      const imagePreview = await terminalImage.file(imagePath, {
        width: '50%',
        height: '50%',
        preserveAspectRatio: true,
      });
      console.log(imagePreview);
    };

    execNpmCommand({
      command: 'image-generation-demo',
      flags: `--prompt "${imageGenerationPrompt}" --display false`,
      callback: imageGenCallback,
      spinnerRef: imageSpinner,
    });

    break;
  }
  case 'poetry-generator': {
    let poeticForm: PoeticForm;
    let poemSubject: string;
    await inquirer
      .prompt({
        type: 'list',
        name: 'answer',
        message: 'What poetic form would you like to generate?',
        choices: poeticForms.map((item) => item.type).sort(),
      })
      .then(async (response: Answers) => {
        [poeticForm] = poeticForms.filter(
          (item) =>
            item.type.toLowerCase() ===
            (response.answer as string).toLowerCase(),
        );
        // console.log(poeticForm);
        await inquirer
          .prompt({
            type: 'input',
            name: 'answer',
            message: `What would you like me to write a ${poeticForm.type.toLowerCase()} about?`,
            default: 'Cornell University',
          })
          .then((response: Answers) => {
            poemSubject = response.answer as string;

            const poemSpinner = ora(
              `Generating ${poeticForm.type.toLowerCase()}`,
            ).start();

            execNpmCommand({
              command: 'poetry-generator-demo',
              flags: `--poemType "${poeticForm.type}" --poemSubject "${poemSubject}" --display false`,
              callback: (stdout: string) => {
                const poem = stdout.toString().split(':\n\n')[1];
                console.log(
                  boxen(poem, {
                    padding: 1,
                    margin: 1,
                    borderStyle: 'double',
                    borderColor: 'blue',
                  }),
                );
                console.log(poeticForm.rules);
              },
              spinnerRef: poemSpinner,
            });
          })
          .catch((err: unknown) => {
            handleError(err);
          });
      });

    break;
  }
  case 'exit': {
    console.log(showGoodbye());

    break;
  }
}
