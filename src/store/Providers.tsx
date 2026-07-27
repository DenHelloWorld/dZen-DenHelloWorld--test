'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './store';

export default function Providers({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
