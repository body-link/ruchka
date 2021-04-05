import { TachkaClient } from '../api-tachka/TachkaClient';

export const tachka = new TachkaClient();

const LS = window.localStorage;
const LS_RCHK = '_RCHK_';

export const setTachkaCred = (cred: ITachkaCred) =>
  LS.setItem(LS_RCHK, JSON.stringify({ ...getTachkaCred(), ...cred }));
export const getTachkaCred = () => JSON.parse(LS.getItem(LS_RCHK) ?? '{}') as ITachkaCred;
export const removeTachkaCred = () => LS.removeItem(LS_RCHK);

interface ITachkaCred {
  endpoint?: string;
  token?: string;
}

const cred = getTachkaCred();
tachka.endpoint = cred.endpoint;
tachka.token = cred.token;
