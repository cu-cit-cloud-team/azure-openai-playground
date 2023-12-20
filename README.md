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
1. Run one of the demos:
    - `npm run text-completion-demo` ([demo info](#text-completion-demo-using-official-nodejs-openai-library))
    - `npm run text-completion-rest-demo` ([demo info](#text-completion-demo-using-rest-api))
    - `npm run image-generation-demo` ([demo info](#image-generation-demo-using-rest-api))

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

### Text Completion Demo (using REST API)

Uses [Got HTTP request library](https://github.com/sindresorhus/got) to access an Azure OpenAI resource endpoint and generate
a completion with a text model.

This demo does the same as the above demo, but uses the REST API directly (vs the official Node.js OpenAI library). See above
for more details, input text, and example output.

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
