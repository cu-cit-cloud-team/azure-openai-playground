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

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `userAgent` | `string` | `'cloud-team-automation'` |

#### Returns

`Headers`

#### Defined in

[openai.ts:80](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/e4891f4/src/lib/openai.ts#L80)

___

### doTextCompletion

▸ **doTextCompletion**(`«destructured»`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TextCompletionParams`](../interfaces/openai.TextCompletionParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[openai.ts:227](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/e4891f4/src/lib/openai.ts#L227)

___

### generateAndSaveImage

▸ **generateAndSaveImage**(`prompt`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `prompt` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[openai.ts:263](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/e4891f4/src/lib/openai.ts#L263)

___

### getImageGenerationResult

▸ **getImageGenerationResult**(`«destructured»`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetImageGenerationResultParams`](../interfaces/openai.GetImageGenerationResultParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[openai.ts:165](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/e4891f4/src/lib/openai.ts#L165)

___

### imageGenerationUrl

▸ **imageGenerationUrl**(): `string`

#### Returns

`string`

#### Defined in

[openai.ts:99](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/e4891f4/src/lib/openai.ts#L99)

___

### saveImageGenerationResult

▸ **saveImageGenerationResult**(`«destructured»`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`SaveImageGenerationResultParams`](../interfaces/openai.SaveImageGenerationResultParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[openai.ts:199](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/e4891f4/src/lib/openai.ts#L199)

___

### submitImageGenerationRequest

▸ **submitImageGenerationRequest**(`«destructured»`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`SubmitImageGenerationRequestParams`](../interfaces/openai.SubmitImageGenerationRequestParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[openai.ts:134](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/e4891f4/src/lib/openai.ts#L134)

___

### textCompletionUrl

▸ **textCompletionUrl**(): `string`

#### Returns

`string`

#### Defined in

[openai.ts:114](https://github.com/CU-CommunityApps/ct-azure-openai-playground/blob/e4891f4/src/lib/openai.ts#L114)
