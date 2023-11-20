import { IWidgetConfiguration } from '../type';
import Widget from '../Widget';
import animate from './animate';
import box from './box';
import coordinate from './coordinate';
import data from './data';
import echarts from './echarts';
import font from './font';

export const widgetType = [
  {
    name: '图表',
    list: [
      {
        name: '折线图',
        url: '/image/icon/line.svg',
        code: 'Line',
      },
      {
        name: '柱状图',
        url: '/image/icon/bar.svg',
        code: 'Bar',
      },
      {
        name: '饼图',
        url: '/image/icon/pie.svg',
        code: 'Pie',
      },
      {
        name: '雷达图',
        url: '/image/icon/radar.svg',
        code: 'Radar',
      },
      {
        name: '仪表盘',
        url: '/image/icon/gauge.svg',
        code: 'Gauge',
      },
      {
        name: '表格',
        url: '/image/icon/table.svg',
        code: 'Table',
      },
      {
        name: '散点图',
        url: '/image/icon/scatter.svg',
        code: 'Scatter',
      },
      {
        name: '拓扑图',
        url: '/image/icon/topology.svg',
        code: 'Topology',
      },
    ],
  },
  {
    name: '文字',
    list: [
      {
        name: '普通',
        url: '/image/icon/basetext.svg',
        code: 'BaseText',
      },
      {
        name: '时间',
        url: '/image/icon/timetext.svg',
        code: 'TimeText',
      },
      {
        name: '翻牌器',
        url: '/image/icon/digitalflop.svg',
        code: 'DigitalFlop',
      },
    ],
  },
  {
    name: '边框',
    list: [
      {
        name: '边框1',
        url: '/image/icon/border1.png',
        code: 'BorderBox1',
      },
      {
        name: '边框2',
        url: '/image/icon/border2.png',
        code: 'BorderBox2',
      },
      {
        name: '边框3',
        url: '/image/icon/border3.png',
        code: 'BorderBox3',
      },
      {
        name: '边框4',
        url: '/image/icon/border4.png',
        code: 'BorderBox4',
      },
      {
        name: '边框5',
        url: '/image/icon/border5.png',
        code: 'BorderBox5',
      },
      {
        name: '边框6',
        url: '/image/icon/border6.png',
        code: 'BorderBox6',
      },
      {
        name: '边框7',
        url: '/image/icon/border7.png',
        code: 'BorderBox7',
      },
      {
        name: '边框8',
        url: '/image/icon/border8.png',
        code: 'BorderBox8',
      },
      {
        name: '边框9',
        url: '/image/icon/border9.png',
        code: 'BorderBox9',
      },
      {
        name: '边框10',
        url: '/image/icon/border10.png',
        code: 'BorderBox10',
      },
      {
        name: '边框11',
        url: '/image/icon/border11.png',
        code: 'BorderBox11',
      },
      {
        name: '边框12',
        url: '/image/icon/border12.png',
        code: 'BorderBox12',
      },
      {
        name: '边框13',
        url: '/image/icon/border13.png',
        code: 'BorderBox13',
      },
    ],
  },
  {
    name: '装饰',
    list: [
      {
        name: '装饰1',
        url: '/image/icon/decorator1.png',
        code: 'Decoration1',
      },
      {
        name: '装饰2',
        url: '',
        code: 'Decoration2',
      },
      {
        name: '装饰3',
        url: '',
        code: 'Decoration3',
      },
      {
        name: '装饰4',
        url: '',
        code: 'Decoration4',
      },
      {
        name: '装饰5',
        url: '',
        code: 'Decoration5',
      },
      {
        name: '装饰6',
        url: '',
        code: 'Decoration6',
      },
      {
        name: '装饰7',
        url: '',
        code: 'Decoration7',
      },
      {
        name: '装饰8',
        url: '',
        code: 'Decoration8',
      },
      {
        name: '装饰9',
        url: '',
        code: 'Decoration9',
      },
      {
        name: '装饰10',
        url: '',
        code: 'Decoration10',
      },
      {
        name: '装饰11',
        url: '',
        code: 'Decoration11',
      },
      {
        name: '装饰12',
        url: '',
        code: 'Decoration12',
      },
    ],
  },
];

