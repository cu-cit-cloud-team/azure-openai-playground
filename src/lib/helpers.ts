import boxen from 'boxen';
import chalk from 'chalk';

// ts interfaces
export interface Arguments {
  [x: string]: unknown;
  a: boolean;
  b: string;
  c: number | undefined;
  d: (string | number)[] | undefined;
  e: number;
  f: string | undefined;
}

// helper methods

/**
 * @function
 * @description Pauses execution by waiting for a specified number of milliseconds
 * @param {number} ms - number of milliseconds to wait
 * @returns {Promise<void>}
 */
export const wait = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

/**
 * @function
 * @description Generates a random number between 0 and a specified number
 * @param {number} maxNum - maximum number to generate
 * @returns {number}
 */
export const randomNum = (maxNum: number): number =>
  Math.floor(Math.random() * maxNum);

/**
 * @function
 * @description Takes a prompt and returns it in a box for display in the terminal
 * @param {string} prompt - prompt to display
 * @returns {void}
 */
export const showPrompt = (prompt: string) =>
  boxen(chalk.italic.cyan(prompt), {
    borderColor: 'cyan',
    title: 'Text to Analyze',
    padding: 1,
    margin: 1,
  });

/**
 * @function
 * @description Takes an error and returns it in a box for display in the terminal
 * @param {Error} error - error to display
 * @returns {void}
 */
export const showError = (error: unknown) =>
  boxen(chalk.bold.redBright(error), {
    borderColor: 'red',
    title: 'ERROR',
    padding: 1,
    margin: 1,
  });

/**
 * @function
 * @description Returns a random goodbye string
 * @returns {string}
 */
export const showGoodbye = () => {
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
    `👋 ${goodbyeStrings[randomNum(goodbyeStrings.length)]}`,
  );
};

/**
 * @function
 * @description Takes an error, displays it in a box, shows a goodbye message, and exits the process
 * @param {Error} error - error to display
 */
export const handleError = (error: unknown): void => {
  console.log(showError(error));
  console.log(showGoodbye());
  process.exit(1);
};
