import _ from 'lodash';
import request from '@/utils/request';
import { RequestMethod } from '@/store/common';

export function getEvents(params) {
  return request('/api/n9e/alert-his-events/list/xh', {
    method: RequestMethod.Get,
    params,
  });
}
export function deleteHistoryEvents(data: any) {
  return request('/api/n9e/alert-his-events/batch-del', {
    method: RequestMethod.Post,
    data:{ids:data}
  });
}

