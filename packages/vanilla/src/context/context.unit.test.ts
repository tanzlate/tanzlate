import { describe, expect, test } from 'vitest';

describe('contextCoreStub (unit)', () => {
  test('exposes i18nApp, composeHelper, lang, and onLangChange', async () => {
    const { contextCoreStub } = await import('./context');
    const ctx = contextCoreStub();
    expect(ctx.i18nApp).toBeDefined();
    expect(typeof ctx.composeHelper).toBe('function');
    expect(typeof ctx.lang).toBe('function');
    expect(typeof ctx.onLangChange).toBe('function');
  });
});
