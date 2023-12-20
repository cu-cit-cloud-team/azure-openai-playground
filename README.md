# ct-azure-openai-playground

Misc. experiments with Azure OpenAI

## About

Demos use Node.js/TypeScript to run some simple examples against an Azure OpenAI Services resource.

NOTE: repo code is NOT production ready, use at your own risk :sweat_smile:

## Running Locally

### Prerequisites

- Node.js >= 20.x (with npm >= v10.x)
- Azure subscription with [access to Azure OpenAI](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/overview#how-do-i-get-access-to-azure-openai)
  - Deployed/available Azure OpenAI [resource and models](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal)

### Getting Started

1. Clone repo
    - `git clone https://github.com/CU-CommunityApps/ct-azure-openai-playground.git`
1. Enter directory
    - `cd ct-azure-openai-playground`
1. Install dependencies
    - `npm install`
1. Copy `.env.example` to `.env` and then replace necessary values `cp .env.example .env`
    - `AOAI_BASE_PATH` set to your Azure OpenAI resource endpoint
    - `AOAI_API_KEY` set to your Azure OpenAI resource API key
    - `AOAI_GPT4_DEPLOYMENT_NAME` set to the name of the deployed Azure OpenAI GPT-4 model you want to use
    - `AOAI_GPT35_DEPLOYMENT_NAME` set to the name of the deployed Azure OpenAI GPT-35 model you want to use
    - `AOAI_GPT4_VISION_DEPLOYMENT_NAME` set to the name of the deployed Azure OpenAI GPT-4 Vision model you want to use
    - `AOAI_INSTRUCT_DEPLOYMENT_NAME` set to the name of the deployed Azure OpenAI instruct model (e.g. 'gpt-35-turbo-instruct') you want to use
    - `AOAI_DALLE_DEPLOYMENT_NAME` set to the name of the deployed Azure DALL-E 3 model you want to use
    - `AOAI_API_VERSION` set to Azure OpenAI API Version (e.g. `2023-12-01-preview`), supported versions available here: <https://learn.microsoft.com/en-us/azure/cognitive-services/openai/reference#completions>
    - `AOAI_DALLE_API_VERSION` set to Azure OpenAI DALL-E 3 API Version (e.g. `2023-12-01-preview`)
    - `AOAI_WHISPER_API_KEY` - set to your Azure OpenAI Whisper resource API key if different from `AOAI_API_KEY`
    - `AOAI_WHISPER_BASE_PATH` - set to your Azure OpenAI Whisper resource endpoint if different from `AOAI_BASE_PATH`
    - `AOAI_WHISPER_MODEL_DEPLOYMENT` - set to the name of the deployed Azure OpenAI Whisper model you want to use
    - `AOAI_WHISPER_API_VERSION` - set to Azure OpenAI Whisper API Version (e.g. `2023-09-01-preview`)
1. Run one of the demos:
    - `npm run text-completion-demo` ([demo info](#text-completion-demo-using-official-nodejs-openai-library))
    - `npm run text-completion-rest-demo` ([demo info](#text-completion-demo-using-rest-api))
    - `npm run image-generation-demo` ([demo info](#image-generation-demo-using-rest-api))
    - `npm run gpt4-chatbot-demo` ([demo info](#gtp-4-chatbot-demo-using-official-nodejs-openai-library))
    - `npm run whisper-transcribe-mp3-demo` ([demo info](#whisper-transcribe-mp3-demo-using-official-nodejs-openai-library))
    - `npm run gpt4-vision-demo` ([demo info](#gpt-4-vision-demo-using-official-nodejs-openai-library))

## Demos

### Text Completion Demo (using official Node.js OpenAI library)

Uses the official Node.js OpenAI library to access an Azure OpenAI resource endpoint and generate a completion with a text model.

Demo analyzes a text string and returns a list of emojis that best represent the text. The data is returned as a JSON array of objects
with keys for the emoji, the markdown short code, and the reasoning for choosing that emoji.

NOTE: this demo works best with the `gpt-35-turbo-instruct` model

Input text:
> "Cornell is a private, Ivy League university and the land-grant university for New York state. Cornell's mission is to discover, preserve and disseminate knowledge, to educate the next generation of global citizens, and to promote a culture of broad inquiry throughout and beyond the Cornell community. Cornell also aims, through public service, to enhance the lives and livelihoods of students, the people of New York and others around the world."

_source: <https://www.cornell.edu/about/mission.cfm>_

Example output:

```json
[
  {
    "emoji": "🌎",
    "shortCode": ":earth_americas:",
    "reason": "Representing the global citizens that Cornell aims to educate"
  },
  {
    "emoji": "📚",
    "shortCode": ":books:",
    "reason": "Symbolizing the knowledge that Cornell aims to discover, preserve, and disseminate"
  },
  {
    "emoji": "🎓",
    "shortCode": ":mortar_board:",
    "reason": "Representing the next generation of students that Cornell aims to educate"
  },
  {
    "emoji": "🌱",
    "shortCode": ":seedling:",
    "reason": "Symbolizing the growth and development of students at Cornell"
  },
  {
    "emoji": "🔬",
    "shortCode": ":microscope:",
    "reason": "Symbolizing the scientific and research focus of Cornell's mission"
  },
  {
    "emoji": "🌟",
    "shortCode": ":star2:",
    "reason": "Symbolizing the impact and influence of Cornell's mission on the world"
  }
]
```

---

### Text Completion Demo (using REST API)

Uses [Got HTTP request library](https://github.com/sindresorhus/got) to access an Azure OpenAI resource endpoint and generate
a completion with a text model.

This demo does the same as the above demo, but uses the REST API directly (vs the official Node.js OpenAI library). See above
for more details, input text, and example output.

---

### Image Generation Demo (using REST API)

Uses [Got HTTP request library](https://github.com/sindresorhus/got) to access an Azure OpenAI resource endpoint and generate an
image with DALL-E.

Demo takes a text prompt and sends it to the DALL-E 3 endpoint to request an image. It then downloads the image and saves it
locally as a PNG file. The terminal output will show the original prompt, the path to the generated image, and a preview of
the image in the terminal.

Input text:
> "Detailed image of the Cornell University clock tower with a pumpkin mounted on the very top of it's spire, in a realistic photo with natural lighting."

Example generated images:

[![Generated Image 1](./src/dall-e-image-rest/generated-images/thumbnails/5d811f1e-5ad7-4d88-bb46-09ae474003b4.jpg)](./src/dall-e-image-rest/generated-images/5d811f1e-5ad7-4d88-bb46-09ae474003b4.png)
[![Generated Image 2](./src/dall-e-image-rest/generated-images/thumbnails/496d7a9c-b5bb-43a6-9d06-0d4475a6c939.jpg)](./src/dall-e-image-rest/generated-images/496d7a9c-b5bb-43a6-9d06-0d4475a6c939.png)
[![Generated Image 3](./src/dall-e-image-rest/generated-images/thumbnails/9068a4fd-c2c2-4e46-961e-f4cc13633365.jpg)](./src/dall-e-image-rest/generated-images/9068a4fd-c2c2-4e46-961e-f4cc13633365.png)
[![Generated Image 4](./src/dall-e-image-rest/generated-images/thumbnails/59681c4f-64a8-4bc1-aa40-eca11b9e6628.jpg)](./src/dall-e-image-rest/generated-images/59681c4f-64a8-4bc1-aa40-eca11b9e6628.png)

---

### GTP-4 Chatbot Demo (using official Node.js OpenAI library)

Uses the official Node.js OpenAI library to access an Azure OpenAI resource endpoint and create a streaming chatbot experience.

Once demo is started, you can begin chatting with the bot by typing in the terminal. The bot will respond to your messages and you will get a new prompt to continue the conversation once the bot response is complete. The current conversation is included with each new message you send (as in, the bot retains context of your entire conversation as you continue chatting) and you can continue the conversation as long as you like. To exit the demo, type `ctrl+c` in the terminal.

---

### Whisper Transcribe MP3 Demo (using official Node.js OpenAI library)

Uses the official Node.js OpenAI library to access an Azure OpenAI Whisper resource endpoint and transcribe an MP3 file.

Included audio is a 30 second clip taken from this interview of Martha Pollack (beginning at the 5 second mark): <https://www.youtube.com/watch?v=UxuzJ-NJ1yQ&t=5s>

<audio controls src="./src/whisper-transcribe-mp3/audio/martha-pollack.mp3"></audio>

#### Example Results

##### Text

> I think the thing I have learned as I've gotten older is that you have to play the hand you're dealt. You can't always control the circumstances around you. Certainly in a leadership position, you can't always decide what challenges you're going to face. And you can either spend time bemoaning that fact and wishing it were different, or you can roll up your arms and deal with it. And, you know, I'm an old bridge player, and one thing I learned from playing bridge is that sometimes you can have the most impact when you do well with a really crummy hand.

##### SRT

```plaintext
1
00:00:00,000 --> 00:00:07,000
I think the thing I have learned as I've gotten older is that you have to play the hand you're dealt.

2
00:00:07,000 --> 00:00:10,000
You can't always control the circumstances around you.

3
00:00:10,000 --> 00:00:14,000
Certainly in a leadership position, you can't always decide what challenges you're going to face.

4
00:00:14,000 --> 00:00:18,000
And you can either spend time bemoaning that fact and wishing it were different,

5
00:00:18,000 --> 00:00:20,000
or you can roll up your arms and deal with it.

6
00:00:20,000 --> 00:00:24,000
And, you know, I'm an old bridge player, and one thing I learned from playing bridge

7
00:00:24,000 --> 00:00:29,000
is that sometimes you can have the most impact when you do well with a really crummy hand.
```

##### JSON

```json
{
  "text": "I think the thing I have learned as I've gotten older is that you have to play the hand you're dealt. You can't always control the circumstances around you. Certainly in a leadership position, you can't always decide what challenges you're going to face. And you can either spend time bemoaning that fact and wishing it were different, or you can roll up your arms and deal with it. And, you know, I'm an old bridge player, and one thing I learned from playing bridge is that sometimes you can have the most impact when you do well with a really crummy hand."
}
```

---

### GPT-4 Vision Demo (using official Node.js OpenAI library)

Uses the official Node.js OpenAI library to access an Azure OpenAI resource endpoint and generate a completion with a gpt-4 vision model.

Demo analyzes one of the dall-e 3 generated images from the above demo and returns a description of it.

Input text:

> Describe this image

Input image:

![Generated Image 1](./src/dall-e-image-rest/generated-images/thumbnails/5d811f1e-5ad7-4d88-bb46-09ae474003b4.jpg)

Example output:

> The image shows an old-style clock tower, probably from a church or old building, with two large round clocks on its front. At the top of the tower, instead of a traditional spire or done, there is a giant orange pumpkin. The pumpkin is sitting on a thin, pointed tip of the tower and appears to be balanced precariously. The background is a clear blue sky.

---

### GPT-4 Vision Compare Demo (using official Node.js OpenAI library)

Uses the official Node.js OpenAI library to access an Azure OpenAI resource endpoint and generate a completion with a gpt-4 vision model.

Demo analyzes two of the dall-e 3 generated images from the above demo and returns a comparison of them.

Input text:

> What are in these images? Is there any difference between them?

Input images:

![Generated Image 1](./src/dall-e-image-rest/generated-images/thumbnails/5d811f1e-5ad7-4d88-bb46-09ae474003b4.jpg)

![Generated Image 2](./src/dall-e-image-rest/generated-images/thumbnails/496d7a9c-b5bb-43a6-9d06-0d4475a6c939.jpg)

Example output:

> Both images show a tower with clocks and a pumpkin on top. The second image is a black and white version of the first image, with some parts colored in yellow.

---
