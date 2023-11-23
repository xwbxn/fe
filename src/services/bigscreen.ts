import request from '@/utils/request';
import { RequestMethod } from '@/store/common';
import { BigscreenType } from '@/pages/bigScreen';

export const listBigscreen = function (params = {}) {
  return request('/api/n9e/bigscreen', {
    method: RequestMethod.Get,
    params,
  });
};

export const getBigscreen = function (id: number | string) {
  return request(`/api/n9e/bigscreen/${id}`, {
    method: RequestMethod.Get,
  });
};

export const createBigscreen = function (data: BigscreenType) {
  return request('/api/n9e/bigscreen', {
    method: RequestMethod.Post,
    data,
  });
};

export const updateBigscreen = function (data: BigscreenType) {
  return request('/api/n9e/bigscreen', {
    method: RequestMethod.Put,
    data,
  });
};

export const deleteBigscreen = function (id: number | string) {
  return request(`/api/n9e/bigscreen/${id}`, {
    method: RequestMethod.Delete,
  });
};

export const getMonitoringOptions = function () {
  return request(`/api/n9e/monitoring/options`, {
    method: RequestMethod.Get,
  });
};
