import boxen from 'boxen';
import chalk from 'chalk';

export const wait = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

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
    goodbyeStrings[Math.floor(Math.random() * goodbyeStrings.length)],
  );
};
