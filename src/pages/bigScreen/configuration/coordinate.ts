import { IConfigurationBase } from '../type';

const coordinate: IConfigurationBase = {
  configureValue: {

  },
  configure: [
    {
      componentName: 'InputNumber',
      label: '左边距',
      name: 'x',
      required: false,
      placeholder: '请输入左边距',
    },
    {
      componentName: 'InputNumber',
      label: '上边距',
      name: 'y',
      required: false,
      placeholder: '请输入上边距',
    },
    {
      componentName: 'InputNumber',
      label: '宽度',
      name: 'width',
      required: false,
      placeholder: '请输入宽度',
    },
    {
      componentName: 'InputNumber',
      label: '高度',
      name: 'height',
      required: false,
      placeholder: '请输入高度',
    },
  ],
};

export default coordinate;
