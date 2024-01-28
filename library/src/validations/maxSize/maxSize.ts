import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Max size validation type.
 */
export type MaxSizeValidation<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'max_size';
  /**
   * The maximum size.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the size of a map, set
 * or blob.
 *
 * @param requirement The maximum size.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function maxSize<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
>(
  requirement: TRequirement,
  message?: ErrorMessage
): MaxSizeValidation<TInput, TRequirement> {
  return {
    type: 'max_size',
    expects: `<=${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      if (input.size <= this.requirement) {
        return actionOutput(input);
      }
      return actionIssue(this, input, 'size', `${input.size}`);
    },
  };
}
