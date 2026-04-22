import { i18nKey } from '@/types/i18n-key';
import { CoreContext, cTFunc } from '@tanzlate/step';
import { computed, inject, onUnmounted, provide, ref, shallowReactive } from 'vue';

/**
 * Sync setup: registers provide + onUnmounted before any await.
 * Returns a resolve function to call once the CoreContext is ready.
 */
export function setupI18nContext() {
  const langRef = ref('en');
  const state = shallowReactive({ ctx: null as unknown as CoreContext, langRef });
  provide(i18nKey, state);

  let cleanup: (() => void) | undefined;
  onUnmounted(() => cleanup?.());

  return function resolve(ctx: CoreContext) {
    state.ctx = ctx;
    state.langRef.value = ctx.i18nApp.language;
    cleanup = ctx.onLangChange((lng) => {
      state.langRef.value = lng;
    });
  };
}

/** Convenience wrapper for sync callers that already have a CoreContext. */
export function provideI18nContext(ctx: CoreContext) {
  setupI18nContext()(ctx);
}

export function useI18n(ns: string) {
  const injected = inject(i18nKey)!;

  function forNamespace(namespace: string): cTFunc {
    const helper = computed(() => {
      void injected.langRef.value; // re-evaluates when language changes
      return injected.ctx.composeHelper(namespace);
    });
    return (key, opts) => helper.value(key, opts);
  }

  return {
    cT: forNamespace(ns),
    globalT: forNamespace('global'),
    forNamespace,
    lang: injected.langRef,
    changeLanguage: injected.ctx.lang,
    i18nApp: injected.ctx.i18nApp,
  };
}
