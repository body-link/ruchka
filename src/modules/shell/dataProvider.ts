import { DataProvider } from 'react-admin';
import { tachka } from '../api-tachka';
import { isDefined } from '../../generic/supply/type-guards';

export enum EResource {
  Automation = 'automation',
  Record = 'record',
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
  getList: mapToHandlers({
    [EResource.Automation]: () =>
      tachka
        .automationStatus()
        .then((data) => ({ data, total: data.length, validUntil: new Date() })),
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
  }),
  getOne: mapToHandlers({
    [EResource.Record]: ({ id }) =>
      tachka.recordGetByID(id as string).then((record) => ({ data: record })),
  }),
  getMany: mapToHandlers({
    [EResource.Record]: ({ ids }) =>
      tachka.recordGetByID(ids as string[]).then((records) => ({ data: records })),
  }),
  getManyReference: (resource, params) => {
    console.log('getManyReference', resource, params);
    return Promise.resolve({ data: [], total: 4 });
  },
  update: mapToHandlers({
    [EResource.Record]: ({ data }) =>
      tachka.recordUpdate(data).then((record) => ({ data: record })),
  }),
  updateMany: (resource, params) => {
    console.log('updateMany', resource, params);
    return Promise.resolve({ data: [] });
  },
  create: mapToHandlers({
    [EResource.Record]: ({ data }) =>
      tachka.recordCreate([data]).then((records) => ({ data: records[0] })),
  }),
  delete: mapToHandlers({
    [EResource.Record]: ({ id }) =>
      tachka.recordRemoveByID(id as string).then(() => ({ data: {} })),
  }),
  deleteMany: mapToHandlers({
    [EResource.Record]: ({ ids }) =>
      tachka.recordRemoveByID(ids as string[]).then(() => ({ data: ids })),
  }),
} as DataProvider;
