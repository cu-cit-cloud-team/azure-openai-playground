export interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: CompletionChoice[];
}

export interface CompletionChoice {
  text: string;
  index: number;
  logprobs: unknown;
  finish_reason: string;
}
