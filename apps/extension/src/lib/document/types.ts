/**
 * Metadata extracted from a web page.
 */
export interface PageMetadata {
  /**
   * Source URL of the page
   */
  readonly url: string;

  /**
   * Title of the page
   */
  readonly title: string;

  /**
   * Site name of the page
   */
  readonly siteName: string;

  /**
   * Language of the page (e.g., "ja", "en", "es", etc.)
   */
  readonly language?: string;

  /**
   * Description or excerpt of the page
   */
  readonly description?: string;
}

/**
 * Parsed content from a web page.
 */
export interface PageContent {
  /**
   * Metadata of the page
   */
  readonly metadata: PageMetadata;

  /**
   * Main content of the page as a string
   */
  readonly content: string;
}

/**
 * Parser interface for extracting content and metadata from a Document.
 */
export interface DocumentParser {
  /**
   * Parses a DOM Document and extracts the main content and metadata.
   *
   * @param document - The DOM Document to parse
   * @returns Parsed page content
   * @throws ParseError if parsing fails
   */
  parse(document: Document): PageContent;
}
