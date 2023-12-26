import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Popover, Checkbox, Row, Col, Select } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, DownOutlined, EditOutlined, FileProtectOutlined, FileSearchOutlined, FundOutlined, GroupOutlined, LeftOutlined, PoweroffOutlined, ProfileTwoTone, RightOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import CommonModal from '@/components/CustomForm/CommonModal';
import { useAntdResizableHeader } from '@minko-fe/use-antd-resizable-header';
import '@minko-fe/use-antd-resizable-header/dist/style.css';


import './locale';
import './style.less';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';
import { Resizable } from 're-resizable';
import { insertXHAsset, updateXHAsset, getAssetstypes, updateAssetDirectoryTree, moveAssetDirectoryTree, getAssetsByCondition, insertAssetDirectoryTree, deleteAssetDirectoryTree, getOrganizationTree, getAssetDirectoryTree } from '@/services/assets';
import { getMonitorInfoList, getMonitorUnit, deleteXhMonitor, deleteXhBatchMonitor, updateMonitorStatus } from '@/services/manage';
import { Link, useHistory } from 'react-router-dom';
import { OperationModal } from './OperationModal';
import type { DataNode, TreeProps } from 'antd/es/tree';
import RefreshIcon from '@/components/RefreshIcon';
import { unitTypes } from '../assetmgt/catalog';
import { useLocalStorage } from 'react-use';

