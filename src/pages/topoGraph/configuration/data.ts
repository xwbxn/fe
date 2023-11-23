const data = {
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
      componentName: 'Input',
      label: '名称',
      name: 'label',
      required: false,
      placeholder: '请输入名称',
    },
  ],
};

export default data;
