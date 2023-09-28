import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Tabs, Select, Form, Row, Col, DatePicker, TreeSelect } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { DownOutlined, DownloadOutlined, EditOutlined, GroupOutlined, OneToOneOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import usePagination from '@/components/usePagination';
import { CommonStateContext } from '@/App';
import { IRawTimeRange } from '@/components/TimeRangePicker';
import Accordion from '@/components/Accordion';
import './locale';
import './style.less';
import _, { set } from 'lodash';
import Add from './Add';

import { getAssetsList, getAssetStatistic,getAssetsListByFilter } from '@/services/assets/asset'
import { getDataCenterList } from '@/services/assets/data-center'

import { Link, useHistory } from 'react-router-dom';
import { OperationModal } from './OperationModal';
export { Add };
import { getDictValueEnum } from '@/services/system/dict';
import { assetStatus } from './Form/asset_utils'
import { getDeviceType } from '@/services/assets/deviceType';
import { DictValueEnumObj } from '@/components/DictTag';
import SetMgt from './SetMgt';
import { useAntdTable, useToggle } from 'ahooks';
import { getOrganizationTree } from '@/services/assets';
import { getRoomList } from '@/services/assets/computer-room';
import { getCabinetList } from '@/services/assets/device-cabinet';
import { getUsers } from '@/services/account';

export enum OperateType {
  SelectDeviceType = "selectDeviceType",
  AssetBatchImport = 'assetBatchImport',
  ChangeOrganize = 'changeOrganize',
  ChangeCatalog = 'changeCatalog',
  ChangeRoom = 'changeRoom',
  CreatedCode = "createdCode",
  DeleteAssets = "deleteAssets",
  ChangeResponsible = "changeResponsible",
  ChangeDept = "changeDept",
  UnbindTag = 'unbindTag',
  Online = "online",
  Offline = "offline",
  None = 'none',
}

export interface OrgType {
  name: string;
  id: number;
  parent_id: number;
  children: OrgType[];
  isEditable?: boolean;
}

const optionMap = {};

interface IProps {
  url?: string;
  datasourceValue: number;
  contentMaxHeight?: number;
  type?: 'table' | 'graph';
  onTypeChange?: (type: 'table' | 'graph') => void;
  defaultTime?: IRawTimeRange | number;
  onTimeChange?: (time: IRawTimeRange) => void; // 用于外部控制时间范围
  promQL?: string;
  graphOperates?: {
    enabled: boolean;
  };
  globalOperates?: {
    enabled: boolean;
  };
  headerExtra?: HTMLDivElement | null;
  executeQuery?: (promQL?: string) => void;
}

export default function () {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [list, setList] = useState<any[]>([]);
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [deviceTypeOption, setDeviceTypeOption] = useState<any[]>();
  const [dataCenterOption, setDataCenterOption] = useState<any[]>();
  const [statistic, setStatistic] = useState({});
  const [leftNavData, setLeftNavData] = useState<any>({});
  const [query, setQuery] = useState({})
  const [states, { set }] = useToggle(true)
  const pagination = usePagination({ PAGESIZE_KEY: 'dashboard-builtin-pagesize' });

  const searchParams = new URLSearchParams(window.location.search);

  const [modalWidth, setModalWidth] = useState<number>(650)

  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_flag'));


  // 展开显示全部标签
  const handlerAll = (val: boolean) => {
    set(!val)
  }
  const [deviceStatusOptions, setDeviceStatusOptions] = useState<any>([]);

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const getTableData = ({ current, pageSize }): Promise<any> => {
    // debugger
    const params = {
      page: current,
      limit: pageSize,
    };
    console.log('getTableData',params)
    return getAssetsListByFilter({
      ...params,
      ...query,
    }).then((res) => {
      return {
        total: res.dat.total,
        list: res.dat.list,
      };
    });
  };
  
  const { tableProps } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    refreshDeps: [query, refreshFlag],
  });

  useEffect(() => {
    //过滤状态 来源数据字典
    getDictValueEnum('asset_filter_status').then((data) => {
      setDeviceStatusOptions(data);
    });
    //设备类型
    getDeviceType({ types: 1 }).then((res: any) => {
      if (res.err === "") {
        const opts = new Array();
        res.dat.list.forEach((item) => {
          opts.push({
            value: item.id,
            label: item.name
          });
        })
        setDeviceTypeOption(opts);
      }
    })
    //数据中心
    getDataCenterList({}).then((res: any) => {
      if (res.err === "") {
        const opts = new Array();
        res.dat.list.forEach((item) => {
          opts.push({
            value: item.id,
            label: item.datacenter_name
          });
        })
        setDataCenterOption(opts);
      }
    })
    getRoomList({}).then(({ dat }) => {
      var roomList  = new Array()
      dat.list.forEach((item) => {
        roomList.push({
          value: item.id,
          label: item.room_name
        });
      })
      optionMap["rooms"] = roomList;
  }); 
   getOrganizationTree({}).then(({ dat }) => {
    optionMap["organs"] = dat;
   });
   //获取用户数据
  getUsers().then(({ dat }) => {
    var userList = new Array()
    dat.forEach((item) => {
      userList.push({
        value: item.nickname,
        label: item.nickname
      })
    })
    optionMap["system_users"] = userList;
   });
  //  getCabinetList(1).then(({ dat }) => {
  //   var userList = new Array()
  //   dat.forEach((item) => {
  //     userList.push({
  //       value: item.nickname,
  //       label: item.nickname
  //     })
  //   })
  //   optionMap["system_users"] = userList;
  //  });

    if (searchParams.get("query") != null && searchParams.get("query") == "1") {
      setLeftNavData({
        status: searchParams.get("status") ? searchParams.get("status") : "0",
        index: searchParams.get("index") ? searchParams.get("index") : "0"
      })

    }
    if (leftNavData && leftNavData.status != undefined) {
      query["DEVICE_STATUS"] = parseInt(leftNavData.status);
    }
    setQuery(query);
  }, []);

  useEffect(() => {

    if (parseInt(leftNavData.status) == 0) {
      getAssetStatistic().then(({ dat, err }) => {
        if (dat != null && dat.list.length > 0) {
          for (let i = 0; i < dat.list.length; i++) {
            let item = eval(dat.list[i]);
            statistic["status_" + item.type] = item.num;
            setStatistic(statistic);
          }
          statistic["status_total"] = dat.total;
          setStatistic(statistic);
        }

      });

    }

  }, [leftNavData]);


  const submitQuery =async (values:any) => {   
    
    let params  ={...query,...values};
    setQuery(params);
    // await getAssetsListByFilter(params).then(res => {
    //   setList(res.dat)
    // })
  }

  const onSelectChange = (selectedRowKeys,rows) => {
    console.log("onSelectChange",selectedRowKeys)
    setSelectedRows(rows);
    console.log("rows",rows)
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onSelectNone = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <PageLayout icon={<GroupOutlined />} title={t('title')}>
      <Tabs className='tab_list_1'>
        <Tabs.TabPane tab={t('设备资产')} key='assetlist'>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '400px', display: 'list-item' }}>
              <Accordion
                handleClick={async (value: any, status, index: any) => {
                  var query = value.query != null ? eval(value.query) : '{}'
                  setLeftNavData({
                    status: "" + status,
                    index: "" + index
                  })
                  if (value.type === 'asset') {
                    window.location.href = "/devicemgt/add/" + value.query.DEVICE_TYPE + "?id=" + query.ID + "&index=" + leftNavData.index + "&status=" + leftNavData.status;
                  } else {
                    setQuery(query);
                  }
                }}
                assetStatus={assetStatus}
              />
            </div>

            <div className='table-content'>

              {leftNavData.status == 0 && (
                <div className='assect_total_head'>
                  <div>
                    全部设备资产(<span>{statistic["status_total"] ? statistic["status_total"] : 0}</span>)
                  </div>
                  <div>
                    已上线 ：<span>{statistic["status_2"] ? statistic["status_2"] : 0}</span>
                  </div>
                  <div>
                    待上线 ：<span>{statistic["status_1"] ? statistic["status_1"] : 0}</span>
                  </div>
                  <div>
                    已下线 ：<span>{statistic["status_3"] ? statistic["status_3"] : 0}</span>
                  </div>
                </div>
              )}

              <div className='table-header'>
                <Form onFinish={submitQuery} layout="inline" labelAlign="left"  className='query_form'>
                    <Row  className='row-spe'>
                      <Col  span={4} >
                      <Form.Item label="过滤器" name="filter">
                        <Select
                          // showSearch
                          placeholder="请选择设备状态"
                          allowClear={true}
                          optionFilterProp="children"
                          onChange={onChange}
                          options={deviceStatusOptions}

                        />
                      </Form.Item>
                      </Col>
                      <Col  span={4}> <Form.Item name="datacenter_id">
                        <Select
                          showSearch
                          allowClear={true}
                          placeholder="请选择数据中心"
                          optionFilterProp="children"
                          options={dataCenterOption}
                        />
                      </Form.Item>
                      </Col>
                       <Col  span={4}>
                          <Form.Item name="equipment_room" >
                            <Select
                              showSearch
                              placeholder="请选择机房"
                              removeIcon={true}
                              optionFilterProp="children"
                            />
                          </Form.Item>
                        </Col>
                        <Col  span={4}>
                         <Form.Item name="device_type">
                            <Select
                              showSearch
                              allowClear={true}
                              placeholder="请选择设备类型"
                              options={deviceTypeOption}
                            /></Form.Item>
                        </Col>
                        <Col  span={5}>
                         <Form.Item name="query">
                        <Input
                          className={'searchInput'}
                          value={searchVal}
                          allowClear
                          onChange={(e) => setSearchVal(e.target.value)}
                          suffix={<SearchOutlined />}
                          placeholder={'输入IP/名称/序列号/厂商型号/关联业务/备注/RAID级别/MA'}
                        /></Form.Item>
                        </Col>
                        <Col  span={3}>
                          <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>查询</Button>
                            <Button style={{ marginLeft: '10px' }} onClick={() => handlerAll(states)}> {states ? '更多▲' : '收起▽'}</Button>
                        </Form.Item>
                        </Col>
                 </Row>
                 <Row hidden={states}   className='row-spe'>
                        <Col  span={4}>
                         <Form.Item name="device_producer" label=" " colon={false} >
                            <Select
                              showSearch
                              placeholder="选择厂商"
                              allowClear={true}
                            /></Form.Item>
                        </Col>
                        <Col  span={4}>
                         <Form.Item name="finish_at" >
                            <DatePicker allowClear placeholder={`请输入维保结束日`} />
                            </Form.Item>
                        </Col>
                        <Col  span={4}>
                            <Form.Item name="manager"   >
                            <Select
                              showSearch
                              placeholder="选择责任人"
                              allowClear={true}
                              options={optionMap["system_users"] }

                            />
                            </Form.Item>
                        </Col>
                        <Col  span={4}>
                            <Form.Item name="owning_cabinet"   >
                            <Select
                              showSearch
                              placeholder="选择机柜"
                              allowClear={true}
                              options={optionMap["system_users"] }
                            />
                            </Form.Item>
                        </Col>
                        <Col  span={6}>
                            <Form.Item name="affiliated_organization" >
                            <TreeSelect
                              showSearch
                              style={{ width: '100%' }}                              
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              placeholder={`选择机构`}
                              allowClear
                              treeDataSimpleMode
                              treeData={optionMap["organs"]}
                              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                              treeDefaultExpandAll={true}
                            ></TreeSelect>
                            </Form.Item>
                        </Col>

                 </Row>
                </Form>
                <div>

                </div>
              </div>
              <div className='assets-list'>

                <div className='biz-oper-action'>
                  <Space>
                    <Dropdown
                      trigger={['click']}
                      overlay={
                        <Menu
                          style={{ width: '100px' }}
                          onClick={({ key }) => {
                            let operates = "changeOrganize,changeRoom,createdCode,changeResponsible,changeDept";
                            if(key=="deleteAssets"){

                              if (selectedRowKeys.length <= 0) {
                                    message.warning("请选择要批量操作的设备")
                                    return
                              }else{
                                
                                Modal.confirm({
                                  title: "确认要删除吗",
                                  onOk: async () => {
                                    // let rows = rowsKey?.map((item) => parseInt(item));
                                    // deleteOperates(businessForm.businessId, rows)
                                  },
                                  onCancel() { },
                                });
                              }
                            }else{
                                console.log("selectedAssetRows",selectedRowKeys)
                                if (operates.indexOf(key) > -1) {
                                  if (selectedRowKeys.length <= 0) {
                                    message.warning("请选择要批量操作的设备")
                                    return
                                  }
                                }
                                setOperateType(key as OperateType);
                            }
                            setModalWidth(650);
                          }}
                          items={[

                            { key: OperateType.SelectDeviceType, label: t('添加设备') },
                            { key: OperateType.AssetBatchImport, label: t('导入设备') },
                            // { key: OperateType.ChangeOrganize, label: t('导出设备') },
                            { key: OperateType.DeleteAssets, label: t('删除设备') },
                            { key: OperateType.ChangeCatalog, label: t('设备转移') },
                            { key: OperateType.CreatedCode, label: t('生成二维码') },
                            { key: OperateType.ChangeResponsible, label: t('更改责任人') },
                            { key: OperateType.ChangeOrganize, label: t('修改所属组织') },
                            { key: OperateType.ChangeRoom, label: t('更改所在机房') },


                          ]}
                        ></Menu>
                      }
                    >
                      <Button>
                        {t('批量操作')} <DownOutlined />
                      </Button>
                    </Dropdown>

                    <Dropdown
                      trigger={['click']}
                      overlay={
                        <Menu
                          style={{ width: '100px' }}
                          onClick={({ key }) => {
                            setOperateType(key as OperateType);
                            if(key === 'online'){
                              setModalWidth(1050);
                            }else{
                              setModalWidth(650)
                            }                            
                          }}
                          items={[
                             { key: OperateType.Online, label: t('设备上线') },
                             { key: OperateType.Offline, label: t('设备下线') }
                          ]}
                        ></Menu>
                      }
                    >
                      <Button>
                        {t('流程操作')} <DownOutlined />
                      </Button>
                    </Dropdown>
                  </Space>

                </div>



                <Table
                  // dataSource={list}
                  // pagination={pagination}
                  {...tableProps}
                  pagination={{
                    ...tableProps.pagination,
                    size: 'small',
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    showTotal: (total) => `Total ${total} items`,
                    showSizeChanger: true,
                  }}
                  rowSelection={rowSelection}
                  columns={[
                    {
                      title: t('管理IP'),
                      dataIndex: 'management_ip',
                    },
                    {
                      title: t('设备名称'),
                      dataIndex: 'device_name',
                    },
                    {
                      title: t('序列号'),
                      dataIndex: 'serial_number',
                    },
                    {
                      title: t('型号'),
                      dataIndex: 'device_model',
                    },
                    {
                      title: t('设备类型'),
                      dataIndex: 'device_type',

                      render(val) {
                           let deviceName = val;
                           deviceTypeOption?.forEach((option) => {
                              if(option.value==val){
                                deviceName =option.label;
                              }                              
                           })
                           return deviceName;
                      }
                    },
                    {
                      title: t('纳管状态'),
                      dataIndex: 'managed_state',
                      render(val) {
                        return '未定义来源';
                      },
                    },
                    {
                      title: t('common:table.operations'),
                      width: '180px',
                      align: 'center',
                      render: (text: string, record: any) => (
                        <Space align="baseline"
                          style={{ marginLeft: '33%', display: 'flex', marginBottom: 8, width: '100%', textAlign: 'center' }}
                        >

                          <EditOutlined onClick={e => {
                            window.location.href = "/devicemgt/add/" + record.device_type + "?id=" + record.id + "&index=" + leftNavData.index + "&status=" + leftNavData.status + "&edit=1";
                          }} />

                          <UnorderedListOutlined />

                          <OneToOneOutlined />

                          <DownloadOutlined />

                        </Space>
                      ),
                    },
                  ]}
                  rowKey='id'
                  size='small'
                ></Table>
                <OperationModal
                  operateType={operateType}
                  width={modalWidth}
                  setOperateType={setOperateType}
                  assets={selectedRows}
                  devicetype={deviceTypeOption}
                  theme={'未使用'}
                  reloadList={() => {
                    setRefreshFlag(_.uniqueId('refreshFlag_'));
                    onSelectNone()
                  }}
                />
              </div>
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('数据中心')} key='datalist'>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('UI监控')} key='uilist'>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('业务资产')} key='bizlist'>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('备件信息')} key='beijianlist'>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('变更管理')} key='biangenglist'>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('资产设置')} key='assetset'>
          <SetMgt></SetMgt>
        </Tabs.TabPane>
      </Tabs>
    </PageLayout>
  );
}
