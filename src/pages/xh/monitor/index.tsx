import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Popover, Checkbox, Row, Col, Select } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, DownOutlined, EditOutlined, FileProtectOutlined, FileSearchOutlined, FundOutlined, GroupOutlined, PoweroffOutlined, ProfileTwoTone, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';

const { confirm } = Modal;
import CommonModal from '@/components/CustomForm/CommonModal';

import { IRawTimeRange } from '@/components/TimeRangePicker';
import './locale';
import './style.less';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';
import { deleteAssets, insertXHAsset, updateXHAsset, getAssetsStypes, updateAssetDirectoryTree, moveAssetDirectoryTree, getAssetsByCondition, insertAssetDirectoryTree, deleteAssetDirectoryTree, getOrganizationTree, getAssetDirectoryTree } from '@/services/assets';
import { getMonitorInfoList, getMonitorInfo, getMonitorInfoListBasedOnSearch, deleteXhMonitor, updateMonitorStatus } from '@/services/manage';
import { Link, useHistory } from 'react-router-dom';
import { OperationModal } from './OperationModal';
import type { DataNode, TreeProps } from 'antd/es/tree';
import RefreshIcon from '@/components/RefreshIcon';

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
let queryFilter =[
  {name:'monitoring_name',label:'监控名称',type:'input'},
  {name:'asset_name',label:'资产名称',type:'input'},
  {name:'status',label:'监控状态',type:'select'},
  {name:'is_alarm',label:'是否启用告警',type:'select'},
]
export default function () {
  const { t } = useTranslation('assets');
  const [list, setList] = useState<any[]>([]);
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
  const [typeId, setTypeId] = useState<any>(null)
  const { search } = useLocation();
  const { assetId } = queryString.parse(search);
  const [currentAssetId, setCurrentAssetId] = useState<number>(assetId != null ? parseInt(assetId.toString()) : 0);
  const [secondAddButton, setSecondAddButton] = useState<boolean>(true);
  const [filterParam,setFilterParam] = useState<string>("");
  const history = useHistory();
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
      width: "130px",
      ellipsis: true,
      render(value, record, index) {
        return <Link to={{ pathname: `/assets/${record.id}` }}>{value}</Link>;
      },
    },
    {
      title: "资产名称",
      width: "105px",
      dataIndex: 'asset_id',
      fixed: 'left',
      ellipsis: true,
      render(value, record, index) {
        let name = assetInfo[value]?.name;
        return name;
      },
    },
  ];
  const choooseColumns = [
    {
      title: "描述",
      width: "105px",
      dataIndex: 'remark',
    },
    {
      title: "监控状态",
      width: "105px",
      dataIndex: 'status',
      render(value, record, index) {
        return value == 0 ? '关闭' : '正常';
      },
    },
    {
      title: "是否启用告警",
      width: "105px",
      dataIndex: 'is_alarm',
      render(value, record, index) {
        return value == 0 ? '未启用' : '启用中';
      },
    },
  ];
  const fixColumns: any[] = [
    {
      title: '操作',
      width: '120px',
      align: 'center',
      fixed: 'right',
      render: (val, record: any) => (
        <Space size={"middle"}>
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
                  title: "确认要禁止当前用户使用？",
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
    setOptionColumns(choooseColumns.concat(baseColumns));
    let modelIds = Array.from(new Set(choooseColumns.concat(baseColumns).map(obj => obj.title)))
    setDefaultValues(modelIds);
    getAssetsStypes().then((res) => {
      const items = res.dat.map((v) => {
        return {
          id: v.name,
          name: v.name,
          ...v,
        };
      })
      // .filter((v) => v.name !== '主机'); //探针自注册的不在前台添加
      let treeData: any[] = [{
        id: 0,
        name: '全部监控',
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
      setTreeData(_.cloneDeep(treeData));
    });
    setSelectColum(baseColumns.concat(choooseColumns).concat(fixColumns));

    
    getAssetsByCondition({}).then(({ dat }) => {
      dat.list.forEach(v => {
        assetInfo[v.id] = (v);
      })
      setAssetInfo({ ...assetInfo });
      getTableData(assetInfo);
    });

    filterOptions["status"]=[{value:'0',label:'关闭'},{value:'1',label:'正常'}]    
    filterOptions["is_alarm"]=[{value:'1',label:'已启用'},{value:'0',label:'未启用'}] 
    setFilterOptions({...filterOptions})
  }, []);


  useEffect(() => {
    getTableData(assetInfo);
  }, [searchVal, refreshFlag, typeId, refreshKey]);

  const getTableData = (assets) => {
    const param = {
      page: current,
      limit: pageSize,
    };

    if (currentAssetId > 0) {
      param["assetId"] = currentAssetId;
    }
    if(searchVal!=null && searchVal.length > 0) {
      param["query"] = searchVal;
    }
    if(filterParam!=null && filterParam.length > 0 && searchVal!=null && searchVal.length > 0)  {
      param["filter"] = filterParam;
    }
    if (typeId != null && typeId + "" != "0") {
      param["assetType"] = typeId;
    }
    getMonitorInfoList(param
    ).then(({ dat }) => {
      setList(dat.list);
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
    if (action == "asset") {
      let url = '/xh/monitor/add?type=asset&action=' + operate;
      if (id == 0) {
            history.push(url);
      } else {
            history.push(url + "&id=" + id);
      }
    }else if (action == "monitor") {
       history.push('/xh/monitor/add?type=monitor&id=' + id + "&action=monitor");
    }else if(action == "rules"){
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
  const formSubmit = (values, businessForm, action, businessZip) => {
    let fields = dealFieldsToForm(businessZip);
    console.log("_Submit", values, businessForm);
    let submitFieldMap = new Map();
    for (let item in values) {
      let value = datalDealValue(values[item], fields.get(item).data_type);
      if (value) {
        submitFieldMap.set(item, value)
      }
    }
    console.log("提交数据", businessForm, values);
    if (action == "add") {
      insertXHAsset(Object.fromEntries(submitFieldMap)).then((res) => {
        setRefreshLeft(_.uniqueId('refresh_left'));
        console.log(refreshLeft);
        businessForm.isOpen = false;
        setBusinessForm(businessForm)
        // loadDataCenter();
        setRefreshKey(_.uniqueId('refreshKey_'));
      })
    } else {
      submitFieldMap.set("id", businessForm["operateId"]);
      updateXHAsset(Object.fromEntries(submitFieldMap)).then((res) => {
        setRefreshLeft(_.uniqueId('refresh_left'));
        console.log(refreshLeft);
        businessForm.isOpen = false;
        setBusinessForm(businessForm)
        // loadDataCenter();
        setRefreshKey(_.uniqueId('refreshKey_'));
      })
    }
  };
  const onSelect = (selectedKeys, info) => {
    setTypeId(selectedKeys);
    setCurrentAssetId(0);
    setRefreshKey(_.uniqueId('refreshKey_'));
  };
  return (
    <PageLayout icon={<GroupOutlined />} title={'监控管理'}>
      <div style={{ display: 'flex' }} className='monitor_list_view'>
        <div style={{ width: '250px', display: 'table', height: '100%' }}>
          <div className='asset_organize_cls'>资产类型
            <div style={{ margin: '0 10prx ' }}>
            </div>

          </div>

          <Tree
            showLine={true}
            showIcon={true}
            style={{ marginTop: 0 }}
            titleRender={titleRender}
            // onRightClick={this.handleRightClick}
            treeData={treeData}
            defaultExpandAll={true}
            autoExpandParent={true}
            checkStrictly
            fieldNames={{ key: 'id', title: 'name' }}
            onSelect={onSelect}
          />
         
        </div>
        <div className='asset-operate_xh'>
          <div className='table-content_xh'>
            <Space>
             <RefreshIcon
                onClick={() => {
                  setRefreshKey(_.uniqueId('refreshKey_'));
                }}
              />
              <div className='table-handle-search'>
              <Select
                  // defaultValue="lucy"
                  placeholder="选择过滤器"
                  style={{ width: 120 }}
                  allowClear
                  onChange={(value)=>{
                       queryFilter.forEach((item)=>{
                          if(item.name==value){
                            setFilterType(item.type);                            
                          }
                       })
                       setFilterParam(value);
                       setSearchVal(null)
                  }}>
                  {queryFilter.map((item,index)=>(
                      <Select.Option value={item.name} key={index}>{item.label}</Select.Option>
                  ))
                  }
                  </Select>
                  {filterType=="input" && (
                     <Input
                     className={'searchInput'}
                     value={searchVal}
                     allowClear                     
                     onChange={(e) => setSearchVal(e.target.value)}
                     suffix={<SearchOutlined />}
                     placeholder={'输入模糊检索关键字'}
                   />
                  )}
                  {filterType=="select" && (
                     <Select
                        className={'searchInput'}
                        value={searchVal}
                        allowClear
                        options={filterOptions[filterParam]?filterOptions[filterParam]:[]}
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
                    showModal("asset", 0, "add")
                  }}

                  type='primary'
                >
                  {t('新增')}
                </Button>
                &nbsp; &nbsp; &nbsp;
              </div>

              <div>
                <Popover placement="bottom" content={pupupContent} trigger="click" className='filter_columns' >
                  <Button className='show_columns' >显示列</Button>
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
                        if (selectedAssets.length <= 0) {
                          message.error("未选中监控");
                          return
                        }
                        if (key == "turnOnMonitoring") {
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
                            title: "确认要禁止当前用户使用？",
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
                      }}
                      items={[
                        { key: OperateType.TurnOnMonitoring, label: '启用监控' },
                        { key: OperateType.DisableMonitoring, label: '禁止监控' },
                        //{ key: OperateType.Dismonitoring, label: '解除监控' },
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
          <div className='monitor-list' style={{ width: '100%' }}>
            <Table
              dataSource={list}
              className='table-view'
              scroll={{ x: 810, }}
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
              columns={selectColum}
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
    </PageLayout>
  );
}

