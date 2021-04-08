import { stringify } from 'qs';
import { isDefined, isNumber, isObject, isText } from '../../generic/supply/type-guards';
import { IAffected, TOption } from '../../generic/supply/type-utils';
import { IResOk } from './types/common';
import { IRecord, IRecordListQuery } from './types/record';
import {
  IAutomationDefinition,
  IAutomationInstance,
  IAutomationInstanceStatus,
  TAutomationInstanceID,
} from './types/automation';
import { AuthError } from './utils';
import { IIntegrationData, IIntegrationDataListItem, TIntegrationID } from './types/integration';

export class TachkaClient {
  public endpoint: TOption<string>;
  public token: TOption<string>;

  login(secret: string) {
    return this.post<{ token: string }>('login', { secret });
  }

  logout() {
    return this.post<IResOk>('logout');
  }

  recordGetByID<T extends string | string[]>(payload: T) {
    return this.post<T extends [] ? IRecord[] : IRecord>('api/v1/record/get-by-id', payload);
  }

  recordList(query?: IRecordListQuery) {
    return this.get<IRecord[]>('api/v1/record/list', query);
  }

  recordCount(query?: IRecordListQuery) {
    return this.get<number>('api/v1/record/count', query);
  }

  recordListCount(query?: IRecordListQuery) {
    return this.get<{ count: number; results: IRecord[] }>('api/v1/record/list-count', query);
  }

  recordCreate(payload: IRecord[]) {
    return this.post<IRecord[]>('api/v1/record/create', payload);
  }

  recordUpdate(payload: Partial<IRecord> & Pick<IRecord, 'id'>) {
    return this.post<IRecord>('api/v1/record/update', payload);
  }

  recordRemoveByID(payload: string | string[]) {
    return this.post<IAffected>('api/v1/record/remove-by-id', payload);
  }

  integrationDataList() {
    return this.get<IIntegrationDataListItem[]>('integration/data/list');
  }

  integrationDataSet(data: IIntegrationData) {
    return this.post<IIntegrationData>('integration/data/set', data);
  }

  integrationDataRemove(id: TIntegrationID) {
    return this.post<IAffected>('integration/data/remove', id);
  }

  automationInstanceList() {
    return this.get<IAutomationInstance[]>('automation/instance/list');
  }

  automationInstanceDefinitions() {
    return this.get<Record<string, IAutomationDefinition>>('automation/definitions');
  }

  automationInstanceCreate(payload: Omit<IAutomationInstance, 'id'>) {
    return this.post<IAutomationInstance>('automation/instance/create', payload);
  }

  automationInstanceUpdate(
    payload: Partial<Omit<IAutomationInstance, 'id' | 'automation'>> & { id: TAutomationInstanceID }
  ) {
    return this.post<IAutomationInstance>('automation/instance/update', payload);
  }

  automationInstanceRemove(id: TAutomationInstanceID) {
    return this.post<IAffected>('automation/instance/remove', { id });
  }

  automationInstanceStatus(id: TAutomationInstanceID) {
    return this.get<IAutomationInstanceStatus>(`automation/instance/status/${id}`);
  }

  automationInstanceStart(id: TAutomationInstanceID) {
    return this.post<IResOk>(`automation/instance/start/${id}`);
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
    if (!isDefined(this.endpoint)) {
      throw new AuthError('Please set Tachka endpoint');
    }
    if (!isDefined(this.token) && path !== 'login') {
      throw new AuthError('Please set Tachka token');
    }
    const response = await window.fetch(`${this.endpoint}/${path}`, {
      ...init,
      headers: {
        ...init?.headers,
        authorization: `Bearer ${this.token}`,
      },
    });
    const status = response.status;
    if (status === 401 || status === 403) {
      throw new AuthError('Please obtain new Tachka token');
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
}
