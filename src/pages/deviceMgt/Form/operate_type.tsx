import { Space } from 'antd';
import React from 'react';

export enum OperateType {
  SelectDeviceType = "selectDeviceType",
  AssetBatchImport = 'assetBatchImport',
  AssetBatchExport = 'assetBatchExport',
  AssetSetBatchImport = 'assetSetBatchImport',
  ChangeOrganize = 'changeOrganize',
  ChangeCatalog = 'changeCatalog',
  SelectUseStorage = "selectUseStorage",
  ChangeRoom = 'changeRoom',
  CreatedCode = "createdCode",
  DeleteAssets = "deleteAssets",
  AddScrap = "addScrap",
  ExportScrap= "exportScrap",
  ChangeResponsible = "changeResponsible",
  ChangeDept = "changeDept",
  UnbindTag = 'unbindTag',
  Online = "online",
  Offline = "offline",
  NetConfigExport = "netConfigExport",
  NetConfigImport = "netConfigImport",
  None = 'none',
}
export const SetOperateTypes = {
  status_0:{
    batch_operations:[
      { key: OperateType.AssetBatchExport, label: ('导出设备') },
      { key: OperateType.CreatedCode, label: ('生成二维码') }
    ],
    flow_operations:[],

  },
  //   label: '待上线设备',
  status_1:{
    batch_operations:[
      { key: OperateType.SelectDeviceType, label: ('添加设备') },
      { key: OperateType.AssetBatchImport, label: ('导入设备') },
      { key: OperateType.AssetBatchExport, label: ('导出设备') },
      { key: OperateType.DeleteAssets, label: ('删除设备') },
      { key: OperateType.ChangeCatalog, label: ('设备转移') },
      { key: OperateType.CreatedCode, label: ('生成二维码') },
      { key: OperateType.ChangeResponsible, label: ('更改责任人') },
      { key: OperateType.ChangeOrganize, label: ('修改所属组织') },
      { key: OperateType.ChangeRoom, label: ('更改所在机房') },
      { key: OperateType.NetConfigExport, label: ('导出网络配置') },
      { key: OperateType.NetConfigImport, label: ('导入网络配置') },
    ],
    flow_operations:[
        { key:"online", label: '设备上线' }
    ],
  },
  //label: '待上线设备',
  status_2:{
    batch_operations:[
      // { key: OperateType.SelectDeviceType, label: ('添加设备') },
      { key: OperateType.AssetBatchImport, label: ('导入设备') },
      { key: OperateType.AssetBatchExport, label: ('导出设备') },
      { key: OperateType.DeleteAssets, label: ('删除设备') },
      { key: OperateType.ChangeCatalog, label: ('设备转移') },
      { key: OperateType.CreatedCode, label: ('生成二维码') },
      { key: OperateType.ChangeResponsible, label: ('更改责任人') },
      { key: OperateType.ChangeOrganize, label: ('修改所属组织') },
      { key: OperateType.ChangeRoom, label: ('更改所在机房') },
      { key: OperateType.NetConfigExport, label: ('导出网络配置') },
      { key: OperateType.NetConfigImport, label: ('导入网络配置') },
    ],
    flow_operations:[
        { key:"offline", label: '设备下线' }
    ],
  },
  //   label: '已下线设备',
  status_3:{
    batch_operations:[
      { key: OperateType.SelectDeviceType, label: ('添加设备') },
      { key: OperateType.AssetBatchImport, label: ('导入设备') },
      { key: OperateType.AssetBatchExport, label: ('导出设备') },
      { key: OperateType.DeleteAssets, label: ('删除设备') },
      { key: OperateType.ChangeCatalog, label: ('设备转移') },
      { key: OperateType.CreatedCode, label: ('生成二维码') },
      { key: OperateType.ChangeResponsible, label: ('更改责任人') },
      { key: OperateType.ChangeOrganize, label: ('修改所属组织') },
      { key: OperateType.ChangeRoom, label: ('更改所在机房') },
      { key: OperateType.NetConfigExport, label: ('导出网络配置') },
      { key: OperateType.NetConfigImport, label: ('导入网络配置') },
    ],
    flow_operations:[
        { key:"offline", label: '设备下架' }
    ],
  },
  //   label: '已报废设备',
 
  status_4:{
    batch_operations:[
      { key: OperateType.AddScrap, label: ('添加') },
      { key: OperateType.ExportScrap, label: ('导出') },
      { key: OperateType.DeleteAssets, label: ('删除设备') },
      { key: OperateType.ChangeCatalog, label: ('设备转移') }
    ],
    flow_operations:[],
  }
}
export const  AssetStatusUtils= [
  {
    label: '全部设备',
    value: 0,
  },
  {
    label: '已上线设备',
    value: 2,
  },
  {
    label: '待上线设备',
    value: 1,
  },
  {
    label: '已下线设备',
    value: 3,
  },
  {
    label: '已报废设备',
    value: 4,
  },
];


