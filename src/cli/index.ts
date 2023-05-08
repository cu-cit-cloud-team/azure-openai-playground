#!/usr/bin/env npx ts-node --esm

import { execSync } from 'node:child_process';
import boxen from 'boxen';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import ora from 'ora';
import terminalImage from 'terminal-image';

const programTitle = 'Azure OpenAI Playground';
const titleStyle = chalk.bold.blue;

console.log(titleStyle(figlet.textSync(programTitle)));

const demos = [
  {
    name: 'Text to Emoji',
    npmCommand: 'text-completion-rest-demo',
  },
  {
    name: 'Image Generation',
    npmCommand: 'image-generation-demo',
    allowsInput: true,
  },
  {
    name: 'Exit',
  },
];

const startChoice = await inquirer
  .prompt({
    type: 'list',
    name: 'answer',
    message: 'What demo would you like to run?',
    choices: demos.map((demo) => demo.name),
  })
  .then((response) => response.answer.toLowerCase())
  .catch((err: unknown) => 'exit');

const displayPrompt = (prompt: string) =>
  boxen(chalk.italic.cyan(prompt), {
    borderColor: 'cyan',
    title: 'Text to Analyze',
    padding: 1,
    margin: 1,
  });

const displayError = (error: string) =>
  boxen(chalk.bold.redBright(error), {
    borderColor: 'red',
    title: 'ERROR',
    padding: 1,
    margin: 1,
  });

const displayGoodbye = () => {
  const goodbyeStrings = [
    'Bye',
    'Goodbye',
    'Toodaloo',
    'Farewell',
    'Until next time',
    'See you later',
    'See you soon',
    'Laters',
    'Cheerio',
    'Peace out',
    'It was nice seeing you',
    'Take it easy',
    'Take care',
    'Bye for now',
    'Have a good one',
    'Stay out of trouble',
    'Stay classy',
    'I look forward to our next meeting',
    'Hasta la vista',
    'Adios',
    'Sayonara',
    'Ciao',
    'Smell you later',
  ];
  return chalk.bold.italic.blue(
    goodbyeStrings[Math.floor(Math.random() * goodbyeStrings.length)],
  );
};

switch (startChoice) {
  case 'text to emoji':
    const defaultPrompt =
      'Cornell is a private, Ivy League university and the land-grant university for New York state. Cornell’s mission is to discover, preserve and disseminate knowledge, to educate the next generation of global citizens, and to promote a culture of broad inquiry throughout and beyond the Cornell community. Cornell also aims, through public service, to enhance the lives and livelihoods of students, the people of New York and others around the world.';
    console.log(displayPrompt(defaultPrompt));
    const spinner = ora('Generating JSON').start();
    const results = await execSync(
      'npm run text-completion-rest-demo --silent',
    );
    spinner.succeed();
    console.log(JSON.parse(results.toString()));

    break;
  case 'image generation':
    const imageGenerationPrompt = await inquirer
      .prompt({
        type: 'input',
        name: 'answer',
        message: 'Describe the image you would like to generate',
        default:
          'Detailed image of a clocktower with a pumpkin on the very top of its spire',
      })
      .then((response) => response.answer)
      .catch((err: unknown) => displayGoodbye());
    const imageSpinner = ora(
      'Generating image (this can take a little while)',
    ).start();
    const imageResults = await execSync(
      `npm run image-generation-demo --silent -- --prompt "${imageGenerationPrompt}" --display false`,
    );
    imageSpinner.succeed();
    console.log(imageResults.toString());
    const imagePath = imageResults.toString().split("'")[1].replace("'", '');
    // console.log(imagePath);
    const imagePreview = await terminalImage.file(imagePath, {
      width: '50%',
      height: '50%',
      preserveAspectRatio: true,
    });
    console.log(imagePreview);

    break;
  case 'exit':
    console.log(displayGoodbye());

    break;
}
