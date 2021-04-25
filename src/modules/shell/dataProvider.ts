import {
  CreateParams,
  CreateResult,
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  UpdateParams,
  UpdateResult,
} from 'react-admin';
import { isDefined } from '../../generic/supply/type-guards';
import { tachka } from './tachkaClient';

export enum EResource {
  Automation = 'Automation',
  Record = 'Record',
  IntegrationData = 'IntegrationData',
}

const mapToHandlers = <Params, Res>(
  map: Partial<Record<EResource, (params: Params) => Promise<Res>>>
) => (resource: EResource, params: Params) => {
  console.log(resource, params);
  const res = map[resource];
  if (isDefined(res)) {
    return res(params);
  }
  throw new Error('Resource not found');
};

export const dataProvider = {
  getList: mapToHandlers<GetListParams, GetListResult>({
    [EResource.Record]: ({
      pagination: { page, perPage },
      sort: { order },
      filter: { fromISO, toISO, ...filters },
    }) =>
      tachka
        .recordListCount({
          page,
          limit: perPage,
          order: order === 'DESC' ? '-timestamp' : 'timestamp',
          ...filters,
        })
        .then(({ count, results }) => ({ data: results, total: count })),
    [EResource.IntegrationData]: () =>
      tachka.integrationDataList().then((data) => ({ data, total: data.length })),
    [EResource.Automation]: () =>
      tachka.automationInstanceList().then((data) => ({ data, total: data.length })),
  }),
  getOne: mapToHandlers<GetOneParams, GetOneResult>({
    [EResource.Record]: ({ id }) =>
      tachka.recordGetByID(id as string).then((record) => ({ data: record })),
    [EResource.IntegrationData]: ({ id }) =>
      tachka.integrationDataList().then((data) => ({ data: data.find((item) => item.id === id)! })),
    [EResource.Automation]: ({ id }) =>
      tachka.automationInstanceList().then((data) => ({
        data: data.find((item) => item.id === Number(id))!,
      })),
  }),
  getMany: mapToHandlers({
    [EResource.Record]: ({ ids }) =>
      tachka.recordGetByID(ids as string[]).then((records) => ({ data: records })),
  }),
  getManyReference: (resource, params) => {
    console.log('getManyReference', resource, params);
    return Promise.resolve({ data: [], total: 4 });
  },
  update: mapToHandlers<UpdateParams, UpdateResult>({
    [EResource.Record]: ({ data }) =>
      tachka.recordUpdate(data).then((record) => ({ data: record })),
    [EResource.IntegrationData]: ({ id, data: payload, previousData }) =>
      isDefined(payload.data)
        ? tachka
            .integrationDataSet(payload)
            .then((data) => ({ data: { ...data, schema: previousData.schema } }))
        : tachka
            .integrationDataRemove(id as string)
            .then(() => ({ data: { id, schema: previousData.schema } })),
    [EResource.Automation]: ({ data, id }) =>
      tachka.automationInstanceUpdate({ id, ...data }).then((data) => ({ data })),
  }),
  updateMany: (resource, params) => {
    console.log('updateMany', resource, params);
    return Promise.resolve({ data: [] });
  },
  create: mapToHandlers<CreateParams, CreateResult>({
    [EResource.Record]: ({ data }) => tachka.recordCreate([data]).then(() => ({ data })),
    [EResource.Automation]: ({ data }) =>
      tachka
        .automationInstanceCreate(data)
        .then((automationInstance) => ({ data: automationInstance })),
  }),
  delete: mapToHandlers({
    [EResource.Record]: ({ id }) =>
      tachka.recordRemoveByID(id as string).then(() => ({ data: {} })),
    [EResource.Automation]: ({ id }) =>
      tachka.automationInstanceRemove(id as number).then(() => ({ data: {} })),
  }),
  deleteMany: mapToHandlers({
    [EResource.Record]: ({ ids }) =>
      tachka.recordRemoveByID(ids as string[]).then(() => ({ data: ids })),
  }),
} as DataProvider;
