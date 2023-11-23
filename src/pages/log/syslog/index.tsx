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
const { RangePicker } = DatePicker;
import { getSysLogListBasedOnSearch } from '@/services/syslog';

export default function () {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [refreshFlag, setRefreshFlag] = useState<string>("");
  const [query, setQuery] = useState({})
  const [filterType, setFilterType] = useState<string>("");
  const [filterParam, setFilterParam] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");
  const [searchVal, setSearchVal] = useState<any>('');
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
    end: 0,
  }); 
  const tableColumns =[
    {
      title: '文件名称',
      dataIndex: 'name',
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      render: (val, record: any) => {
        const date = moment.unix(val);
        const formattedTime = date.format('YYYY-MM-DD HH:mm:ss'); // 使用 format 方法将时间格式化为 24 小时制的时间
        return formattedTime;
      }
    },
    {
      title: '文件大小',
      dataIndex: 'size',
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
  let queryFilter = [
    { name: 'file_name', label: '文件名称', type: 'input' },
  ]

  const [selectColum,setSelectColum]=useState<any>(tableColumns)
  //时间选择框使用
  const onTimeChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    //console.log('Selected Time: ', value);
    if(value==null){
      filter["start"] =0;
      filter["end"] =0;
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

  const getTableData = ({ current, pageSize }): Promise<any> => {
    // debugger
    const params = {
      page: current,
      limit: pageSize,
    };
    if(filterName!=null&&filterName.length>0){
      params["filter"]=filterName;
      //console.log("FFFFFFFFFF",filterName)
    }
    if (searchVal != null && searchVal.length > 0) {
      console.log("searchVal",searchVal)
      params["query"] = searchVal;
    }
    if(filter!=undefined&&filter!=null&&filter["end"]!=0){
      //console.log("filter",filter)
      params["start"]=filter["start"];
      params["end"]=filter["end"];
    }
    //console.log('getTableData', params);
    return getSysLogListBasedOnSearch({
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



  return (
    <PageLayout icon={<GroupOutlined />} title={'系统日志'} >
      
            <div className='table-content'>


              <div className='table-header'>
                <Form  layout="inline" labelAlign="left" className='query_form'>
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
                          // options={}
                          onChange={(val) => setSearchVal(val)}
                          placeholder={'选择要查询的条件'}
                        />
                      )}
                    </Col>     

                    
                    <Button className='btn' type="primary" style={{right:'0',position:'absolute',marginRight:'16px'}}   onClick={()=>{}}>批量导出
                    </Button>
                                   
                  </Row>
                </Form>
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
