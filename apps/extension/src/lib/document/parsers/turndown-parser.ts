import TurndownService from 'turndown';
import type { DocumentParser, PageContent, PageMetadata } from '../types';
import { normalizeWhitespace } from '../utils';

/**
 * Default Turndown service configuration.
 */
const DEFAULT_SERVICE = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  linkStyle: 'inlined',
})
  .remove([
    'head',
    'meta',
    'link',
    'style',
    'script',
    'noscript',
    'iframe',
    'embed',
    'object',
    'header',
    'footer',
    'nav',
    'aside',
  ])
  .addRule('Remove empty links', {
    filter: ['a'],
    replacement: (content: string, node: HTMLElement) => {
      const element = node as HTMLElement;
      const href = element.getAttribute('href') || '';
      if (!href) {
        return '';
      }

      const linkText = content.trim();
      if (!linkText) {
        return '';
      }
      return `[${linkText}](${href})`;
    },
  });

/**
 * Document parser implementation that extracts content and converts it to Markdown
 */
export class TurndownParser implements DocumentParser {
  private readonly turndown: TurndownService;

  constructor(turndown: TurndownService = DEFAULT_SERVICE) {
    this.turndown = turndown;
  }

  /**
   * @inheritdoc
   */
  parse(document: Document): PageContent {
    const metadata = this.parseMetadata(document);
    const markdown = this.turndown.turndown(document.body);
    const content = normalizeWhitespace(markdown);
    return { metadata, content };
  }

  private parseMetadata(document: Document): PageMetadata {
    return {
      url: document.URL,
      title: document.title,
      siteName: this.extractMetaContent(document, 'meta[property="og:site_name"]') || document.title,
      language: document.documentElement.lang,
      description: this.extractMetaContent(document, 'meta[name="description"]'),
    };
  }

  private extractMetaContent(document: Document, selector: string): string | undefined {
    const meta = document.querySelector<HTMLMetaElement>(selector);
    return meta?.content || undefined;
  }
}
