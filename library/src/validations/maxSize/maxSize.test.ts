import { describe, expect, test } from 'vitest';
import { maxSize } from './maxSize.ts';

describe('maxSize', () => {
  test('should pass only valid sizes', () => {
    const validate = maxSize(3);

    const value1 = new Map();
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = new Map().set(1, 1).set(2, 2).set(3, 3);
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = new Set();
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = new Set().add(1).add(2).add(3);
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse(value2.set(4, 4)).issues).toBeTruthy();
    expect(validate._parse(value4.add(4)).issues).toBeTruthy();
    expect(validate._parse(value4.add(5)).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value size is greater than "2"!';
    const value = new Set().add(1).add(2).add(3);
    const validate = maxSize(2, error);
    expect(validate._parse(value).issues?.[0].context.message).toBe(error);
  });
});
