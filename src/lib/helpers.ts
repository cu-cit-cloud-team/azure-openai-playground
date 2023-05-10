import { oneLineTrim, stripIndents } from 'common-tags';
import { exec } from 'node:child_process';
import boxen from 'boxen';
import chalk from 'chalk';
import { Ora } from 'ora';

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
    `👋 ${goodbyeStrings[Math.floor(Math.random() * goodbyeStrings.length)]}`,
  );
};

export interface ExecNpmCommandParams {
  command: string;
  flags: string;
  callback: Function;
  spinnerRef?: Ora;
}

export const execNpmCommand = ({
  command,
  flags,
  callback,
  spinnerRef = undefined,
}: ExecNpmCommandParams) => {
  exec(
    `npm run ${command} --silent -- ${flags}`,
    async (error, stdout, stderr) => {
      if (error) {
        if (spinnerRef) {
          spinnerRef.fail();
        }
        console.log(showError(error));
      }
      if (spinnerRef) {
        spinnerRef.succeed();
      }
      callback(stdout);
    },
  );
};

export interface PoeticForm {
  type: string;
  rules: string;
  example: string;
}
export const poeticForms: PoeticForm[] = [
  {
    type: 'Ballad',
    rules: `A ballad is similar to an epic in that it tells a story, but it's much shorter and a bit more structured. This poetry form is made up of four-line stanzas (as many as are needed to tell the story) with a rhyme scheme of ABCB. Ballads were originally meant to be set to music. A lot of traditional ballads are all in dialogue, where two characters are speaking back and forth.
`,
    example: stripIndents`It is an ancient Mariner,
      And he stoppeth one of three.
      By thy long grey beard and glittering eye,
      Now wherefore stopp'st thou me?
      The bridegroom's doors are opened wide,
      And I am next of kin;
      The guests are met, the feast is set`,
  },
  {
    type: 'Cinquain',
    rules: `A cinquain is a five-line poem consisting of twenty-two syllables: two in the first line, then four, then six, then eight, and then two syllables again in the last line.`,
    example: stripIndents`Listen…
      With faint dry sound,
      Like steps of passing ghosts,
      The leaves, frost-crisp'd, break from the trees
      And fall.`,
  },
  {
    type: 'Triolet',
    rules: `A triolet is a traditional French single-stanza poem of eight lines with a rhyme scheme of ABAAABAB; however, it only consists of five unique lines. The first line is repeated as the fourth and seventh line, and the second line is repeated as the very last line.`,
    example: stripIndents`How great my grief, my joys how few,
      Since first it was my fate to know thee!
      Have the slow years not brought to view
      How great my grief, my joys how few,
      Nor memory shaped old times anew,
      Nor loving-kindness helped to show thee
      How great my grief, my joys how few,
      Since first it was my fate to know thee?`,
  },
  {
    type: 'Dizain',
    rules: `A dizain is another traditional form made up of just one ten-line stanza, and with each line having ten syllables (that's an even hundred in total). The rhyme scheme for a dizain is ABABBCCDCD.`,
    example: stripIndents`If true that a rose by another name
      Holds in its fine form fragrance just as sweet
      If vivid beauty remains just the same
      And if other qualities are replete
      With the things that make a rose so complete
      Why bother giving anything a name
      Then on whom may I place deserved blame
      When new people's names I cannot recall
      There seems to be an underlying shame
      So why do we bother with names at all`,
  },
  {
    type: 'Sonnet',
    rules: `A sonnet is a lyric poem that always has fourteen lines. The oldest type of sonnet is the Italian or Petrarchan sonnet, which is broken into two stanzas of eight lines and six lines. The first stanza has a consistent rhyme scheme of ABBA ABBA and the second stanza has a rhyme scheme of either CDECDE or CDCDCD. Later on, an ambitious bloke by the name of William Shakespeare developed the English sonnet (which later came to be known as the Shakespearean sonnet). It still has fourteen lines, but the rhyme scheme is different and it uses a rhythm called iambic pentameter. It has four distinctive parts, which might be separate stanzas or they might be all linked together. The rhyme scheme for an English sonnet is ABAB CDCD EFEF GG.`,
    example: stripIndents`Shall I compare thee to a summer's day?
      Thou art more lovely and more temperate:
      Rough winds do shake the darling buds of May,
      And summer's lease hath all too short a date:
      Sometime too hot the eye of heaven shines,
      And often is his gold complexion dimm'd;
      And every fair from fair sometime declines,
      By chance, or nature's changing course, untrimm'd;
      But thy eternal summer shall not fade
      Nor lose possession of that fair thou ow'st;
      Nor shall Death brag thou wander'st in his shade,
      When in eternal lines to time thou grow'st;
      So long as men can breathe or eyes can see,
      So long lives this, and this gives life to thee.`,
  },
  {
    type: 'Blank Verse',
    rules: `Blank verse is a type of poetry that's written in a precise meter, usually iambic pentameter, but without rhyme. This is reminiscent of Shakespearean sonnets and many of his plays, but it reflects a movement that puts rhythm above rhyme. Though each line of blank verse must be ten syllables, there's no restriction on the amount of lines or individual stanzas.`,
    example: stripIndents`The Frost performs its secret ministry,
      Unhelped by any wind. The owlet's cry
      Came loud—and hark, again! loud as before.
      The inmates of my cottage, all at rest,
      Have left me to that solitude, which suits
      Abstruser musings: save that at my side
      My cradled infant slumbers peacefully.
      'Tis calm indeed! so calm, that it disturbs
      And vexes meditation with its strange
      And extreme silentness. Sea, hill, and wood,
      This populous village! Sea, and hill, and wood,
      With all the numberless goings-on of life,
      Inaudible as dreams! the thin blue flame
      Lies on my low-burnt fire, and quivers not;
      Only that film, which fluttered on the grate`,
  },
  {
    type: 'Free Verse',
    rules: `Free verse is the type of poetry most favored by contemporary poets; it has no set meter, rhyme scheme, or structure, but allows the poet to feel out the content of the poem as they go. Poets will often still use rhythmic literary devices such as assonance and internal rhymes, but it won't be bound up with the same creative restraints as more structured poetry.`,
    example: stripIndents`The whole idea of it makes me feel
      like I'm coming down with something,
      something worse than any stomach ache
      or the headaches I get from reading in bad light—
      a kind of measles of the spirit,
      a mumps of the psyche,
      a disfiguring chicken pox of the soul.`,
  },
  {
    type: 'Palindrome',
    rules: `Palindrome poems, also called "mirror poems," are poems that begin repeating backwards halfway through, so that the first line and the last line are the same, the second line and the second-to-last line are the same, and so on.`,
    example: stripIndents`Far from the din of the articulated world,
      I wanted to be content in an empty room—
      a barn on the hillside like a bone,
      a limbo of afternoons strung together like cardboard boxes,
      to be free of your image—
      crown of bees, pail of black water
      staggering through the pitiful corn.
      I can't always see through it.
      The mind is a pond layered in lilies.
      The mind is a pond layered in lilies.
      I can't always see through it
      staggering through the pitiful corn.
      Crown of Bees, Pail of Black Water,
      to be of your image—
      a limbo of afternoons strung together like cardboard boxes,
      a barn on the hillside like a bone.
      I wanted to be content in an empty room
      far from the din of the articulated world.`,
  },
  {
    type: 'Pastoral',
    rules: `Pastoral poetry can take any meter or rhyme scheme, but it focuses on the beauty of nature. These poems draw attention to idyllic settings and romanticize the idea of shepherds and agriculture laborers living in harmony with the natural world. Often these traditional pastoral poems carry a religious overtone, suggesting that by bringing oneself closer to nature they were also becoming closer to their spirituality. They can be written in free verse, or in poetic structure.`,
    example: stripIndents`Come live with me and be my love,
      And we will all the pleasures prove
      That valleys, groves, hills, and fields,
      Woods, or steepy mountain yields.
      And we will sit upon the rocks,
      Seeing the shepherds feed their flocks,
      By shallow rivers to whose falls
      Melodious birds sing madrigals.`,
  },
  {
    type: 'Elegy',
    rules: `An elegy is similar to an ode in that it celebrates a person or idea, but in this instance is the poem centers around something that has died or been lost. There's a tradition among poets to write elegies for one another once another poet has died. Sometimes these are obvious memoriams of a deceased person, and other times the true meaning will be hidden behind layers of symbolism and metaphor. Like the ode, there's no formal meter or rhyme scheme in an elegy.`,
    example: stripIndents`He disappeared in the dead of winter:
      The brooks were frozen, the airports almost deserted,
      And snow disfigured the public statues;
      The mercury sank in the mouth of the dying day.
      What instruments we have agree
      The day of his death was a dark cold day.

      Far from his illness
      The wolves ran on through the evergreen forests,
      The peasant river was untempted by the fashionable quays;
      By mourning tongues
      The death of the poet was kept from his poems.`,
  },
  {
    type: 'Haiku',
    rules: `A haiku is a traditional cornerstone of Japanese poetry with no set rhyme scheme, but a specific shape: three lines composed of five syllables in the first line, seven in the second line, and five in the third line. Adhere to this structure.`,
    example: stripIndents`Over the wintry
      Forest, winds howl in rage
      With no leaves to blow.`,
  },
  {
    type: 'Limerick',
    rules: `A limerick is a short, famous poetic form consisting of five lines that follow the rhyme form AABBA. Usually these are quite funny and tell a story. The first two lines should have eight or nine syllables each, the third and fourth lines should have five or six syllables each, and the final line eight or nine syllables again.`,
    example: stripIndents`There was a small boy of Quebec,
      Who was buried in snow to his neck;
      When they said, "Are you friz?"
      He replied, "Yes, I is—
      But we don't call this cold in Quebec."`,
  },
  {
    type: 'Ode',
    rules: `An ode is a poetic form of celebration used to honor a person, thing, or idea. They're often overflowing with intense emotion and powerful imagery. Odes can be used in conjunction with formal meters and rhyme schemes, but they don't have to be; often poets will favor internal rhymes instead, to give their ode a sense of rhythm.`,
    example: stripIndents`Season of mists and mellow fruitfulness,
      Close bosom-friend of the maturing sun;
      Conspiring with him how to load and bless
      With fruit the vines that round the thatch-eaves run;
      To bend with apples the mossed cottage-trees,
      And fill all fruit with ripeness to the core;
      To swell the gourd, and plump the hazel shells
      With a sweet kernel; to set budding more,
      And still more, later flowers for the bees,
      Until they think warm days will never cease,
      For Summer has o'er-brimmed their clammy cells.`,
  },
  {
    type: 'Villanelle',
    rules: `A villanelle is a type of French poem made up of nineteen lines grouped into six separate stanzas. The first five stanzas have three lines each, and the last stanza has four lines. Each three-line stanza rhymes ABA, and the last one ABAA. Villanelles tend to feature a lot of repetition, which lends them a musical quality; usually the very first and third lines become the alternating last lines of each following stanza.`,
    example: stripIndents`My darling turns to poetry at night.
      What began as flirtation, an aside
      Between abstract expression and first light
      Now finds form as a silent, startled flight
      Of commas on her face—a breath, a word…
      My darling turns to poetry at night.
      When rain inspires the night birds to create
      Rhyme and formal verse, stanzas can be made
      Between abstract expression and first light.
      Her heartbeat is a metaphor, a late
      Bloom of red flowers that refuse to fade.
      My darling turns to poetry at night.
      I watch her turn. I do not sleep. I wait
      For symbols, for a sign that fear has died
      Between abstract expression and first light.
      Her dreams have night vision, and in her sight
      Our bodies leave ghostprints on the bed.
      My darling turns to poetry at night
      Between abstract expression and first light.`,
  },
  {
    type: 'Nonce',
    rules: `A nonce poem is a DIY poem structure intended for one-time use to challenge yourself as a writer, or just to try something new. It's a formal, rigid, standardized poetry form that's brand new to the world.`,
    example: stripIndents`Are you aggriev'd therefore?
      The sea hath fish for every man,
      And what would you have more?”
      Thus did my mistress once,
      Amaze my mind with doubt;
      And popp'd a question for the nonce
      To beat my brains about.`,
  },
];