export const widgetConfigure: IWidgetConfiguration = {
  BaseText: {
    component: Widget.BaseText,
    configureValue: {
      ...font.configureValue,
      ...box.configureValue,
      ...animate.configureValue,
    },
    configuration: {
      widgetConfigure: [...font.configure, box.configure, animate.configure],
      dataConfigure: [...data.configure],
      coordinateConfigure: coordinate.configure,
    },
    coordinateValue: {
      width: 200,
      height: 40,
    },
    dataConfigureValue: {
      ...data.configureValue,
      mock: {
        value: '文本框',
      },
    },
  },
  TimeText: {
    component: Widget.TimeText,
    configureValue: {
      ...font.configureValue,
      fmtDate: 'YYYY-MM-DD HH:mm:ss',
    },
    coordinateValue: {
      width: 400,
      height: 40,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Input',
          label: '时间格式',
          name: 'fmtDate',
          required: false,
          placeholder: '',
        },
        ...font.configure,
        box.configure,
        animate.configure,
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  DigitalFlop: {
    component: Widget.DigitalFlop,
    configureValue: {
      content: '{nt}',
      toFixed: 0,
      styleTextAlign: 'center',
      styleFontSize: 30,
      styleFill: '#3de7c9',
      styleTextBaseline: 'middle',
      rowGap: 0,
      formatter: undefined,
      animationCurve: 'easeOutCubic',
      animationFrame: 50,
    },
    coordinateValue: {
      width: 400,
      height: 50,
    },
    dataConfigureValue: {
      ...data.configureValue,
      mock: {
        value: [1234567890],
      },
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Input',
          label: '模板',
          name: 'content',
          placeholder: '默认为{nt}',
          required: false,
        },
        {
          componentName: 'InputNumber',
          label: '小数位数',
          name: 'toFixed',
          required: false,
          placeholder: '',
        },
        {
          componentName: 'Select',
          label: '文字对齐',
          name: 'styleTextAlign',
          required: false,
          placeholder: '',
          options: [
            { code: 'left', name: 'left' },
            { code: 'center', name: 'center' },
            { code: 'right', name: 'right' },
          ],
        },
        {
          componentName: 'InputNumber',
          label: '字体大小',
          name: 'styleFontSize',
          required: false,
          placeholder: '',
        },
        {
          componentName: 'SketchPicker',
          label: '字体颜色',
          name: 'styleFill',
          required: false,
          placeholder: '',
        },
        {
          componentName: 'InputNumber',
          label: '行间距',
          name: 'rowGap',
          required: false,
          placeholder: '',
        },
      ],
      coordinateConfigure: coordinate.configure,
      dataConfigure: data.configure,
    },
  },
  Line: {
    component: Widget.Line,
    configureValue: {
      ...animate.configureValue,
      ...echarts.title.configureValue,
      ...echarts.legend.configureValue,
      ...echarts.grid.configureValue,
      ...echarts.xAxis.configureValue,
      ...echarts.yAxis.configureValue,
      ...echarts.echartColor.configureValue,
      ...echarts.line.configureValue,
      ...echarts.seriesLabel.configureValue,
      ...echarts.seriesStack.configureValue,
      ...echarts.symbol.configureValue,
    },
    dataConfigureValue: {
      ...data.configureValue,
      field: 'series',
      mock: {
        series: [
          {
            seriesName: 'Email',
            data: [
              {
                name: 'Mon',
                value: '@integer(100, 300)',
              },
              {
                name: 'Tue',
                value: '@integer(100, 300)',
              },
              {
                name: 'Wed',
                value: '@integer(100, 300)',
              },
              {
                name: 'Thu',
                value: '@integer(100, 300)',
              },
              {
                name: 'Fri',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sat',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sun',
                value: '@integer(100, 300)',
              },
            ],
          },
        ],
      },
    },
    coordinateValue: {
      width: 500,
      height: 300,
    },
    configuration: {
      widgetConfigure: [
        [
          {
            name: '折线设置',
            list: [...echarts.line.configure, echarts.seriesLabel.configure, echarts.symbol.configure, ...echarts.seriesStack.configure],
          },
          {
            name: '标题',
            list: echarts.title.configure,
          },
          {
            name: '图例',
            list: echarts.legend.configure,
          },
          {
            name: '网格',
            list: echarts.grid.configure,
          },
          {
            name: 'X轴',
            list: echarts.xAxis.configure,
          },
          {
            name: 'y轴',
            list: echarts.yAxis.configure,
          },
          {
            name: '自定义颜色',
            list: echarts.echartColor.configure,
          },
          ...animate.configure,
        ],
      ],
      coordinateConfigure: coordinate.configure,
      dataConfigure: data.configure,
    },
  },
  Bar: {
    component: Widget.Bar,
    configureValue: {
      ...animate.configureValue,
      ...echarts.title.configureValue,
      ...echarts.legend.configureValue,
      ...echarts.grid.configureValue,
      ...echarts.xAxis.configureValue,
      ...echarts.yAxis.configureValue,
      ...echarts.echartColor.configureValue,
      ...echarts.bar.configureValue,
      ...echarts.seriesLabel.configureValue,
      ...echarts.seriesStack.configureValue,
      xAxisBoundaryGap: true,
      yAxisBoundaryGap: true,
    },
    dataConfigureValue: {
      ...data.configureValue,
      field: 'series',
      mock: {
        series: [
          {
            seriesName: 'Email',
            data: [
              {
                name: 'Mon',
                value: '@integer(100, 300)',
              },
              {
                name: 'Tue',
                value: '@integer(100, 300)',
              },
              {
                name: 'Wed',
                value: '@integer(100, 300)',
              },
              {
                name: 'Thu',
                value: '@integer(100, 300)',
              },
              {
                name: 'Fri',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sat',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sun',
                value: '@integer(100, 300)',
              },
            ],
          },
        ],
      },
    },
    coordinateValue: {
      width: 500,
      height: 300,
    },
    configuration: {
      widgetConfigure: [
        [
          {
            name: '柱状设置',
            list: [...echarts.seriesStack.configure, ...echarts.bar.configure, echarts.seriesLabel.configure],
          },
          {
            name: '标题',
            list: echarts.title.configure,
          },
          {
            name: '图例',
            list: echarts.legend.configure,
          },
          {
            name: '网格',
            list: echarts.grid.configure,
          },
          {
            name: 'X轴',
            list: echarts.xAxis.configure,
          },
          {
            name: 'y轴',
            list: echarts.yAxis.configure,
          },
          {
            name: '自定义颜色',
            list: echarts.echartColor.configure,
          },
          ...animate.configure,
        ],
      ],
      coordinateConfigure: coordinate.configure,
      dataConfigure: data.configure,
    },
  },
  Pie: {
    component: Widget.Pie,
    configureValue: {
      styleDisplay: 'block',
      ...animate.configureValue,
      ...echarts.title.configureValue,
      ...echarts.legend.configureValue,
      ...echarts.echartColor.configureValue,
      ...echarts.pie.configureValue,
      xAxisShow: false,
      yAxisShow: false,
      seriesLabelShow: true,
      seriesLabelPosition: 'outside',
      seriesLabelColor: '',
      xAxisType: 'category',
      yAxisType: 'value',
    },
    dataConfigureValue: {
      ...data.configureValue,
      field: 'series',
      mock: {
        series: [
          {
            seriesName: 'Email',
            data: [
              {
                name: 'Mon',
                value: '@integer(100, 300)',
              },
              {
                name: 'Tue',
                value: '@integer(100, 300)',
              },
              {
                name: 'Wed',
                value: '@integer(100, 300)',
              },
              {
                name: 'Thu',
                value: '@integer(100, 300)',
              },
              {
                name: 'Fri',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sat',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sun',
                value: '@integer(100, 300)',
              },
            ],
          },
        ],
      },
    },
    coordinateValue: {
      width: 500,
      height: 300,
    },
    configuration: {
      widgetConfigure: [
        [
          {
            name: '饼图设置',
            list: [
              ...echarts.pie.configure,
              echarts.seriesLabel.configure.map((item: any) => {
                return {
                  ...item,
                  list: item.list.map((subItem) => {
                    if (subItem.name === 'seriesLabelPosition') {
                      return {
                        ...subItem,
                        options: [
                          { code: 'outside', name: 'outside' },
                          { code: 'inside', name: 'inside' },
                          { code: 'center', name: 'center' },
                        ],
                      };
                    }
                    return subItem;
                  }),
                };
              }),
            ],
          },
          {
            name: '标题',
            list: [...echarts.title.configure],
          },
          {
            name: '图例',
            list: [...echarts.legend.configure],
          },
          {
            name: '自定义颜色',
            list: [...echarts.echartColor.configure],
          },
          ...animate.configure,
        ],
      ],
      coordinateConfigure: coordinate.configure,
      dataConfigure: data.configure,
    },
  },
  Radar: {
    component: Widget.Radar,
    coordinateValue: {
      width: 500,
      height: 300,
    },
    dataConfigureValue: {
      ...data.configureValue,
      field: 'series',
      mock: {
        series: [
          {
            seriesName: 'Email',
            data: [
              {
                name: 'Mon',
                value: '@integer(100, 300)',
              },
              {
                name: 'Tue',
                value: '@integer(100, 300)',
              },
              {
                name: 'Wed',
                value: '@integer(100, 300)',
              },
              {
                name: 'Thu',
                value: '@integer(100, 300)',
              },
              {
                name: 'Fri',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sat',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sun',
                value: '@integer(100, 300)',
              },
            ],
          },
          {
            seriesName: 'Director',
            data: [
              {
                name: 'Mon',
                value: '@integer(100, 300)',
              },
              {
                name: 'Tue',
                value: '@integer(100, 300)',
              },
              {
                name: 'Wed',
                value: '@integer(100, 300)',
              },
              {
                name: 'Thu',
                value: '@integer(100, 300)',
              },
              {
                name: 'Fri',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sat',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sun',
                value: '@integer(100, 300)',
              },
            ],
          },
        ],
      },
    },
    configureValue: {
      styleDisplay: 'block',
      ...animate.configureValue,
      ...echarts.title.configureValue,
      ...echarts.legend.configureValue,
      ...echarts.echartColor.configureValue,
      ...echarts.radar.configureValue,
      ...echarts.seriesLabel.configureValue,
      ...echarts.symbol.configureValue,
      xAxisShow: false,
      yAxisShow: false,
      xAxisType: 'category',
      yAxisType: 'value',
    },
    configuration: {
      widgetConfigure: [
        [
          {
            name: '雷达设置',
            list: [...echarts.radar.configure, echarts.symbol.configure],
          },
          {
            name: '标题',
            list: echarts.title.configure,
          },
          {
            name: '图例',
            list: echarts.legend.configure,
          },
        ],
        echarts.echartColor[echarts.echartColor.configure.length - 1],
        animate.configure,
      ],
      coordinateConfigure: coordinate.configure,
      dataConfigure: data.configure,
    },
  },
  Gauge: {
    component: Widget.Gauge,
    coordinateValue: {
      width: 300,
      height: 300,
    },
    dataConfigureValue: {
      ...data.configureValue,
      field: 'series',
      mock: {
        series: [
          {
            seriesName: 'SCORE',
            data: [
              {
                name: 'SCORE',
                value: '@integer(0,100)',
              },
            ],
          },
        ],
      },
    },
    configureValue: {
      ...font.configureValue,
      ...echarts.title.configureValue,
      ...echarts.legend.configureValue,
      ...echarts.echartColor.configureValue,
      ...echarts.gauge.configureValue,
      ...animate.configureValue,
      legendShow: false,
    },
    configuration: {
      widgetConfigure: [
        [
          {
            name: '仪表盘设置',
            list: [...echarts.gauge.configure],
          },
          {
            name: '字体',
            list: [...font.configure],
          },
          {
            name: '标题',
            list: [...echarts.title.configure],
          },
          {
            name: '图例',
            list: [...echarts.legend.configure],
          },
          ...animate.configure,
        ],
      ],
      dataConfigure: data.configure,
      coordinateConfigure: coordinate.configure,
    },
  },
  Table: {
    component: Widget.Table,
    configureValue: {
      styleDisplay: 'block',
      tableBorderColor: 'rgba(255,255,255,0.2)',
      tableFontSize: 14,
      tableHeaderBackgroudColor: 'rgba(80,18,215,1)',
      tableHeaderColor: 'rgba(255,255,255,0.5)',
      tableLineHeight: 35,
      tableShowBorder: true,
      tableShowBorderColor: 'rgba(230,30,30,1)',
      tableShowHeader: true,
      tableTbodyColor: 'rgba(153,144,197,1)',
      tableTbodyEvenBackgroudColor: 'rgba(40,34,89,1)',
      tableTbodyOddBackgroudColor: 'rgba(98,68,244,1)',
      tableRows: 5,
      tableRolling: false,
      tableColumn: [
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'left',
          width: 100,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          align: 'left',
          width: 100,
        },
        {
          title: '工作',
          dataIndex: 'job',
          align: 'left',
        },
      ],
    },
    dataConfigureValue: {
      ...data.configureValue,
      field: 'table',
      mock: {
        table: [
          {
            name: 'hejp',
            age: 20,
            job: '前端开发工程师',
          },
          {
            name: 'zhangsan',
            age: 20,
            job: '后台开发',
          },
          {
            name: 'lisi',
            age: 20,
            job: '产品经理',
          },
        ],
      },
    },
    coordinateValue: {
      width: 500,
      height: 300,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'InputNumber',
          label: '字体大小',
          name: 'tableFontSize',
          required: false,
          min: 12,
          placeholder: '',
        },
        {
          componentName: 'InputNumber',
          label: '行高',
          name: 'tableLineHeight',
          required: false,
          placeholder: '',
        },
        {
          componentName: 'InputNumber',
          label: '最多显几行',
          name: 'tableRows',
          required: false,
          min: 12,
          placeholder: '',
        },
        {
          componentName: 'JsonEdit',
          label: 'Column数据',
          name: 'tableColumn',
          required: false,
          placeholder: '请输入Column数据',
        },
        [
          {
            name: '边框',
            list: [
              {
                componentName: 'Switch',
                label: '是否显示',
                name: 'tableShowBorder',
                required: false,
                placeholder: '',
              },
              {
                componentName: 'SketchPicker',
                label: '颜色',
                name: 'tableBorderColor',
                required: false,
                placeholder: '请选择颜色',
                relationFields: 'tableShowBorder',
                relationValues: 'true',
              },
            ],
          },
          {
            name: '表头',
            list: [
              {
                componentName: 'Switch',
                label: '是否显示',
                name: 'tableShowHeader',
                required: false,
                placeholder: '',
              },
              {
                componentName: 'SketchPicker',
                label: '背景颜色',
                name: 'tableHeaderBackgroudColor',
                required: false,
                placeholder: '请选择背景颜色',
                relationFields: 'tableShowHeader',
                relationValues: 'true',
              },
              {
                componentName: 'SketchPicker',
                label: '字体颜色',
                name: 'tableHeaderColor',
                required: false,
                placeholder: '请选择字体颜色',
                relationFields: 'tableShowHeader',
                relationValues: 'true',
              },
            ],
          },
          {
            name: '表体',
            list: [
              {
                componentName: 'SketchPicker',
                label: '字体颜色',
                name: 'tableTbodyColor',
                required: false,
                placeholder: '请选择字体颜色',
              },
              {
                componentName: 'SketchPicker',
                label: '奇数行颜色',
                name: 'tableTbodyOddBackgroudColor',
                required: false,
                placeholder: '请选择奇数行颜色',
              },
              {
                componentName: 'SketchPicker',
                label: '偶数行颜色',
                name: 'tableTbodyEvenBackgroudColor',
                required: false,
                placeholder: '请选择偶数行颜色',
              },
            ],
          },
          {
            name: '滚动',
            list: [
              {
                componentName: 'Switch',
                label: '是否滚动',
                name: 'tableRolling',
                required: false,
                placeholder: '',
              },
            ],
          },
        ],
      ],
      dataConfigure: data.configure,
      coordinateConfigure: coordinate.configure,
    },
  },
  Scatter: {
    component: Widget.Scatter,
    configureValue: {
      ...animate.configureValue,
      ...echarts.title.configureValue,
      ...echarts.legend.configureValue,
      ...echarts.grid.configureValue,
      ...echarts.xAxis.configureValue,
      ...echarts.yAxis.configureValue,
      ...echarts.echartColor.configureValue,
      ...echarts.scatter.configureValue,
      ...echarts.seriesLabel.configureValue,
      legendShow: false,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: 10,
    },
    coordinateValue: {
      height: 300,
      width: 500,
    },
    dataConfigureValue: {
      ...data.configureValue,
      field: 'series',
      mock: {
        series: [
          {
            seriesName: 'Email',
            data: [
              {
                name: 'Mon',
                value: '@integer(100, 300)',
              },
              {
                name: 'Tue',
                value: '@integer(100, 300)',
              },
              {
                name: 'Wed',
                value: '@integer(100, 300)',
              },
              {
                name: 'Thu',
                value: '@integer(100, 300)',
              },
              {
                name: 'Fri',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sat',
                value: '@integer(100, 300)',
              },
              {
                name: 'Sun',
                value: '@integer(100, 300)',
              },
            ],
          },
        ],
      },
    },
    configuration: {
      widgetConfigure: [
        [
          {
            name: '散点图设置',
            list: [...echarts.scatter.configure, echarts.symbol.configure, echarts.seriesLabel.configure],
          },
          {
            name: '标题',
            list: echarts.title.configure,
          },
          {
            name: '图例',
            list: echarts.legend.configure,
          },
          {
            name: '网格',
            list: echarts.grid.configure,
          },
          {
            name: 'X轴',
            list: echarts.xAxis.configure,
          },
          {
            name: 'y轴',
            list: echarts.yAxis.configure,
          },
          {
            name: '自定义颜色',
            list: echarts.echartColor.configure,
          },
          ...animate.configure,
        ],
      ],
      dataConfigure: data.configure,
      coordinateConfigure: coordinate.configure,
    },
  },
  Topology: {
    component: Widget.Topology,
    configureValue: {
      graph: {
        cells: [
          {
            position: { x: 110, y: 70 },
            size: { width: 40, height: 40 },
            view: 'react-shape-view',
            attrs: {
              body: {
                fill: 'rgba(0,186,136,0)',
                stroke: 'rgba(0,186,136,1)',
                'stroke-width': 2,
              },
            },
            shape: 'Switch',
            id: 'cf37a53a-185c-426d-ba21-fcbc0418ac28',
            data: { label: '交换机' },
            ports: {
              groups: {
                default: {
                  position: 'center',
                  attrs: { circle: { magnet: true, r: 5 } },
                },
              },
              items: [],
            },
            zIndex: 1,
          },
          {
            position: { x: 268, y: 70 },
            size: { width: 40, height: 40 },
            view: 'react-shape-view',
            attrs: {
              body: {
                fill: 'rgba(0,186,136,0)',
                stroke: 'rgba(0,186,136,1)',
                'stroke-width': 2,
              },
            },
            shape: 'Switch',
            id: '47a3ba30-60fa-44ed-b472-d3039e6e5988',
            data: { label: '交换机' },
            ports: {
              groups: {
                default: {
                  position: 'center',
                  attrs: { circle: { magnet: true, r: 5 } },
                },
              },
              items: [],
            },
            zIndex: 2,
          },
          {
            shape: 'edge',
            attrs: { line: { stroke: '#00ba88', targetMarker: null } },
            id: '1ea606e5-be57-413b-b9bb-8c464ee5e114',
            source: { cell: 'cf37a53a-185c-426d-ba21-fcbc0418ac28' },
            target: { cell: '47a3ba30-60fa-44ed-b472-d3039e6e5988' },
            zIndex: 3,
          },
        ],
      },
    },
    coordinateValue: {
      height: 400,
      width: 600,
    },
    configuration: {},
  },
  BorderBox1: {
    component: Widget.BorderBox1,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox2: {
    component: Widget.BorderBox2,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox3: {
    component: Widget.BorderBox3,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox4: {
    component: Widget.BorderBox4,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: { reverse: false },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Switch',
          label: '反向',
          name: 'reverse',
          required: false,
          placeholder: '',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox5: {
    component: Widget.BorderBox5,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: { reverse: false },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Switch',
          label: '反向',
          name: 'reverse',
          required: false,
          placeholder: '',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox6: {
    component: Widget.BorderBox6,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox7: {
    component: Widget.BorderBox7,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox8: {
    component: Widget.BorderBox8,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: { reverse: false, dur: 3 },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Switch',
          label: '反向',
          name: 'reverse',
          required: false,
          placeholder: '',
        },
        {
          componentName: 'InputNumber',
          label: '动画时长',
          name: 'dur',
          required: false,
          placeholder: '单次动画时长(秒)',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox9: {
    component: Widget.BorderBox9,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox10: {
    component: Widget.BorderBox10,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox11: {
    component: Widget.BorderBox11,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: { title: 'XXX可视化大屏', titleWidth: 250 },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Input',
          label: '标题',
          name: 'title',
          required: false,
          placeholder: '请填写标题',
        },
        {
          componentName: 'InputNumber',
          label: '标题宽度',
          name: 'titleWidth',
          required: false,
          placeholder: '请设置标题宽度',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox12: {
    component: Widget.BorderBox12,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  BorderBox13: {
    component: Widget.BorderBox13,
    coordinateValue: {
      width: 800,
      height: 600,
    },
    configureValue: {},
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration1: {
    component: Widget.Decoration1,
    configureValue: {},
    coordinateValue: {
      width: 200,
      height: 50,
    },
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration2: {
    component: Widget.Decoration2,
    configureValue: { reverse: false, dur: 6 },
    coordinateValue: {
      width: 200,
      height: 20,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Switch',
          label: '纵向',
          name: 'reverse',
          required: false,
          placeholder: '',
        },
        {
          componentName: 'InputNumber',
          label: '动画时长',
          name: 'dur',
          required: false,
          placeholder: '单次动画时长(秒)',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration3: {
    component: Widget.Decoration3,
    configureValue: {},
    coordinateValue: {
      width: 250,
      height: 50,
    },
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration4: {
    component: Widget.Decoration4,
    configureValue: { reverse: false, dur: 3 },
    coordinateValue: {
      width: 20,
      height: 150,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Switch',
          label: '横向',
          name: 'reverse',
          required: false,
          placeholder: '',
        },
        {
          componentName: 'InputNumber',
          label: '动画时长',
          name: 'dur',
          required: false,
          placeholder: '单次动画时长(秒)',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration5: {
    component: Widget.Decoration5,
    configureValue: { dur: 1.2 },
    coordinateValue: {
      width: 400,
      height: 40,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'InputNumber',
          label: '动画时长',
          name: 'dur',
          required: false,
          placeholder: '单次动画时长(秒)',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration6: {
    component: Widget.Decoration6,
    configureValue: {},
    coordinateValue: {
      width: 300,
      height: 30,
    },
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration7: {
    component: Widget.Decoration7,
    configureValue: { title: '标题' },
    coordinateValue: {
      width: 150,
      height: 30,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Input',
          label: '标题',
          name: 'title',
          required: false,
          placeholder: '请输入标题',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration8: {
    component: Widget.Decoration8,
    configureValue: { reverse: false },
    coordinateValue: {
      width: 300,
      height: 50,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Switch',
          label: '反向',
          name: 'reverse',
          required: false,
          placeholder: '',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration9: {
    component: Widget.Decoration9,
    configureValue: { dur: 3, title: '标题' },
    coordinateValue: {
      width: 150,
      height: 150,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Input',
          label: '标题',
          name: 'title',
          required: false,
          placeholder: '请输入标题',
        },
        {
          componentName: 'InputNumber',
          label: '动画时间',
          name: 'dur',
          required: false,
          placeholder: '请设置动画时间',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration10: {
    component: Widget.Decoration10,
    configureValue: {},
    coordinateValue: {
      width: 500,
      height: 5,
    },
    configuration: {
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration11: {
    component: Widget.Decoration11,
    configureValue: { title: '标题' },
    coordinateValue: {
      width: 200,
      height: 60,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Input',
          label: '标题',
          name: 'title',
          required: false,
          placeholder: '请输入标题',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
  Decoration12: {
    component: Widget.Decoration12,
    configureValue: { title: '标题', scanDur: 3, haloDur: 2 },
    coordinateValue: {
      width: 150,
      height: 150,
    },
    configuration: {
      widgetConfigure: [
        {
          componentName: 'Input',
          label: '标题',
          name: 'title',
          required: false,
          placeholder: '请输入标题',
        },
        {
          componentName: 'InputNumber',
          label: '动画时间1',
          name: 'scanDur',
          required: false,
          placeholder: '请设置动画时间1',
        },
        {
          componentName: 'InputNumber',
          label: '动画时间2',
          name: 'haloDur',
          required: false,
          placeholder: '请设置动画时间2',
        },
      ],
      coordinateConfigure: coordinate.configure,
    },
  },
};
