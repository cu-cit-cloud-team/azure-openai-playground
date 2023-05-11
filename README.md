# ct-azure-openai-playground

Misc. experiments with Azure OpenAI

## About

Looking into what's different in Azure OpenAI (vs using OpenAI directly) and where the official Node.js library does and doesn't work.

Demos use Node.js/TypeScript to run some simple examples against an Azure OpenAI Services resource.

NOTE: repo code is NOT production ready, use at your own risk :sweat_smile:

## Running Locally

### Prerequisites

- Node.js >= 18.x (with npm >= v8.x)
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
    - `OPENAI_BASE_PATH` set to your Azure OpenAI resource endpoint
    - `OPENAI_API_KEY` set to your Azure OpenAI resource API key
    - `OPENAI_AZURE_MODEL_DEPLOYMENT` set to the name of the deployed Azure OpenAI model you want to use. Note that this should be the deployment name vs the name of the model itself (e.g. "deployment-name-text-davinci-003" vs "text-davinci-003")
    - `OPENAI_AZURE_API_VERSION` set to Azure OpenAI API Version, supported versions available here: <https://learn.microsoft.com/en-us/azure/cognitive-services/openai/reference#completions>
    - `OPENAI_AZURE_DALLE_API_VERSION` if using DALL-E, set to Azure OpenAI DALL-E API Version (not in official docs yet, "2022-08-03-preview" is the only working version I've found)
1. Run one of the demos:
    - `npm run text-completion-demo` ([demo info](#text-completion-demo-using-official-nodejs-openai-library))
    - `npm run text-completion-rest-demo` ([demo info](#text-completion-demo-using-rest-api))
    - `npm run image-generation-demo` ([demo info](#image-generation-demo-using-rest-api))

## Notes/Lessons Learned

At the time of writing, the official [OpenAI Node.js Library](https://github.com/openai/openai-node) is NOT (yet)
supported for use with Azure OpenAI Services (and the Python library has capable but limited "preview" support).

I was able to get the official Node.js library to work with Azure OpenAI Services by using some workarounds. There are
NO guarantees that this will continue to work in the future. Once official library support is available, I will use
the supported and documented approach.

### Typical OpenAI Node.js Client Setup

This is a pretty common setup for using the official OpenAI Node.js library with OpenAI APIs directly:

```javascript
// load env vars
const { OPENAI_API_KEY } = process.env;

// create configuration object for client
const clientConfig = new Configuration({
  apiKey: OPENAI_API_KEY, // standard OpenAI API key from openai.com
});

// instantiate client
const openAiClient = new OpenAIApi(clientConfig);
```

### Expected Azure OpenAI Node.js Client Setup (NOT WORKING)

While the official OpenAI Node.js library is NOT yet supported for Azure OpenAI Services, the following is what I would
expect the setup to look like once it is supported:

```javascript
// load env vars
const { AZURE_OPENAI_BASE_PATH, OPENAI_API_KEY } = process.env;

// create configuration object for client
const clientConfig = new Configuration({
  apiKey: OPENAI_API_KEY, // Azure OpenAI API key from your deployment
  basePath: AZURE_OPENAI_BASE_PATH, // ex: https://deployment-name.openai.azure.com/
});

// instantiate client
const openAIClient = new OpenAIApi(clientConfig);
```

### Unsupported/undocumented Azure OpenAI Node.js Client Setup (WORKING)

Some examination of requests and experimentation led to the following setup that works with Azure OpenAI Services:

```javascript
// load env vars
const {
  OPENAI_BASE_PATH, // ex: https://deployment-name.openai.azure.com/
  OPENAI_API_KEY, // Azure OpenAI API key from your deployment
  OPENAI_AZURE_MODEL_DEPLOYMENT, // ex: model-deployment-name-gpt-35-turbo-0301 (when you deploy a model you give it's deployment a name, use that here vs the model name itself)
  OPENAI_AZURE_API_VERSION, // ex: 2023-03-15-preview
} = process.env;

// create configuration object for client
const clientConfig = new Configuration({
  baseOptions: {
    headers: {
      'api-key': OPENAI_API_KEY,
    },
    params: { 'api-version': OPENAI_AZURE_API_VERSION },
  },
  basePath: `${OPENAI_BASE_PATH}openai/deployments/${OPENAI_AZURE_MODEL_DEPLOYMENT}`,
});

// instantiate client
const openAIClient = new OpenAIApi(clientConfig);
```

## Demos

### Text Completion Demo (using official Node.js OpenAI library)

Uses the official Node.js OpenAI library to access an Azure OpenAI resource endpoint and generate a completion with a text model.

Demo analyzes a text string and returns a list of emojis that best represent the text. The data is returned as a JSON array of objects
with keys for the emoji, the markdown short code, and the reasoning for choosing that emoji.

NOTE: works best with a `davinci`-based text model. Tested with `text-davinci-003`.

Input text:
> "Cornell is a private, Ivy League university and the land-grant university for New York state. Cornell's mission is to discover, preserve and disseminate knowledge, to educate the next generation of global citizens, and to promote a culture of broad inquiry throughout and beyond the Cornell community. Cornell also aims, through public service, to enhance the lives and livelihoods of students, the people of New York and others around the world."

_source: <https://www.cornell.edu/about/mission.cfm>_

Example output:

```json
[
  {
    "emoji": "🤝",
    "shortCode": ":handshake:",
    "reason": "To represent the collaboration between Cornell and its students, the people of New York, and others around the world."
  },
  {
    "emoji": "📚",
    "shortCode": ":books:",
    "reason": "To represent Cornell's mission to discover, preserve, and disseminate knowledge."
  },
  {
    "emoji": "🌎",
    "shortCode": ":earth_americas:",
    "reason": "To represent Cornell's mission to educate the next generation of global citizens."
  },
  {
    "emoji": "🤔",
    "shortCode": ":thinking:",
    "reason": "To represent Cornell's mission to promote a culture of broad inquiry."
  },
  {
    "emoji": "🙌",
    "shortCode": ":raised_hands:",
    "reason": "To represent Cornell's mission to enhance the lives and livelihoods of its students."
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

Demo takes a text prompt and sends it to the DALL-E endpoint to request an image be generated. It then reads the response headers
to get the URL of the image operation and polls that image operation URL (using exponential back-off) until the image is ready.
Once the image is ready, it downloads it and saves it locally as a PNG file. The terminal output will show the original prompt,
the path to the generated image, and a preview of the image in the terminal.

Input text:
> "Detailed image of a clocktower with a pumpkin on the very top of it's spire"

Example generated images:

![Generated Image 1](./src/dall-e-image-rest/generated-images/thumbnails/30a51b59-5613-41c0-b052-af2d9c47035c1683144799.jpg) ![Generated Image 2](./src/dall-e-image-rest/generated-images/thumbnails/5812c9b8-02b7-4fb3-b30c-67d7ed0206321683144799.jpg)
![Generated Image 3](./src/dall-e-image-rest/generated-images/thumbnails/59890c0f-d9e8-4c27-ba87-5e1a40d9d22d1683144799.jpg) ![Generated Image 4](./src/dall-e-image-rest/generated-images/thumbnails/bc85ca68-be67-4152-bd5d-85e62656bf4c1683144799.jpg)
