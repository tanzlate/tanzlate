export { SAFE_URL_SCHEMES, URL_ATTRIBUTES, isSafeUrl };

const SAFE_URL_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:', 'ftp:']);

/** Attribute names whose value is a URL. */
const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'poster', 'xlink:href']);

// Only used to resolve relative URLs, never rendered.
const RELATIVE_BASE = 'https://tanzlate.invalid';

/**
 * Whether a URL is safe to render.
 *
 * Uses the URL parser rather than a pattern: browsers strip control characters inside a
 * scheme, so `java\tscript:` is a live javascript: URL that a regex misses.
 */
function isSafeUrl(value: string): boolean {
  try {
    return SAFE_URL_SCHEMES.has(new URL(value, RELATIVE_BASE).protocol);
  } catch {
    return false;
  }
}
