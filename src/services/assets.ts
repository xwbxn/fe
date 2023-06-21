import request from '@/utils/request';
import { RequestMethod } from '@/store/common';
import { assetsType } from '@/store/assetsInterfaces';

export const getAssets = function (bgid, query) {
    return request("/api/n9e/assets", {
        method: RequestMethod.Get,
        params: {
            bgid, query
        }
    })
}

export const getAsset = function (id: string) {
    return request(`/api/n9e/assets/${id}`, {
        method: RequestMethod.Get
    })
}

export const addAsset = function (data: assetsType) {
    return request("/api/n9e/assets", {
        method: RequestMethod.Post,
        data
    })
}

export const updateAsset = function (data: assetsType) {
    return request("/api/n9e/assets", {
        method: RequestMethod.Put,
        data
    })
}

//删除
export const deleteAssets = function (data: { ids: string[] }) {
    return request(`/api/n9e/assets`, {
        method: RequestMethod.Delete,
        data
    })
}

//获取默认配置模板
export const getAssetDefaultConfig = function (type: string, data) {
    return request(`/api/n9e/assets/config/default/${type}`, {
        method: RequestMethod.Post,
        data
    })
}

//获取可用监控探针
export const getAssetsIdents = function (params) {
    return request('/api/n9e/assets/idents', {
        method: RequestMethod.Get,
        params
    })
}

//获取资产类型
export const getAssetsStypes = function () {
    return request('/api/n9e/assets/types', {
        method: RequestMethod.Get
    })
}

export function bindTags(data) {
    return bindOrUnbindTags(true, data);
}

export function unbindTags(data) {
    return bindOrUnbindTags(false, data);
}

// 绑定/解绑标签
export function bindOrUnbindTags(isBind, data) {
    return request(`/api/n9e/assets/tags`, {
        method: isBind ? RequestMethod.Post : RequestMethod.Delete,
        data,
    });
}

// 修改/移出业务组
export function moveTargetBusi(data) {
    return request(`/api/n9e/assets/bgid`, {
        method: RequestMethod.Put,
        data: Object.assign({ bgid: 0 }, data),
    });
}

// 修改对象备注
export function updateTargetNote(data) {
    return request(`/api/n9e/assets/note`, {
        method: RequestMethod.Put,
        data,
    });
}

// 获取监控对象标签列表
export function getAssetsTags(params) {
    return request(`/api/n9e/assets/tags`, {
        method: RequestMethod.Get,
        params,
    });
}

// 修改对象备注
export function updateAssetNote(data) {
    return request(`/api/n9e/assets/note`, {
      method: RequestMethod.Put,
      data,
    });
  }