import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

export function useUserIdentity(generatorFunction: () => string) {
  const [cookies, setCookie] = useCookies(['user-identity']);
  const userIdentity = cookies['user-identity'];

  useEffect(() => {
    if (!Boolean(userIdentity)) {
      setCookie('user-identity', generatorFunction());
    }
  }, [userIdentity, setCookie, generatorFunction]);

  return userIdentity;
}
