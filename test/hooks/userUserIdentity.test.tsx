import React from 'react';
import { useUserIdentity } from '@app/hooks/useUserIdentity';
import { render } from '@testing-library/react';

const TestComponent = ({ generator }: { generator: () => string }) => {
  const identity = useUserIdentity(generator);

  return <label>{identity}</label>;
};

describe(useUserIdentity, () => {
  test('that it stores a cookie or something', () => {
    const fn1 = () => 'test-identity-1';
    const fn2 = () => 'test-identity-2';

    const { getByText, rerender, container } = render(
      <TestComponent generator={fn1} />
    );

    expect(getByText('test-identity-1')).toBeTruthy();

    rerender(<TestComponent generator={fn2} />);

    expect(getByText('test-identity-1')).toBeTruthy();
  });
});
