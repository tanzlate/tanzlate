import { InitOptions, Module, Newable, NewableModule, Resource } from 'i18next';

export type { Createi18nConfigParams, I18nextModule };

/** Anything i18next's `use()` accepts: a module instance, a class, or a constructor. */
type I18nextModule = Module | NewableModule<Module> | Newable<Module>;

/**
 * i18n configuration parameters
 * It extends i18next InitOptions but omits some properties to allow custom naming and typing.
 */
type Createi18nConfigParams = Omit<InitOptions, 'backend' | 'resources'> & {
  /** Your alias for i18next's `ns` */
  namespace?: string | readonly string[] | InitOptions['ns'];
  /** Your alias for i18next's `supportedLngs` */
  supportedLanguages?: InitOptions['supportedLngs'];
  // TODO: check comments
  /**
   * i18next plugins to register before init, e.g. `[FsBackend]` on a server or
   * `[HttpBackend]` in a browser.
   *
   * The caller supplies these so that this package never imports a backend
   * itself -- a static `import('i18next-fs-backend')` here would be followed by
   * bundlers regardless of any runtime guard, pulling Node's `fs` into a
   * browser build.
   */
  modules?: I18nextModule[];
  /**
   * Options for whichever backend you registered via `modules`, passed through
   * to i18next untouched. Not constrained to one backend's shape -- use that
   * backend's own options type at the call site.
   */
  backend?: InitOptions['backend'];
  /** Keep a precise type for resources */
  resources?: Resource;
};
