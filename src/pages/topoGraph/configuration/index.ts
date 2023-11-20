import data from './data';
import attr from './attr';

export const defaultPortAttr = {
  circle: {
    magnet: true,
    r: 5,
  },
};

export const defaultGroup = {
  groups: {
    default: {
      position: 'center',
      attrs: defaultPortAttr,
    },
  },
};

export const defaultPorts = {
  items: [
    {
      group: 'default',
    },
  ],
};

const defaultConfigureValue = {
  shape: 'Rect',
  width: 40,
  height: 40,
  ports: {
    ...defaultGroup,
  },
  attrs: {
    body: {
      fill: 'rgba(0,186,136,0)',
      stroke: 'rgba(0,186,136,1)',
      'stroke-width': 2,
    },
  },
};

export const widgetType = [
  {
    name: '网络资产',
    list: [
      {
        name: '交换机',
        url: '/image/topo/switch.svg',
        code: 'Switch',
      },
      {
        name: '防火墙',
        url: '/image/topo/firewall.svg',
        code: 'Firewall',
      },
      {
        name: '中间件',
        url: '/image/topo/middleware.svg',
        code: 'Middleware',
      },
      {
        name: '数据库',
        url: '/image/topo/database.svg',
        code: 'Database',
      },
      {
        name: '负载',
        url: '/image/topo/lb.svg',
        code: 'LoadBalance',
      },
      {
        name: '服务器',
        url: '/image/topo/server.svg',
        code: 'Server',
      },
    ],
  },
  {
    name: '形状',
    list: [
      {
        name: '矩形',
        url: '',
        code: 'rect',
      },
      {
        name: '圆形',
        url: '',
        code: 'circle',
      },
      {
        name: '椭圆',
        url: '',
        code: 'ellipse',
      },
    ],
  },
];

export const widgetConfigure = {
  Switch: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'Switch',
      data: {
        label: '交换机',
      },
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
  Firewall: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'Firewall',
      data: {
        label: '防火墙',
      },
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
  Middleware: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'Middleware',
      data: {
        label: '中间件',
      },
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
  Database: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'Database',
      data: {
        label: '数据库',
      },
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
  LoadBalance: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'LoadBalance',
      data: {
        label: '负载均衡',
      },
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
  Server: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'Server',
      data: {
        label: '服务器',
      },
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
  rect: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'rect',
      width: 100,
      height: 100,
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
  circle: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'circle',
      width: 100,
      height: 100,
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
  ellipse: {
    configureValue: {
      ...defaultConfigureValue,
      shape: 'ellipse',
      width: 100,
      height: 60,
    },
    dataConfigureValue: data.configureValue,
    configuration: {
      data: data.configure,
      attr: attr.configure,
    },
  },
};
