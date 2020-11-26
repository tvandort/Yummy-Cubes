import React from 'react';
import '@app/styles/tailwind.css';
import { AppProps } from 'next/app';
import { useUserIdentity } from '@app/hooks/useUserIdentity';
import { v4 } from 'uuid';

const UserIdentityContext = React.createContext<string | undefined>(undefined);

function Website({ Component, pageProps }: AppProps) {
  const userIdentity = useUserIdentity(v4);

  return (
    <UserIdentityContext.Provider value={userIdentity}>
      <Component {...pageProps} />
    </UserIdentityContext.Provider>
  );
}

export default Website;
