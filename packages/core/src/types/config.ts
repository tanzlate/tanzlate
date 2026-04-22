import { InitOptions, Resource } from 'i18next';
import { FsBackendOptions } from 'i18next-fs-backend/cjs';

export type { Createi18nConfigParams };

/**
 * i18n configuration parameters
 * It extends i18next InitOptions but omits some properties to allow custom naming and typing.
 */
type Createi18nConfigParams = Omit<InitOptions, 'backend' | 'resources'> & {
  /** Your alias for i18next's `ns` */
  namespace?: string | readonly string[] | InitOptions['ns'];
  /** Your alias for i18next's `supportedLngs` */
  supportedLanguages?: InitOptions['supportedLngs'];
  /** Optional: constrain backend to the FS backend options */
  backend?: FsBackendOptions;
  /** Keep a precise type for resources */
  resources?: Resource;
};
