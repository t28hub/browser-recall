/**
 * Normalizes whitespace in text content.
 *
 * This function performs the following operations:
 * 1. Normalizes line endings to LF
 * 2. Collapses consecutive spaces and tabs into a single space
 * 3. Collapses multiple consecutive newlines into a single newline
 * 4. Trims leading and trailing whitespace
 *
 * @param text The input text to normalize
 * @returns The normalized text
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n?/g, '\n') // Normalize line endings to LF
    .replace(/[ \t]+/g, ' ') // Collapse consecutive spaces/tabs to single space
    .replace(/\n{2,}/g, '\n') // Collapse 2+ newlines to single newline
    .trim();
}
