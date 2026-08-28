import { describe, expect, it } from 'vitest';
import { isSafeUrl } from './sanitize-url';

describe('isSafeUrl', () => {
  it.each([
    'https://reteach.io',
    'http://reteach.io',
    '/relative/path',
    'relative/path',
    'mailto:hi@example.com',
    'tel:+4930123456',
  ])('allows %s', (url) => expect(isSafeUrl(url)).toBe(true));

  it.each([
    'javascript:alert(1)',
    '  javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,<script>alert(1)</script>',
    'data:image/svg+xml;base64,PHN2Zy8+',
  ])('refuses %j', (url) => expect(isSafeUrl(url)).toBe(false));
});
