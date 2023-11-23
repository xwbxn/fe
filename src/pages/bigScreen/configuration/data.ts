import { getApiServiceOptions } from '@/services/api_service';
import { IConfigurationBase } from '../type';

const data: IConfigurationBase = {
  // 数据项默认值
  configureValue: {
    useInterface: false,
    dataType: 'mock',
    mock: {
      value: '文本框',
    },
    url: '',
    method: 'get',
    field: 'value',
    autoRefresh: false,
    interval: 0,
  },
  // 数据项配置
  configure: [
    {
      componentName: 'Select',
      label: '请求类型',
      name: 'dataType',
      required: false,
      placeholder: '',
      relationFields: 'useInterface',
      relationValues: 'false',
      options: [
        { code: 'mock', name: 'mock数据' },
        { code: 'dynamic', name: '接口数据' },
        { code: 'api', name: '接口服务' },
      ],
    },
    {
      componentName: 'JsonEdit',
      label: 'mock数据',
      name: 'mock',
      required: false,
      placeholder: '请输入mock数据',
      relationFields: 'dataType,useInterface',
      relationValues: 'mock,false',
    },
    {
      componentName: 'TextArea',
      label: '接口地址',
      name: 'url',
      required: false,
      placeholder: '请输入接口地址',
      relationFields: 'dataType,useInterface',
      relationValues: 'dynamic,false',
    },
    {
      componentName: 'Select',
      label: '接口服务',
      name: 'url',
      options: getApiServiceOptions,
      required: false,
      placeholder: '请选择接口地址',
      relationFields: 'dataType,useInterface',
      relationValues: 'api,false',
    },
    {
      componentName: 'Select',
      label: '请求方式',
      name: 'method',
      required: false,
      placeholder: '',
      relationFields: 'dataType,useInterface',
      relationValues: 'dynamic,false',
      options: [
        { code: 'get', name: 'GET' },
        { code: 'post', name: 'POST' },
      ],
    },
    {
      componentName: 'Input',
      label: '对应字段',
      name: 'field',
      required: false,
      placeholder: '',
    },
    {
      componentName: 'Switch',
      label: '自动刷新',
      name: 'autoRefresh',
      required: false,
      placeholder: '',
    },
    {
      componentName: 'InputNumber',
      label: '刷新时间(s)',
      name: 'interval',
      required: false,
      placeholder: '数据刷新时间',
      relationFields: 'autoRefresh',
      relationValues: 'true',
    },
  ],
};

export default data;
