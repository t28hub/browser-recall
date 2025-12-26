import type { DocumentParser, PageContent } from '@/lib/document';

/**
 * Options for PageExtractor
 */
interface PageExtractorOptions {
  /**
   * Minimum content ratio to consider extraction successful
   */
  readonly minContentRatio: number;
}

const DEFAULT_OPTIONS: PageExtractorOptions = {
  minContentRatio: 0.2,
};

/**
 * Extracts content from a web page with automatic fallback and Markdown conversion.
 */
export class PageExtractor {
  private readonly readabilityParser: DocumentParser;
  private readonly plainTextParser: DocumentParser;
  private readonly turndownParser: DocumentParser;
  private readonly options: PageExtractorOptions;

  constructor(
    readabilityParser: DocumentParser,
    plainTextParser: DocumentParser,
    turndownParser: DocumentParser,
    options?: Partial<PageExtractorOptions>,
  ) {
    this.readabilityParser = readabilityParser;
    this.plainTextParser = plainTextParser;
    this.turndownParser = turndownParser;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Extracts page content from the given Document, converting it to Markdown.
   *
   * @param document - The DOM Document to extract from
   * @returns Extracted page content with Markdown
   */
  extract(document: Document): PageContent {
    const originalLength = document.body.innerText.length;
    const parsed = this.parseWithFallback(document);

    // Check if extraction captured enough content
    const contentRatio = parsed.content.length / originalLength;
    if (contentRatio < this.options.minContentRatio) {
      console.info(
        `Browser Recall: Extraction content ratio too low (${contentRatio.toFixed(2)}), using Turndown directly.`,
      );
      const { content } = this.turndownParser.parse(document);
      return { metadata: parsed.metadata, content };
    }

    // Convert extracted HTML to Markdown
    const htmlDocument = new DOMParser().parseFromString(parsed.content, 'text/html');
    const markdownResult = this.turndownParser.parse(htmlDocument);
    return { metadata: parsed.metadata, content: markdownResult.content };
  }

  private parseWithFallback(document: Document): PageContent {
    try {
      return this.readabilityParser.parse(document.cloneNode(true) as Document);
    } catch {
      return this.plainTextParser.parse(document);
    }
  }
}
