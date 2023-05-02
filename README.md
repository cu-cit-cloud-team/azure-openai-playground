# ct-azure-openai-playground

Misc. experiments with Azure OpenAI.

## About

Looking into what's different in Azure OpenAI (vs using OpenAI directly)
and where the official Node.js library does and doesn't work.

Examples use Node.js/TypeScript to run some basic examples against the
Azure OpenAI service.

NOTE: repo code is NOT production ready, use at your own risk :sweat_smile:

### Included Examples

- `./src/text-to-emoji-lib.ts`
  - Uses the official Node.js OpenAI library to access an Azure OpenAI resource
    - Note that (at time of writing) the Official OpenAI library for Node.js is NOT yet supported for Azure OpenAI Services (the Python library has limited preview support)
    - This example uses some workarounds to get the official library to work with Azure OpenAI and can't be guaranteed to work in the future as is.
    - Code will be updated to reflect official documented library usage when it becomes supported
  - Uses the `davinci` model to analyze text and returns a list of emojis that represent the text
    - Results are returned as a JSON array of objects that includes the emoji, the markdown short code, and the reason it was chosen

- `./src/dall-e-image-rest.ts`
  - Uses REST API calls to access DALL-E via an Azure OpenAI resource and generate an image from text
  - Sends a text prompt to DALL-E requesting an image
  - Uses the response headers to get the URL of the image operation
  - Polls the image operation URL (using exponential back-off) until the image is ready
  - Downloads the image and saves it to a file

## Usage

### Requirements

- Node.js >= 18.x (with npm >= v8.x)
- Azure subscription with [access to Azure OpenAI](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/overview#how-do-i-get-access-to-azure-openai)
  - Deployed/available Azure OpenAI [resource and models](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal)

### Running Locally

1. Clone this repo and `cd` into it:

    ```bash
      git clone https://github.com/CU-CommunityApps/ct-azure-openai-playground.git
      cd ct-azure-openai-playground
    ```

2. Setup environment variables:
    - Copy `.env.example` to `.env` and fill in the values for your Azure OpenAI resource

3. Install dependencies:

    ```bash
      npm install
    ```

4. Run one of the examples (substitute `script-name.ts` below with the name of the example script you want to run):

    ```bash
      npm run dev -- ./src/script-name.ts
    ```
