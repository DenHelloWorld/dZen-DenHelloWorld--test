import { useAppDispatch, useAppSelector } from './hooks';

describe('hooks', () => {
  it('exports useAppDispatch', () => {
    expect(useAppDispatch).toBeDefined();
  });

  it('exports useAppSelector', () => {
    expect(useAppSelector).toBeDefined();
  });
});
