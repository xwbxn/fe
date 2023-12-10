import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Popover, Checkbox, Row, Col, Select, Tooltip } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import {
  BulbFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileSearchOutlined,
  FundOutlined,
  GroupOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  SyncOutlined,
  UnorderedListOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import './locale';
import './style.less';
import _ from 'lodash';
import { Resizable } from 're-resizable';
import Accordion from './Accordion';
import { assetsType } from '@/store/assetsInterfaces';
import { CommonStateContext } from '@/App';
import {
  deleteXhAssets,
  deleteAssets,
  insertXHAsset,
  updateXHAsset,
  getAssetsStypes,
  updateAssetDirectoryTree,
  moveAssetDirectoryTree,
  getAssetsByCondition,
  insertAssetDirectoryTree,
  deleteAssetDirectoryTree,
  getOrganizationTree,
  getAssetDirectoryTree,
} from '@/services/assets';

import RefreshIcon from '@/components/RefreshIcon';
import { Link, useHistory } from 'react-router-dom';
import { OperationModal } from './OperationModal';
import { factories } from './catalog';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { useSize, useTimeout } from 'ahooks';
import useResizeTableCol from '@/components/table/useResizeTableCol';
import { useInterval } from 'react-use';
// export { Add, Edit };

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
}
let queryFilter = [
  { name: 'ip', label: 'IP地址', type: 'input' },
  { name: 'name', label: '资产名称', type: 'input' },
  { name: 'manufacturers', label: '厂商', type: 'select' },
  { name: 'os', label: '操作系统', type: 'input' },
  { name: 'status', label: '状态', type: 'select' },
  { name: 'group_id', label: '业务组', type: 'select' },
  { name: 'position', label: '资产位置', type: 'input' },
];

