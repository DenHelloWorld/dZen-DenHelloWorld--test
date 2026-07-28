import { extractApiErrorMessage } from './api-error';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit';

describe('extractApiErrorMessage', () => {
  it('returns null when error is undefined', () => {
    expect(extractApiErrorMessage(undefined)).toBeNull();
  });

  it('returns the error string from FetchBaseQueryError data', () => {
    const error: FetchBaseQueryError = {
      status: 400,
      data: { error: 'Invalid credentials' },
    };
    expect(extractApiErrorMessage(error)).toBe('Invalid credentials');
  });

  it('returns "Something went wrong" when FetchBaseQueryError data has no error field', () => {
    const error: FetchBaseQueryError = {
      status: 500,
      data: { detail: 'Server error' },
    };
    expect(extractApiErrorMessage(error)).toBe('Something went wrong');
  });

  it('returns "Something went wrong" when FetchBaseQueryError data is not an object', () => {
    const error: FetchBaseQueryError = {
      status: 500,
      data: 'plain string error',
    };
    expect(extractApiErrorMessage(error)).toBe('Something went wrong');
  });

  it('returns the message from a SerializedError', () => {
    const error: SerializedError = {
      message: 'Network failed',
      name: 'Error',
      stack: '',
    };
    expect(extractApiErrorMessage(error)).toBe('Network failed');
  });

  it('returns "Something went wrong" when SerializedError has no message', () => {
    const error: SerializedError = { name: 'Error' };
    expect(extractApiErrorMessage(error)).toBe('Something went wrong');
  });

  it('returns null when error is null', () => {
    expect(extractApiErrorMessage(null)).toBeNull();
  });
});
