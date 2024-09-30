import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseSchemaAsync,
  ErrorMessage,
  MaybePromise,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { CustomIssue } from './types.ts';

/**
 * Check async type.
 */
type CheckAsync = (input: unknown) => MaybePromise<boolean>;

/**
 * Custom schema async type.
 */
export interface CustomSchemaAsync<
  TInput,
  TMessage extends ErrorMessage<CustomIssue> | undefined,
> extends BaseSchemaAsync<TInput, TInput, CustomIssue> {
  /**
   * The schema type.
   */
  readonly type: 'custom';
  /**
   * The schema reference.
   */
  readonly reference: typeof customAsync;
  /**
   * The expected property.
   */
  readonly expects: 'unknown';
  /**
   * The type check function.
   */
  readonly check: CheckAsync;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a custom schema.
 *
 * @param check The type check function.
 *
 * @returns A custom schema.
 */
export function customAsync<TInput>(
  check: CheckAsync
): CustomSchemaAsync<TInput, undefined>;

/**
 * Creates a custom schema.
 *
 * @param check The type check function.
 * @param message The error message.
 *
 * @returns A custom schema.
 */
export function customAsync<
  TInput,
  const TMessage extends ErrorMessage<CustomIssue> | undefined =
    | ErrorMessage<CustomIssue>
    | undefined,
>(check: CheckAsync, message: TMessage): CustomSchemaAsync<TInput, TMessage>;

export function customAsync<TInput>(
  check: CheckAsync,
  message?: ErrorMessage<CustomIssue>
): CustomSchemaAsync<TInput, ErrorMessage<CustomIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'custom',
    reference: customAsync,
    expects: 'unknown',
    async: true,
    check,
    message,
    '~standard': 1,
    '~vendor': 'valibot',
    async '~validate'(dataset, config = getGlobalConfig()) {
      if (await this.check(dataset.value)) {
        // @ts-expect-error
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as unknown as OutputDataset<TInput, CustomIssue>;
    },
  };
}
