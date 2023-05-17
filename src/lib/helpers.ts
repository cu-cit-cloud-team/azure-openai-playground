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
export const wait = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

export const randomNum = (maxNum: number): number =>
  Math.floor(Math.random() * maxNum);

export const showPrompt = (prompt: string) =>
  boxen(chalk.italic.cyan(prompt), {
    borderColor: 'cyan',
    title: 'Text to Analyze',
    padding: 1,
    margin: 1,
  });

export const showError = (error: unknown) =>
  boxen(chalk.bold.redBright(error), {
    borderColor: 'red',
    title: 'ERROR',
    padding: 1,
    margin: 1,
  });

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

export const handleError = (error: unknown): void => {
  console.log(showError(error));
  console.log(showGoodbye());
  process.exit(1);
};
