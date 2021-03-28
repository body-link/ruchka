import { DataProvider } from 'ra-core';

export const dataProvider: DataProvider = {
  getList: (resource, params) => {
    return Promise.resolve({ data: [], total: 9 });
  },
  getOne: (resource, params) => {
    return Promise.resolve({ data: {} as any });
  },
  getMany: (resource, params) => {
    return Promise.resolve({ data: [] });
  },
  getManyReference: (resource, params) => {
    return Promise.resolve({ data: [], total: 4 });
  },
  update: (resource, params) => {
    return Promise.resolve({ data: {} as any });
  },
  updateMany: (resource, params) => {
    return Promise.resolve({ data: [] });
  },
  create: (resource, params) => {
    return Promise.resolve({ data: {} as any });
  },
  delete: (resource, params) => {
    return Promise.resolve({});
  },
  deleteMany: (resource, params) => {
    return Promise.resolve({});
  },
};
