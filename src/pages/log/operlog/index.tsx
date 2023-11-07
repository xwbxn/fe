import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Tabs, Select, Form, Row, Col, DatePicker, TreeSelect, Checkbox, Popover } from 'antd';
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


export default function () {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [refreshFlag, setRefreshFlag] = useState<string>("");
  const [query, setQuery] = useState({})
  //全部设备、已上线设备、待上线设备、已下线设备
  const tableColumns =[
    {
      title: '日志编号',
      dataIndex: 'management_ip',
    },
    {
      title: '系统模块',
      dataIndex: 'device_name',
    },
    {
      title: '操作类型',
      dataIndex: 'serial_number',
    },
    {
      title: '操作人员',
      dataIndex: 'device_model',
      render(val) {
       
      }
    },
    {
      title: '操作地址',
      dataIndex: 'device_type',
      render(val) {      
        return val;
      }
    },
    {
      title: '操作地点',
      dataIndex: 'managed_state',
      render(val) {
        return '未定义来源';
      },
    },
    {
      title: '操作状态',
      width: '180px',
      align: 'center',
      render: (val, record: any) => {
        return val;
      }
    },
    {
      title: '操作时间',
      width: '180px',
      align: 'center',
      render: (val, record: any) => {
        return val;
      }
    },
    {
      title: '操作',
      width: '180px',
      align: 'center',
      render: (val, record: any) => {
        return val;
      }
    },
   ];


  const [selectColum,setSelectColum]=useState<any>(tableColumns)


  const [deviceStatusOptions, setDeviceStatusOptions] = useState<any>([]);
  const [scrapStatusOptions, setScrapStatusOptions] = useState<any>([]);

  const initialColumn = [
    {name: '管理IP', checked: true, value: 0},{name: '设备名称', checked: true, value: 1},
    {name: '序列号', checked: true, value: 2},{name: '型号', checked: true, value: 3},
    {name: '设备类型', checked: true, value: 4},{name: '纳管状态', checked: true, value: 5},
    {name: '操作', checked: true, value: 6}
  ];

  const [showColumn, setShowColumn] = useState(initialColumn);
  function handelShowColumn(checkedValues) {
    let res = initialColumn;
    res.forEach(item => {
        item.checked = checkedValues.includes(item.value);
    });
    setShowColumn([...res]);  
    loadingChoosedColumn(tableColumns,[...res]);  
  }
  
  const loadingChoosedColumn =(tableColumns,showColumns)=>{
    let showColumnMap = new Map();
    showColumns.forEach((item)=>{
        if(item.checked){
          showColumnMap.set(item.name,item.value);
        }
    });
    console.log("showColumnMap",showColumnMap);
    let showColumn = new Array();
    tableColumns.forEach((column)=>{
      if(showColumnMap.has(column.title)){
        showColumn.push(column);
      }
    });
    setSelectColum(showColumn);
  };



  const pupupContent = (
    <div>
        <Checkbox.Group
            defaultValue={[0,1,2,3,4,5,6]}
            style={{ width: '100%' }}
            onChange={handelShowColumn}
        >
        {
            showColumn.map(item => (
                <Row key={item.value} style={{ marginBottom: '5px' }}>
                    <Col span={24}>
                        <Checkbox value={item.value}>{item.name}</Checkbox>
                    </Col>
                </Row>
            ))
        }
        </Checkbox.Group>
    </div>
);

 

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const getTableData = ({ current, pageSize }): Promise<any> => {
    // debugger
    const params = {
      page: current,
      limit: pageSize,
    };
    console.log('getTableData', params);
      return getScrapList({
        ...params
      }).then((res) => {
        // let modelIds  =Array.from(new Set(res.dat.list.map(obj => obj.device_model)))
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
  }, []);



  return (
    <PageLayout icon={<GroupOutlined />} title={'操作日志'} >
      
            <div className='table-content'>


              <div className='table-header'>
                <Form  layout="inline" labelAlign="left" className='query_form'>
                  <Row className='row-spe'>
                    <Col span={4} >
                      <Form.Item label="过滤器" name="filter" className='input_query'>
                        <Select
                          showSearch
                          style={{ width: '125px' }}
                          placeholder="请选择过滤条件"
                          allowClear={true}
                          optionFilterProp="children"
                          onChange={onChange}
                          options={deviceStatusOptions}

                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={4} >
                      <Form.Item label="过滤器" name="filter" className='input_query'>
                        <Select
                          showSearch
                          style={{ width: '125px' }}
                          placeholder="请选择过滤条件"
                          allowClear={true}
                          optionFilterProp="children"
                          onChange={onChange}
                          options={scrapStatusOptions}

                        />
                      </Form.Item>
                    </Col>
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
