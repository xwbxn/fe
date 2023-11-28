import request from '@/utils/request';
import { RequestMethod } from '@/store/common';
import { N9EAPI } from '../../config/constant';
//获取系统参数设置
export const getParametersList = function () {
  return request(`/api/n9e/user-config/`, {
      method: RequestMethod.Get
  })
}
//更新系统参数设置
export const updateParametersList = function (data) {
  return request('/api/n9e/user-config/', {
    method: RequestMethod.Put,
    data
  });
};