import { CoreContext, CoreContextParams, useCoreContext } from './context/context';
import { Createi18nConfigParams } from './types';

interface TanzlateContext extends CoreContext {
  tanzlate: string;
}

export async function useTanzlate(config: Createi18nConfigParams): Promise<TanzlateContext> {
  const coreCtxParams: CoreContextParams = {
    config,
    ssr: false,
    callbackWhenLanguageChange: () => {},
  };
  const coreContext = await useCoreContext(coreCtxParams);

  return {
    ...coreContext,
    tanzlate: 'tanzlate',
  };
}

export async function tanzlateContextStub(): Promise<TanzlateContext> {
  const coreCtxParams: CoreContextParams = {
    config: {} as Createi18nConfigParams,
    ssr: true,
    callbackWhenLanguageChange: () => {},
  };

  const coreContext = await useCoreContext(coreCtxParams);

  return {
    ...coreContext,
    tanzlate: 'tanzlate',
  };
}