export default function () {
  const { t } = useTranslation('assets');

  const tableRef = useRef(null);
  const tableWrapperSize = useSize(tableRef);
  const [wrapperWidth, setWrapperWidth] = useState<number>();

  const [list, setList] = useState<any[]>([]);
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [selectedAssetsName, setSelectedAssetsName] = useState<string[]>([]);
  const [treeData, setTreeData] = React.useState<DataNode[]>();
  const [optionColumns, setOptionColumns] = useState<any[]>([]);
  const [refreshLeft, setRefreshLeft] = useState<string>(_.uniqueId('refresh_left'));
  const [filterType, setFilterType] = useState<string>('');
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchVal, setSearchVal] = useState('');
  const [filterParam, setFilterParam] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [defaultValues, setDefaultValues] = useState<string[]>();
  const [total, setTotal] = useState<number>(0);
  const [groupColumns, setGroupColumns] = useState<any>({});
  const [initData, setInitData] = useState({});
  const { busiGroups } = useContext(CommonStateContext);
  const [allColumns, setAllColumns] = useState<any[]>([]);

  const [collapse, setCollapse] = useState(localStorage.getItem('left_asset_list') === '1');
  const [width, setWidth] = useState(_.toNumber(localStorage.getItem('leftassetWidth') || 200));
  const [typeId, setTypeId] = useState(_.toString(localStorage.getItem('left_asset_type') || '0'));
  const [assetTypes, setAassetTypes] = useState<any[]>([]);
  const [viewIndex, setViewIndex] = useState<number>(-1);

  const [secondAddButton, setSecondAddButton] = useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = useState<any[]>();
  const [modifyType, setModifyType] = useState<boolean>(true);
  const [queryCondition, setQueryCondition] = useState<any>({});
  const [selectColum, setSelectColum] = useState<any[]>([]);
  const { colIsInit, tableColumns } = useResizeTableCol(wrapperWidth, tableRef, selectColum);
  const history = useHistory();

  const baseColumns: any[] = [
    {
      title: '资产名称',
      dataIndex: 'name',
      fixed: 'left',
      width: '130px',
      ellipsis: true,
      sorter: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      render(value, record, index) {
        return <Link to={`/xh/monitor/add?type=monitor&id=${record.id}&asset_id=${record.id}&action=asset&prom=1`}>{value}</Link>;
      },
    },
    {
      title: '资产类型',
      width: '105px',
      dataIndex: 'type',
      fixed: 'left',
      align: 'center',
      ellipsis: true,
      sorter: (a, b) => {
        return a.type.localeCompare(b.type);
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      width: '130px',
      align: 'center',
      ellipsis: true,
      sorter: (a, b) => {
        return a.ip.localeCompare(b.ip);
      },
      render(value, record, index) {
        return value;
      },
    },
    {
      title: '厂商',
      width: '105px',
      dataIndex: 'manufacturers',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: '130px',
      align: 'center',
      ellipsis: true,
      sorter: (a, b) => {
        return a.position.localeCompare(b.position);
      },
      render(value, record, index) {
        return value;
      },
    },
    {
      title: '所属业务组',
      dataIndex: 'group_id',
      width: '130px',
      align: 'center',
      ellipsis: true,
      render(value, record, index) {
        if (value > 0) {
          let groupName = '';
          busiGroups.forEach((group) => {
            if (group.id === value) {
              groupName = group.name;
            }
          });
          return groupName;
        }
      },
    },
    {
      title: '管理状态',
      width: '105px',
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      sorter: (a, b) => {
        return a.status - b.status;
      },
      render(value, record, index) {
        let label;
        if (value == 0) {
          label = (
            <Tag icon={<CloseCircleOutlined />} color='error'>
              离线
            </Tag>
          );
        } else if (value == 1) {
          label = (
            <Tag icon={<CheckCircleOutlined />} color='success'>
              正常
            </Tag>
          );
        }
        return label;
      },
    },
    {
      title: '运行状态',
      width: '105px',
      dataIndex: 'health',
      align: 'center',
      ellipsis: true,
      sorter: (a, b) => {
        return a.status - b.status;
      },
      render(value, record, index) {
        let label;
        if (value == 0) {
          label = (
            <Tag icon={<CloseCircleOutlined />} color='error'>
              离线
            </Tag>
          );
        } else if (value == 1) {
          label = (
            <Tag icon={<CheckCircleOutlined />} color='success'>
              在线
            </Tag>
          );
        } else if (value == 2) {
          label = (
            <Tag icon={<SyncOutlined spin />} color='processing'>
              待检测
            </Tag>
          );
        }
        return label;
      },
    },
  ];

  /**
   * 选择左边，加载列属性
   */
  const getAssetTypeItems = (type: any, types?: any) => {
    let dealTypes = types != null ? types : assetTypes;
    if (type == '0') {
      return loadAssetTypeAllColumns(dealTypes);
    }

    const extendType: any = dealTypes.find((v) => v.name === type);
    if (extendType) {
      //TODO：处理分组属性
      const extra_items = new Array();
      extendType.metrics?.forEach((element) => {
        let newItem = {
          name: element.metrics,
          label: element.name,
        };
        extra_items.push(newItem);
      });
      let extra_props = extendType.extra_props;
      for (let property in extra_props) {
        let group = extra_props[property];
        let columns = new Array();
        if (group != null) {
          for (let item of group.props) {
            item.items.forEach((element) => {
              columns.push({
                title: element.label,
                dataIndex: element.name,
                width: '120px',
                ellipsis: true,
                align: 'center',
              });
            });
            let newItem = {
              name: property + '.' + item.name,
              label: item.label,
            };
            extra_items.push(newItem);
          }
        }
        groupColumns[property] = columns;
        setGroupColumns({ ...groupColumns });
      }

      const cloumns = new Array();
      extra_items.map((item) => {
        cloumns.push({
          title: item.label,
          dataIndex: item.name,
          width: '80px',
          align: 'center',
          ellipsis: true,
          render: (val, record, i) => {
            if (item.name.split('.').length > 1) {
              return renderItem(item.name, record, i);
            } else {
              return renderMetricsItem(item.name, record, i);
            }
          },
        });
      });

      let columns = baseColumns.concat(cloumns);
      setOptionColumns(_.cloneDeep(columns));
      setSelectColum(_.cloneDeep(baseColumns.concat(fixColumns)));
    }
  };

  const fixColumns: any[] = [
    {
      title: '操作',
      width: '140px',
      align: 'center',
      fixed: 'right',
      render: (text: string, record: assetsType) => (
        <Space>
          <VideoCameraOutlined
            title='设置监控'
            onClick={(e) => {
              localStorage.setItem('left_monitor_type', '0');
              history.push('/xh/monitor?mode=view&assetId=' + record.id);
            }}
          />
          <FileSearchOutlined
            title='资产详情'
            onClick={(e) => {
              showModal('view', record);
            }}
          />
          <FundOutlined
            title='监控图表'
            onClick={(e) => {
              history.push(`/xh/monitor/add?type=monitor&id=${record.id}&asset_id=${record.id}&action=asset&prom=1`);
            }}
          />
          <EditOutlined
            title='编辑'
            onClick={(e) => {
              showModal('update', record);
            }}
          />
          <DeleteOutlined
            className='table-operator-area-warning'
            onClick={async () => {
              Modal.confirm({
                title: t('common:confirm.delete'),
                onOk: async () => {
                  await deleteXhAssets({ ids: [record.id.toString()] });
                  message.success(t('common:success.delete'));
                  setRefreshKey(_.uniqueId('refreshKey_'));
                },

                onCancel() {},
              });
            }}
          ></DeleteOutlined>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (tableWrapperSize) {
      setWrapperWidth(tableWrapperSize.width);
    }
  }, [tableRef, tableWrapperSize]);

  function handelShowColumn(checkedValues) {
    let showColumns = new Array();
    optionColumns.map((item, index) => {
      if (checkedValues.includes(item.title)) {
        showColumns.push(item);
      }
    });
    setSelectColum(showColumns.concat(fixColumns));
  }
  useEffect(() => {
    if (!modifyType) {
      loadDataCenter();
      setSecondAddButton(true);
    } else {
      setSecondAddButton(false);
    }
  }, [modifyType]);

  useEffect(() => {
    let modelIds = Array.from(new Set(baseColumns.map((obj) => obj.title)));
    setDefaultValues(modelIds);
    setOptionColumns(baseColumns);
    setSelectColum(baseColumns.concat(fixColumns));
    //来源数据字典
    getAssetsStypes().then((res) => {
      let arr = ['0'];
      const items = res.dat.map((v) => {
        return {
          id: v.name,
          name: v.name,
          ...v,
        };
      });
      let treeData: any[] = [
        {
          id: '0',
          name: '全部资产',
          count: 0,
          children: items,
        },
      ];
      items.map((item, index) => {
        arr.push(item.id);
      });
      setExpandedKeys(arr);
      setAassetTypes(items);
      filterOptions['type'] = res.dat.map((v) => {
        return {
          value: v.name,
          label: v.name,
        };
      });
      setFilterOptions({ ...filterOptions });
      setTreeData(_.cloneDeep(treeData));
      getAssetTypeItems(typeId, items);
    });
    filterOptions['status'] = [
      { value: '1', label: '在线' },
      { value: '0', label: '离线' },
    ];
    filterOptions['group_id'] = busiGroups.map((group) => {
      return {
        value: '' + group.id,
        label: group.name,
      };
    });
    filterOptions['manufacturers'] = factories.map((factory) => {
      return {
        value: '' + factory.value,
        label: factory.value,
      };
    });
    setFilterOptions({ ...filterOptions });
    setFilterType('input');
    setFilterParam('ip');
  }, []);

  useEffect(() => {
    getTableData();
  }, [searchVal, typeId, refreshKey]);

  useInterval(() => {
    setRefreshKey(_.uniqueId('refreshKey_'));
  }, 1000 * 30);

  const getTableData = () => {
    const param = {
      page: current,
      limit: pageSize,
    };

    if (searchVal != null && searchVal.length > 0) {
      param['query'] = searchVal;
    }
    if (typeId != null && typeId != '0' && modifyType) {
      param['type'] = typeId;
    }
    if (filterParam != null && filterParam.length > 0 && searchVal != null && searchVal.length > 0) {
      param['filter'] = filterParam;
    }
    setQueryCondition(param);
    getAssetsByCondition(param).then(({ dat }) => {
      dat.list.forEach((entity, index) => {
        let expands = entity.exps;
        if (expands != null && expands.length > 0) {
          const map = new Map();
          expands.forEach((item, index, arr) => {
            if (!map.has(item.config_category)) {
              map.set(
                item.config_category,
                arr.filter((a) => a.config_category == item.config_category),
              );
            }
          });
          console.log('Map', map);
          //以上分组加载数据
          let mapValues = {};
          map.forEach(function (value, key) {
            const formDataMap = new Map();
            value.forEach((item, index, arr) => {
              if (!formDataMap.has(item.group_id)) {
                formDataMap.set(
                  item.group_id,
                  arr.filter((a) => a.group_id == item.group_id),
                );
              }
            });
            let group: any = [];
            formDataMap.forEach(function (value, i) {
              let itemsChars = '';
              value.forEach((item, index, arr) => {
                itemsChars += '"' + item.name + '":"' + item.value + '",';
              });
              itemsChars = '{' + itemsChars.substring(0, itemsChars.length - 1) + '}';
              group.push(JSON.parse(itemsChars));
            });
            mapValues[key] = group;
          });
          entity.expands = mapValues;
        }
      });
      setList(dat.list);
      setTotal(dat.total);
    });
  };

  const pupupContent = (
    <div style={{ maxHeight: '550px', overflow: 'scroll' }}>
      <Checkbox.Group defaultValue={defaultValues} style={{ width: '100%' }} onChange={handelShowColumn}>
        {optionColumns.map((item, index) => (
          <Row key={'option' + index} style={{ marginBottom: '5px' }}>
            <Col span={24}>
              <Checkbox value={item.title}>{item.title}</Checkbox>
            </Col>
          </Row>
        ))}
      </Checkbox.Group>
    </div>
  );
  const loadDataCenter = () => {
    getAssetDirectoryTree().then(({ dat, err }) => {
      //默认所有的
      if (err == '') {
        let treeData: any[] = [
          {
            id: 0,
            name: '全部资产',
            count: 0,
            children: dat,
          },
        ];
        initData['directory_id'] = dat;
        setInitData({ ...initData });
        setTreeData(_.cloneDeep(treeData));
      }
    });
  };

  const detailInfo = (id, data) => {
    let columns = groupColumns[id];
    console.log(columns, data);
    return (
      <div className='other_infos'>
        <Table style={{ width: '700px' }} dataSource={data} className='other_table' columns={columns} pagination={false}></Table>
      </div>
    );
  };

  const renderItem = (field, record, index) => {
    let key = field.split('.')[1];
    let values = record.expands ? record.expands[key] : [];
    return (
      <>
        <Popover content={detailInfo(key, values)} title='详细记录'>
          <Button type='primary'>详情</Button>
        </Popover>
      </>
    );
  };

  const renderMetricsItem = (field, record, index) => {
    let vaue: any = null;
    for (let item of record.metrics_list) {
      if (item.label == field) {
        vaue = parseFloat(item.val).toFixed(1);
        break;
      }
    }
    return vaue;
  };

  const loadAssetTypeAllColumns = (dealTypes) => {
    const extra_items = new Array();
    const map = new Map();

    dealTypes.map((extendType) => {
      //TODO：处理分组属性

      extendType.metrics?.forEach((element) => {
        if (!map.has(element.name)) {
          let newItem = {
            name: element.metrics,
            label: element.name,
          };
          extra_items.push(newItem);
          map.set(element.name, element.name);
        }
      });
      let extra_props = extendType.extra_props;
      for (let property in extra_props) {
        let group = extra_props[property];
        let columns = new Array();
        if (group != null) {
          for (let item of group.props) {
            item.items.forEach((element) => {
              columns.push({
                title: element.label,
                dataIndex: element.name,
                width: '120px',
                ellipsis: true,
                align: 'center',
              });
            });
            if (!map.has(item.label)) {
              let newItem = {
                name: property + '.' + item.name,
                label: item.label,
              };
              extra_items.push(newItem);
              map.set(item.label, item.label);
            }
          }
        }
        groupColumns[property] = columns;
        setGroupColumns({ ...groupColumns });
      }
    });
    const cloumns = new Array();
    extra_items.map((item) => {
      cloumns.push({
        title: item.label,
        dataIndex: item.name,
        width: '80px',
        align: 'center',
        ellipsis: true,
        render: (val, record, i) => {
          if (item.name.split('.').length > 1) {
            return renderItem(item.name, record, i);
          } else {
            return renderMetricsItem(item.name, record, i);
          }
        },
      });
    });

    let columns = baseColumns.concat(cloumns);
    setOptionColumns(_.cloneDeep(columns));
    setSelectColum(_.cloneDeep(baseColumns.concat(fixColumns)));
  };

  const showModal = (action: string, formData: any) => {
    if (action == 'add') {
      history.push('/xh/assetmgt/add?mode=edit&&type=');
    } else if (action == 'update') {
      history.push('/xh/assetmgt/add?mode=edit&id=' + formData.id);
    } else if (action == 'view') {
      history.push('/xh/assetmgt/add?mode=view&id=' + formData.id);
    }
  };

  const onPageChange = (page: number, pageSize: number) => {
    setCurrent(page);
    setPageSize(pageSize);
    setRefreshKey(_.uniqueId('refreshKey_'));
  };

  return (
    <PageLayout icon={<GroupOutlined />} title={'资产管理'}>
      <div style={{ display: 'inline-flex' }} className='asset_list_view'>
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
            localStorage.setItem('leftassetWidth', curWidth.toString());
          }}
        >
          <div className={collapse ? 'left-area collapse' : 'left-area'}>
            <div
              className='collapse-btn'
              onClick={() => {
                localStorage.setItem('left_asset_list', !collapse ? '1' : '0');
                setCollapse(!collapse);
              }}
            >
              {!collapse ? <LeftOutlined /> : <RightOutlined />}
            </div>
            <div className='left_tree' style={{ display: 'inline-block' }}>
              <div className='asset_organize_cls'>
                组织树列表
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
              <Accordion
                isAutoInitialized={true}
                refreshLeft={refreshLeft}
                treeData={treeData}
                addButton={secondAddButton}
                addMenu={true}
                expandAll={true}
                selectedKey={typeId}
                expandedKeys={expandedKeys}
                handleClick={async (key: any, node: any, type) => {
                  if (type == 'query' && !modifyType) {
                    setTypeId(key);
                    setRefreshKey(_.uniqueId('refreshKey_'));
                  }
                  if (type == 'query' && modifyType) {
                    //资产类型操作
                    getAssetTypeItems(key);
                    setTypeId(key);
                    localStorage.setItem('left_asset_type', key);
                    setRefreshKey(_.uniqueId('refreshKey_'));
                  }
                  if (key < 0) {
                    let params = {
                      name: '新目录',
                      parent_id: node,
                    };
                    insertAssetDirectoryTree(params).then((res) => {
                      loadDataCenter();
                    });
                  } else {
                    if (type == 'delete') {
                      deleteAssetDirectoryTree(key).then((res) => {
                        message.success('删除成功！');
                        loadDataCenter();
                      });
                    } else if (type == 'update') {
                      updateAssetDirectoryTree(node).then((res) => {
                        message.success('修改成功！');
                        loadDataCenter();
                      });
                    } else if (type == 'move') {
                      moveAssetDirectoryTree(node).then((res) => {
                        message.success('修改成功！');
                        loadDataCenter();
                      });
                    }
                  }
                }}
              />
            </div>
          </div>
        </Resizable>
        <div className='asset-operate_xh'>
          <div className='table-content_xh'>
            <Space>
              <RefreshIcon
                onClick={() => {
                  setRefreshKey(_.uniqueId('refreshKey_'));
                }}
              />
              <div className='table-handle-search'>
                <Space>
                  <Select
                    defaultValue='ip'
                    placeholder='选择过滤器'
                    style={{ width: 120 }}
                    allowClear
                    onChange={(value) => {
                      queryFilter.forEach((item) => {
                        if (item.name == value) {
                          setFilterType(item.type);
                        }
                      });
                      setFilterParam(value);
                      setSearchVal('');
                    }}
                  >
                    {queryFilter.map((item, index) => (
                      <Select.Option value={item.name} key={index}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                  {filterType == 'input' && (
                    <Input
                      className={'searchInput'}
                      value={searchVal}
                      allowClear
                      onChange={(e) => setSearchVal(e.target.value)}
                      suffix={<SearchOutlined />}
                      placeholder={'输入模糊检索关键字'}
                    />
                  )}
                  {filterType == 'select' && (
                    <Select
                      className={'searchInput'}
                      placeholder={'选择要查询的条件'}
                      value={searchVal}
                      allowClear
                      options={filterOptions[filterParam] ? filterOptions[filterParam] : []}
                      onChange={(val) => setSearchVal(val)}
                    />
                  )}
                </Space>
              </div>
            </Space>
            <div className='tool_right'>
              <Space>
                <div>
                  <Button
                    onClick={() => {
                      showModal('add', null);
                    }}
                    type='primary'
                  >
                    {t('新增')}
                  </Button>
                </div>
                <div>
                  <Popover placement='bottom' content={pupupContent} trigger='click' className='filter_columns'>
                    <Button icon={<UnorderedListOutlined />}>显示列</Button>
                  </Popover>
                </div>
                <div>
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu
                        style={{ width: '100px' }}
                        onClick={({ key }) => {
                          if (key == OperateType.AssetBatchExport) {
                            let names = new Array();
                            names.push(queryCondition);
                            setSelectedAssetsName(queryCondition);
                            if (selectedAssets.length <= 0) {
                              Modal.confirm({
                                title: '确认导出所有设备资产吗',
                                onOk: async () => {
                                  setOperateType(key as OperateType);
                                },
                                onCancel() {},
                              });
                            } else {
                              setOperateType(key as OperateType);
                            }
                          } else if (key == OperateType.Delete) {
                            if (selectedAssets.length <= 0) {
                              message.warning('请选择要批量操作的设备');
                              return;
                            } else {
                              Modal.confirm({
                                title: '确认要删除吗',
                                onOk: async () => {
                                  let rows = selectedAssets?.map((item) => '' + item);
                                  deleteXhAssets({ ids: rows }).then((res) => {
                                    message.success('删除成功！');
                                    setRefreshKey(_.uniqueId('refreshKey_'));
                                  });
                                },
                                onCancel() {},
                              });
                            }
                          } else if (key == OperateType.UpdateBusi) {
                            if (selectedAssets.length <= 0) {
                              message.warning('请选择要批量操作记录');
                              return;
                            }
                            setOperateType(key as OperateType);
                          } else {
                            setOperateType(key as OperateType);
                          }
                        }}
                        items={[
                          { key: OperateType.AssetBatchImport, label: '导入设备' },
                          { key: OperateType.AssetBatchExport, label: '导出设备' },
                          // { key: OperateType.BindTag, label: '绑定标签' },
                          // { key: OperateType.UnbindTag, label: '解绑标签' },
                          { key: OperateType.UpdateBusi, label: '批量转移' },
                          // { key: OperateType.RemoveBusi, label: '移出业务组' },
                          // { key: OperateType.UpdateNote, label: '修改备注' },
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
              </Space>
            </div>
          </div>
          <div className='assets-list-1' ref={tableRef}>
            <Table
              dataSource={list}
              className='table-view'
              scroll={{ x: 810 }}
              // components={{
              //   header: {
              //     cell: ResizeableTitle,
              //   },
              // }}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    // debugger;
                    setViewIndex(record.id);
                    console.log(viewIndex);
                  },
                };
              }}
              rowSelection={{
                onChange: (_, rows) => {
                  setSelectedAssets(rows ? rows.map(({ id }) => id) : []);
                  setSelectedAssetsName(rows ? rows.map(({ name }) => name) : []);
                },
              }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                current: current,
                pageSize: pageSize,
                total: total,
                onChange: onPageChange,
                showTotal: (total) => `总共 ${total} 条`,
                pageSizeOptions: [10, 20, 50, 100],
              }}
              columns={selectColum}
              rowKey='id'
              size='small'
            ></Table>
            {/* ):null} */}
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
    </PageLayout>
  );
}
