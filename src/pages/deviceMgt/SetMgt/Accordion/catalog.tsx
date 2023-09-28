import { DictValueEnumObj } from '@/components/DictTag';
import { Space } from 'antd';
import React from 'react';

export const SetConfigCatelog = [
  {
    label: '设备类型',
    refer: 'device_type',
    source: 'table',
    fields: ['id', 'name'],
    id: 'device_model_set',
    type:'group'
  },//设备类型
  // {
  //   label: '普通资产类型',
  //   source: 'self',
  //   id: 'common_asset_type_set',
  // },
  {
    label: '厂商信息',
    value: 'producer-type',
    source: 'dict',
    id: 'producer_set',
    type:'single'
  },//厂商
  {
    label: '备件基础数据',
    value: 'spare-base-data',
    source: 'dict',
    id: 'spare_base_data_set',
    type:'single'
  },
  {
    label: '扩展字段',
    source: 'dict',
    value: 'asset_expansion_fields',
    id: 'asset_expansion_set',
    type:'single'
  }, 
  {
    label: '资产完整性设置',
    source: 'self',
    id: 'asset_integrity_set',
    type:'group'
  },
  {
    label: '设备生命期限设置',
    source: 'self',
    id: 'asset_life_period_set',
    type:'group'
  },
  {
    label: '机柜空间设置',
    source: 'self',
    id: 'cabinet_space_set',
    type:'group'
  },
];