export enum OperateType {
  BindTag = 'bindTag',
  UnbindTag = 'unbindTag',
  AssetBatchImport = 'assetBatchImport',
  AssetBatchExport = 'assetBatchExport',
  UpdateBusi = 'updateBusi',
  RemoveBusi = 'removeBusi',
  UpdateNote = 'updateNote',
  Delete = 'delete',
  ChangeOrganize = 'changeOrganize',
  None = 'none',
  TurnOnMonitoring = 'turnOnMonitoring',  //启用监控
  DisableMonitoring = 'disableMonitoring',  //禁止监控
}
let queryFilter = [
  { name: 'monitoring_name', label: '监控名称', type: 'input' },
  { name: 'asset_name', label: '资产名称', type: 'input' },
  { name: 'status', label: '监控状态', type: 'select' },
  // { name: 'is_alarm', label: '是否启用告警', type: 'select' },
  { name: 'asset_ip', label: 'IP地址', type: 'input' },
  // { name: 'asset_type', label: '资产类型', type: 'select' },
]
export default function () {
  const { t } = useTranslation('assets');
  const [list, setList] = useState<any[]>([]);
  const audioRef = useRef(null);
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [selectedAssetsName, setSelectedAssetsName] = useState<string[]>([]);
  const [treeData, setTreeData] = React.useState<DataNode[]>();
  const [refreshLeft, setRefreshLeft] = useState<string>(_.uniqueId('refresh_left'));
  const [optionColumns, setOptionColumns] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [assetTypes, setAssetTypes] = useState<any[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchVal, setSearchVal] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [defaultValues, setDefaultValues] = useState<string[]>();
  const [total, setTotal] = useState<number>(0);
  const [assetInfo, setAssetInfo] = useState<any>({});
  const [props, setProps] = useState<any>({});
  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});
  const [typeId, setTypeId] = useLocalStorage<any>('monitor_filter_type',0);
  const { search } = useLocation();
  const { assetId } = queryString.parse(search);
  const [currentAssetId, setCurrentAssetId] = useState<number>(assetId != null ? parseInt(assetId.toString()) : 0);
  const [secondAddButton, setSecondAddButton] = useState<boolean>(true);
  const [collapse, setCollapse] = useState(localStorage.getItem('left_monitor_list') === '1');
  const [width, setWidth] = useLocalStorage<any>('left_monitor_width',200);  
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [filterParam, setFilterParam] = useState<string>("");
  const history = useHistory();
  const [unitOptions, setUnitOptions] = useState<any>(unitTypes);
  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_flag'));

  const onSelectNone = () => {
    setSelectedAssets([]);
    setSelectedAssetsName([]);
  };
  const baseColumns: any[] = [
    {
      title: "监控名称",
      dataIndex: 'monitoring_name',
      fixed: 'left',
      // width: "80px",
      ellipsis: true,
      render(value, record, index) {
        return <div style={{ color: '#2B7EE5', cursor: 'pointer' }} onClick={(e) => { showModal("asset", record.id, "view") }}>{value}</div>;
      },
      sorter: (a, b) => {
        return (a.monitoring_name).localeCompare(b.monitoring_name)
      },
    },
    {
      title: "资产名称",
      // width: "100px",
      dataIndex: 'asset_id',
      fixed: 'left',
      align: 'center',
      ellipsis: true,
      render(value, record, index) {
        let name = assetInfo[value]?.name;
        return <div style={{ color: '#2B7EE5', cursor: 'pointer' }} onClick={(e) => {
          history.push(`/xh/monitor/add?type=monitor&id=${value}&asset_id=${value}&action=asset&prom=1`)
        }}>{name}</div>;
      },
      sorter: (a, b) => {
        const aip = assetInfo[a.asset_id]?.name
        const bip = assetInfo[b.asset_id]?.name
        return (aip).localeCompare(bip)
      },
    },
    {
      title: "IP地址",
      // width: "100px",
      dataIndex: 'asset_id',
      fixed: 'left',
      align: 'center',
      ellipsis: true,
      render(value, record, index) {
        let name = assetInfo[value]?.ip;
        return <div style={{ color: '#2B7EE5', cursor: 'pointer' }} onClick={(e) => {
          history.push(`/xh/monitor/add?type=monitor&id=${value}&asset_id=${value}&action=asset&prom=1`)
        }}>{name}</div>;
      },
      sorter: (a, b) => {
        const aip = assetInfo[a.asset_id]?.ip
        const bip = assetInfo[b.asset_id]?.ip
        return (aip).localeCompare(bip)
      },
    },
  ];
  const choooseColumns = [
    {
      title: "描述",
      width: "105px",
      align: 'center',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: "监控状态",
      width: 120,
      ellipsis: true,
      align: 'center',
      dataIndex: 'status',
      render(value, record, index) {
        return value == 0 ? '关闭' : '正常';
      },
      sorter: (a, b) => {
        return a.status > b.status ? 1 : -1
      },
    },
    {
      title: "更新时间",
      width: 120,
      dataIndex: 'updated_at',
      align: 'center',
      render(text, record, index) {
        return moment.unix(text).format('YYYY-MM-DD HH:mm:ss');
      },
      sorter: (a, b) => {
        return a.updated_at > b.updated_at ? 1 : -1
      },
    },
    {
      title: "更新人",
      width: 120,
      dataIndex: 'updated_by',
      align: 'center',
      render(text, record, index) {
        return text;
      },
    }
  ];
  const fixColumns: any[] = [
    {
      title: '操作',
      width: 300,
      align: 'center',
      fixed: 'right',
      render: (val, record: any) => (
        <Space>
          <PoweroffOutlined
            title={record.status == 1 ? '正常' : '失效'}
            style={{ color: record.status === 1 ? ('green') : ('gray') }}
            onClick={e => {
              let key = new Array;
              key.push(record.id)
              if (record.status == 0) {
                Modal.confirm({
                  title: "确认要启用当前选择监控？",
                  onOk: async () => {
                    updateMonitorStatus(1, key, 1).then((res) => {
                      message.success('修改成功');
                      setRefreshFlag(_.uniqueId('refreshFlag_'));
                    });
                  },
                  onCancel() { },
                });

              } else {
                Modal.confirm({
                  title: "确认要关闭当前选择监控？",
                  onOk: async () => {
                    updateMonitorStatus(0, key, 1).then((res) => {
                      message.success('修改成功');
                      setRefreshFlag(_.uniqueId('refreshFlag_'));
                    });
                  },
                  onCancel() { },
                });
              }
            }} />

          <FileProtectOutlined title='查看资产告警规则' onClick={() => {
            showModal("rules", record.asset_id, "view")
          }} />

          <FileSearchOutlined title='查看监控配置' onClick={() => {
            showModal("asset", record.id, "view")
          }}
          />
          <FundOutlined title='监控指标信息' onClick={() => {
            showModal("monitor", record.id, "view")
          }} />
          <EditOutlined title='编辑监控信息' onClick={() => {
            showModal("asset", record.id, "edit")
          }}
          />
          <DeleteOutlined title='删除监控信息' onClick={() => {
            Modal.confirm({
              title: t('common:confirm.delete'),
              onOk: async () => {
                deleteXhMonitor(record.id).then((res) => {
                  message.success('删除成功');
                  setRefreshFlag(_.uniqueId('refreshFlag_'));
                });
              },
              onCancel() { },
            });
          }} />

        </Space>
        
      ),
    },
  ];


  const [selectColum, setSelectColum] = useState<any[]>()

  const { components, resizableColumns, tableWidth } = useAntdResizableHeader({
    columns: useMemo(() => selectColum, [selectColum]),
    columnsState: {
      persistenceType: 'localStorage',
      persistenceKey: `dashboard-table-resizable-xh-monitor-management`,
    },
  });
  function handelShowColumn(checkedValues) {
    let showColumns = new Array();
    optionColumns.forEach(item => {
      if (checkedValues.includes(item.title)) {
        showColumns.push(item)
      }
    });
    setSelectColum(showColumns.concat(fixColumns));
  }


  useEffect(() => {
    setSecondAddButton(false)
    setOptionColumns(baseColumns.concat(choooseColumns));
    let modelIds = Array.from(new Set(baseColumns.concat(choooseColumns).map(obj => obj.title)))
    setDefaultValues(modelIds);
    getAssetstypes().then((res) => {
      const items = res.dat.map((v) => {
        return {
          id: v.name,
          name: v.name,
          ...v,
        };
      })
      let treeData: any[] = [{
        id: 0,
        name: '全部资产',
        count: 0,
        children: items
      }];
      const types = items.map((v) => {
        return {
          value: v.name,
          label: v.name,
          ...v,
        };
      })
      setAssetTypes(types);
      let arr = ["0"];
      items.map((item, index) => {
        arr.push(item.id);
      })
      setExpandedKeys(arr);
      setTreeData(_.cloneDeep(treeData));
    });
    setSelectColum(baseColumns.concat(choooseColumns).concat(fixColumns));
    getAssetsByCondition({}).then(({ dat }) => {
      dat.list.forEach(v => {
        assetInfo[v.id] = (v);
      })
      setAssetInfo({ ...assetInfo });
      getTableData(assetInfo, unitTypes);
    });

    filterOptions["status"] = [{ value: '0', label: '关闭' }, { value: '1', label: '正常' }]
    filterOptions["is_alarm"] = [{ value: '1', label: '已启用' }, { value: '0', label: '未启用' }]
    getAssetstypes().then((res) => {
      filterOptions["asset_type"] = res.dat.map((v) => {
        return {
          value: v.name,
          label: v.name,
        };
      });
      setFilterOptions({ ...filterOptions })
      selectFilterType("asset_ip");
    });
    setFilterOptions({ ...filterOptions })
  }, []);

  const selectFilterType = (value) => {
    queryFilter.forEach((item) => {
      if (item.name == value) {
        setFilterType(item.type);
      }
    })
    setFilterParam(value);
    setSearchVal(null)
  }

  useEffect(() => {
    getTableData(assetInfo, unitOptions);
  }, [searchVal, refreshFlag, typeId, refreshKey]);

  const getTableData = (assets, units) => {
    const param = {
      page: current,
      limit: pageSize,
    };

    if (currentAssetId > 0) {
      param["assetId"] = currentAssetId;
    }
    if (searchVal != null && searchVal.length > 0) {
      param["query"] = searchVal;
    }
    if (filterParam != null && filterParam.length > 0 && searchVal != null && searchVal.length > 0) {
      param["filter"] = filterParam;
    }
    if (typeId != null && typeId + "" != "0") {
      param["assetType"] = typeId;
    }

    getMonitorInfoList(param
    ).then(({ dat }) => {
      dat.list.forEach(entity => {
        if (entity.unit != null && entity.unit.length > 0 && units[entity.unit]) {
          entity["unit_name"] = units[entity.unit];
        } else {
          entity["unit_name"] = "";
        }
        return entity;
      });
      setList(dat.list)
      setTotal(dat.total)
    });
  };

  const pupupContent = (
    <div>
      <Checkbox.Group
        defaultValue={defaultValues}
        style={{ width: '100%' }}
        onChange={handelShowColumn}
      >
        {
          optionColumns.map(item => (
            <Row key={item.title} style={{ marginBottom: '5px' }}>
              <Col span={24}>
                <Checkbox value={item.title}>{item.title}</Checkbox>
              </Col>
            </Row>
          ))
        }
      </Checkbox.Group>
    </div>
  );
  const loadDataCenter = () => {
    getAssetDirectoryTree().then(({ dat, err }) => { //默认所有的
      if (err == "") {
        let treeData: any[] = [{
          id: 0,
          name: '全部资产',
          count: 0,
          children: dat
        }];
        initData["directory_id"] = dat;
        setInitData({ ...initData });
        setTreeData(_.cloneDeep(treeData));
      }
    })
  }

  const dealFieldsToForm = (props) => {
    //处理中文和每个表单每个块要提交的字段名称+类型
    let fieldMap = new Map();
    let items = props.Form.items;
    items.map((item, index) => {
      fieldMap.set(item.name, {
        name_cn: item.label,
        data_type: item.data_type ? item.data_type : "string"
      })
    })
    let groups = props.Form.groups;
    groups?.map((group, index) => {
      group.items.map((item, index) => {
        fieldMap.set(item.name, {
          name_cn: item.label,
          data_type: item.data_type ? item.data_type : "string"
        })
      })
    })
    return fieldMap;
  }

  const datalDealValue = (value, data_type) => {
    if (value != null) {
      if (data_type == "date") {
        value = moment(moment(value).format('YYYY-MM-DD')).valueOf() / 1000
      } else if (data_type == "int") {
        value = parseInt(value);
      } else if (data_type == "float") {
        value = parseFloat(value);
      } else if (data_type == "timestamp") {
        value = moment(moment(value).format('YYYY-MM-DD HH:mm:ss')).valueOf() / 1000
      } else if (data_type == "boolean") {
        value = value == true ? 1 : 0;
      }
      return value;
    } else {
      return null;
    }
  }
  const showModal = (action: string, id: any, operate: string) => {
    console.log("showModal, id: " + id)
    if (action == "asset") {
      let url = '/xh/monitor/add?type=asset&action=' + operate;
      if (id == 0) {
        history.push(url);
      } else {
        history.push(url + '&id=' + id);
      }
    } else if (action == "monitor") {
      history.push(`/xh/monitor/add?type=monitor&id=${id}&action=monitor`);
    } else if (action == "rules") {
      let asset = assetInfo[id];
      history.push(`/alert-rules?id=${asset.group_id}&&asset_id=${id}`);
    }
  }
  const titleRender = (node) => {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <span>
          {node.name}
          {node.id > 0 && (
            <Fragment ><span style={{ marginLeft: "5px" }} className="tree_node_count"> ({node.count})</span></Fragment>
          )}
        </span>
      </div>
    );

  };

  const onPageChange = (page: number, pageSize: number) => {
    setCurrent(page);
    setPageSize(pageSize);
    setRefreshKey(_.uniqueId('refreshKey_'));
  }

  const onSelect = (selectedKeys, info) => {
    setTypeId(selectedKeys[0]);
    setCurrentAssetId(0);
    setRefreshKey(_.uniqueId('refreshKey_'));
  };
  return (
    <PageLayout icon={<GroupOutlined />} title={'监控管理'} showBack
    >
      <div style={{ display: 'flex' }} className='monitor_list_view'>
        <Resizable
          style={{
            marginRight: collapse ? 0 : 10,
          }}
          size={{ width: collapse ? 0 : width, height: '100%' }}
          enable={{
            right: collapse ? false : true,
          }}
          onResizeStop={(e, direction, ref, d) => {
            let curWidth = width + d.width;
            if (curWidth < 200) {
              curWidth = 200;
            }
            setWidth(curWidth);
          }}
        >
          <div className={collapse ? 'left-area collapse' : 'left-area'}>
            <div
              className='collapse-btn'
              onClick={() => {
                localStorage.setItem('left_monitor_list', !collapse ? '1' : '0');
                setCollapse(!collapse);
              }}
            >
              {!collapse ? <LeftOutlined /> : <RightOutlined />}
            </div>
            <div className="left_tree" style={{ display: 'inline-block' }}>
              <div className='asset_organize_cls'>组织树列表
                <div style={{ margin: '0 10prx ' }}>
                  
                  {/* <Switch
                  className='switch'
                  checkedChildren='切至目录'
                  disabled={!modifySwitch}
                  
                  defaultChecked={modifyType}
                  unCheckedChildren='切至类型'
                  size="small"
                  onChange={(checked: boolean) => setModifyType(checked)}
                /> */}
                </div>

              </div>
              <div style={{ display: 'table', height: '100%',width:'100%' }}>
                {expandedKeys && treeData && (
                  <Tree
                    showLine={true}
                    showIcon={true}
                    style={{ marginTop: 0 }}
                    titleRender={titleRender}
                    defaultExpandedKeys={expandedKeys}
                    treeData={treeData}
                    defaultExpandAll={true}
                    defaultSelectedKeys={[typeId]}
                    autoExpandParent={true}
                    checkStrictly
                    fieldNames={{ key: 'id', title: 'name' }}
                    onSelect={onSelect}
                  />
                )}
              </div>
            </div>
          </div>

        </Resizable>
        <div className='monitor-operate_xh'>
          <div className='table-content_xh'>
            <Space>
              <RefreshIcon
                onClick={() => {
                  setRefreshKey(_.uniqueId('refreshKey_'));
                }}
              />
              <div className='table-handle-search'>
                <Select
                  defaultValue="asset_ip"
                  placeholder="选择过滤器"
                  style={{ width: 120 }}
                  // allowClear
                  onChange={(value) => {
                    selectFilterType(value);
                  }}>
                  {queryFilter.map((item, index) => (
                    <Select.Option value={item.name} key={index}>{item.label}</Select.Option>
                  ))
                  }
                </Select>
                {filterType == "input" && (
                  <Input
                    className={'searchInput'}
                    value={searchVal}
                    allowClear
                    onChange={(e) => setSearchVal(e.target.value)}
                    suffix={<SearchOutlined />}
                    placeholder={'输入模糊检索关键字'}
                  />
                )}
                {filterType == "select" && (
                  <Select
                    className={'searchInput'}
                    value={searchVal}
                    allowClear
                    options={filterOptions[filterParam] ? filterOptions[filterParam] : []}
                    onChange={(val) => setSearchVal(val)}
                    placeholder={'选择要查询的条件'}
                  />
                )}




              </div>
            </Space>
            <div className='tool_right'>
              <div>
                <Button className='tool_rightbtn'
                  onClick={() => {
                    showModal("asset", currentAssetId, "add")
                  }}

                  type='primary'
                >
                  {t('新增')}
                </Button>
                &nbsp; &nbsp; &nbsp;
              </div>
              <div>
                <Popover placement="bottom" content={pupupContent} trigger="click" className='filter_columns' >
                  <Button className='show_columns'  icon={<UnorderedListOutlined />} >显示列</Button>
                  &nbsp; &nbsp; &nbsp;
                </Popover>
              </div>
              <div>
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu
                      style={{ width: '100px' }}
                      onClick={({ key }) => {
                        if ("assetBatchImport" == key) {
                          history.push('/xh/monitor/muti/add')
                        } else {
                          if (selectedAssets.length <= 0) {
                            message.error("未选中监控信息");
                            return
                          }
                          if (key == "delete") {
                            Modal.confirm({
                              title: "确认要强制删除当前选中的监控信息？",
                              onOk: async () => {
                                deleteXhBatchMonitor({ ids: selectedAssets.toString().split(",") }).then((res) => {
                                  message.success('删除成功');
                                  setRefreshFlag(_.uniqueId('refreshFlag_'));
                                });
                              },
                              onCancel() { },
                            });
                          } else if (key == "turnOnMonitoring") {
                            Modal.confirm({
                              title: "确认要启用当前选择监控？",
                              onOk: async () => {
                                updateMonitorStatus(1, selectedAssets, 1).then((res) => {
                                  message.success('修改成功');
                                  setOperateType(OperateType.None);
                                  setRefreshFlag(_.uniqueId('refreshFlag_'));
                                  onSelectNone();
                                });
                              },
                              onCancel() { },
                            });
                          } else if (key == "disableMonitoring") {
                            Modal.confirm({
                              title: "确认要禁止当前选择监控？",
                              onOk: async () => {
                                updateMonitorStatus(0, selectedAssets, 1).then((res) => {
                                  message.success('修改成功');
                                  setOperateType(OperateType.None);
                                  setRefreshFlag(_.uniqueId('refreshFlag_'));
                                  onSelectNone();
                                });
                              },
                              onCancel() { },
                            });
                          } else {
                            setOperateType(key as OperateType);
                          }
                        }


                      }}
                      items={[
                        { key: OperateType.TurnOnMonitoring, label: '启用监控' },
                        { key: OperateType.DisableMonitoring, label: '禁止监控' },
                        { key: OperateType.AssetBatchImport, label: '批量添加' },
                        { key: OperateType.Delete, label: '批量删除' },
                      ]}

                    ></Menu>
                  }
                >
                  <Button>
                    {t('common:btn.batch_operations')} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className='renderer-table-container' >
            <div className='monitor-list renderer-table-container-box' >
              <Table
                dataSource={list}
                className='table-view'
                scroll={{ x: tableWidth }}
                components={components}
                columns={resizableColumns}
                bordered
                rowSelection={{
                  onChange: (_, rows) => {
                    setSelectedAssets(rows ? rows.map(({ id }) => id) : []);
                    setSelectedAssetsName(rows ? rows.map(({ name }) => name) : []);
                  },
                  selectedRowKeys: selectedAssets
                }}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  current: current,
                  pageSize: pageSize,
                  total: total,
                  onChange: onPageChange,
                  showTotal: (total) => `总共 ${total} 条`,
                  pageSizeOptions: [10, 20, 50, 100]
                }}
                rowKey='id'
                size='small'
              ></Table>
              <CommonModal
                Modal={props.Modal}
                Form={props.Form}
                initial={initData}
                defaultValue={formData}
                isInline={props.isInline}
                operate={businessForm.operate}
                isOpen={businessForm.isOpen} >
              </CommonModal>
              <OperationModal
                operateType={operateType}
                setOperateType={setOperateType}
                assets={selectedAssets}
                names={selectedAssetsName}
                reloadList={() => {
                  setRefreshKey(_.uniqueId('refreshKey_'));
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout >
  );
}

