import { IConfigurationBase } from '../type';

const page: IConfigurationBase = {
  type: 'page',
  label: '页面配置',
  configureValue: {
    gridSize: 10,
    gridBorderColor: '#090548',
    showAuxiliary: true,
    horizontalNumber: 4,
    verticalNumber: 3,
    interval: 10,
    auxiliaryBorderColor: '#1890ff',
    width: 1920,
    height: 1080,
    backgroundImage: '',
    backgroundColor: '#090548',
    widgets: [],
  },
  configure: [
    {
      componentName: 'Input',
      label: '项目名称',
      name: 'projectName',
      required: false,
      placeholder: '请输入项目名称',
    },
    {
      componentName: 'InputNumber',
      label: '屏幕宽度',
      name: 'width',
      required: false,
      placeholder: '请输入屏幕宽度',
      min: 1366,
      max: 5000,
    },
    {
      componentName: 'InputNumber',
      label: '屏幕高度',
      name: 'height',
      required: false,
      placeholder: '请输入屏幕高度',
      min: 768,
      max: 3000,
    },
    {
      componentName: 'InputNumber',
      label: '横几屏',
      name: 'horizontalNumber',
      required: false,
      min: 1,
      max: 6,
      placeholder: '请输入横几屏',
    },
    {
      componentName: 'InputNumber',
      label: '竖几屏',
      min: 1,
      max: 6,
      name: 'verticalNumber',
      required: false,
      placeholder: '请输入竖几屏',
    },
    {
      componentName: 'SketchPicker',
      label: '背景颜色',
      name: 'backgroundColor',
      required: false,
      placeholder: '请选择背景颜色',
    },
    {
      componentName: 'Input',
      label: '背景图片',
      name: 'backgroundImage',
      required: false,
      placeholder: '请输入背景图片地址',
    },
    {
      componentName: 'Input',
      label: '背景图片',
      name: 'backgroundImage',
      required: false,
      placeholder: '请输入背景图片地址',
    },
    {
      componentName: 'InputNumber',
      label: '刷新时间(s)',
      name: 'interval',
      required: false,
      placeholder: '请输入全局刷新时间',
    },
    {
      componentName: 'Input',
      label: '标题',
      name: 'title',
      required: false,
      placeholder: '请输入标题',
    },
    {
      componentName: 'TextArea',
      label: '大屏简介',
      name: 'description',
      required: false,
      placeholder: '请输入大屏简介',
    },
    [
      {
        name: '屏幕辅助线',
        list: [
          {
            componentName: 'Switch',
            label: '是否显示',
            name: 'showAuxiliary',
            required: false,
            placeholder: '请选择是否显示',
          },
          {
            componentName: 'InputNumber',
            label: '屏幕间隔',
            min: 0,
            max: 20,
            name: 'interval',
            required: false,
            placeholder: '请输入竖几屏',
          },
          {
            componentName: 'SketchPicker',
            label: '线颜色',
            name: 'auxiliaryBorderColor',
            required: false,
            placeholder: '请选择网络线颜色',
          },
        ],
      },
    ],
  ],
};

export default page;
