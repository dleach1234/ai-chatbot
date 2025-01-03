import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  if (apiIdentifier.startsWith('claude')) {
    return wrapLanguageModel({
      model: anthropic(apiIdentifier),
      middleware: customMiddleware,
    });
  }

  if (apiIdentifier.startsWith('gemini')) {
    return wrapLanguageModel({
      model: google(apiIdentifier),
      middleware: customMiddleware,
    });
  }

  // Default to OpenAI
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  });
};
