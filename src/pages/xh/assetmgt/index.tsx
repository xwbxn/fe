import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Popover, Checkbox, Row, Col, Select, Tooltip } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, DeleteOutlined, DownOutlined, EditOutlined, FileSearchOutlined, FundOutlined, GroupOutlined, SearchOutlined, UnorderedListOutlined, VideoCameraOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import CommonModal from '@/components/CustomForm/CommonModal';
import { IRawTimeRange } from '@/components/TimeRangePicker';
import './locale';
import './style.less';
import _ from 'lodash';
// import Add from './Add';
// import Edit from './Edit';
import Accordion from './Accordion';
import moment from 'moment';
import { assetsType } from '@/store/assetsInterfaces';
import { CommonStateContext } from '@/App';
import {deleteXhAssets, deleteAssets, insertXHAsset,updateXHAsset, getAssetsStypes, updateAssetDirectoryTree, moveAssetDirectoryTree, getAssetsByCondition, insertAssetDirectoryTree, deleteAssetDirectoryTree, getOrganizationTree, getAssetDirectoryTree } from '@/services/assets';

import RefreshIcon from '@/components/RefreshIcon';
import { Link, useHistory } from 'react-router-dom';
import { OperationModal } from './OperationModal';
import type { DataNode, TreeProps } from 'antd/es/tree';
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

