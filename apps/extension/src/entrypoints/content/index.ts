import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { PlainTextParser, ReadabilityParser, TurndownParser } from '@/lib/document';
import { PageExtractor } from './page-extractor';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main: (context: ContentScriptContext) => {
    console.info(`Browser Recall: Content script loaded on ${window.location.href}`);

    const readabilityParser = new ReadabilityParser();
    const plainTextParser = new PlainTextParser();
    const turndownParser = new TurndownParser();
    const extractor = new PageExtractor(readabilityParser, plainTextParser, turndownParser);
    const result = extractor.extract(document.cloneNode(true) as Document);

    console.info('Browser Recall: Parsed document:', result.metadata);
    console.info('Browser Recall', result.content);

    // Listen for URL changes in SPAs
    // https://wxt.dev/api/reference/wxt/utils/content-script-context/interfaces/WxtWindowEventMap.html#wxt-locationchange
    context.addEventListener(window, 'wxt:locationchange', () => {
      const result = extractor.extract(document.cloneNode(true) as Document);
      console.info('Browser Recall: URL changed, re-parsed document:', result.metadata);
      console.info('Browser Recall', result.content);
    });
  },
});
