import { AuthProvider } from 'react-admin';
import { tachka } from '../api-tachka';
import { noop } from '../../generic/supply/utils';

export const authProvider: AuthProvider = {
  login: (params: { url: string; secret: string }) => {
    tachka.setOrigin(params.url);
    return tachka.login(params.secret);
  },
  checkError: (error) => {
    console.log('checkError', error);
    return Promise.resolve();
  },
  checkAuth: () => {
    console.log('checkAuth');
    return tachka
      .recordList({ limit: 1 })
      .then(noop)
      .catch(() => Promise.reject({ redirectTo: '/login', message: 'Unauthorized' }));
  },
  logout: () => {
    return tachka
      .logout()
      .catch(noop)
      .then(() => {
        tachka.removeOrigin();
      });
  },
  getIdentity: () => {
    console.log('getIdentity');
    return Promise.resolve({ id: 1 });
  },
  getPermissions: () => {
    console.log('getPermissions');
    return Promise.resolve([]);
  },
};