export interface OrgType {
  name: string;
  id: number;
  parent_id: number;
  children: OrgType[];
  isEditable?: boolean;
}

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
  const [list, setList] = useState<any[]>([]);
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [selectedAssetsName, setSelectedAssetsName] = useState<string[]>([]);
  const [treeData, setTreeData] = React.useState<DataNode[]>();  
  const [optionColumns, setOptionColumns] = useState<any[]>([]);
  const [refreshLeft, setRefreshLeft] = useState<string>(_.uniqueId('refresh_left'));
  const [filterType,setFilterType] = useState<string>("");
  const [current,setCurrent] = useState<number>(1);
  const [pageSize,setPageSize] = useState<number>(10);  
  const [searchVal, setSearchVal] = useState('');
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const [defaultValues, setDefaultValues] = useState<string[]>();
  const [total,setTotal] = useState<number>(0);
  const [assetTypeItems, setAssetTypeItems] = useState<any[]>([]);
  const [groupColumns, setGroupColumns] = useState<any>({});
  const [initData, setInitData] = useState({});
  const { busiGroups } = useContext(CommonStateContext);

  const [typeId, setTypeId] = useState<any>(null);
  const [assetTypes, setAassetTypes] = useState<any[]>([]);
  const [modifySwitch, setModifySwitch] = useState(true);  
  const [viewIndex, setViewIndex] = useState<number>(-1);  
  
  const [secondAddButton, setSecondAddButton] = useState<boolean>(true);

  const [expandedKeys,setExpandedKeys] =useState<any[]>();

  const [modifyType, setModifyType] = useState<boolean>(true);

  const [queryCondition, setQueryCondition] = useState<any>({});

  const history = useHistory();
  const baseColumns: any[] = [
    {
      title: "资产名称",
      dataIndex: 'name',
      fixed: 'left',
      width: "130px",
      ellipsis:true,
      render(value, record, index) {
        return <Link to={{ pathname: `/assets/${record.id}` }}>{value}</Link>;
      },
    },
    {
      title: "资产类型",
      width: "105px",
      dataIndex: 'type',
      fixed: 'left',
      ellipsis:true,
    },
    {
      title: "IP地址",
      dataIndex: 'ip',
      width: "130px",
      ellipsis:true,
      render(value, record, index) {
        return value;
      },
    },
    {
      title: "厂商",
      width: "105px",
      dataIndex: 'manufacturers',
      ellipsis:true,
    },
    {
      title: "位置",
      dataIndex: 'position',
      width: "130px",
      ellipsis:true,
      render(value, record, index) {
        return value;
      },
    },
    {
      title: "所属业务组",
      dataIndex: 'group_id',
      width: "130px",
      ellipsis:true,
      render(value, record, index) {
        if(value >0){
          let groupName = ""
          busiGroups.forEach(group =>{
             if(group.id ===value){
              groupName= group.name;
             }
          });
          return groupName;
        }
        
      }
    },
    {
      title: "状态",
      width: "105px",
      dataIndex: 'status',
      ellipsis:true,
      render(value, record, index) {
        let label = "-";
        if(value==0){
           label = "离线";
        }else if(value==1){
           label = "正常"
        }
        return label;
      },
    },
  ];
  
  const fixColumns: any[] = [
    {
      title: '操作',
      width: '120px',
      align: 'center',
      fixed: 'right',
      render: (text: string, record: assetsType) => (
        <Space>
          <VideoCameraOutlined title='设置监控' onClick={(e)=>{
              location.href="/xh/monitor?mode=view&assetId="+record.id;  
          }}/>
          <FileSearchOutlined title='资产详情' onClick={(e)=>{
               showModal("view",record)
          }} />
          <FundOutlined  title='监控图表' onClick={(e)=>{
               location.href="/xh/monitor/add?type=monitor&id="+record.id+"&action=asset";  
          }}  />
          <EditOutlined  title='编辑' onClick={(e)=>{
               showModal("update",record)
          }}/>
          <DeleteOutlined
              onClick={async () => {
                Modal.confirm({
                  title: t('common:confirm.delete'),
                  onOk: async () => {
                    await deleteAssets({ ids: [record.id.toString()] });
                    message.success(t('common:success.delete'));
                    setRefreshKey(_.uniqueId('refreshKey_'));
                  },
  
                  onCancel() { },
                });
              }}
            >
            </DeleteOutlined>
        </Space>
      ),
    },
  ];


  const [selectColum, setSelectColum] = useState<any[]>()

  function handelShowColumn(checkedValues) {
    let showColumns = new Array();
    optionColumns.map((item,index) => {
      if (checkedValues.includes(item.title)) {
        showColumns.push(item)
      }
    });
    setSelectColum(showColumns.concat(fixColumns));
  }
  useEffect(() => {
    if(!modifyType){
        loadDataCenter();
        setSecondAddButton(true)
    }else{
      setSecondAddButton(false)
      getAssetsStypes().then((res) => {
        let arr = ["0"];
        const items = res.dat.map((v) => {
            return {
              id: v.name,
              name: v.name,
              ...v,
            };
          })
          // .filter((v) => v.name !== '主机'); //探针自注册的不在前台添加
          let treeData: any[] = [{
            id: "0",
            name: '全部资产',
            count: 0,
            children: items
          }];
          items.map((item, index) => {
             arr.push(item.id);
          })
          setExpandedKeys(arr);
          setAassetTypes(items);
          setTreeData(_.cloneDeep(treeData));
      });

    }
    setTypeId(null);

  },[modifyType]);

  useEffect(() => {
    
    console.log("初始化页面和参数");
    let modelIds = Array.from(new Set(baseColumns.map(obj => obj.title)))
    setDefaultValues(modelIds);
    setOptionColumns(baseColumns);
    setSelectColum((baseColumns.concat(fixColumns)));
    //来源数据字典
  }, []);

  useEffect(() => {
    getTableData();
  }, [searchVal,typeId,filterType,refreshKey]);

  const getTableData = () =>{
  
    const param = {
      page: current,
      limit: pageSize,
    };

    if(searchVal!=null && searchVal.length > 0) {
      param["query"] = searchVal;
    }
    if(typeId!=null && typeId!="0" && modifyType){
      param["type"] = typeId;
    }
    if(filterType!=null && filterType.length > 0 && searchVal!=null && searchVal.length > 0)  {
      param["filter"] = filterType;
    }
    setQueryCondition(param);

    getAssetsByCondition(param).then(({dat}) => {
         dat.list.forEach((entity,index)=>{
            let  expands = entity.exps;
            if(expands!=null && expands.length > 0) {
              const map = new Map()
              expands.forEach((item, index, arr) => {
                if (!map.has(item.config_category)) {
                  map.set(
                    item.config_category,
                    arr.filter(a => a.config_category == item.config_category)
                  )
                }
              })
              console.log("Map",map);
              //以上分组加载数据 
              let mapValues = {};
              map.forEach(function (value, key) {
                const formDataMap = new Map()
                value.forEach((item, index, arr) => {
                  if (!formDataMap.has(item.group_id)) {
                    formDataMap.set(
                      item.group_id,
                      arr.filter(a => a.group_id == item.group_id)
                    )
                  }
                })
                let group:any =[];
                formDataMap.forEach(function (value, i) {
                  let itemsChars = ""
                  value.forEach((item, index, arr) => {
                      itemsChars += "\"" + item.name + "\":\"" + item.value + "\",";
                  })
                  itemsChars = "{" + itemsChars.substring(0, itemsChars.length - 1) + "}";
                  group.push(JSON.parse(itemsChars));
                })
                mapValues[key] = group;
                
              }) 
              entity.expands = mapValues;
            }

         })
        setList(dat.list);
        setTotal(dat.total)
    });
  };

  const pupupContent = (
    
    <div style={{maxHeight:'550px',overflow:"scroll"}}>      
      <Checkbox.Group
        defaultValue={defaultValues}
        style={{ width: '100%' }}
        onChange={handelShowColumn}
      >
        {
          optionColumns.map((item,index) => (
            <Row key={"option"+index} style={{ marginBottom: '5px' }}>
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

  const detailInfo =(id, data)=>{
    let columns = groupColumns[id];
    console.log(columns,data);
    return <Table 
         style={{width:'650px'}} 
         dataSource={data} 
         columns={columns} 
         pagination={false}>
    </Table>
  }
  
  const renderItem = (field, record, index) => {
    
    let key = field.split(".")[1];
    let values=record.expands?record.expands[key]:[];
    console.log("render", key, values);
    return <>
      <Popover content={detailInfo(key,values)} title="详细记录">
        <Button type="primary">详情</Button>
      </Popover>
    </>
  }

  const renderMetricsItem = (field, record, index) => {
    let vaue :any= null;
    for (let item of record.metrics_list){
      if(item.label==field){
          vaue = parseFloat(item.val).toFixed(1);
          break;
        }
    }
    return vaue;
  }
  const getAssetTypeItems = (type) => {
    const extendType: any = assetTypes.find((v) => v.name === type);
    if (extendType) {
      //TODO：处理分组属性
      const extra_items = new Array();   
      extendType.metrics?.forEach(element => {
        let  newItem = {
          name: element.metrics,
          label: element.name,                 
        };
        extra_items.push(newItem);
      });   
      let extra_props = extendType.extra_props; 
      for (let property  in extra_props) {         
          let group  = extra_props[property];
          let columns = new Array;
          if(group!=null){
            for( let item  of group.props ){              
              item.items.forEach(element => {
                columns.push({
                    title: element.label,
                    dataIndex: element.name,
                    width: "120px",
                    ellipsis:true,
                 })
              });
              let  newItem = {
                name: property+"."+(item.name),
                label: item.label,                 
              };
              extra_items.push(newItem);
           }
          }
          groupColumns[property]=columns;
          setGroupColumns({...groupColumns})                   
      }      
      
      const cloumns = new Array();
      extra_items.map(item =>{
        cloumns.push({
          title: item.label,
          dataIndex: item.name,
          width: "80px",
          align: "center",
          ellipsis:true,
          render: (val,record,i) => {
            if(item.name.split(".").length>1){
               return renderItem(item.name,record,i);
            }else{
              return  renderMetricsItem(item.name,record,i);
            }
            
          }
        })
      })
      
      let columns = baseColumns.concat(cloumns);
      setOptionColumns(_.cloneDeep(columns));
      console.log(columns);
      setSelectColum(_.cloneDeep(baseColumns.concat(fixColumns)));
    }

  }


  const showModal = (action:string,formData:any) => {

    if(action=="add"){
      history.push('/xh/assetmgt/add?mode=edit');    
    }else if(action=="update"){
      history.push('/xh/assetmgt/add?mode=edit&id='+formData.id);    
    }else if(action=="view"){
      history.push('/xh/assetmgt/add?mode=view&id='+formData.id);    
    }

  }

  const onPageChange =(page: number, pageSize: number) =>{
    setCurrent(page);
    setPageSize(pageSize);
    setRefreshKey(_.uniqueId('refreshKey_'));
  }
 
  
  return (
    <PageLayout icon={<GroupOutlined />} title={'资产管理'}>
      <div style={{ display: 'flex' }} className='asset_list_view'>
        <div style={{ width: '250px', display: 'table', height: '100%' }}>
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
          <Accordion
            isAutoInitialized={false}
            refreshLeft={refreshLeft}
            treeData={treeData}
            addButton={secondAddButton}
            addMenu={true}
            expandAll={true}
            expandedKeys={expandedKeys}
            handleClick={async (key: any, node: any, type) => {
              console.log("点击的事件参数为", key, node, type)
              if (type == "query" && !modifyType) {
                   setTypeId(key);
                   setRefreshKey(_.uniqueId('refreshKey_'));
              }
              if (type == "query" && modifyType) {
                getAssetTypeItems(key);
                setTypeId(key);
                setRefreshKey(_.uniqueId('refreshKey_'));
           }
              if (key < 0) {
                let params = {
                  name: "新目录",
                  parent_id: node
                }
                insertAssetDirectoryTree(params).then((res) => {
                  loadDataCenter();
                })
              } else {
                if (type == "delete") {
                  deleteAssetDirectoryTree(key).then((res) => {
                    message.success("删除成功！")
                    loadDataCenter();
                  })
                } else if (type == 'update') {
                  updateAssetDirectoryTree(node).then((res) => {
                    message.success("修改成功！")
                    loadDataCenter();
                  })
                } else if (type == 'move') {
                  moveAssetDirectoryTree(node).then((res) => {
                    message.success("修改成功！")
                    loadDataCenter();
                  })
                }
              }


            }}
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
                    setFilterType(value);
                  }}
                  options={[
                    //  { value: "1", label: '数据源名称' },
                    //  { value: "2", label: 'IP地址解析器' },
                    //  { value: "3", label: '数据源类型' },
                    //  { value: "4", label: '解析器' },
                     { value: "group", label: '业务组' }
                  ]}
                />
                <Input
                  className={'searchInput'}
                  value={searchVal}
                  allowClear
                  onChange={(e) => setSearchVal(e.target.value)}
                  prefix={<SearchOutlined />}
                  placeholder={'模糊检索资产名称/IP等多个关键字'}
                />
              </div>
            </Space>
            <div className='tool_right'>
              <div>
                <Button
                  onClick={() => {
                    showModal("add",null)
                  }}
                  type='primary'
                >
                  {t('新增')}
                </Button>
              </div>
              <div>
                <Popover placement="bottom" content={pupupContent} trigger="click" className='filter_columns' >
                  <Button  icon={<UnorderedListOutlined />}>显示列</Button>
                </Popover>
              </div>
              <div>
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu
                      style={{ width: '100px' }}
                      onClick={({ key }) => {
                        
                        if (key == OperateType.AssetBatchExport){
                          let names = new Array;
                          names.push(queryCondition);
                          setSelectedAssetsName(queryCondition);
                          if (selectedAssets.length <= 0) {
                            Modal.confirm({
                              title: "确认导出所有设备资产吗",
                              onOk: async () => {
                                setOperateType(key as OperateType);
                              },
                              onCancel() { },
                            });

                          }else{
                            setOperateType(key as OperateType);
                          }
                        }else if (key == OperateType.Delete) {
                          if (selectedAssets.length <= 0) {
                            message.warning("请选择要批量操作的设备")
                            return
                          } else {
                            Modal.confirm({
                              title: "确认要删除吗",
                              onOk: async () => {
                                let rows = selectedAssets?.map((item) => ""+item);
                                deleteXhAssets({ids:rows}).then(res => {
                                  message.success("删除成功！");
                                  setRefreshKey(_.uniqueId('refreshKey_'));
                                })
                              },
                              onCancel() { },
                            });
                          }
                        }else{
                          setOperateType(key as OperateType);
                        }

                      }}
                      items={[
                        { key: OperateType.AssetBatchImport, label: '导入设备' },
                        { key: OperateType.AssetBatchExport, label: '导出设备' },
                        { key: OperateType.BindTag, label: '绑定标签' },
                        { key: OperateType.UnbindTag, label: '解绑标签' },
                        // { key: OperateType.UpdateBusi, label: '修改业务组' },1 excle 2 xml 3 text
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
            </div>
          </div>
          <div className='assets-list' style={{ width:'100%' }}>
            <Table
              dataSource={list}
              className='table-view'
              scroll={{ x: 810}}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    // debugger;
                    setViewIndex(record.id)
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
                pageSizeOptions: [10, 20, 50, 100]
              }}
              columns={selectColum}
              rowKey='id'
              size='small'
            ></Table>
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
