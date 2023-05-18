[azure-openai-playground](../README.md) / openai

# Module: openai

## Table of contents

### Interfaces

- [GetImageGenerationResultParams](../interfaces/openai.GetImageGenerationResultParams.md)
- [ImageOperationResponse](../interfaces/openai.ImageOperationResponse.md)
- [ImageOperationResponseResult](../interfaces/openai.ImageOperationResponseResult.md)
- [SaveImageGenerationResultParams](../interfaces/openai.SaveImageGenerationResultParams.md)
- [SubmitImageGenerationRequestParams](../interfaces/openai.SubmitImageGenerationRequestParams.md)
- [TextCompletionParams](../interfaces/openai.TextCompletionParams.md)
- [TextCompletionResponse](../interfaces/openai.TextCompletionResponse.md)
- [TextCompletionResponseChoice](../interfaces/openai.TextCompletionResponseChoice.md)

### Functions

- [defaultHeaders](openai.md#defaultheaders)
- [doTextCompletion](openai.md#dotextcompletion)
- [generateAndSaveImage](openai.md#generateandsaveimage)
- [getImageGenerationResult](openai.md#getimagegenerationresult)
- [imageGenerationUrl](openai.md#imagegenerationurl)
- [saveImageGenerationResult](openai.md#saveimagegenerationresult)
- [submitImageGenerationRequest](openai.md#submitimagegenerationrequest)
- [textCompletionUrl](openai.md#textcompletionurl)

## Functions

### defaultHeaders

▸ **defaultHeaders**(`userAgent?`): `Headers`

defaultHeaders

**`Description`**

returns default headers for reuse in Azure OpenAI API requests

**`Example`**

```ts
const headers = defaultHeaders();
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `userAgent?` | `string` | `'cloud-team-automation'` | The user agent to use in the headers. |

#### Returns

`Headers`

An object containing the headers

#### Defined in

[openai.ts:88](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/fc40831/src/lib/openai.ts#L88)

___

### doTextCompletion

▸ **doTextCompletion**(`params`): `Promise`<`string`\>

doTextCompletion

**`Description`**

This function provides text completion suggestions for the given prompt using OpenAI's API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`TextCompletionParams`](../interfaces/openai.TextCompletionParams.md) | The parameters for the text completion request. |

#### Returns

`Promise`<`string`\>

A promise that resolves with the generated text completion.

#### Defined in

[openai.ts:290](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/fc40831/src/lib/openai.ts#L290)

___

### generateAndSaveImage

▸ **generateAndSaveImage**(`prompt`): `Promise`<`string`\>

generateAndSaveImage

**`Description`**

This function submits a request to generate an image using OpenAI's DALL-E API and saves the result to a file.

**`Example`**

```ts
const image = await generateAndSaveImage('a prompt');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | The prompt for the image generation. |

#### Returns

`Promise`<`string`\>

A promise that resolves with the path to the saved image.

#### Defined in

[openai.ts:333](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/fc40831/src/lib/openai.ts#L333)

___

### getImageGenerationResult

▸ **getImageGenerationResult**(`params`): `Promise`<`string`\>

getImageGenerationResult

**`Description`**

This function gets the result of an image generation request using OpenAI's DALL-E API.

**`Example`**

```ts
const image = await getImageGenerationResult({ operationUrl: 'an operation url' });
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`GetImageGenerationResultParams`](../interfaces/openai.GetImageGenerationResultParams.md) | object with parameters for the request. |

#### Returns

`Promise`<`string`\>

A promise that resolves with the generated image.

#### Defined in

[openai.ts:207](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/fc40831/src/lib/openai.ts#L207)

___

### imageGenerationUrl

▸ **imageGenerationUrl**(): `string`

imageGenerationUrl

**`Description`**

This function returns the URL for generating images using Azure OpenAI's DALL-E API.

**`Example`**

```ts
const url = imageGenerationUrl();
```

#### Returns

`string`

The URL for generating images.

#### Defined in

[openai.ts:113](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/fc40831/src/lib/openai.ts#L113)

___

### saveImageGenerationResult

▸ **saveImageGenerationResult**(`params`): `Promise`<`string`\>

saveImageGenerationResult

**`Description`**

This function saves the generated image to a file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`SaveImageGenerationResultParams`](../interfaces/openai.SaveImageGenerationResultParams.md) | The parameters for saving the image. |

#### Returns

`Promise`<`string`\>

A promise that resolves with the full path to the saved image file.

#### Defined in

[openai.ts:251](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/fc40831/src/lib/openai.ts#L251)

___

### submitImageGenerationRequest

▸ **submitImageGenerationRequest**(`params`): `Promise`<`string`\>

submitImageGenerationRequest

**`Description`**

This function submits a request to generate an image using OpenAI's DALL-E API.

**`Example`**

```ts
const image = await submitImageGenerationRequest({ prompt: 'a prompt' });
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`SubmitImageGenerationRequestParams`](../interfaces/openai.SubmitImageGenerationRequestParams.md) | object with parameters for the request. |

#### Returns

`Promise`<`string`\>

A promise that resolves with the generated image.

#### Defined in

[openai.ts:167](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/fc40831/src/lib/openai.ts#L167)

___

### textCompletionUrl

▸ **textCompletionUrl**(): `string`

textCompletionUrl

**`Description`**

This function returns the URL for text completion using Azure OpenAI's API.

**`Example`**

```ts
const url = textCompletionUrl();
```

#### Returns

`string`

The URL for text completion.

#### Defined in

[openai.ts:134](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/fc40831/src/lib/openai.ts#L134)
