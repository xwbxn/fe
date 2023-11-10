import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Popover, Checkbox, Row, Col, Select } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, CopyTwoTone, DeleteOutlined, DownOutlined, EditOutlined, FileProtectOutlined, FileSearchOutlined, FundOutlined, GroupOutlined, PoweroffOutlined, ProfileTwoTone, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';

const { confirm } = Modal;
import CommonModal from '@/components/CustomForm/CommonModal';
import { SetConfigTables, SetConfigForms } from './catalog'
import { CommonStateContext } from '@/App';
import { IRawTimeRange } from '@/components/TimeRangePicker';
import './locale';
import './style.less';
import _ from 'lodash';
// import Add from './Add';
// import Edit from './Edit';
import Accordion from '../assetmgt/Accordion';
import moment from 'moment';
import { assetsType } from '@/store/assetsInterfaces';
import { deleteAssets, insertXHAsset,updateXHAsset, getAssetsStypes, updateAssetDirectoryTree, moveAssetDirectoryTree, getAssetsByCondition, insertAssetDirectoryTree, deleteAssetDirectoryTree, getOrganizationTree, getAssetDirectoryTree } from '@/services/assets';

import RefreshIcon from '@/components/RefreshIcon';
import { Link, useHistory } from 'react-router-dom';
import { OperationModal } from './OperationModal';
import { DataNode } from 'antd/lib/tree';
import { AlertRuleStatus } from '@/pages/alertRules/types';
import { updateAlertRules, deleteStrategy } from '@/services/warning';
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
  const [refreshLeft, setRefreshLeft] = useState<string>(_.uniqueId('refresh_left'));
  
  const [filterType,setFilterType] = useState<string>("");
  const [current,setCurrent] = useState<number>(1);
  const [pageSize,setPageSize] = useState<number>(10);  
  const [searchVal, setSearchVal] = useState('');
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const [defaultValues, setDefaultValues] = useState<string[]>();
  const [total,setTotal] = useState<number>(0);

  const [props, setProps] = useState<any>({});
  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});
  const [organId, setOrganId] = useState<number>()
  const [typeId, setTypeId] = useState<any>(null)

  const [dictDatas, setDictDatas] = useState({});
  
  const [secondAddButton, setSecondAddButton] = useState<boolean>(true);
  const [modifyType, setModifyType] = useState<boolean>(false);

  const history = useHistory();
  const baseColumns: any[] = [
    {
      title: "监控名称",
      dataIndex: 'name',
      fixed: 'left',
      width: "130px",
      ellipsis:true,
      render(value, record, index) {
        return <Link to={{ pathname: `/assets/${record.id}` }}>{value}</Link>;
      },
    },
    {
      title: "资产名称",
      width: "105px",
      dataIndex: 'type',
      fixed: 'left',
      ellipsis:true,
    },
  ];
  const choooseColumns = [
    {
      title: "描述",
      width: "105px",
      dataIndex: 'ip',
    },
    {
      title: "监控状态",
      width: "105px",
      dataIndex: 'producer',
    },
    {
      title: "是否启用告警",
      width: "105px",
      dataIndex: 'os',
    },    
  ];
  const fixColumns: any[] = [
    {
      title: '操作',
      width: '120px',
      align: 'center',
      fixed: 'right',
      render: (text: string, record: any|assetsType) => (
        <Space>
              <PoweroffOutlined  
               title={record.disabled === AlertRuleStatus.Enable ?('已启动'):('未启动')}
               style={{color:record.disabled === AlertRuleStatus.Enable ?('green'):('gray')}}
               onClick={e=>{
                

              }}/> 
            <Link
              to={{
                pathname: `/alert-rules/edit/${record.id}?mode=clone`,
              }}
              target='_blank'
            >
              <FileProtectOutlined />
            </Link>
            <FileSearchOutlined />
            <FundOutlined />
            <EditOutlined />       

            <DeleteOutlined onClick={() => {
              Modal.confirm({
                title: t('common:confirm.delete'),
                onOk: () => {
                  
                },

                onCancel() {},
              });
            }} />
            
          </Space>
      ),
    },
  ];


  const [selectColum, setSelectColum] = useState<any[]>()
  function handelShowColumn(checkedValues) {
    let showColumns = new Array();
    choooseColumns.forEach(item => {
      if (checkedValues.includes(item.title)) {
        showColumns.push(item)
      }
    });
    setSelectColum(baseColumns.concat(showColumns).concat(fixColumns));
  }
  useEffect(() => {
      setSecondAddButton(false)
      getAssetsStypes().then((res) => {
        const items = res.dat.map((v) => {
            return {
              id: v.name,
              name: v.name,
              ...v,
            };
          })
          .filter((v) => v.name !== '主机'); //探针自注册的不在前台添加
          let treeData: any[] = [{
            id: 0,
            name: '全部监控',
            count: 0,
            children: items
          }];
          setTreeData(_.cloneDeep(treeData));
      });
      setSelectColum(baseColumns.concat(choooseColumns).concat(fixColumns));
  },[]);


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
  //   getAssetsByCondition(param).then((res) => {
  //       setList(res.dat.list);
  //       setTotal(res.dat.total)
  //   });
  // };

  const pupupContent = (
    <div>
      <Checkbox.Group
        defaultValue={defaultValues}
        style={{ width: '100%' }}
        onChange={handelShowColumn}
      >
        {
          choooseColumns.map(item => (
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
  const showModal = (action:string,data:any) => {
    if(action=="add"){
       history.push('/xh/monitor/add?type=asset&id='+0);   
    }else if(action=="view"){  
       history.push('/xh/monitor/add?type=view&id='+data);    
    }else if(action=="monitor"){  
      history.push('/xh/monitor/add?type=monitor&id='+data);    
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
  return (
    <PageLayout icon={<GroupOutlined />} title={'资产管理'}>
      <div style={{ display: 'flex' }} className='monitor_list_view'>
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
            expandAll={true}
            addButton={secondAddButton}
            addMenu={true}
            handleClick={async (key: any, node: any, type) => {
              console.log("点击的事件参数为", key, node, type)
              if (type == "query") {
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
                  suffix={<SearchOutlined />}
                  placeholder={'模糊检索表格内容,多个关键字用空格分隔'}
                />
              </div>
            </Space>
            <div className='tool_right'>
              <div>
                <Button className='tool_right_btn'
                  onClick={() => {
                    showModal("add",null)
                  }}
                  type='primary'
                >
                  {t('新增')}
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    showModal("view",1)
                  }}
                  type='primary'
                >
                  {t('查看配置')}
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    showModal("monitor",1)
                  }}
                  type='primary'
                >
                  {t('查看监控')}
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
          <div className='monitor-list' style={{ width:'100%' }}>
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
