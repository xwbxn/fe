
export const modelsAttributes = {
  type_1:
  {
    name: 'ARM服务器',
    tip: '',
    type_id: 1,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [
          {
            name: 'operate_system',
            source: 'dict',
            refer: 'operate_system',
          }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              refer: 'device_producers',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              // readonly:true,
              // required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              source: 'dict',
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              refer: 'organs',
            }]
          }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            data_type: 'int',
            refer: 'rooms',
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            data_type: 'int',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '并排放置',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '硬件配置',
        form_type: 'form',
        tip: '请认真填写下面信息(演示)',
        id: 'form-hardware-cfg',
        icon: '',
        models: [
          {
          name: 'CPU',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_cpu',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_cpu_name',
            label: '名称',
            type: 'input',
            required: true,
            placeholder: '请输入名称',
          }, {
            name: 'ext_model',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_multiple_frequency',
            label: '主频',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_core_amount',
            label: '核心数量',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',
          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',
          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',
          }]
          }, {
          name: '内存',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_memory',
          span: 6,
          initial_data: [],
          base_attributes: [
            {
              name: 'base_install_capacity',
              label: '安装容量',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入安装容量',

            }, {
              name: 'base_max_capacity',
              label: '最大容量',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入最大容量',

            }, {
              name: 'base_may_slot',
              label: '可用插槽',
              type: 'input',
              readonly: true,
              required: false,
              placeholder: '请输入最大容量',

            }, {
              name: 'base_use_slot',
              label: '已用插槽',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入最大容量',

            }
          ],
          attributes: [
            {
              name: 'ext_memory_name',
              label: '名称',
              type: 'input',
              required: name,
              placeholder: '请输入名称',
            }, {
              name: 'ext_memory_model',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_main_frequency',
              label: '主频',
              type: 'input',
              required: false,
              placeholder: '请输入主频',

            }, {
              name: 'ext_size',
              label: '大小',
              type: 'input',
              required: true,
              placeholder: '请输入大小',
              unit: 'G',
            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固定版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

          }]
          }, {
          name: '物理磁盘',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_physical_disk',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_bus_type',
            label: '总线类型',
            type: 'input',
            required: false,
            placeholder: '请输入总线类型',

          }, {
            name: 'ext_disk_media',
            label: '磁盘介质',
            type: 'input',
            required: false,
            placeholder: '请输入磁盘介质',

          }, {
            name: 'ext_size',
            label: '大小',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入名称',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_speed',
            label: '转速',
            type: 'input',
            required: false,
            placeholder: '请输入转速',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_dim',
            label: '尺寸',
            type: 'input',
            required: false,
            placeholder: '请输入尺寸',

          }, {
            name: 'ext_fixed_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }]
          }, {
          name: '逻辑磁盘',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_logical_disk',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_raid_level',
            label: 'RAID级别',
            type: 'input',
            required: false,
            placeholder: '请输入RAID级别',

          }, {
            name: 'ext_size',
            label: '大小',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_name',
            label: '阵列卡',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_physical_num',
            label: '物理盘个数',
            type: 'input',
            required: false,
            placeholder: '请输入物理盘个数',
          }, {
            name: 'ext_physical_disk',
            label: '物理磁盘',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',
          }]
        },
        {
          name: '电源',
          tip: '请认真填写下面信息',
          multiple: true,
          id: 'form_power',
          span: 6,
          initial_data: [{
            name: 'ext_name',
            source: 'dict',
            refer: 'operate_system',
          }],


          attributes: [
            {
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              multiple: true,
            }, {
              name: 'ext_type',
              label: '类型',
              type: 'input',
              required: false,
              placeholder: '请输入类型',

            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_power',
              label: '功率',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
        },
        {
          name: '网络端口',
          tip: '',
          multiple: true,
          id: 'form_network_port',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_ip',
            label: 'IP',
            type: 'input',
            required: false,
            placeholder: '请输入名称',

          }, {
            name: 'ext_mac',
            label: 'MAC',
            type: 'input',
            required: false,
            placeholder: '请输入MAC',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_speed',
            label: '速度',
            type: 'input',
            required: false,
            placeholder: '请输入速度',

          }, {
            name: 'ext_fix_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',

          }]
        },
        {
          name: '陈列卡',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_display_code',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_cache',
            label: '缓存大小',
            type: 'input',
            required: false,
            placeholder: '请输入缓存大小',

          }, {
            name: 'ext_speed',
            label: '速度',
            type: 'input',
            required: false,
            placeholder: '请输入速度',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_fix_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }]
        },
        {
          name: '风扇',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_fan',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }]
        }
        ]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [{
          name: 'ext_link_method',
          source: 'dict',
          refer: 'link_method',
        }],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          },{
            name: 'ext_switch_name',
            label: '交换机名称',
            type: 'input',
            required: false,
            placeholder: '请输入交换机名称',
          } ,{
            name: 'ext_switch_mac',
            label: '交换机MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入交换机MAC地址',
          },

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,

          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          },{
            name: 'ext_switch_name',
            label: '交换机名称',
            type: 'input',
            required: false,
            placeholder: '请输入交换机名称',
          } ,{
            name: 'ext_switch_mac',
            label: '交换机MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入交换机MAC地址',
          },{
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_password',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'select',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_link_port',
            label: '连接端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',//service_config
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
           }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            data_type: 'string',
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            data_type:'json',
            key: 'service_name',
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//ARM服务器 1
  type_8:{
    name: 'PC机',
    tip: '',
    type_id: 8,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              refer: 'device_producers',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            data_type: 'int',
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,
          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_username',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'input',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//PC机 8
  type_13:{
    name: '存储',
    tip: '',
    type_id: 13,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [
          {
            name: '填写设备信息',
            tip: '填写设备信息',
            multiple: false,
            id: 'group_base',
            span: 12,
            attributes: [
              {
                name: 'management_ip',
                label: '管理IP',
                type: 'input',
                required: false,
              }, {
                name: 'device_name',
                label: '设备名称',
                type: 'input',
                required: false,
              }, {
                name: 'serial_number',
                label: '序列号',
                type: 'input',
                required: false,
              }, {
                name: 'device_status',
                label: '设备状态',
                readonly: true,
                type: 'input',
                required: false,
              }, {
                name: 'device_producer',
                label: '厂商',
                type: 'select',
                source: 'initial',
                multiple: false,
                required: true,
                option: [],
              }, {
                name: 'device_model',
                label: '型号',
                type: 'select',
                required: true,
                source: 'initial',
                multiple: false,
                option: [],
              }, {
                name: 'subtype',
                label: '子类型',
                type: 'input',
                readonly: true,
                required: false,
              }, {
                name: 'outline_structure',
                label: '外形结构',
                type: 'input',
                readonly: true,
                required: false,
              }, {
                name: 'specifications',
                label: '规格',
                readonly: true,
                type: 'input',
                required: false,
              }, {
                name: 'u_number',
                label: 'U数',
                type: 'input',
                readonly: true,
                required: false,
              }, {
                name: 'use_storage',
                label: '使用存储',
                type: 'input',
                required: false,
                extend: {
                  type: 'dialog',
                  label: '使用存储',
                  source: 'storage',
                  ctrl_name: 'use_storage'
                }
              }, {
                name: 'device_manager_one',
                label: '设备责任人1',
                type: 'select',
                required: false,
                multiple: true,
                source: 'initial',
                refer: 'system_users',
                option: [],
              }, {
                name: 'business_manager_one',
                label: '业务责任人1',
                type: 'select',
                required: false,
                multiple: true,
                source: 'initial',
                refer: 'system_users',
                option: [],
              }, {
                name: 'device_manager_two',
                label: '设备责任人2',
                type: 'select',
                required: false,
                multiple: true,
                source: 'initial',
                refer: 'system_users',
                option: [],
              }, {
                name: 'business_manager_two',
                label: '业务责任人2',
                type: 'select',
                required: false,
                multiple: true,
                source: 'initial',
                refer: 'system_users',
                option: [],
              }, {
                name: 'operating_system',
                label: '操作系统',
                type: 'select',
                required: false,
                multiple: true,
                source: 'dict',
                refer: 'operate_system',
                option: [],
              }, {
                name: 'remark',
                label: '备注',
                type: 'textarea',
                required: false,
              }, {
                name: 'affiliated_organization',
                label: '所属组织机构',
                type: 'treeselect',
                required: true,
                source: 'initial',
                refer: 'organs',
                option: [],
              }]
          }, {
            name: '填写设备位置信息',
            tip: '填写设备位置信息',
            multiple: false,
            id: 'group_position',
            span: 12,
            attributes: [{
              name: 'equipment_room',
              label: '所在机房',
              type: 'select',
              required: true,
              multiple: true,
              source: 'initial',
              refer: 'rooms',
              option: [],
            },
            {
              name: 'region',
              label: '所属区域',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'device_status',
              option: [],
            },
            {
              name: 'owning_cabinet',
              label: '所在机柜',
              type: 'select',
              required: false,
              multiple: true,
              source: 'other',
              option: [],
            },
            {
              name: 'cabinet_location',
              label: '机柜位置',
              type: 'input',
              required: false,
              unit: 'U',
              extend: {
                type: 'checkbox',
                title: '并排放置 ',
                source: 'storage',
                ctrl_name: 'abreast'
              }
            }, {
              name: 'abreast',
              label: '管理IP',
              type: 'hidden',
              required: false,
            }, {
              name: 'location_description',
              label: '位置描述',
              type: 'input',
              required: false,
            }
            ]
          }]

      },
      {
        name: '硬件配置',
        form_type: 'form',
        tip: '请认真填写下面信息(演示)',
        id: 'form-hardware-cfg',
        icon: '',
        models: [
          {
            name: '电源',
            tip: '请认真填写下面信息',
            multiple: true,
            id: 'form_power',
            span: 6,
            initial_data: [
              // {
              // name: 'ext_name',
              // source: 'dict',
              // refer: 'operate_system',
              // }
            ],
            attributes: [
              {
                name: 'ext_name',
                label: '名称',
                type: 'input',
                required: false,
              }, {
                name: 'ext_type',
                label: '类型',
                type: 'input',
                required: false,
                placeholder: '请输入类型',

              }, {
                name: 'ext_models',
                label: '型号',
                type: 'input',
                required: false,
                placeholder: '请输入型号',

              }, {
                name: 'ext_power',
                label: '功率',
                type: 'input',
                required: false,
                placeholder: '请输入名称',

              }, {
                name: 'ext_producer',
                label: '厂商',
                type: 'input',
                required: false,
                placeholder: '请输入厂商',
              }, {
                name: 'ext_party_code',
                label: '部件号',
                type: 'input',
                required: false,
                placeholder: '请输入部件号',

              }, {
                name: 'ext_serial',
                label: '序列号',
                type: 'input',
                required: false,
                placeholder: '请输入序列号',

              }, {
                name: 'ext_fixed_version',
                label: '固件版本',
                type: 'input',
                required: false,
                placeholder: '请输入固件版本',

              }, {
                name: 'ext_slot',
                label: '槽位',
                type: 'input',
                required: false,
                placeholder: '请输入槽位',

              }]
          },
          {
            name: '网络端口',
            tip: '',
            multiple: true,
            id: 'form_network_port',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_ip',
              label: 'IP',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_mac',
              label: 'MAC',
              type: 'input',
              required: false,
              placeholder: '请输入MAC',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_speed',
              label: '速度',
              type: 'input',
              required: false,
              placeholder: '请输入速度',

            }, {
              name: 'ext_fix_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',

            }]
          },
          {
            name: '风扇',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_fan',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
          },
          {
            name: '物理磁盘',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_physical_disk',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_bus_type',
              label: '总线类型',
              type: 'input',
              required: false,
              placeholder: '请输入总线类型',

            }, {
              name: 'ext_disk_media',
              label: '磁盘介质',
              type: 'input',
              required: false,
              placeholder: '请输入磁盘介质',

            }, {
              name: 'ext_size',
              label: '大小',
              type: 'input',
              required: false,
              placeholder: '请输入大小',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_speed',
              label: '转速',
              type: 'input',
              required: false,
              placeholder: '请输入转速',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_dim',
              label: '尺寸',
              type: 'input',
              required: false,
              placeholder: '请输入尺寸',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }]
          },//物理磁盘
          {
            name: 'LUN',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_lun',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_lun_name',
              label: 'Lun名称',
              type: 'input',
              required: false,
              placeholder: '请输入Lun名称',
            }, {
              name: 'ext_lun_nameid',
              label: 'Lun ID',
              type: 'input',
              required: false,
              placeholder: '请输入Lun ID',

            }, {
              name: 'ext_lun_capacity',
              label: '容量',
              type: 'input',
              required: false,
              placeholder: '请输入容量',

            }, {
              name: 'ext_pool_id',
              label: '池ID',
              type: 'input',
              required: false,
              placeholder: '请输入大小',

            }, {
              name: 'ext_physical_num',
              label: '物理盘个数',
              type: 'input',
              required: false,
              placeholder: '请输入物理盘个数',
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
            }, {
              name: 'ext_host_port',
              label: '主机端口',
              type: 'input',
              required: false,
            }, {
              name: 'ext_lun_model',
              label: '型号',
              type: 'input',
              required: false,
            }, {
              name: 'ext_storage_port',
              label: '存储端口',
              type: 'input',
              required: false,
            }, {
              name: 'ext_storage_volume',
              label: '存储卷',
              type: 'input',
              required: false,
            }]
          },//LUN      
          {
            name: '存储池',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_storage_pool',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_storage_ame',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_storage_pool_id',
              label: '池ID',
              type: 'input',
              required: false,
            }, {
              name: 'ext_disk_domain_name',
              label: '磁盘域名称',
              type: 'input',
              required: false,
            }, {
              name: 'ext_total_capacity',
              label: '总容量',
              type: 'input',
              required: false,

            }, {
              name: 'ext_used_capacity',
              label: '已用容量',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_remain_capacity',
              label: '剩余容量',
              type: 'input',
              required: false,

            }]
          },//存储池
          {
            name: '端口',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_ports',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_port_name',
              label: '名称',
              type: 'input',
              required: false,
            }, {
              name: 'ext_port_model',
              label: '型号',
              type: 'input',
              required: false,
            }, {
              name: 'ext_port_id',
              label: 'IP',
              type: 'input',
              required: false,
            }, {
              name: 'ext_port_mac',
              label: 'MAC',
              type: 'input',
              required: false,

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_part_code',
              label: '部件号',
              type: 'input',
              required: false,
            }, {
              name: 'ext_serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'ext_speed',
              label: '速度',
              type: 'input',
              required: false,
            }, {
              name: 'ext_fix_version',
              label: '固件版本',
              type: 'input',
              required: false,
            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
            },//端口
            ]
          }]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [
          {
            name: '生产IP信息',
            tip: '填写设备信息',
            multiple: true,
            id: 'group_ip',
            span: 6,
            attributes: [{
              name: 'production_ip',
              label: '生产IP',
              type: 'input',
              required: false,
              placeholder: '请输入生产IP',
            }, {
              name: 'ext_mask',
              label: '子网掩码',
              type: 'input',
              required: false,
              placeholder: '请输入子网掩码',
            }, {
              name: 'ext_gateway',
              label: '网关',
              type: 'input',
              required: false,
              placeholder: '请输入网关',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_operate_system',
              label: '操作系统',
              type: 'input',
              required: false,
              placeholder: '请输入操作系统',
            }, {
              name: 'ext_username',
              label: '用户名',
              type: 'input',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_username',
              label: '密码',
              type: 'password',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_link_method',
              label: '连接方式',
              type: 'input',
              required: false,
              placeholder: '请输入连接方式',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_remote_desktop',
              label: '远程桌面',
              type: 'input',
              required: false,
              placeholder: '请输入远程桌面',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_distr_frame',
              label: '对接配线架',
              type: 'input',
              required: false,
              placeholder: '请输入对接配线架',
            }, {
              name: 'ext_docking_port',
              label: '对接端口',
              type: 'input',
              required: false,
              placeholder: '请输入对接端口',
            }, {
              name: 'ext_corres_port',
              label: '对应端口',
              type: 'input',
              required: false,
              placeholder: '请输入对应端口',
            }

            ]
          }, {
            name: '光纤交换机',
            tip: '填写设备信息',
            multiple: false,
            id: 'group_fiber_switches',
            span: 6,
            attributes: [{
              name: 'ext_har_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }, {
            name: '备光纤交换机',
            tip: '',
            multiple: false,
            id: 'group_optic_switches',
            span: 6,
            attributes: [{
              name: 'ext_hba_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_optic_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_optic_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_optic_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_optic_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_optic_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//存储 13
  type_2:{
    name: '备份设备',
    tip: '',
    type_id: 2,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '硬件配置',
        form_type: 'form',
        tip: '请认真填写下面信息(演示)',
        id: 'form-hardware-cfg',
        icon: '',
        models: [
          {
            name: '磁盘',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_disk',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_bus_type',
              label: '总线类型',
              type: 'input',
              required: false,
              placeholder: '请输入总线类型',

            }, {
              name: 'ext_disk_media',
              label: '磁盘介质',
              type: 'input',
              required: false,
              placeholder: '请输入磁盘介质',

            }, {
              name: 'ext_size',
              label: '大小',
              type: 'input',
              required: false,
              placeholder: '请输入大小',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_speed',
              label: '转速',
              type: 'input',
              required: false,
              placeholder: '请输入转速',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_dim',
              label: '尺寸',
              type: 'input',
              required: false,
              placeholder: '请输入尺寸',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }]
          },
          {
            name: '电源',
            tip: '请认真填写下面信息',
            multiple: true,
            id: 'form_power',
            span: 6,
            initial_data: [{
              name: 'ext_name',
              source: 'dict',
              refer: 'operate_system',
            }],
            attributes: [
              {
                name: 'ext_name',
                label: '名称',
                type: 'select',
                required: false,
                multiple: true,
                source: 'dict',
                refer: 'operate_system',
                option: [],
              }, {
                name: 'ext_type',
                label: '类型',
                type: 'input',
                required: false,
                placeholder: '请输入类型',

              }, {
                name: 'ext_models',
                label: '型号',
                type: 'input',
                required: false,
                placeholder: '请输入型号',

              }, {
                name: 'ext_power',
                label: '功率',
                type: 'input',
                required: false,
                placeholder: '请输入名称',

              }, {
                name: 'ext_producer',
                label: '厂商',
                type: 'input',
                required: false,
                placeholder: '请输入厂商',
              }, {
                name: 'ext_party_code',
                label: '部件号',
                type: 'input',
                required: false,
                placeholder: '请输入部件号',

              }, {
                name: 'ext_serial',
                label: '序列号',
                type: 'input',
                required: false,
                placeholder: '请输入序列号',

              }, {
                name: 'ext_fixed_version',
                label: '固件版本',
                type: 'input',
                required: false,
                placeholder: '请输入固件版本',

              }, {
                name: 'ext_slot',
                label: '槽位',
                type: 'input',
                required: false,
                placeholder: '请输入槽位',

              }]
          },
          {
            name: '网络端口',
            tip: '',
            multiple: true,
            id: 'form_network_port',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_ip',
              label: 'IP',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_mac',
              label: 'MAC',
              type: 'input',
              required: false,
              placeholder: '请输入MAC',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_speed',
              label: '速度',
              type: 'input',
              required: false,
              placeholder: '请输入速度',

            }, {
              name: 'ext_fix_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',

            }]
          },
          {
            name: '风扇',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_fan',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
          }
        ]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [
          {
            name: '管理网信息',
            tip: '填写设备信息',
            multiple: true,
            id: 'group_management',
            span: 6,
            attributes: [{
              name: 'ext_out_band_ip',
              label: '带外IP',
              type: 'input',
              required: false,
              placeholder: '请输入带外IP',
              // options:[{value:"1", label: '测试'}]
            }, {
              name: 'ext_mask',
              label: '子网掩码',
              type: 'input',
              required: false,
              placeholder: '请输入子网掩码',
            }, {
              name: 'ext_gateway',
              label: '网关',
              type: 'input',
              required: false,
              placeholder: '请输入网关',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_corres_port',
              label: '对应端口',
              type: 'input',
              required: false,
              placeholder: '请输入对应端口',
            }, {
              name: 'ext_distr_frame',
              label: '对接配线架',
              type: 'input',
              required: false,
              placeholder: '请输入对接配线架',
            }, {
              name: 'ext_docking_port',
              label: '对接端口',
              type: 'input',
              required: false,
              placeholder: '请输入对接端口',
            }

            ]
          },
          {
            name: '生产IP信息',
            tip: '填写设备信息',
            multiple: true,
            id: 'group_ip',
            span: 6,
            attributes: [{
              name: 'production_ip',
              label: '生产IP',
              type: 'input',
              required: false,
              placeholder: '请输入生产IP',
            }, {
              name: 'ext_mask',
              label: '子网掩码',
              type: 'input',
              required: false,
              placeholder: '请输入子网掩码',
            }, {
              name: 'ext_gateway',
              label: '网关',
              type: 'input',
              required: false,
              placeholder: '请输入网关',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_operate_system',
              label: '操作系统',
              type: 'input',
              required: false,
              placeholder: '请输入操作系统',
            }, {
              name: 'ext_username',
              label: '用户名',
              type: 'input',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_username',
              label: '密码',
              type: 'password',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_link_method',
              label: '连接方式',
              type: 'input',
              required: false,
              placeholder: '请输入连接方式',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_remote_desktop',
              label: '远程桌面',
              type: 'input',
              required: false,
              placeholder: '请输入远程桌面',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_distr_frame',
              label: '对接配线架',
              type: 'input',
              required: false,
              placeholder: '请输入对接配线架',
            }, {
              name: 'ext_docking_port',
              label: '对接端口',
              type: 'input',
              required: false,
              placeholder: '请输入对接端口',
            }, {
              name: 'ext_corres_port',
              label: '对应端口',
              type: 'input',
              required: false,
              placeholder: '请输入对应端口',
            }

            ]
          },
          {
            name: '光纤交换机',
            tip: '填写设备信息',
            multiple: false,
            id: 'group_fiber_switches',
            span: 6,
            attributes: [{
              name: 'ext_har_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          },
          {
            name: '备光纤交换机',
            tip: '',
            multiple: false,
            id: 'group_optic_switches',
            span: 6,
            attributes: [{
              name: 'ext_hba_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_optic_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_optic_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_optic_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_optic_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_optic_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//备份设备 2
  type_3:{
    name: '环境动力',
    tip: '',
    type_id: 3,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              // readonly:true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,
          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_username',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'input',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      },
      {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//环境动力 3
  type_4:{
    name: '超融合',
    tip: '',
    type_id: 4,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '硬件配置',
        form_type: 'form',
        tip: '请认真填写下面信息(演示)',
        id: 'form-hardware-cfg',
        icon: '',
        models: [
          {
            name: '电源',
            tip: '请认真填写下面信息',
            multiple: true,
            id: 'form_power',
            span: 6,
            initial_data: [
              // {
              // name: 'ext_name',
              // source: 'dict',
              // refer: 'operate_system',
              // }
            ],
            attributes: [
              {
                name: 'ext_name',
                label: '名称',
                type: 'input',
                required: false,
              }, {
                name: 'ext_type',
                label: '类型',
                type: 'input',
                required: false,
                placeholder: '请输入类型',

              }, {
                name: 'ext_models',
                label: '型号',
                type: 'input',
                required: false,
                placeholder: '请输入型号',

              }, {
                name: 'ext_power',
                label: '功率',
                type: 'input',
                required: false,
                placeholder: '请输入名称',

              }, {
                name: 'ext_producer',
                label: '厂商',
                type: 'input',
                required: false,
                placeholder: '请输入厂商',
              }, {
                name: 'ext_party_code',
                label: '部件号',
                type: 'input',
                required: false,
                placeholder: '请输入部件号',

              }, {
                name: 'ext_serial',
                label: '序列号',
                type: 'input',
                required: false,
                placeholder: '请输入序列号',

              }, {
                name: 'ext_fixed_version',
                label: '固件版本',
                type: 'input',
                required: false,
                placeholder: '请输入固件版本',

              }, {
                name: 'ext_slot',
                label: '槽位',
                type: 'input',
                required: false,
                placeholder: '请输入槽位',

              }]
          },
          {
            name: '网络端口',
            tip: '',
            multiple: true,
            id: 'form_network_port',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_ip',
              label: 'IP',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_mac',
              label: 'MAC',
              type: 'input',
              required: false,
              placeholder: '请输入MAC',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_speed',
              label: '速度',
              type: 'input',
              required: false,
              placeholder: '请输入速度',

            }, {
              name: 'ext_fix_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',

            }]
          },
          {
            name: '风扇',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_fan',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
          },
          {
            name: '物理磁盘',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_physical_disk',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_name',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_bus_type',
              label: '总线类型',
              type: 'input',
              required: false,
              placeholder: '请输入总线类型',

            }, {
              name: 'ext_disk_media',
              label: '磁盘介质',
              type: 'input',
              required: false,
              placeholder: '请输入磁盘介质',

            }, {
              name: 'ext_size',
              label: '大小',
              type: 'input',
              required: false,
              placeholder: '请输入大小',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_speed',
              label: '转速',
              type: 'input',
              required: false,
              placeholder: '请输入转速',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_dim',
              label: '尺寸',
              type: 'input',
              required: false,
              placeholder: '请输入尺寸',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }]
          },//物理磁盘
          {
            name: 'LUN',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_lun',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_lun_name',
              label: 'Lun名称',
              type: 'input',
              required: false,
              placeholder: '请输入Lun名称',
            }, {
              name: 'ext_lun_nameid',
              label: 'Lun ID',
              type: 'input',
              required: false,
              placeholder: '请输入Lun ID',

            }, {
              name: 'ext_lun_capacity',
              label: '容量',
              type: 'input',
              required: false,
              placeholder: '请输入容量',

            }, {
              name: 'ext_pool_id',
              label: '池ID',
              type: 'input',
              required: false,
              placeholder: '请输入大小',

            }, {
              name: 'ext_physical_num',
              label: '物理盘个数',
              type: 'input',
              required: false,
              placeholder: '请输入物理盘个数',
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
            }, {
              name: 'ext_host_port',
              label: '主机端口',
              type: 'input',
              required: false,
            }, {
              name: 'ext_lun_model',
              label: '型号',
              type: 'input',
              required: false,
            }, {
              name: 'ext_storage_port',
              label: '存储端口',
              type: 'input',
              required: false,
            }, {
              name: 'ext_storage_volume',
              label: '存储卷',
              type: 'input',
              required: false,
            }]
          },//LUN      
          {
            name: '存储池',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_storage_pool',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_storage_ame',
              label: '名称',
              type: 'input',
              required: false,
              placeholder: '请输入名称',
            }, {
              name: 'ext_storage_pool_id',
              label: '池ID',
              type: 'input',
              required: false,
            }, {
              name: 'ext_disk_domain_name',
              label: '磁盘域名称',
              type: 'input',
              required: false,
            }, {
              name: 'ext_total_capacity',
              label: '总容量',
              type: 'input',
              required: false,

            }, {
              name: 'ext_used_capacity',
              label: '已用容量',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_remain_capacity',
              label: '剩余容量',
              type: 'input',
              required: false,

            }]
          },//存储池
          {
            name: '端口',
            tip: '请认真填写下面信息(演示)',
            multiple: true,
            id: 'form_ports',
            span: 6,
            initial_data: [],
            attributes: [{
              name: 'ext_port_name',
              label: '名称',
              type: 'input',
              required: false,
            }, {
              name: 'ext_port_model',
              label: '型号',
              type: 'input',
              required: false,
            }, {
              name: 'ext_port_id',
              label: 'IP',
              type: 'input',
              required: false,
            }, {
              name: 'ext_port_mac',
              label: 'MAC',
              type: 'input',
              required: false,

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_part_code',
              label: '部件号',
              type: 'input',
              required: false,
            }, {
              name: 'ext_serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'ext_speed',
              label: '速度',
              type: 'input',
              required: false,
            }, {
              name: 'ext_fix_version',
              label: '固件版本',
              type: 'input',
              required: false,
            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
            },//端口
            ]
          }]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,
          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_username',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'input',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//超融合 4
  type_5:{
    name: '工控机',
    tip: '',
    type_id: 5,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '硬件配置',
        form_type: 'form',
        tip: '请认真填写下面信息(演示)',
        id: 'form-hardware-cfg',
        icon: '',
        models: [{
          name: 'CPU',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_cpu',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_cpu_name',
            label: '名称',
            type: 'input',
            required: true,
            placeholder: '请输入名称',
          }, {
            name: 'ext_model',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_multiple_frequency',
            label: '主频',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_core_amount',
            label: '核心数量',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',
          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',
          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',
          }]
        }, {
          name: '内存',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_memory',
          span: 6,
          initial_data: [],
          base_attributes: [
            {
              name: 'base_install_capacity',
              label: '安装容量',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入安装容量',

            }, {
              name: 'base_max_capacity',
              label: '最大容量',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入最大容量',

            }, {
              name: 'base_may_slot',
              label: '可用插槽',
              type: 'input',
              readonly: true,
              required: false,
              placeholder: '请输入最大容量',

            }, {
              name: 'base_use_slot',
              label: '已用插槽',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入最大容量',

            }
          ],
          attributes: [
            {
              name: 'ext_memory_name',
              label: '名称',
              type: 'input',
              required: name,
              placeholder: '请输入名称',
            }, {
              name: 'ext_memory_model',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_main_frequency',
              label: '主频',
              type: 'input',
              required: false,
              placeholder: '请输入主频',

            }, {
              name: 'ext_size',
              label: '大小',
              type: 'input',
              required: true,
              placeholder: '请输入大小',
              unit: 'G',
            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固定版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
        }, {
          name: '物理磁盘',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_physical_disk',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_bus_type',
            label: '总线类型',
            type: 'input',
            required: false,
            placeholder: '请输入总线类型',

          }, {
            name: 'ext_disk_media',
            label: '磁盘介质',
            type: 'input',
            required: false,
            placeholder: '请输入磁盘介质',

          }, {
            name: 'ext_size',
            label: '大小',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入名称',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_speed',
            label: '转速',
            type: 'input',
            required: false,
            placeholder: '请输入转速',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_dim',
            label: '尺寸',
            type: 'input',
            required: false,
            placeholder: '请输入尺寸',

          }, {
            name: 'ext_fixed_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }]
        }, {
          name: '逻辑磁盘',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_logical_disk',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_raid_level',
            label: 'RAID级别',
            type: 'input',
            required: false,
            placeholder: '请输入RAID级别',

          }, {
            name: 'ext_size',
            label: '大小',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_name',
            label: '阵列卡',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_physical_num',
            label: '物理盘个数',
            type: 'input',
            required: false,
            placeholder: '请输入物理盘个数',
          }, {
            name: 'ext_physical_disk',
            label: '物理磁盘',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',
          }]
        },
        {
          name: '电源',
          tip: '请认真填写下面信息',
          multiple: true,
          id: 'form_power',
          span: 6,
          initial_data: [{
            name: 'ext_name',
            source: 'dict',
            refer: 'operate_system',
          }],


          attributes: [
            {
              name: 'ext_name',
              label: '名称',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'ext_type',
              label: '类型',
              type: 'input',
              required: false,
              placeholder: '请输入类型',

            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_power',
              label: '功率',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
        },
        {
          name: '网络端口',
          tip: '',
          multiple: true,
          id: 'form_network_port',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_ip',
            label: 'IP',
            type: 'input',
            required: false,
            placeholder: '请输入名称',

          }, {
            name: 'ext_mac',
            label: 'MAC',
            type: 'input',
            required: false,
            placeholder: '请输入MAC',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_speed',
            label: '速度',
            type: 'input',
            required: false,
            placeholder: '请输入速度',

          }, {
            name: 'ext_fix_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',

          }]
        },
        {
          name: '陈列卡',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_display_code',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_cache',
            label: '缓存大小',
            type: 'input',
            required: false,
            placeholder: '请输入缓存大小',

          }, {
            name: 'ext_speed',
            label: '速度',
            type: 'input',
            required: false,
            placeholder: '请输入速度',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_fix_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }]
        },
        {
          name: '风扇',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_fan',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }]
        }
        ]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,
          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_username',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'input',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//工控机 5
  type_6:{
    name: '大型机',
    tip: '',
    type_id: 6,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,
          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_username',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'input',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//PC机 6
  type_7:{
    name: '小型机',
    tip: '',
    type_id: 7,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },

      {
        name: '硬件配置',
        form_type: 'form',
        tip: '请认真填写下面信息(演示)',
        id: 'form-hardware-cfg',
        icon: '',
        models: [{
          name: 'CPU',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_cpu',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_cpu_name',
            label: '名称',
            type: 'input',
            required: true,
            placeholder: '请输入名称',
          }, {
            name: 'ext_model',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_multiple_frequency',
            label: '主频',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_core_amount',
            label: '核心数量',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',
          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',
          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',
          }]
        }, {
          name: '内存',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_memory',
          span: 6,
          initial_data: [],
          base_attributes: [
            {
              name: 'base_install_capacity',
              label: '安装容量',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入安装容量',

            }, {
              name: 'base_max_capacity',
              label: '最大容量',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入最大容量',

            }, {
              name: 'base_may_slot',
              label: '可用插槽',
              type: 'input',
              readonly: true,
              required: false,
              placeholder: '请输入最大容量',

            }, {
              name: 'base_use_slot',
              label: '已用插槽',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入最大容量',

            }
          ],
          attributes: [
            {
              name: 'ext_memory_name',
              label: '名称',
              type: 'input',
              required: name,
              placeholder: '请输入名称',
            }, {
              name: 'ext_memory_model',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_main_frequency',
              label: '主频',
              type: 'input',
              required: false,
              placeholder: '请输入主频',

            }, {
              name: 'ext_size',
              label: '大小',
              type: 'input',
              required: true,
              placeholder: '请输入大小',
              unit: 'G',
            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固定版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
        }, {
          name: '物理磁盘',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_physical_disk',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_bus_type',
            label: '总线类型',
            type: 'input',
            required: false,
            placeholder: '请输入总线类型',

          }, {
            name: 'ext_disk_media',
            label: '磁盘介质',
            type: 'input',
            required: false,
            placeholder: '请输入磁盘介质',

          }, {
            name: 'ext_size',
            label: '大小',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入名称',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_speed',
            label: '转速',
            type: 'input',
            required: false,
            placeholder: '请输入转速',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_dim',
            label: '尺寸',
            type: 'input',
            required: false,
            placeholder: '请输入尺寸',

          }, {
            name: 'ext_fixed_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }]
        }, {
          name: '逻辑磁盘',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_logical_disk',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_raid_level',
            label: 'RAID级别',
            type: 'input',
            required: false,
            placeholder: '请输入RAID级别',

          }, {
            name: 'ext_size',
            label: '大小',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_name',
            label: '阵列卡',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_physical_num',
            label: '物理盘个数',
            type: 'input',
            required: false,
            placeholder: '请输入物理盘个数',
          }, {
            name: 'ext_physical_disk',
            label: '物理磁盘',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',
          }]
        },
        {
          name: '电源',
          tip: '请认真填写下面信息',
          multiple: true,
          id: 'form_power',
          span: 6,
          initial_data: [{
            name: 'ext_name',
            source: 'dict',
            refer: 'operate_system',
          }],


          attributes: [
            {
              name: 'ext_name',
              label: '名称',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'ext_type',
              label: '类型',
              type: 'input',
              required: false,
              placeholder: '请输入类型',

            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_power',
              label: '功率',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
        },
        {
          name: '网络端口',
          tip: '',
          multiple: true,
          id: 'form_network_port',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_ip',
            label: 'IP',
            type: 'input',
            required: false,
            placeholder: '请输入名称',

          }, {
            name: 'ext_mac',
            label: 'MAC',
            type: 'input',
            required: false,
            placeholder: '请输入MAC',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_speed',
            label: '速度',
            type: 'input',
            required: false,
            placeholder: '请输入速度',

          }, {
            name: 'ext_fix_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',

          }]
        },
        {
          name: '陈列卡',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_display_code',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_cache',
            label: '缓存大小',
            type: 'input',
            required: false,
            placeholder: '请输入缓存大小',

          }, {
            name: 'ext_speed',
            label: '速度',
            type: 'input',
            required: false,
            placeholder: '请输入速度',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_fix_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }]
        },
        {
          name: '风扇',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_fan',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }]
        },
        {
          name: '分区',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_partition',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_partition_id',
            label: '分区ID',
            type: 'input',
            required: false,
            placeholder: '请输入分区ID',
          }, {
            name: 'ext_id_key',
            label: '识别键',
            type: 'input',
            required: false,
            placeholder: '请输入识别键',

          }, {
            name: 'ext_partition_name',
            label: '分区名称',
            type: 'input',
            required: false,
            placeholder: '请输入分区名称',

          }, {
            name: 'ext_os_version',
            label: 'OS版本',
            type: 'input',
            required: false,
            placeholder: '请输入OS版本',

          }, {
            name: 'ext_serial_number',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_processor_allocated_units',
            label: '处理器已分配处理单元',
            type: 'input',
            required: false,
          }, {
            name: 'ext_min_unit_processor',
            label: '处理器最小处理单元',
            type: 'input',
            required: false,
          }, {
            name: 'ext_max_unit_processor',
            label: '处理器最大处理单元',
            type: 'input',
            required: false,
          }, {
            name: 'ext_allocate_memory',
            label: '已分配内存',
            type: 'input',
            required: false,
          }, {
            name: 'ext_min_memory',
            label: '最小内存',
            type: 'input',
            required: false,
          }, {
            name: 'ext_max_memory',
            label: '最大内存',
            type: 'input',
            required: false,
          }]
        }
        ]

      },





      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,
          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_username',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'input',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//小型机 7
  type_9:{
    name: '备份设备',
    tip: '',
    type_id: 9,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [
          {
            name: '生产IP信息',
            tip: '填写设备信息',
            multiple: true,
            id: 'group_ip',
            span: 6,
            attributes: [{
              name: 'production_ip',
              label: '生产IP',
              type: 'input',
              required: false,
              placeholder: '请输入生产IP',
            }, {
              name: 'ext_mask',
              label: '子网掩码',
              type: 'input',
              required: false,
              placeholder: '请输入子网掩码',
            }, {
              name: 'ext_gateway',
              label: '网关',
              type: 'input',
              required: false,
              placeholder: '请输入网关',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_operate_system',
              label: '操作系统',
              type: 'input',
              required: false,
              placeholder: '请输入操作系统',
            }, {
              name: 'ext_username',
              label: '用户名',
              type: 'input',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_username',
              label: '密码',
              type: 'password',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_link_method',
              label: '连接方式',
              type: 'input',
              required: false,
              placeholder: '请输入连接方式',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_remote_desktop',
              label: '远程桌面',
              type: 'input',
              required: false,
              placeholder: '请输入远程桌面',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_distr_frame',
              label: '对接配线架',
              type: 'input',
              required: false,
              placeholder: '请输入对接配线架',
            }, {
              name: 'ext_docking_port',
              label: '对接端口',
              type: 'input',
              required: false,
              placeholder: '请输入对接端口',
            }, {
              name: 'ext_corres_port',
              label: '对应端口',
              type: 'input',
              required: false,
              placeholder: '请输入对应端口',
            }

            ]
          }, {
            name: '光纤交换机',
            tip: '填写设备信息',
            multiple: false,
            id: 'group_fiber_switches',
            span: 6,
            attributes: [{
              name: 'ext_har_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }, {
            name: '备光纤交换机',
            tip: '',
            multiple: false,
            id: 'group_optic_switches',
            span: 6,
            attributes: [{
              name: 'ext_hba_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_optic_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_optic_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_optic_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_optic_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_optic_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//网络设备 9
  type_10:{
    name: '其他',
    tip: '',
    type_id: 10,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [
          {
            name: '填写设备信息',
            tip: '填写设备信息',
            multiple: false,
            id: 'group_base',
            span: 12,
            attributes: [
              {
                name: 'management_ip',
                label: '管理IP',
                type: 'input',
                required: false,
              }, {
                name: 'device_name',
                label: '设备名称',
                type: 'input',
                required: false,
              }, {
                name: 'serial_number',
                label: '序列号',
                type: 'input',
                required: false,
              }, {
                name: 'device_status',
                label: '设备状态',
                readonly: true,
                type: 'input',
                required: false,
              }, {
                name: 'device_producer',
                label: '厂商',
                type: 'select',
                source: 'initial',
                multiple: false,
                required: true,
                option: [],
              }, {
                name: 'device_model',
                label: '型号',
                type: 'select',
                required: true,
                source: 'initial',
                multiple: false,
                option: [],
              }, {
                name: 'subtype',
                label: '子类型',
                type: 'input',
                readonly: true,
                required: false,
              }, {
                name: 'outline_structure',
                label: '外形结构',
                type: 'input',
                readonly: true,
                required: false,
              }, {
                name: 'specifications',
                label: '规格',
                readonly: true,
                type: 'input',
                required: false,
              }, {
                name: 'u_number',
                label: 'U数',
                type: 'input',
                readonly: true,
                required: false,
              }, {
                name: 'use_storage',
                label: '使用存储',
                type: 'input',
                required: false,
                extend: {
                  type: 'dialog',
                  label: '使用存储',
                  source: 'storage',
                  ctrl_name: 'use_storage'
                }
              }, {
                name: 'device_manager_one',
                label: '设备责任人1',
                type: 'select',
                required: false,
                multiple: true,
                source: 'initial',
                refer: 'system_users',
                option: [],
              }, {
                name: 'business_manager_one',
                label: '业务责任人1',
                type: 'select',
                required: false,
                multiple: true,
                source: 'initial',
                refer: 'system_users',
                option: [],
              }, {
                name: 'device_manager_two',
                label: '设备责任人2',
                type: 'select',
                required: false,
                multiple: true,
                source: 'initial',
                refer: 'system_users',
                option: [],
              }, {
                name: 'business_manager_two',
                label: '业务责任人2',
                type: 'select',
                required: false,
                multiple: true,
                source: 'initial',
                refer: 'system_users',
                option: [],
              }, {
                name: 'operating_system',
                label: '操作系统',
                type: 'select',
                required: false,
                multiple: true,
                source: 'dict',
                refer: 'operate_system',
                option: [],
              }, {
                name: 'remark',
                label: '备注',
                type: 'textarea',
                required: false,
              }, {
                name: 'affiliated_organization',
                label: '所属组织机构',
                type: 'treeselect',
                required: true,
                source: 'initial',
                refer: 'organs',
                option: [],
              }]
          }, {
            name: '填写设备位置信息',
            tip: '填写设备位置信息',
            multiple: false,
            id: 'group_position',
            span: 12,
            attributes: [{
              name: 'equipment_room',
              label: '所在机房',
              type: 'select',
              required: true,
              multiple: true,
              source: 'initial',
              refer: 'rooms',
              option: [],
            },
            {
              name: 'region',
              label: '所属区域',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'device_status',
              option: [],
            },
            {
              name: 'owning_cabinet',
              label: '所在机柜',
              type: 'select',
              required: false,
              multiple: true,
              source: 'other',
              option: [],
            },
            {
              name: 'cabinet_location',
              label: '机柜位置',
              type: 'input',
              required: false,
              unit: 'U',
              extend: {
                type: 'checkbox',
                title: '并排放置 ',
                source: 'storage',
                ctrl_name: 'abreast'
              }
            }, {
              name: 'abreast',
              label: '管理IP',
              type: 'hidden',
              required: false,
            }, {
              name: 'location_description',
              label: '位置描述',
              type: 'input',
              required: false,
            }
            ]
          }]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [
          {
            name: '生产IP信息',
            tip: '填写设备信息',
            multiple: true,
            id: 'group_ip',
            span: 6,
            attributes: [{
              name: 'production_ip',
              label: '生产IP',
              type: 'input',
              required: false,
              placeholder: '请输入生产IP',
            }, {
              name: 'ext_mask',
              label: '子网掩码',
              type: 'input',
              required: false,
              placeholder: '请输入子网掩码',
            }, {
              name: 'ext_gateway',
              label: '网关',
              type: 'input',
              required: false,
              placeholder: '请输入网关',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_operate_system',
              label: '操作系统',
              type: 'input',
              required: false,
              placeholder: '请输入操作系统',
            }, {
              name: 'ext_username',
              label: '用户名',
              type: 'input',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_username',
              label: '密码',
              type: 'password',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_link_method',
              label: '连接方式',
              type: 'input',
              required: false,
              placeholder: '请输入连接方式',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_remote_desktop',
              label: '远程桌面',
              type: 'input',
              required: false,
              placeholder: '请输入远程桌面',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_distr_frame',
              label: '对接配线架',
              type: 'input',
              required: false,
              placeholder: '请输入对接配线架',
            }, {
              name: 'ext_docking_port',
              label: '对接端口',
              type: 'input',
              required: false,
              placeholder: '请输入对接端口',
            }, {
              name: 'ext_corres_port',
              label: '对应端口',
              type: 'input',
              required: false,
              placeholder: '请输入对应端口',
            }

            ]
          }, {
            name: '光纤交换机',
            tip: '填写设备信息',
            multiple: false,
            id: 'group_fiber_switches',
            span: 6,
            attributes: [{
              name: 'ext_har_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }, {
            name: '备光纤交换机',
            tip: '',
            multiple: false,
            id: 'group_optic_switches',
            span: 6,
            attributes: [{
              name: 'ext_hba_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_optic_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_optic_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_optic_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_optic_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_optic_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//其他 10
  type_11:{
    name: '安全设备',
    tip: '',
    type_id: 11,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },

      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [
          {
            name: '生产IP信息',
            tip: '填写设备信息',
            multiple: true,
            id: 'group_ip',
            span: 6,
            attributes: [{
              name: 'production_ip',
              label: '生产IP',
              type: 'input',
              required: false,
              placeholder: '请输入生产IP',
            }, {
              name: 'ext_mask',
              label: '子网掩码',
              type: 'input',
              required: false,
              placeholder: '请输入子网掩码',
            }, {
              name: 'ext_gateway',
              label: '网关',
              type: 'input',
              required: false,
              placeholder: '请输入网关',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_operate_system',
              label: '操作系统',
              type: 'input',
              required: false,
              placeholder: '请输入操作系统',
            }, {
              name: 'ext_username',
              label: '用户名',
              type: 'input',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_username',
              label: '密码',
              type: 'password',
              required: false,
              placeholder: '请输入用户名',
            }, {
              name: 'ext_link_method',
              label: '连接方式',
              type: 'input',
              required: false,
              placeholder: '请输入连接方式',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_remote_desktop',
              label: '远程桌面',
              type: 'input',
              required: false,
              placeholder: '请输入远程桌面',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_distr_frame',
              label: '对接配线架',
              type: 'input',
              required: false,
              placeholder: '请输入对接配线架',
            }, {
              name: 'ext_docking_port',
              label: '对接端口',
              type: 'input',
              required: false,
              placeholder: '请输入对接端口',
            }, {
              name: 'ext_corres_port',
              label: '对应端口',
              type: 'input',
              required: false,
              placeholder: '请输入对应端口',
            }

            ]
          }, {
            name: '光纤交换机',
            tip: '填写设备信息',
            multiple: false,
            id: 'group_fiber_switches',
            span: 6,
            attributes: [{
              name: 'ext_har_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }, {
            name: '备光纤交换机',
            tip: '',
            multiple: false,
            id: 'group_optic_switches',
            span: 6,
            attributes: [{
              name: 'ext_hba_cardname',
              label: 'HBA卡名',
              type: 'input',
              required: false,
              placeholder: '请输入HBA卡名',
            }, {
              name: 'ext_optic_wwn',
              label: 'WWN',
              type: 'input',
              required: false,
              placeholder: '请输入WWN',
            }, {
              name: 'ext_optic_switch_ip',
              label: '交换机IP',
              type: 'input',
              required: false,
              placeholder: '请输入交换机IP',
            }, {
              name: 'ext_optic_port',
              label: '端口',
              type: 'input',
              required: false,
              placeholder: '请输入端口',
            }, {
              name: 'ext_optic_mac',
              label: 'MAC地址',
              type: 'input',
              required: false,
              placeholder: '请输入MAC地址',
            }, {
              name: 'ext_optic_wwpn',
              label: 'WWPN',
              type: 'input',
              required: false,
              placeholder: '请输入WWPN',
            }

            ]
          }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//安全设备 11
  type_12:{
    name: 'X86服务器',
    tip: '',
    type_id: 12,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '硬件配置',
        form_type: 'form',
        tip: '请认真填写下面信息(演示)',
        id: 'form-hardware-cfg',
        icon: '',
        models: [{
          name: 'CPU',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_cpu',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_cpu_name',
            label: '名称',
            type: 'input',
            required: true,
            placeholder: '请输入名称',
          }, {
            name: 'ext_model',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_multiple_frequency',
            label: '主频',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_core_amount',
            label: '核心数量',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',
          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',
          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',
          }]
        }, {
          name: '内存',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_memory',
          span: 6,
          initial_data: [],
          base_attributes: [
            {
              name: 'base_install_capacity',
              label: '安装容量',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入安装容量',

            }, {
              name: 'base_max_capacity',
              label: '最大容量',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入最大容量',

            }, {
              name: 'base_may_slot',
              label: '可用插槽',
              type: 'input',
              readonly: true,
              required: false,
              placeholder: '请输入最大容量',

            }, {
              name: 'base_use_slot',
              label: '已用插槽',
              type: 'input',
              required: false,
              readonly: true,
              placeholder: '请输入最大容量',

            }
          ],
          attributes: [
            {
              name: 'ext_memory_name',
              label: '名称',
              type: 'input',
              required: name,
              placeholder: '请输入名称',
            }, {
              name: 'ext_memory_model',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_main_frequency',
              label: '主频',
              type: 'input',
              required: false,
              placeholder: '请输入主频',

            }, {
              name: 'ext_size',
              label: '大小',
              type: 'input',
              required: true,
              placeholder: '请输入大小',
              unit: 'G',
            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固定版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
        }, {
          name: '物理磁盘',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_physical_disk',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_bus_type',
            label: '总线类型',
            type: 'input',
            required: false,
            placeholder: '请输入总线类型',

          }, {
            name: 'ext_disk_media',
            label: '磁盘介质',
            type: 'input',
            required: false,
            placeholder: '请输入磁盘介质',

          }, {
            name: 'ext_size',
            label: '大小',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入名称',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_speed',
            label: '转速',
            type: 'input',
            required: false,
            placeholder: '请输入转速',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_dim',
            label: '尺寸',
            type: 'input',
            required: false,
            placeholder: '请输入尺寸',

          }, {
            name: 'ext_fixed_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }]
        }, {
          name: '逻辑磁盘',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_logical_disk',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_raid_level',
            label: 'RAID级别',
            type: 'input',
            required: false,
            placeholder: '请输入RAID级别',

          }, {
            name: 'ext_size',
            label: '大小',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_name',
            label: '阵列卡',
            type: 'input',
            required: false,
            placeholder: '请输入大小',

          }, {
            name: 'ext_physical_num',
            label: '物理盘个数',
            type: 'input',
            required: false,
            placeholder: '请输入物理盘个数',
          }, {
            name: 'ext_physical_disk',
            label: '物理磁盘',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',
          }]
        },
        {
          name: '电源',
          tip: '请认真填写下面信息',
          multiple: true,
          id: 'form_power',
          span: 6,
          initial_data: [{
            name: 'ext_name',
            source: 'dict',
            refer: 'operate_system',
          }],


          attributes: [
            {
              name: 'ext_name',
              label: '名称',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'ext_type',
              label: '类型',
              type: 'input',
              required: false,
              placeholder: '请输入类型',

            }, {
              name: 'ext_models',
              label: '型号',
              type: 'input',
              required: false,
              placeholder: '请输入型号',

            }, {
              name: 'ext_power',
              label: '功率',
              type: 'input',
              required: false,
              placeholder: '请输入名称',

            }, {
              name: 'ext_producer',
              label: '厂商',
              type: 'input',
              required: false,
              placeholder: '请输入厂商',
            }, {
              name: 'ext_party_code',
              label: '部件号',
              type: 'input',
              required: false,
              placeholder: '请输入部件号',

            }, {
              name: 'ext_serial',
              label: '序列号',
              type: 'input',
              required: false,
              placeholder: '请输入序列号',

            }, {
              name: 'ext_fixed_version',
              label: '固件版本',
              type: 'input',
              required: false,
              placeholder: '请输入固件版本',

            }, {
              name: 'ext_slot',
              label: '槽位',
              type: 'input',
              required: false,
              placeholder: '请输入槽位',

            }]
        },
        {
          name: '网络端口',
          tip: '',
          multiple: true,
          id: 'form_network_port',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_ip',
            label: 'IP',
            type: 'input',
            required: false,
            placeholder: '请输入名称',

          }, {
            name: 'ext_mac',
            label: 'MAC',
            type: 'input',
            required: false,
            placeholder: '请输入MAC',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_speed',
            label: '速度',
            type: 'input',
            required: false,
            placeholder: '请输入速度',

          }, {
            name: 'ext_fix_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',

          }]
        },
        {
          name: '陈列卡',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_display_code',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_models',
            label: '型号',
            type: 'input',
            required: false,
            placeholder: '请输入型号',

          }, {
            name: 'ext_cache',
            label: '缓存大小',
            type: 'input',
            required: false,
            placeholder: '请输入缓存大小',

          }, {
            name: 'ext_speed',
            label: '速度',
            type: 'input',
            required: false,
            placeholder: '请输入速度',

          }, {
            name: 'ext_producer',
            label: '厂商',
            type: 'input',
            required: false,
            placeholder: '请输入厂商',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_fix_version',
            label: '固件版本',
            type: 'input',
            required: false,
            placeholder: '请输入固件版本',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }]
        },
        {
          name: '风扇',
          tip: '请认真填写下面信息(演示)',
          multiple: true,
          id: 'form_fan',
          span: 6,
          initial_data: [],
          attributes: [{
            name: 'ext_name',
            label: '名称',
            type: 'input',
            required: false,
            placeholder: '请输入名称',
          }, {
            name: 'ext_party_code',
            label: '部件号',
            type: 'input',
            required: false,
            placeholder: '请输入部件号',

          }, {
            name: 'ext_serial',
            label: '序列号',
            type: 'input',
            required: false,
            placeholder: '请输入序列号',

          }, {
            name: 'ext_slot',
            label: '槽位',
            type: 'input',
            required: false,
            placeholder: '请输入槽位',

          }]
        }
        ]

      },
      {
        name: '网络配置',
        path: undefined,
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,
          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_username',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'input',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//X86服务器 12
  type_14:{
    name: '终端设备',
    tip: '',
    type_id: 14,
    models: [
      {
        name: '基本信息',
        tip: '请认真填写下面信息(演示)',
        id: 'form_base_position',
        icon: '',
        form_type: 'group',
        initial_data: [{
          name: 'device_producer',
          source: 'initial',
          refer: 'device_producers',
        }, {
          name: 'device_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'device_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_two',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'business_manager_one',
          source: 'initial',
          refer: 'system_users',
        }, {
          name: 'operating_system',
          source: 'dict',
          refer: 'operate_system',
        }, {
          name: 'affiliated_organization',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'equipment_room',
          source: 'initial',
          refer: 'rooms',
        }
        ],
        models: [{
          name: '填写设备信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_base',
          span: 12,
          attributes: [
            {
              name: 'management_ip',
              label: '管理IP',
              type: 'input',
              required: false,
            }, {
              name: 'device_name',
              label: '设备名称',
              type: 'input',
              required: false,
            }, {
              name: 'serial_number',
              label: '序列号',
              type: 'input',
              required: false,
            }, {
              name: 'device_status',
              label: '设备状态',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'device_producer',
              label: '厂商',
              type: 'select',
              source: 'initial',
              multiple: false,
              required: true,
              option: [],
            }, {
              name: 'device_model',
              label: '型号',
              type: 'select',
              required: true,
              source: 'initial',
              multiple: false,
              option: [],
            }, {
              name: 'subtype',
              label: '子类型',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'outline_structure',
              label: '外形结构',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'specifications',
              label: '规格',
              readonly: true,
              type: 'input',
              required: false,
            }, {
              name: 'u_number',
              label: 'U数',
              type: 'input',
              readonly: true,
              required: false,
            }, {
              name: 'use_storage',
              label: '使用存储',
              type: 'input',
              required: false,
              extend: {
                type: 'dialog',
                label: '使用存储',
                source: 'storage',
                ctrl_name: 'use_storage'
              }
            }, {
              name: 'device_manager_one',
              label: '设备责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_one',
              label: '业务责任人1',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'device_manager_two',
              label: '设备责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'business_manager_two',
              label: '业务责任人2',
              type: 'select',
              required: false,
              multiple: true,
              source: 'initial',
              refer: 'system_users',
              option: [],
            }, {
              name: 'operating_system',
              label: '操作系统',
              type: 'select',
              required: false,
              multiple: true,
              source: 'dict',
              refer: 'operate_system',
              option: [],
            }, {
              name: 'remark',
              label: '备注',
              type: 'textarea',
              required: false,
            }, {
              name: 'affiliated_organization',
              label: '所属组织机构',
              type: 'treeselect',
              required: true,
              source: 'initial',
              refer: 'organs',
              option: [],
            }]
        }, {
          name: '填写设备位置信息',
          tip: '填写设备位置信息',
          multiple: false,
          id: 'group_position',
          span: 12,
          attributes: [{
            name: 'equipment_room',
            label: '所在机房',
            type: 'select',
            required: true,
            multiple: true,
            source: 'initial',
            refer: 'rooms',
            option: [],
          },
          {
            name: 'region',
            label: '所属区域',
            type: 'select',
            required: false,
            multiple: true,
            source: 'dict',
            refer: 'device_status',
            option: [],
          },
          {
            name: 'owning_cabinet',
            label: '所在机柜',
            type: 'select',
            required: false,
            multiple: true,
            source: 'other',
            option: [],
          },
          {
            name: 'cabinet_location',
            label: '机柜位置',
            type: 'input',
            required: false,
            unit: 'U',
            extend: {
              type: 'checkbox',
              title: '并排放置 ',
              source: 'storage',
              ctrl_name: 'abreast'
            }
          }, {
            name: 'abreast',
            label: '管理IP',
            type: 'hidden',
            required: false,
          }, {
            name: 'location_description',
            label: '位置描述',
            type: 'input',
            required: false,
          }
          ]
        }]

      },
      {
        name: '硬件配置',
        form_type: 'form',
        tip: '请认真填写下面信息(演示)',
        id: 'form-hardware-cfg',
        icon: '',
        models: [
          {
            name: '电源',
            tip: '请认真填写下面信息',
            multiple: true,
            id: 'form_power',
            span: 6,
            initial_data: [
              // {
              // name: 'ext_name',
              // source: 'dict',
              // refer: 'operate_system',
              // }
            ],
            attributes: [
              {
                name: 'ext_name',
                label: '名称',
                type: 'input',
                required: false,
              }, {
                name: 'ext_type',
                label: '类型',
                type: 'input',
                required: false,
                placeholder: '请输入类型',

              }, {
                name: 'ext_models',
                label: '型号',
                type: 'input',
                required: false,
                placeholder: '请输入型号',

              }, {
                name: 'ext_power',
                label: '功率',
                type: 'input',
                required: false,
                placeholder: '请输入名称',

              }, {
                name: 'ext_producer',
                label: '厂商',
                type: 'input',
                required: false,
                placeholder: '请输入厂商',
              }, {
                name: 'ext_party_code',
                label: '部件号',
                type: 'input',
                required: false,
                placeholder: '请输入部件号',

              }, {
                name: 'ext_serial',
                label: '序列号',
                type: 'input',
                required: false,
                placeholder: '请输入序列号',

              }, {
                name: 'ext_fixed_version',
                label: '固件版本',
                type: 'input',
                required: false,
                placeholder: '请输入固件版本',

              }, {
                name: 'ext_slot',
                label: '槽位',
                type: 'input',
                required: false,
                placeholder: '请输入槽位',

              }]
          }
        ]
      },
      {
        name: '网络配置',
        tip: '请认真填写下面信息(演示)',
        id: 'form-netconfig',
        form_type: 'group',
        initial_data: [],
        icon: '',
        models: [{
          name: '管理网信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_management',
          span: 6,
          attributes: [{
            name: 'ext_out_band_ip',
            label: '带外IP',
            type: 'input',
            required: false,
            placeholder: '请输入带外IP',
            // options:[{value:"1", label: '测试'}]
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }

          ]
        }, {
          name: '生产IP信息',
          tip: '填写设备信息',
          multiple: true,
          id: 'group_ip',
          span: 6,
          attributes: [{
            name: 'production_ip',
            label: '生产IP',
            type: 'input',
            required: false,
            placeholder: '请输入生产IP',
          }, {
            name: 'ext_mask',
            label: '子网掩码',
            type: 'input',
            required: false,
            placeholder: '请输入子网掩码',
          }, {
            name: 'ext_gateway',
            label: '网关',
            type: 'input',
            required: false,
            placeholder: '请输入网关',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_operate_system',
            label: '操作系统',
            type: 'input',
            required: false,
            placeholder: '请输入操作系统',
          }, {
            name: 'ext_username',
            label: '用户名',
            type: 'input',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_username',
            label: '密码',
            type: 'password',
            required: false,
            placeholder: '请输入用户名',
          }, {
            name: 'ext_link_method',
            label: '连接方式',
            type: 'input',
            required: false,
            placeholder: '请输入连接方式',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_remote_desktop',
            label: '远程桌面',
            type: 'input',
            required: false,
            placeholder: '请输入远程桌面',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_distr_frame',
            label: '对接配线架',
            type: 'input',
            required: false,
            placeholder: '请输入对接配线架',
          }, {
            name: 'ext_docking_port',
            label: '对接端口',
            type: 'input',
            required: false,
            placeholder: '请输入对接端口',
          }, {
            name: 'ext_corres_port',
            label: '对应端口',
            type: 'input',
            required: false,
            placeholder: '请输入对应端口',
          }

          ]
        }, {
          name: '光纤交换机',
          tip: '填写设备信息',
          multiple: false,
          id: 'group_fiber_switches',
          span: 6,
          attributes: [{
            name: 'ext_har_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }, {
          name: '备光纤交换机',
          tip: '',
          multiple: false,
          id: 'group_optic_switches',
          span: 6,
          attributes: [{
            name: 'ext_hba_cardname',
            label: 'HBA卡名',
            type: 'input',
            required: false,
            placeholder: '请输入HBA卡名',
          }, {
            name: 'ext_optic_wwn',
            label: 'WWN',
            type: 'input',
            required: false,
            placeholder: '请输入WWN',
          }, {
            name: 'ext_optic_switch_ip',
            label: '交换机IP',
            type: 'input',
            required: false,
            placeholder: '请输入交换机IP',
          }, {
            name: 'ext_optic_port',
            label: '端口',
            type: 'input',
            required: false,
            placeholder: '请输入端口',
          }, {
            name: 'ext_optic_mac',
            label: 'MAC地址',
            type: 'input',
            required: false,
            placeholder: '请输入MAC地址',
          }, {
            name: 'ext_optic_wwpn',
            label: 'WWPN',
            type: 'input',
            required: false,
            placeholder: '请输入WWPN',
          }

          ]
        }]
      },
      {
        name: '维保信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-maintenance',
        form_type: 'group',
        icon: '',
        initial_data: [{
          name: 'maintenance_type',
          source: 'dict',
          refer: 'maintenance_type',
        }, {
          name: 'service_config',
          source: 'dict',
          refer: 'maintenance_service',
        }, {
          name: 'maintenance_provider',
          source: 'initial',
          refer: 'providers',
        }],
        models: [{
          name: '维保信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form-maintenance',
          span: 12,
          attributes: [{
            name: 'start_at',
            label: '开始日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入开始日期',
          }, {
            name: 'finish_at',
            label: '结束日期',
            data_type: 'date',
            type: 'datepicker',
            required: false,
            placeholder: '请输入结束日期',
          }, {
            name: 'maintenance_type',
            label: '维保类型',
            type: 'select',
            required: true,
            placeholder: '请输入维保类型',
          }, {
            name: 'maintenance_provider',
            label: '维保商',
            data_type: 'number',
            type: 'select',
            required: false,
            placeholder: '请输入维保商',
          }, {
            name: 'production_at',
            label: '出厂日期',
            type: 'datepicker',
            data_type: 'date',
            required: false,
            placeholder: '请输入出厂日期',
          }, {
            name: 'maintenance_period',
            label: '维保期限',
            type: 'input',
            data_type: 'number',
            required: false,
            placeholder: '请输入维保期限',
          }, {
            name: 'service_config',
            label: '维保服务',
            type: 'table',
            span: 24,
            required: false,
            key: 'service_name',
            option: [
              {
                title: '服务选项',
                dataIndex: 'service_name',
                render: (text: string) => {
                  return text;
                },
                key: 'service_name'
              },
              {
                title: '服务对象',
                dataIndex: 'service_object',
                key: 'service_object'
              }, {
                title: '服务期限',
                dataIndex: 'service_expire',
                key: 'service_expire'
              }],
            placeholder: '请输入维保服务',
          }
          ]
        }]
      }, {
        name: '管理信息',
        tip: '请认真填写下面信息(演示)',
        id: 'table-management',
        form_type: 'group',
        initial_data: [{
          name: 'service_level',
          source: 'dict',
          refer: 'service_level'
        }, {
          name: 'belong_dept',
          source: 'initial',
          refer: 'organs',
        }, {
          name: 'user_department',
          source: 'initial',
          refer: 'organs',
        }],
        icon: '',
        models: [{
          name: '设备管理信息',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_management_base',
          span: 12,

          attributes: [{
            name: 'id',
            label: '主键id',
            type: 'hidden',
            required: false,
          }, {
            name: 'asset_code',
            label: '资产编号',
            type: 'input',
            required: false,
            placeholder: '请输入资产编号',
          }, {
            name: 'shutdown_level',
            label: '关机级别',
            type: 'select',
            required: false,
            placeholder: '请输入关机级别',
            options: [{ value: 1, label: '重要' }, { value: 0, label: '一般' }]
          }, {
            name: 'service_level',
            label: '服务级别',
            type: 'select',
            required: false,
            placeholder: '请输入服务级别',
          }, {
            name: 'service_code',
            label: '服务代码',
            type: 'input',
            required: false,
            placeholder: '请输入服务代码',
          }]
        }, {
          name: '设备归属',
          tip: '填写设备信息',
          multiple: false,
          id: 'form_belong_info',
          span: 12,
          attributes: [
            {
              name: 'belong_dept',
              label: '所属部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入所属部门',
            }, {
              name: 'equipment_use',
              label: '设备用途',
              type: 'input',
              required: false,
              placeholder: '请输入设备用途',

            }, {
              name: 'user_department',
              label: '使用部门',
              type: 'treeselect',
              required: false,
              placeholder: '请输入使用部门',
            }, {
              name: 'using_site',
              label: '使用地点',
              type: 'input',
              required: false,
              placeholder: '请输入使用地点',
            }
          ]
        }
        ]
      }, {
        name: '变更信息',
        tip: '请认真填写下面信息(演示)',
        id: 'component-alert',
        form_type: 'component',
        icon: '',
        models: []
      }]
  },//终端设备 14
};
