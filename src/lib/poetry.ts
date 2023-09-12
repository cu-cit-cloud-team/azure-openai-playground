import { stripIndents } from 'common-tags';

// ts interfaces
export interface PoeticForm {
  type: string;
  rules: string;
  example: string;
}

// list of poetic forms
export const poeticForms: PoeticForm[] = [
  {
    type: 'Cinquain',
    rules: 'A cinquain is a five-line poem consisting of twenty-two syllables: two syllables in the first line, four syllables in the second line, six syllables in the third line, eight syllables om the fourth line, and then two syllables in the last line.',
    example: stripIndents`Listen…
      With faint dry sound,
      Like steps of passing ghosts,
      The leaves, frost-crisp'd, break from the trees
      And fall.`,
  },
  {
    type: 'Triolet',
    rules: 'A triolet is a traditional French single-stanza poem of eight lines with a rhyme scheme of ABAAABAB; however, it only consists of five unique lines. The first line is repeated as the fourth and seventh line, and the second line is repeated as the very last line.',
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
    rules: 'A dizain is another traditional form made up of just one ten-line stanza, and with each line having ten syllables (for an even hundred syllables in total). The rhyme scheme for a dizain is ABABBCCDCD.',
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
    type: 'Blank Verse',
    rules: `Blank verse is a type of poetry that's written in a precise meter, usually iambic pentameter, but without rhyme. This is reminiscent of Shakespearean sonnets and many of his plays, but it reflects a movement that puts rhythm above rhyme. Each line of blank verse must be ten syllables. There's no restriction on the amount of lines or individual stanzas.`,
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
    type: 'Haiku',
    rules: 'A haiku is a traditional cornerstone of Japanese poetry with no set rhyme scheme, but a specific shape: three lines composed of five syllables in the first line, seven in the second line, and five in the third line.',
    example: stripIndents`Over the wintry
      Forest, winds howl in rage
      With no leaves to blow.`,
  },
  {
    type: 'Limerick',
    rules: 'A limerick is a short, famous poetic form consisting of five lines that follow the rhyme form AABBA. Usually these are quite funny and tell a story. The first two lines should have eight or nine syllables each, the third and fourth lines should have five or six syllables each, and the final line eight or nine syllables again.',
    example: stripIndents`There was a small boy of Quebec,
      Who was buried in snow to his neck;
      When they said, "Are you friz?"
      He replied, "Yes, I is—
      But we don't call this cold in Quebec."`,
  },
  {
    type: 'Villanelle',
    rules: 'A villanelle is a type of French poem made up of nineteen lines grouped into six separate stanzas. The first five stanzas have three lines each, and the last stanza has four lines. Each three-line stanza rhymes ABA, and the last stanza rhymes ABAA. Villanelles tend to feature a lot of repetition; usually the very first and third lines become the alternating last lines of each following stanza.',
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
];
