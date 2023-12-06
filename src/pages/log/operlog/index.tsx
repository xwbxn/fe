import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Tabs, Select, Form, Row, Col, DatePickerProps, TreeSelect, Checkbox, Popover } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CaretDownOutlined, DownOutlined, DownloadOutlined, EditOutlined, GroupOutlined, OneToOneOutlined, SearchOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons';
import moment from 'moment';
import { CommonStateContext } from '@/App';
import './style.less';
import _, { set } from 'lodash';
// import Add from './Add';
import { getAssetsTree, getAssetsListByFilter, deleteDeviceOnline, getAssetById, exportTemplet } from '@/services/assets/asset'
import { Link, useHistory } from 'react-router-dom';
import { useAntdTable, useToggle } from 'ahooks';
import { getScrapList ,addScrap} from '@/services/assets/device-scrap';
import DatePicker, { RangePickerProps } from 'antd/es/date-picker';
import { getLogListBasedOnSearch } from '@/services/operlog';
import { file } from 'jszip';
const { RangePicker } = DatePicker;
export default function () {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_flag'));
  const [query, setQuery] = useState({})
  const [searchVal, setSearchVal] = useState<any>('');
  const [logInfo, setLogInfo] = useState<any>({});
  const [status, setStatus] = useState<number>();
  const [filterType, setFilterType] = useState<string>("");
  const [filterParam, setFilterParam] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");
  
  const modelOptions=[
  {label:"资产",value:"资产模块"},{label:"监控",value:"监控模块"},
  {label:"用户配置",value:"用户配置模块"},{label:"告警",value:"告警模块"},
  {label:"用户信息",value:"用户信息模块"},
  {label:"接口管理",value:"接口管理模块"},{label:"登录",value:"登录模块"},
  {label:"许可管理",value:"许可管理模块"}
  ];
  // const statusOptions =[
  //   {label:"类型",value:1},{label:"对象",value:2},
  //   {label:"用户",value:4},{label:"描述",value:3}]; 
  const [filter, setFilter] = useState<any | {
    group?: number;
    severity?: number;
    query: string;
    start: number;
    end: number;
    type: any | number;
  }>({
    query: '',
    type: null,
    start: 0,
    end: -1,
  });  
  let queryFilter = [
    { name: 'id', label: '日志编号', type: 'input' },
    { name: 'object', label: '系统模块', type: 'select' },
    { name: 'type', label: '操作类型', type: 'input' },
    { name: 'user', label: '操作人员', type: 'input' },
  ]
  const tableColumns =[
    {
      title: '类型',
      align: 'center',
      dataIndex: 'type',
      ellipsis: true,
    },
    {
      title: '对象',
      align: 'center',
      dataIndex: 'object',
      ellipsis: true,
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '用户',
      align: 'center',
      dataIndex: 'user',
      ellipsis: true,
    },
    {
      title: '时间',
      align: 'center',
      dataIndex: 'oper_time',
      ellipsis: true,
    },
    {
      title: '操作',
      width: '180px',
      align: 'center',
      render: (val, record: any) => {
        return (
          <a onClick={() => {}}  target='_blank'>
            导出
          </a>
        );
      }
    },
   ];


  const [selectColum,setSelectColum]=useState<any>(tableColumns)
  const getTableData = ({ current, pageSize }): Promise<any> => {
    // debugger
    const params = {
      page: current,
      limit: pageSize,
    };
    if (searchVal != null && searchVal.length > 0) {
      //console.log("searchVal",searchVal)
      params["query"] = searchVal;
      //console.log("query",searchVal)
    }
    //console.log("FFFFFFFFFF",filterName)
    if(filterName!=null&&filterName.length>0){
      params["filterType"]=filterName;
      //console.log("FFFFFFFFFF",filterName)
    }
    // if(status!=undefined&&status>0){
    //   //console.log("status",status)
    //   params["filterType"] = status;
    // }
    if(filter!=undefined&&filter!=null){
      //console.log("filter",filter)
      params["start"]=filter["start"];
      params["end"]=filter["end"];

    }

    //console.log('getTableData', params);
    return getLogListBasedOnSearch({
      ...params
    }).then((res) => {
      // let modelIds  =Array.from(new Set(res.dat.list.map(obj => obj.device_model)))
      //console.log("AAAAAAAAAAAAAAAAA",res)
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
      setRefreshFlag(_.uniqueId('refresh_flag'))
  }, [searchVal]);

  const onStatusChange = (e) => {
    let val = e;
    setStatus(val!=null?val:null);
    //console.log("SSSSSSSSSSSS",status)
    setRefreshFlag(_.uniqueId('refresh_flag'));
  };
  //时间选择框使用
  const onTimeChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    //console.log('Selected Time: ', value);
    if(value==null){
      filter["start"] =0;
      filter["end"] =-1;
      setFilter({ ...filter });
      setRefreshFlag(_.uniqueId('refresh_'));
    }
    //console.log('Formatted Selected Time: ', dateString);
  };
  //时间选择框使用
  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value'] | any) => {
    //console.log('onOk: ', value);
    value?.forEach((element, index) => {
      if (index == 0 && element != null) {
        filter["start"] = moment(element).unix()
        setFilter({ ...filter });
      }
      if (index == 1 && element != null) {
        filter["end"] = moment(element).unix()
        setFilter({ ...filter });
      }
    });
    setRefreshFlag(_.uniqueId('refresh_'));
  };

  return (
    <PageLayout icon={<GroupOutlined />} title={'操作日志'} >
      
            <div className='table-content'>
              <div className='table-header'>
                
                  <Row className='row-spe'>
                    <Col span={3}>
                      <Select
                      // defaultValue="lucy"
                      placeholder="选择过滤器"
                      style={{ width: 120 }}
                      allowClear
                      onChange={(value) => {
                        queryFilter.forEach((item) => {
                          if (item.name == value) {
                            setFilterType(item.type);
                            setFilterName(item.name);
                            // console.log("type",item.type);
                            // console.log("name",item.name);
                            // console.log("value",value);
                          }
                        })
                        setFilterParam(value);
                        setSearchVal("")
                      }}>
                      {queryFilter.map((item, index) => (
                        <option value={item.name} key={index}>{item.label}</option>
                      ))
                      }
                    </Select>
                    </Col>
                    {/* <Col span={5} >
                      <Input
                          className={'searchInput'}
                          value={searchVal}
                          onChange={(e) => setSearchVal(e.target.value)}
                          suffix={<SearchOutlined />}
                          // onPressEnter={onSearchQuery}
                          placeholder={'请输入类型/用户/对象/描述'}
                        />
                        </Col>  */}
                    <Col span={7}>
                      <RangePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={onTimeChange}
                        onOk={onOk}
                      /> 
                    </Col>  
                    <Col>
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
                          options={modelOptions}
                          // options={}
                          onChange={(val) => setSearchVal(val)}
                          placeholder={'选择要查询的条件'}
                        />
                      )}
                    </Col>     
                    {/* <Col span={11} >
                    <Select
                      style={{ width: '125px',marginLeft:'10px' }}
                      placeholder="筛选条件"
                      allowClear={true}
                      onChange={onStatusChange}
                      options={statusOptions}
                    />
                    </Col>   */}
                    
                    <Button className='btn' type="primary" style={{right:'0',position:'absolute',marginRight:'16px'}}   onClick={()=>{}}>批量导出
                    </Button>
                                   
                  </Row>
              </div>
              <div className='assets-list_1'>               
                
                <Table
                  {...tableProps}
                  pagination={{
                    ...tableProps.pagination,
                    size: 'small',
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    showTotal: (total) => `Total ${total} items`,
                    showSizeChanger: true,
                  }}
                  onHeaderRow={(columns, index) => {
                    return {
                      onClick: () => {}, // 点击表头行
                    };
                  }}
                  columns={ selectColum}
                  size='small'

                  
                ></Table>
                
              </div>
            </div>
       
    </PageLayout>
  );
}
