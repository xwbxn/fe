import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Popover, Checkbox, Row, Col, Select } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, DeleteOutlined, DownOutlined, EditOutlined, FileSearchOutlined, FundOutlined, GroupOutlined, SearchOutlined, UnorderedListOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getBusiGroups } from '@/services/common';
const { confirm } = Modal;
import CommonModal from '@/components/CustomForm/CommonModal';
import { SetConfigTables, SetConfigForms } from './catalog'
import { CommonStateContext } from '@/App';
import { IRawTimeRange } from '@/components/TimeRangePicker';
import './locale';
import './style.less';
import _ from 'lodash';
import Add from './Add';
import Edit from './Edit';
import Accordion from './Accordion';
import moment from 'moment';
import { assetsType } from '@/store/assetsInterfaces';
import { getDeviceType } from '@/services/assets/deviceType';
import { getDictValueEnum } from '@/services/system/dict';
import { deleteAssets, insertXHAsset,updateXHAsset, getAssetsStypes, updateAssetDirectoryTree, moveAssetDirectoryTree, getAssetsByCondition, insertAssetDirectoryTree, deleteAssetDirectoryTree, getOrganizationTree, getAssetDirectoryTree } from '@/services/assets';

import RefreshIcon from '@/components/RefreshIcon';
import { Link, useHistory } from 'react-router-dom';
import { OperationModal } from './OperationModal';
import { DataNode } from 'antd/lib/tree';
export { Add, Edit };

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

  const [props, setProps] = useState<any>({});
  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});
  const [typeId, setTypeId] = useState<any>(null)

  const [dictDatas, setDictDatas] = useState({});
  const [assetTypes, setAassetTypes] = useState<any[]>([]);
  const [modifySwitch, setModifySwitch] = useState(true);  
  const [secondAddButton, setSecondAddButton] = useState<boolean>(true);

  const [expandedKeys,setExpandedKeys] =useState<any[]>();

  const [modifyType, setModifyType] = useState<boolean>(true);

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
      title: "状态",
      width: "105px",
      dataIndex: 'status',
      ellipsis:true,
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
          <VideoCameraOutlined />
          <FileSearchOutlined title='资产详情' />
          <FundOutlined  title='监控图表'  />
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
          console.log("-------------------------------",items);
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
    setSelectColum((baseColumns));
    //来源数据字典
    // getDictValueEnum('cpu_specifications,memory_specifications,producer,asset_status,operate_system,asset_ext_fields').then((data) => {
    //     setDictDatas(data)
    //     initData["cpu"] = data["cpu_specifications"] ? data["cpu_specifications"] : [];
    //     initData["memory"] = data["memory_specifications"] ? data["memory_specifications"] : [];
    //     initData["producer"] = data["producer"] ? data["producer"] : [];
    //     initData["asset_status"] = data["asset_status"] ? data["asset_status"] : [];
    //     initData["os"] = data["operate_system"] ? data["operate_system"] : [];
    //     setInitData({ ...initData});
    // });

    // getOrganizationTree({}).then(({ dat }) => {
    //     initData["organization_id"] = dat;
    //     setInitData({ ...initData});
    // });

    // getAssetsStypes().then((res) => {
    //   const options = res.dat
    //     .map((v) => {
    //       return {
    //         label: v.name,
    //         value: v.name
    //       };
    //     })
    //     // .filter((v) => v.name !== '主机');
    //     initData["type"] = options;
    //     setInitData({ ...initData});
    // });
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
    if (typeId !=null && !modifyType) {
      param["directory_id"] = typeId;
    }
    if(typeId!=null && modifyType){
      param["type"] = typeId;
    }
    if(filterType!=null && filterType.length > 0 && searchVal!=null && searchVal.length > 0)  {
      param["filter"] = filterType;
    }
    getAssetsByCondition(param).then((res) => {
        setList(res.dat.list);
        setTotal(res.dat.total)
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
  

  const getAssetTypeItems = (type) => {
    const extendType: any = assetTypes.find((v) => v.name === type);
    if (extendType) {
      //TODO：处理分组属性
      const extra_items = new Array();      
      let extra_props = extendType.extra_props; 
      for (let property  in extra_props) {          
          let group  = extra_props[property];
          if(group!=null){
            for( let item  of group.props ){
              if (item.type === "list") {
                  for( let entity  of item.items ){
                   let  newItem = {
                       name: property+"."+(entity.name),
                       label: group.label+"-"+entity.label,
                   };
                    console.log("newItem",newItem) 
                    extra_items.push(newItem);
                 };
              } else {
                let  newItem = {
                  name: property+"."+(item.name),
                  label: group.label+"-"+item.label,
                };
                console.log("newItem",newItem)
                extra_items.push(newItem);
              }
           }
          }               
      }
      const cloumns = new Array();
      extra_items.map(item =>{
        cloumns.push({
          title: item.label,
          dataIndex: item.name,
          width: "140px",
          ellipsis:true,
        })
      })
      let columns = baseColumns.concat(cloumns);
      setOptionColumns(_.cloneDeep(columns));
      setSelectColum(_.cloneDeep(baseColumns));
    }

  }


  const showModal = (action:string,formData:any) => {

    if(action=="add"){
      history.push('/xh/assetmgt/add');    
    }

  }

  const onPageChange =(page: number, pageSize: number) =>{
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
    }else{
      submitFieldMap.set("id",businessForm["operateId"]);
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
  const FormOnChange = (values, item) => {    
    // console.log("FormOnChange", item, values,businessForm);
    if (businessForm["businessId"] == "asset_set") {
      let itemKey = "";//控制的字段
      for (var key in item) {
        itemKey = key;
      }
      // console.log(itemKey)
      if(itemKey==="type"){
          let itemType = extendTypes().type1;
          delete props.Form.groups;
          let groups = new Array<any>()
          groups.push({
            items:itemType
          })
          props.Form["groups"]= groups;
          setProps(_.cloneDeep(props))
      }
    }
    setFormData(values);
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
                     { value: "1", label: '数据源名称' },
                     { value: "2", label: 'IP地址解析器' },
                     { value: "3", label: '数据源类型' },
                     { value: "4", label: '解析器' }
                  ]}
                />
                <Input
                  className={'searchInput'}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  prefix={<SearchOutlined />}
                  placeholder={'模糊检索表格内容,多个关键字用空格分隔'}
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
                        setOperateType(key as OperateType);
                      }}
                      items={[
                        { key: OperateType.AssetBatchImport, label: '导入' },
                        { key: OperateType.AssetBatchExport, label: '导出' },
                        { key: OperateType.BindTag, label: '绑定标签' },
                        { key: OperateType.UnbindTag, label: '解绑标签' },
                        { key: OperateType.UpdateBusi, label: '修改业务组' },
                        { key: OperateType.RemoveBusi, label: '移出业务组' },
                        { key: OperateType.UpdateNote, label: '修改备注' },
                        { key: OperateType.Delete, label: '批量删除' },
                        { key: OperateType.ChangeOrganize, label: '变更组织树' },
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
              scroll={{ x: 810,}}
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
            <CommonModal
              Modal={props.Modal}
              Form={props.Form}
              initial={initData}
              defaultValue={formData}
              FormOnChange={FormOnChange}
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
