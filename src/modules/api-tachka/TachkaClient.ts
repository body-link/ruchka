import { stringify } from 'qs';
import { isDefined, isNumber, isObject, isText } from '../../generic/supply/type-guards';
import { TOption } from '../../generic/supply/type-utils';
import { IResOk } from './types/common';
import { IRecord, IRecordListQuery } from './types/record';

export class TachkaClient {
  public origin: TOption<string> = window.localStorage.getItem(this.lsKey) ?? undefined;

  constructor(private prefix: string) {}

  get lsKey() {
    return `_RCHK_${this.prefix}`;
  }

  setOrigin(url: string) {
    this.origin = url.trim().replace(/\/+$/, '');
    window.localStorage.setItem(this.lsKey, this.origin);
  }

  removeOrigin() {
    window.localStorage.removeItem(this.lsKey);
  }

  login(secret: string) {
    return this.post<IResOk>('login', { secret });
  }

  logout() {
    return this.post<IResOk>('logout');
  }

  recordList(query?: IRecordListQuery) {
    return this.get<IRecord[]>('api/v1/record/list', query);
  }

  private async get<T = void>(path: string, query?: unknown) {
    return this.fetch<T>(isDefined(query) ? `${path}?${stringify(query)}` : path);
  }

  private async post<T = void>(path: string, payload?: unknown) {
    const init: RequestInit = { method: 'POST' };
    if (isDefined(payload)) {
      init.body = JSON.stringify(payload);
      init.headers = {
        'Content-Type': 'application/json',
      };
    }
    return this.fetch<T>(path, init);
  }

  private async fetch<T>(path: string, init?: RequestInit): Promise<T> {
    if (isDefined(this.origin)) {
      const response = await window.fetch(`${this.origin}/${path}`, {
        ...init,
        credentials: 'include',
      });
      if (response.status >= 400) {
        if (response.status === 403) {
          throw new Error('Forbidden');
        }
      }
      const result = await response.json();
      if (response.status !== 200) {
        if (isObject(result)) {
          const {
            error: { status, message },
          } = result;
          const errorStatus = isNumber(status) ? status : response.status;
          const errorMessage = isText(message) ? message : 'No details about this error';
          throw new Error(`${errorStatus}: ${errorMessage}`);
        }
      }
      return result;
    }
    throw new Error("Tachka URL isn't defined");
  }
}
