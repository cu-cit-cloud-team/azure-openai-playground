#!/usr/bin/env -S npx tsx

import readline from 'node:readline';
import boxen from 'boxen';
import chalk from 'chalk';
import { oneLineTrim } from 'common-tags';
import figlet from 'figlet';
import inquirer, { Answers } from 'inquirer';
import ora from 'ora';
import terminalImage from 'terminal-image';

import { DemoListItem, KeyPressKey, execNpmCommand } from '../lib/cli.js';
import { handleError, showGoodbye } from '../lib/helpers.js';
import { PoeticForm, poeticForms } from '../lib/poetry.js';
import { Language, languages } from '../lib/translator.js';

readline.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (ch, key: KeyPressKey) => {
  if (key.ctrl && key.name === 'c') {
    process.stdin.pause();
    console.log('\n', showGoodbye());
    process.exit(0);
  }
});

process.stdin.setRawMode(true);

// set title text and style
const programTitle = 'Azure OpenAI Demos';
const titleStyle = chalk.bold.blue;

// output title
console.clear();
console.log(titleStyle(figlet.textSync(programTitle)));

// define demos available to run
const demos: DemoListItem[] = [
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
    name: 'English Translator',
    value: 'english-translator',
    npmCommand: 'english-translator-demo',
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
  .then((response: Answers) => (response.answer as string).toLowerCase())
  .catch(() => 'exit');

switch (startChoice) {
  case 'text-to-emoji': {
    const defaultPrompt = oneLineTrim`
      Cornell is a private, Ivy League university and the land-grant university for New York state.
      Cornell's mission is to discover, preserve and disseminate knowledge, to educate the next
      generation of global citizens, and to promote a culture of broad inquiry throughout and beyond
      the Cornell community. Cornell also aims, through public service, to enhance the lives and
      livelihoods of students, the people of New York and others around the world.
    `;

    const emojiGenerationPrompt = await inquirer
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
      flags: `--prompt "${emojiGenerationPrompt as string}"`,
      callback: (stdout: string) => {
        console.log(JSON.parse(stdout));
      },
      spinnerRef: emojiSpinner,
    });

    break;
  }
  case 'image-generation': {
    const imageGenerationPrompt = await inquirer
      .prompt({
        type: 'input',
        name: 'answer',
        message: 'Describe the image you would like to generate',
        default:
          'Detailed image of a clock tower with a pumpkin on the very top of its spire',
      })
      .then((response: Answers) => response.answer as string)
      .catch((err: unknown) => {
        handleError(err);
      });

    const imageSpinner = ora(
      'Generating image (this can take a little while)'
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
      flags: `--prompt "${imageGenerationPrompt as string}" --display false`,
      callback: imageGenCallback,
      spinnerRef: imageSpinner,
      playMusic: true,
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
            (response.answer as string).toLowerCase()
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
              `Generating ${poeticForm.type.toLowerCase()}`
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
                  })
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
  case 'english-translator': {
    let language: Language;
    let textToTranslate: string;

    await inquirer
      .prompt({
        type: 'list',
        name: 'answer',
        message: 'What language would you like me to translate your text to?',
        choices: languages.map((item) => item.name).sort(),
      })
      .then(async (response: Answers) => {
        [language] = languages.filter(
          (item) =>
            item.name.toLowerCase() ===
            (response.answer as string).toLowerCase()
        );
        // console.log(language);
        await inquirer
          .prompt({
            type: 'input',
            name: 'answer',
            message: `Enter the English text you would like translated to ${language.name}:`,
            default: 'Where can I find some good tacos to eat?',
          })
          .then((response: Answers) => {
            textToTranslate = response.answer as string;

            const translationSpinner = ora(
              `Generating ${language.name} translation`
            ).start();

            execNpmCommand({
              command: 'english-translator-demo',
              flags: `--language "${language.name}" --text "${textToTranslate}"`,
              callback: (stdout: string) => {
                const results = stdout.toString().split(':\n\n');
                console.log('\n', results[1].trim().split('\n\n')[1]);
              },
              spinnerRef: translationSpinner,
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
