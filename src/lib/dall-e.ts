export interface ImageOperationResponseResult {
  caption: string;
  contentUrl?: string;
  contentUrlExpiresAt?: string;
  createdDateTime: string;
}

export interface ImageOperationResponse {
  id: string;
  result: ImageOperationResponseResult;
  status: string;
}