export const SetConfigTables = {
  device_model_set: {
    searchOption: [
      {
        type: "select",
        name: "producer",
        require: false,
        label: "厂商",
        placeholder: "请选择厂商",
        source: 'initial'
      },
      {
        type: "input",
        name: "query",
        require: false,
        label: "关键词",
        width: "300px",
        placeholder: "型号/带外版本/描述",
      },
    ],
    itemClick:Function,
    ButtonArr: [
      {
        ButtonText: "添加",
        type: "primary",
        Action:'add',
        ClickFun: Function
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: Function
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: Function
      }, {
        ButtonText: "导出",
        Action:'export',
        ClickFun: Function
      }
    ],
    TableColumns: [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '厂商',
        dataIndex: 'alias',
        key: 'alias',
      },
      {
        title: '型号',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '带外版本',
        dataIndex: 'out_band_version',
        key: 'out_band_version',
      },
      {
        title: 'U数',
        dataIndex: 'u_number',
        key: 'u_number',
      },
      {
        title: '描述',
        dataIndex: 'describe',
        key: 'describe',
      },
    ],
    TableData: []
  },
  producer: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'alias',
        key: 'alias',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'chinese_name',
        key: 'chinese_name',
      },
      {
        title: '公司名称',
        dataIndex: 'company_name',
        key: 'company_name',
      },
      {
        title: '官方站点',
        dataIndex: 'official',
        key: 'official',
      },
      {
        title: '是否国产',
        dataIndex: 'is_domestic',
        key: 'is_domestic',
        render(val) {
          return val!==null && val=='0'?'否':'是';
        }
      },
      {
        title: '是否显示中文',
        dataIndex: 'is_display_chinese',
        key: 'is_display_chinese',
        render(val) {
          return val!==null && val=='0'?'否':'是';
        }
      }],
    TableData: []
  },
  third_party_maintenance: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '维保服务商简称',
        dataIndex: 'alias',
        key: 'alias',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'chinese_name',
        key: 'chinese_name',
      },
      {
        title: '公司名称',
        dataIndex: 'company_name',
        key: 'company_name',
      },
      {
        title: '地址',
        dataIndex: 'official',
        key: 'official',
      },
      {
        title: '传真',
        dataIndex: 'fax',
        key: 'fax',
      },
      {
        title: '联系人',
        dataIndex: 'contact_person',
        key: 'contact_person',
      },
      {
        title: '联系人电话',
        dataIndex: 'contact_number',
        key: 'contact_number',
      },
      {
        title: '联系人邮箱',
        dataIndex: 'contact_email',
        key: 'contact_email',
      },
      {
        title: '是否国产',
        dataIndex: 'is_domestic',
        key: 'is_domestic',
        render(val) {
          return val!==null && val=='0'?'否':'是';
        }
      },
      {
        title: '是否显示中文',
        dataIndex: 'is_display_chinese',
        key: 'is_display_chinese',
        render(val) {
          return val!==null && val=='0'?'否':'是';
        }
      }
    ],
    TableData: []
  },
  supplier: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '供应商简称',
        dataIndex: 'alias',
        key: 'alias',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'chinese_name',
        key: 'chinese_name',
      },
      {
        title: '公司名称',
        dataIndex: 'company_name',
        key: 'company_name',
      },
      {
        title: '地址',
        dataIndex: 'official',
        key: 'official',
      },
      {
        title: '传真',
        dataIndex: 'fax',
        key: 'fax',
      },
      {
        title: '联系人',
        dataIndex: 'contact_person',
        key: 'contact_person',
      },
      {
        title: '联系人电话',
        dataIndex: 'contact_number',
        key: 'contact_number',
      },
      {
        title: '联系人邮箱',
        dataIndex: 'contact_email',
        key: 'contact_email',
      },
      {
        title: '是否国产',
        dataIndex: 'is_domestic',
        key: 'is_domestic',
        render(val) {
          return val!==null && val=='0'?'否':'是';
        }
      },
      {
        title: '是否显示中文',
        dataIndex: 'is_display_chinese',
        key: 'is_display_chinese',
        render(val) {
          return val!==null && val=='0'?'否':'是';
        }
      }],
    TableData: []
  },
  component_brand: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '部件品牌',
        dataIndex: 'alias',
        key: 'alias',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'chinese_name',
        key: 'chinese_name',
      },
      {
        title: '公司名称',
        dataIndex: 'company_name',
        key: 'company_name',
      },
      {
        title: '地址',
        dataIndex: 'official',
        key: 'official',
      },
      {
        title: '传真',
        dataIndex: 'fax',
        key: 'fax',
      },
      {
        title: '联系人',
        dataIndex: 'contact_person',
        key: 'contact_person',
      },
      {
        title: '联系人电话',
        dataIndex: 'contact_number',
        key: 'contact_number',
      },
      {
        title: '联系人邮箱',
        dataIndex: 'contact_email',
        key: 'contact_email',
      },
      {
        title: '是否国产',
        dataIndex: 'is_domestic',
        key: 'is_domestic',
        render(val) {
          return val!==null && val=='0'?'否':'是';
        }
      },
      {
        title: '是否显示中文',
        dataIndex: 'is_display_chinese',
        key: 'is_display_chinese',
        render(val) {
          return val!==null && val=='0'?'否':'是';
        }
      }],
    TableData: []
  },
  spare_party_base: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'producer',
        key: 'producer',
      },
      {
        title: '公司名称',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '官方站点',
        dataIndex: 'vee',
        key: 'vee',
      },
      {
        title: '是否国产',
        dataIndex: 'noute',
        key: 'noute',
      },
      {
        title: '是否显示中文',
        dataIndex: 'descibe',
        key: 'descibe',
      }],
    TableData: []
  },
  party_type: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'producer',
        key: 'producer',
      },
      {
        title: '公司名称',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '官方站点',
        dataIndex: 'vee',
        key: 'vee',
      },
      {
        title: '是否国产',
        dataIndex: 'noute',
        key: 'noute',
      },
      {
        title: '是否显示中文',
        dataIndex: 'descibe',
        key: 'descibe',
      }],
    TableData: []
  },
  device_type: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'producer',
        key: 'producer',
      },
      {
        title: '公司名称',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '官方站点',
        dataIndex: 'vee',
        key: 'vee',
      },
      {
        title: '是否国产',
        dataIndex: 'noute',
        key: 'noute',
      },
      {
        title: '是否显示中文',
        dataIndex: 'descibe',
        key: 'descibe',
      }],
    TableData: []
  },
  inventory_alert_set: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'producer',
        key: 'producer',
      },
      {
        title: '公司名称',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '官方站点',
        dataIndex: 'vee',
        key: 'vee',
      },
      {
        title: '是否国产',
        dataIndex: 'noute',
        key: 'noute',
      },
      {
        title: '是否显示中文',
        dataIndex: 'descibe',
        key: 'descibe',
      }],
    TableData: []
  },
  warehouse_information: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'producer',
        key: 'producer',
      },
      {
        title: '公司名称',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '官方站点',
        dataIndex: 'vee',
        key: 'vee',
      },
      {
        title: '是否国产',
        dataIndex: 'noute',
        key: 'noute',
      },
      {
        title: '是否显示中文',
        dataIndex: 'descibe',
        key: 'descibe',
      }],
    TableData: []
  },
  asset_expansion_set: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'producer',
        key: 'producer',
      },
      {
        title: '公司名称',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '官方站点',
        dataIndex: 'vee',
        key: 'vee',
      },
      {
        title: '是否国产',
        dataIndex: 'noute',
        key: 'noute',
      },
      {
        title: '是否显示中文',
        dataIndex: 'descibe',
        key: 'descibe',
      }],
    TableData: []
  },
  asset_expand_field: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入数据项别名和描述",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '所在内容分类',
        dataIndex: 'type_code',
        key: 'type_code',
        width: 180,
        render(val) {
          return '基本信息';
        }
        
      },
      {
        title: '数据项别名',
        dataIndex: 'dict_value',
        key: 'dict_value',
      },
      {
        title: '数据项序号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '数据项描述',
        dataIndex: 'remark',
        key: 'remark',
      },
     ],
    TableData: []
  },//资产扩展字段
  asset_life_period_set: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'producer',
        key: 'producer',
      },
      {
        title: '公司名称',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '官方站点',
        dataIndex: 'vee',
        key: 'vee',
      },
      {
        title: '是否国产',
        dataIndex: 'noute',
        key: 'noute',
      },
      {
        title: '是否显示中文',
        dataIndex: 'descibe',
        key: 'descibe',
      }],
    TableData: []
  },
  cabinet_space_set: {
    searchOption: [
      {
        type: "input",
        name: "key_name",
        require: false,
        label: "关键词",
        placeholder: "输入厂商简称/中文名称/公司名称",
      },
    ],
    ButtonArr: [
      {
        ButtonText: "导出",
        Action:'export',
        ClickFun: () => {
        }
      }, {
        ButtonText: "导入",
        Action:'import',
        ClickFun: () => {
        }
      }, {
        ButtonText: "添加",
        Action:'add',
        ClickFun: () => {
        }
      }, {
        ButtonText: "删除",
        Action:'delete',
        ClickFun: () => {
        }
      }
    ],
    TableColumns: [
      {
        title: '厂商简称',
        dataIndex: 'name',
        key: 'name',
        width: 180
      },
      {
        title: '中文名称',
        dataIndex: 'producer',
        key: 'producer',
      },
      {
        title: '公司名称',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '官方站点',
        dataIndex: 'vee',
        key: 'vee',
      },
      {
        title: '是否国产',
        dataIndex: 'noute',
        key: 'noute',
      },
      {
        title: '是否显示中文',
        dataIndex: 'descibe',
        key: 'descibe',
      }],
    TableData: []
  },

}
export const SetConfigForms = {
  device_model_set: {
    Modal: {
      title: "添加",
      width: 650,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "name",
          label: "名称",
          required:true,
        }, {
          type: "select",
          name: "subtype",
          label: "子类型",
          source:'initial',
        },{
          type: "select",
          name: "producer_id",
          label: "厂商",
          source:'initial',
          required:true,
        },{
          type: "input",
          name: "model",
          label: "型号",
          require:true,
        },{
          type: "input",
          name: "series",
          label: "系列",
        },{
          type: "input",
          name: "u_number",
          required:true,
          label: "U数",
          data_type: "int",
        },{
          type: "select",
          name: "outline_structure",
          label: "外形结构",
          source:'initial',
        },{
          type: "input",
          name: "specifications",
          label: "规格",
        },{
          type: "input",
          name: "maximum_memory",
          label: "最大内存数",
          data_type: "int",
        },{
          type: "input",
          name: "working_consumption",
          label: "工作功耗",
          data_type: "float",
        },{
          type: "input",
          name: "rated_consumption",
          label: "额定功耗",
          data_type: "float",
        },{
          type: "input",
          name: "peak_consumption",
          label: "峰值功率",
          data_type: "float",
        },{
          type: "input",
          name: "weight",
          label: "设备重量",
          data_type: "float",
        },{
          type: "select",
          name: "out_band_version",
          label: "带外版本",
          source:'initial',
        },{
          type: "input",
          name: "enlistment",
          label: "服务期限",
          data_type: "int",
        },{
          type: "input",
          name: "describe",
          label: "描述",
        }
      ]
    },
    Loading: true,
  },
  producer: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alias",
          label: "厂商简称",
          required:true,
        }, {
          type: "input",
          name: "chinese_name",
          label: "中文名称",
          required:true,
        },{
          type: "input",
          name: "company_name",
          label: "公司全称",
          required:true,
        },{
          type: "input",
          name: "ext_producer_type",
          label: "厂商类别",
          readonly:true,
          value:'厂商',
        },{
          type: "checkbox",
          name: "is_domestic",
          label: "是否国产",
          data_type:"boolean",
          value: 1
        },{
        },{
          type: "input",
          name: "official",
          label: "官方站点",
        },{
          type: "checkbox",
          name: "is_display_chinese",
          required:false,
          label: "是否显示中文",
          data_type:"boolean",
          value: 1
        }
      ]
    },
    Loading: true,
  },
  third_party_maintenance: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alias",
          label: "厂商简称",
          required:true,
        }, {
          type: "input",
          name: "chinese_name",
          label: "中文名称",
          required:false,
        },{
          type: "input",
          name: "company_name",
          label: "公司全称",
          required:true,
        },{
          type: "input",
          name: "ext_producer_type",
          label: "厂商类别",
          readonly:true,
          value:'第三方维保服务商',
        },
        {
          type: "input",
          name: "service_tel",
          label: "服务电话",
          required:false,
        },{
          type: "input",
          name: "service_email",
          label: "服务邮箱",
          required:false,
        },
        {
          type: "input",
          name: "country",
          label: "国家",
          required:false,
        },{
          type: "input",
          name: "city",
          label: "城市",
          required:false,
        },
        {
          type: "input",
          name: "address",
          label: "地址",
          required:false,
        },{
          type: "input",
          name: "fax",
          label: "传真",
          required:false,
        },
        {
          type: "input",
          name: "contact_person",
          label: "联系人",
          required:false,
        },{
          type: "input",
          name: "contact_number",
          label: "联系人电话",
          required:false,
        },
        {
          type: "input",
          name: "contact_email",
          label: "联系人邮箱",
          required:false,
        },{
          type: "input",
          name: "official",
          label: "官方站点",
          required:false,
        },
        {
          type: "checkbox",
          name: "is_domestic",
          label: "是否国产",
          value: 1
        },{
          type: "checkbox",
          name: "is_display_chinese",
          required:false,
          label: "是否显示中文",
          value: 1
        }
      ]
    },
    Loading: true,
  },
  supplier: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alias",
          label: "供应商简称",
          required:true,
        }, {
          type: "input",
          name: "chinese_name",
          label: "中文名称",
          required:false,
        },{
          type: "input",
          name: "company_name",
          label: "公司全称",
          required:true,
        },{
          type: "input",
          name: "ext_producer_type",
          label: "厂商类别",
          readonly:true,
          value:'供应商',
        },
        {
          type: "input",
          name: "service_tel",
          label: "服务电话",
          required:false,
        },{
          type: "input",
          name: "service_email",
          label: "服务邮箱",
          required:false,
        },
        {
          type: "input",
          name: "country",
          label: "国家",
          required:false,
        },{
          type: "input",
          name: "city",
          label: "城市",
          required:false,
        },
        {
          type: "input",
          name: "address",
          label: "地址",
          required:false,
        },{
          type: "input",
          name: "fax",
          label: "传真",
          required:false,
        },
        {
          type: "input",
          name: "contact_person",
          label: "联系人",
          required:false,
        },{
          type: "input",
          name: "contact_number",
          label: "联系人电话",
          required:false,
        },
        {
          type: "input",
          name: "contact_email",
          label: "联系人邮箱",
          required:false,
        },{
          type: "input",
          name: "official",
          label: "官方站点",
          required:false,
        },
        {
          type: "checkbox",
          name: "is_domestic",
          label: "是否国产",
          value: 1
        },{
          type: "checkbox",
          name: "is_display_chinese",
          required:false,
          label: "是否显示中文",
          value: 1
        }
      ]
    },
    Loading: true,
  },
  component_brand: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alias",
          label: "部件品牌",
          required:true,
        }, {
          type: "input",
          name: "chinese_name",
          label: "中文名称",
          required:false,
        },{
          type: "input",
          name: "company_name",
          label: "公司全称",
          required:true,
        },{
          type: "input",
          name: "ext_producer_type",
          label: "厂商类别",
          readonly:true,
          value:'部件品牌',
        },
        {
          type: "input",
          name: "service_tel",
          label: "服务电话",
          required:false,
        },{
          type: "input",
          name: "service_email",
          label: "服务邮箱",
          required:false,
        },
        {
          type: "input",
          name: "country",
          label: "国家",
          required:false,
        },{
          type: "input",
          name: "city",
          label: "城市",
          required:false,
        },
        {
          type: "input",
          name: "address",
          label: "地址",
          required:false,
        },{
          type: "input",
          name: "fax",
          label: "传真",
          required:false,
        },
        {
          type: "input",
          name: "contact_person",
          label: "联系人",
          required:false,
        },{
          type: "input",
          name: "contact_number",
          label: "联系人电话",
          required:false,
        },
        {
          type: "input",
          name: "contact_email",
          label: "联系人邮箱",
          required:false,
        },{
          type: "input",
          name: "official",
          label: "官方站点",
          required:false,
        },
        {
          type: "checkbox",
          name: "is_domestic",
          label: "是否国产",
          value: 1
        },{
          type: "checkbox",
          name: "is_display_chinese",
          required:false,
          label: "是否显示中文",
          value: 1
        }
      ]
    },
    Loading: true,
  },
  spare_party_base: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alter_sponsor",
          label: "请添加所有",
        }
      ]
    },
    Loading: true,
  },
  party_type: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alter_sponsor",
          label: "请添加所有",
        }
      ]
    },
    Loading: true,
  },
  device_type: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alter_sponsor",
          label: "请添加所有",
        }
      ]
    },
    Loading: true,
  },
  inventory_alert_set: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alter_sponsor",
          label: "请添加所有",
        }
      ]
    },
    Loading: true,
  },
  warehouse_information: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alter_sponsor",
          label: "请添加所有",
        }
      ]
    },
    Loading: true,
  },
  asset_expand_field: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 24,
      isInline: true,
      items: [
        {
          type: "input",
          name: "dict_category",
          value: '基本信息',
          label: "内容分类",
          readonly :true,
          col: 24,
        }, {
          type: "select",
          name: "sn",
          label: "序号",
          source:'number',
          value:20,
          col: 24,
          option: [],
          data_type: "int"
        }, {
          type: "input",
          name: "dict_value",
          label: "数据项别名",
          require:true,
          col: 24,
        },
        {
          type: "textarea",
          name: "remark",
          label: "描述",
          col: 24,
        }
      ]
    },
    Loading: true,
  },
  asset_integrity_set: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alter_sponsor",
          label: "请添加所有",
        }
      ]
    },
    Loading: true,
  },
  asset_life_period_set: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 2,
      items: [
        {
          type: "input",
          name: "alter_sponsor",
          label: "请添加所有",
        }
      ]
    },
    Loading: true,
  },
  cabinet_space_set: {
    Modal: {
      title: "添加",
      width: 620,
      cancel: Function
    },
    FormOnChange: Function,
    Form: {
      col: 24,
      items: [
        {
          type: "input",
          name: "alter_sponsor",
          label: "请添加所有",
        }
      ]
    },
    Loading: true,
  },
}
