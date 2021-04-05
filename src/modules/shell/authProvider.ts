import { AuthProvider } from 'react-admin';
import { noop } from '../../generic/supply/utils';
import { removeTachkaCred, setTachkaCred, tachka } from './tachkaClient';
import { isAuthError } from '../api-tachka/utils';

export const authProvider: AuthProvider = {
  checkAuth: () =>
    tachka
      .recordListCount({ limit: 1 })
      .then(noop)
      .catch(() => Promise.reject({ redirectTo: '/login', message: 'Unauthorized' })),
  login: (params: { url: string; secret: string }) => {
    const endpoint = params.url.trim().replace(/\/+$/, '');
    tachka.endpoint = endpoint;
    setTachkaCred({ endpoint });
    return tachka.login(params.secret).then(({ token }) => {
      tachka.token = token;
      setTachkaCred({ token });
    });
  },
  logout: () =>
    tachka
      .logout()
      .catch(noop)
      .then(() => {
        delete tachka.endpoint;
        delete tachka.token;
        removeTachkaCred();
      }),
  getIdentity: () => Promise.resolve({ id: 1 }),
  getPermissions: () => Promise.resolve([]),
  checkError: (error) => {
    if (isAuthError(error)) {
      delete tachka.token;
      removeTachkaCred();
      return Promise.reject();
    } else {
      return Promise.resolve();
    }
  },
};
