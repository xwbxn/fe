export const SetConfigTables = {}
export const InterfaceForms = [
  { id: 'asset_interface', title: '资产信息接口' },
  { id: 'monitor_interface', title: '监测数据接口' },
  { id: 'alter_interface', title: '告警管理接口' },
  { id: 'energy_consumption_interface', title: '能耗数据接口' },
  { id: 'oaop_asset_interface', title: 'OAOP资产同步接口' },
]

export const ParametersForms = [
  {
    id: 'monitor_data_clear_set',
    title: '监测数据存储和清除设置',
    items: [
      {
        label: '监测隶属数据保留时间',
        name: 'p1',
        type: 'select',
        require: true,
        options: [
          {label:'值1',value:2},{label:'值2',value:4},{label:'值3',value:3},{label:'值4',value:5},
          {label:'值1',value:21},{label:'值2',value:41},{label:'值3',value:31},{label:'值4',value:51}
        ]
      }, {
        label: '能耗历史数据保留时间',
        type: 'select',
        name: 'p2',
        require: true,
        options: []
      }, {
        label: 'SysLog历史数据保留时间',
        type: 'select',
        name: 'p3',
        require: true,
        options: []
      }, {
        label: 'SnmpTrap历史数据保留时间',
        type: 'select',
        name: 'p4',
        require: true,
        options: []
      }
    ],
    tips:'提示：若设置SysLog、SnmpTrap历史数据保留数目,则其对应的历史数据保留时间设置无效。'
  },
  {
    id: 'session_timeout_set', title: '会话超时设置',
    items: []
  },
  {
    id: 'password_complexity_set', title: '用户密码复杂度与密码修改设置',
    items: [],
    tips:'提示：密码复杂度限制选择开启情况下，密码复杂度需满足以下条件:<br/>1、警码长度8位或以上 ;<br/>2: 离码必须同时包含大写字母，小写字母，数字和特殊字符。<br/>警码定期修改选择开启情况下:<br/>1、未开启密码复杂度验证时，用户密码修改周期不能超过180天，且不能与前3次密码相同，<br/>2开启密码复杂度验证时，用户率码修改周期不能超过360天，且不能与上一次查码相同用户第一次登录修改密码选择开启情况下:用户第一次登录系统时，必须先修改用户警码。'
  },
  {
    id: 'asset_catalog_set', title: '资产目录设置',
    items: [
      {
        label: '测试',
        type: 'checkbox',
        name: 'p8',
        require: true,
        options: [
          {label:'值1',value:2},{label:'值2',value:4},{label:'值3',value:3},{label:'值4',value:5},
          {label:'值1',value:21},{label:'值2',value:41},{label:'值3',value:31},{label:'值4',value:51}
        ]
      }]
  },
  {
    id: 'history_alert_set', title: '历史告警显示设置',
    items: []
  },
  {
    id: 'monitor_account_set', title: '监测账号导出文件密码设置',
    items: []
  },
  {
    id: 'monitor_set', title: '监测设置',
    items: []
  },
  {
    id: 'collect_producer_set', title: '收集厂商信息设置',
    items: []
  },
  {
    id: 'find_set', title: '发现设置',
    item: []
  },
  {
    id: 'power_on_set', title: '开机设置',
    item: []
  },
]



export const SetConfigForms = {
  organization_set: {
    Modal: {
      title: "组织机构",
      width: 650,
      cancel: Function,
      submit: Function
    },
    itemClick: Function,
    FormOnChange: Function,
    Form: {
      col: 2,
      groups: [],
      items: [
        {
          type: "input",
          name: "name",
          label: "机构名称",
          required: true,
        }, {
          type: "input",
          name: "city",
          label: "城市",
          required: true,

        }, {
          type: "input",
          name: "address",
          label: "地址",
          required: false,
        }, {
          type: "input",
          name: "manger",
          label: "机构负责人",
        }, {
          type: "input",
          name: "phone",
          label: "联系电话",
        }, {
          type: "treeselect",
          name: "parent_id",
          label: "上级组织机构",
          source: 'initial',
        }, {
          type: "textarea",
          name: "description",
          label: "描述",
          col: 2
        }
      ]
    },
    Loading: true,
  }
}
