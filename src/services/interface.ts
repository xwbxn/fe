import request from '@/utils/request';
import { RequestMethod } from '@/store/common';
import { N9EAPI } from '../../config/constant';

//根据输入密码获取密钥
// export const getPwInfo = function (id:any) {
//     // return request(`/api/n9e/xh/monitoring/aes/${cipher}`, {
//       return request(`/api/n9e/xh/monitoring/${id}`, {
//         method: RequestMethod.Get,
//       });
//     };
export const getPwInfo = function (cipher:any) {
  return request(`/api/n9e/xh/sysmanagement/access/${cipher}`, {
        method: RequestMethod.Get,
    });
  };
//保存IP和密码
export const saveIpAndPw = function (inputIpVal: any, inputPwVal: any) {
    return request(`/api/n9e/xh/sysmanagement/saveinfo`, {
      method: RequestMethod.Post,
      data:{"inputIpVal": inputIpVal, "inputPwVal":inputPwVal},
    });
  };