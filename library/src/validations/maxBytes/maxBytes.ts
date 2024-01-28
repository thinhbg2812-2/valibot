import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Max bytes validation type.
 */
export type MaxBytesValidation<
  TInput extends string,
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'max_bytes';
  /**
   * The maximum byte length.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the bytes of a string.
 *
 * @param requirement The maximum bytes.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function maxBytes<TInput extends string, TRequirement extends number>(
  requirement: TRequirement,
  message?: ErrorMessage
): MaxBytesValidation<TInput, TRequirement> {
  return {
    type: 'max_bytes',
    expects: `<=${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      const length = new TextEncoder().encode(input).length;
      if (length <= this.requirement) {
        return actionOutput(input);
      }
      return actionIssue(this, input, 'bytes', `${length}`);
    },
  };
}
