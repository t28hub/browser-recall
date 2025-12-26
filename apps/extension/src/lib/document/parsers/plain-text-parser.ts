import type { DocumentParser, PageContent, PageMetadata } from '../types';
import { normalizeWhitespace } from '../utils';

/**
 * Document parser implementation that extracts plain text content
 */
export class PlainTextParser implements DocumentParser {
  /**
   * @inheritdoc
   */
  parse(document: Document): PageContent {
    const metadata = this.parseMetadata(document);
    const content = normalizeWhitespace(document.body.innerText);
    return { metadata, content };
  }

  private parseMetadata(document: Document): PageMetadata {
    return {
      url: document.URL,
      title: document.title,
      siteName: this.extractMetaContent(document, 'meta[property="og:site_name"]') || document.title,
      language: document.documentElement.lang || undefined,
      description: this.extractMetaContent(document, 'meta[name="description"]'),
    };
  }

  private extractMetaContent(document: Document, selector: string): string | undefined {
    const meta = document.querySelector<HTMLMetaElement>(selector);
    return meta?.content || undefined;
  }
}
