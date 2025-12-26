import { Readability } from '@mozilla/readability';
import { ParseError } from '../errors';
import type { DocumentParser, PageContent, PageMetadata } from '../types';
import { normalizeWhitespace } from '../utils';

/**
 * Result of parsing a document with Readability.
 */
type ReadabilityArticle = NonNullable<ReturnType<Readability['parse']>>;

/**
 * Options for ReadabilityParser
 */
interface ReadabilityOptions {
  /**
   * Minimum number of characters required in the extracted content.
   */
  readonly minCharCount?: number;
}

const DEFAULT_OPTIONS: ReadabilityOptions = {
  minCharCount: 200,
};

/**
 * Document parser implementation that extracts readable content using Mozilla Readability
 */
export class ReadabilityParser implements DocumentParser {
  private readonly options: ReadabilityOptions;

  constructor(options: ReadabilityOptions = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * @inheritdoc
   */
  parse(document: Document): PageContent {
    const reader = new Readability(document, {
      charThreshold: this.options.minCharCount,
      keepClasses: false,
    });
    const parsed = reader.parse();
    if (!parsed) {
      throw new ParseError('Failed to parse document with Readability');
    }

    if (!parsed.content) {
      throw new ParseError('Parsed content is empty');
    }
    const metadata = this.parseMetadata(document, parsed);
    const content = normalizeWhitespace(parsed.content);
    return { metadata, content };
  }

  private parseMetadata(document: Document, article: ReadabilityArticle): PageMetadata {
    return {
      url: document.URL,
      title: article.title || document.title,
      siteName:
        article.siteName || this.extractMetaContent(document, 'meta[property="og:site_name"]') || document.title,
      language: document.documentElement.lang || undefined,
      description: article.excerpt || this.extractMetaContent(document, 'meta[name="description"]'),
    };
  }

  private extractMetaContent(document: Document, selector: string): string | undefined {
    const meta = document.querySelector<HTMLMetaElement>(selector);
    return meta?.content || undefined;
  }
}
