import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Tabs, Select, Form, Row, Col, DatePicker, TreeSelect, Checkbox, Popover } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CaretDownOutlined, DownOutlined, DownloadOutlined, EditOutlined, GroupOutlined, OneToOneOutlined, SearchOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons';
import moment from 'moment';
import { CommonStateContext } from '@/App';
import Accordion from './Accordion';
import './locale';
import './style.less';
import _, { set } from 'lodash';
import {TableComponent} from 'dynamic-tablelist-colums';
// import Add from './Add';
import { getAssetsTree, getAssetsListByFilter, deleteDeviceOnline, getAssetById, exportTemplet } from '@/services/assets/asset'
import { getDataCenterList } from '@/services/assets/data-center'
import { getAssetTreeBelongId } from '@/services/assets/asset-tree';
import { Link, useHistory } from 'react-router-dom';
import { OperationModal } from './Form/OperationModal';
import CommonModal from '@/components/CustomForm/CommonModal';
// export { Add };
import { getDictValueEnum } from '@/services/system/dict';
import { getDeviceType } from '@/services/assets/deviceType';
import SetMgt from './SetMgt';
import DataCenter from './DataCenter';
import { useAntdTable, useToggle } from 'ahooks';
import { getOrganizationTree } from '@/services/assets';
import { getRoomList } from '@/services/assets/computer-room';
import { getCabinetList } from '@/services/assets/device-cabinet';
import { getUsers } from '@/services/account';
import { getDeviceModelById } from '@/services/assets/device-models';
import { SetConfigTables, SetConfigForms } from './catalog'
import { getProducerList } from '@/services/assets/producer';
import { getScrapList ,addScrap} from '@/services/assets/device-scrap';

import { OperateType, SetOperateTypes, AssetStatusUtils } from './Form/operate_type';
import { Fragment } from 'react';

//初始化选项数据【key=value】
const optionMap = {};


export default function () {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  //原始默认选中的value值
  
  const [list, setList] = useState<any[]>([]);
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any>();
  const [searchVal, setSearchVal] = useState('');
  const [deviceTypeOption, setDeviceTypeOption] = useState<any[]>();
  const [dataCenterOption, setDataCenterOption] = useState<any[]>();
  const [statistic, setStatistic] = useState({});
  const [leftNavData, setLeftNavData] = useState<any>({
     status:0,
     index:0
  });
  const [query, setQuery] = useState({})
  const [states, { set }] = useToggle(true)
  const [initData, setInitData] = useState({});
  const [randomId, setRandomId] = useState<string>();

  const searchParams = new URLSearchParams(window.location.search);

  const [modalWidth, setModalWidth] = useState<number>(650)
  const [refreshFlag, setRefreshFlag] = useState<string>("");
  const [refreshLeftTreeFlag, setRefreshLeftTreeFlag] = useState<string>(_.uniqueId('refresh_left'));
  const [modelMap, setModelMap] = useState({});

  const [props, setProps] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});



  //全部设备、已上线设备、待上线设备、已下线设备
  const assetTableColumns =[
    {
      title: '管理IP',
      dataIndex: 'management_ip',
    },
    {
      title: '设备名称',
      dataIndex: 'device_name',
    },
    {
      title: '序列号',
      dataIndex: 'serial_number',
    },
    {
      title: '型号',
      dataIndex: 'device_model',
      render(val) {
        if (modelMap[val] != null) {
          return modelMap[val].name;
        }
      }
    },
    {
      title: '设备类型',
      dataIndex: 'device_type',
      render(val) {
        let deviceName = val;
        deviceTypeOption?.forEach((option) => {
          if (option.value == val) {
            deviceName = option.label;
          }
        })
        return deviceName;
      }
    },
    {
      title: '纳管状态',
      dataIndex: 'managed_state',
      render(val) {
        return '未定义来源';
      },
    },
    {
      title: '操作',
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
   ];

  //已报废的设备
  const scrapTableColumns = [
    {
      title: t('报废日期'),
      dataIndex: 'scrap_at',
    },
    {
      title: t('序列号'),
      dataIndex: 'serial_number',
    },
    {
      title: t('设备名称'),
      dataIndex: 'device_name',
    },
    {
      title: t('原管理IP'),
      dataIndex: 'old_management_ip',
    },
    {
      title: t('厂商'),
      dataIndex: 'device_producer',
    },
    {
      title: t('型号'),
      dataIndex: 'device_model',
      render(val) {
        if (modelMap[val] != null) {
          return modelMap[val].name;
        }
      }
    },
    {
      title: t('设备类型'),
      dataIndex: 'device_type',
      render(val) {
        let deviceName = val;
        deviceTypeOption?.forEach((option) => {
          if (option.value == val) {
            deviceName = option.label;
          }
        })
        return deviceName;
      }
    },
    {
      title: t('所属部门'),
      dataIndex: 'old_belong_organization',
      render(val) {
        return val;
      },
    },
    {
      title: t('报废说明'),
      dataIndex: 'remark',
      render(val) {
        return val;
      },
    },
  ]


  const [selectColum,setSelectColum]=useState(assetTableColumns)


  // 展开显示全部标签
  const handlerAll = (val: boolean) => {
    set(!val)
  }

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
    loadingChoosedColumn(assetTableColumns,[...res]);  
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
    console.log('getTableData', params)

    if (leftNavData.status > 3) {
      delete query["DEVICE_STATUS"];
      return getScrapList({
        ...params,
        ...query,
      }).then((res) => {
        let modelIds  =Array.from(new Set(res.dat.list.map(obj => obj.device_model)))        
        modelIds.forEach((modelId,_) => {
          getDeviceModelById(modelId).then(({dat}) => {
            modelMap[dat.id] = dat;
            setModelMap({...modelMap})
            console.log(modelMap)
           });
        })
        

        return {
          total: res.dat.total,
          list: res.dat.list,
        };
      });
    } else {
      return getAssetsListByFilter({
        ...params,
        ...query,
      }).then(({dat}) => {        
        if(dat.list!=null && dat.list.length>0) {
          let modelIds = Array.from(new Set(dat.list.map(obj => obj.device_model)))
          modelIds.forEach((modelId, _) => {
            getDeviceModelById(modelId).then(({ dat }) => {
              modelMap[dat.id] = dat;
              setModelMap({ ...modelMap })
              console.log(modelMap)
            });
          })
        }
        if(dat.statistics!=null){
          for(let item in dat.statistics){
            statistic["status_" + item] =dat.statistics[item];
          }
          setStatistic(statistic);
        }
        return {
          total: dat.total,
          list:  dat.list,
        };
      });
    }


  };

  //导出数据
  const exportDatas = async (businessForm) => {
    let data = {};
    let url = businessForm.url;
    console.log("exportDatas",businessForm);
    if (businessForm.businessId == "scrap_set") {
        url = "/api/n9e/device-scrap/export-xls";
        if(selectedRowKeys!=null && selectedRowKeys.length>0){
          data = {...query,ids:selectedRowKeys}
        }else{
          data = {...query}
        }        
    }
    
    exportTemplet(url, data).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res],
        // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式                          
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      const fileName = businessForm.title + "_" + moment().format('MMDDHHmmss') + ".xls" 
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  }

  const { tableProps } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    refreshDeps: [query, refreshFlag],
  });

  useEffect(() => {
    //过滤状态 来源数据字典
    getDictValueEnum('asset_filter_status').then((data) => {
      setDeviceStatusOptions(data);
    });
    getDictValueEnum('scrap_query_filter').then((data) => {
      setScrapStatusOptions(data);
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
        initData["device_type"] = opts;
        setInitData({ ...initData });
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
    getProducerList().then(({ dat }) => {
      var roomList = new Array()
      console.log("getProducerList", dat)
      dat.list?.forEach((item) => {
        roomList.push({
          value: item.id,
          label: item.alias
        });
      })
      optionMap["producers"] = roomList;
    });
    getRoomList({}).then(({ dat }) => {
      var roomList = new Array()
      dat.list?.forEach((item) => {
        roomList.push({
          value: item.id,
          label: item.room_name
        });
      })
      optionMap["rooms"] = roomList;
    });
    getOrganizationTree({}).then(({ dat }) => {
      optionMap["organs"] = dat;
      initData["old_belong_organization"] = dat;
      setInitData({ ...initData });
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


  }, []);

  

  
  useEffect(() => {
   
    setRefreshFlag(_.uniqueId('refresh_flag'))
    if (leftNavData.status == 4) {
      getAssetsTree(leftNavData.status).then(({ dat }) => {
        initData["tree"] = dat;
        setInitData({ ...initData });
      })

    }


  }, [leftNavData.status]);


  const submitQuery = async (values: any) => {
    let params = { ...query, ...values };
    setQuery(params);
  }

  const onSelectChange = (selectedRowKeys, rows) => {
    console.log("onSelectChange", selectedRowKeys)
    setSelectedRows(rows);
    console.log("rows", rows)
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

  const FormOnChange = (values, item) => {
    console.log("FormOnChange", item, businessForm);
    if (businessForm["businessId"] == "scrap_set") {
      let itemKey = "";
      for (var key in item) {
        itemKey = key;
      }
      if (itemKey == "serial_number" || itemKey == "old_management_ip") {
        let params = {
          page: 1,
          limit: 1000,
        }
        if(values["serial_number"]!=null) {
          params["serial_number"] = values["serial_number"];
        }
        if(values["old_management_ip"]!=null) {
          params["management_ip"] = values["old_management_ip"];
        }
        getAssetsListByFilter(params).then(({ dat }) => {
          console.log("返回的数据有", dat.list)
          if (dat.list != null) {
            let item = dat.list[0];
            values["device_name"]=item.device_name
            values["old_belong_organization"]=item.affiliated_organization;
            values["device_type"]=item.device_type;  
            values["device_producer"]=item.device_producer;
            values["device_model"]=""+item.device_model;           
          }else{
            values["device_name"] ="";
            values["old_belong_organization"]= null;
            values["device_type"]= null;
            values["device_producer"]= null;
            values["device_model"]=null;  
          }
          setFormData(values);
        })
      }

    }

  }

  const dealFieldsToForm = (businessId) => {
    //处理中文和每个表单每个块要提交的字段名称+类型
    let fieldMap = new Map();
    let items = SetConfigForms[businessId].Form.items;
    items.map((item, index) => {
      fieldMap.set(item.name,{
        name_cn :item.label,
        data_type:item.data_type?item.data_type:"string"
      })
    })
    let groups = SetConfigForms[businessId].Form.groups;
    groups?.map((group, index) => {
      group.items.map((item, index) => {
        fieldMap.set(item.name,{
          name_cn :item.label,
          data_type:item.data_type?item.data_type:"string"
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
  const formSubmit = (values, businessForm, action) => {
    let currentID = businessForm.businessId;
    let fields =dealFieldsToForm(currentID); 
    console.log("_Submit", values, businessForm);
    let submitFieldMap = new Map(); 
    for (let item in values) {
      let value =  datalDealValue(values[item],fields.get(item).data_type);
      if(value){
        submitFieldMap.set(item,value)
      }
    }
    console.log("提交数据",businessForm,values);
    if (businessForm["businessId"] == "scrap_set") {      
      addScrap(Object.fromEntries(submitFieldMap)).then((result) => {
          message.success('修改成功');
          businessForm.isOpen = false;
          setBusinessForm(businessForm)
          setRefreshFlag(_.uniqueId('refresh_flag'))
      });
    }
  }

  return (
    <PageLayout icon={<GroupOutlined />} title={t('title')} >
      <Tabs className='tab_list_1' style={{ marginTop: "-55px" }} >
        <Tabs.TabPane tab={t('设备资产')} key='assetlist'>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '400px', display: 'list-item' }}>
              <Accordion
                   assetStatus={AssetStatusUtils}
                   isAutoInitialized={true}
                   refreshFlag ={refreshLeftTreeFlag}
                   handleClick={async (value: any,status,index:any) => {
                    console.log("handle", value)
                    var query = value.query != null ? { ...eval(value.query), tree_id: value.id } : '{}'
                    leftNavData["status"] = status;
                    leftNavData["index"] = index;
                    if (value.type === 'asset') {
                      getAssetById(query.ID).then(({ dat }) => {
                        window.location.href = "/devicemgt/add/" + dat.device_type + "?id=" + query.ID + "&index=" + leftNavData.index + "&status=" + leftNavData.status;
                      })
                    } else {
                      if (status > 0) {
                        // debugger
                        setQuery(query);
                      } else {
                        setQuery({});
                      }
                      setRefreshFlag(_.uniqueId('refresh_flag'))
                    }
                    setLeftNavData(leftNavData);                    
                   }}             
              
              />
            </div>

            <div className='table-content'>

              {leftNavData.status == 0 && ( //全部设备
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
                <Form onFinish={submitQuery} layout="inline" labelAlign="left" className='query_form'>
                  <Row className='row-spe'>
                    {leftNavData.status >= 0 && leftNavData.status <=3  &&  (
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
                    )}
                    {leftNavData.status==4  &&  (
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
                    )}
                    <Col span={4}>
                      <Form.Item name="datacenter_id">
                        <Select
                          showSearch
                          allowClear={true}
                          placeholder="请选择数据中心"
                          optionFilterProp="children"
                          options={dataCenterOption}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="equipment_room" >
                        <Select
                          showSearch
                          placeholder="请选择机房"
                          removeIcon={true}
                          optionFilterProp="children"
                          onChange={value => {
                            getCabinetList(value).then((res) => {
                              let cabinetList = new Array()
                              res.dat.forEach((item) => {
                                cabinetList.push({
                                  value: item.id,
                                  label: item.cabinet_code
                                });
                              })
                              optionMap["cabinets"] = cabinetList;
                            })
                          }}
                          options={optionMap["rooms"]}
                        />
                      </Form.Item>
                    </Col>
                    {leftNavData.status >= 0 && leftNavData.status <=3  &&  (
                    <Col span={4}>
                      <Form.Item name="device_type">
                        <Select
                          showSearch
                          allowClear={true}
                          placeholder="请选择设备类型"
                          options={deviceTypeOption}
                        /></Form.Item>
                    </Col>
                    )}
                    <Col span={6}>
                      <Form.Item name="query" label="搜索" labelAlign='right' className='input_query'>
                        <Input
                          className={'searchInput'}
                          value={searchVal}
                          allowClear
                          style={{ width: '200px' }}
                          onChange={(e) => setSearchVal(e.target.value)}
                          suffix={<SearchOutlined />}
                          placeholder={(leftNavData.status >= 0 && leftNavData.status <=3)?'输IP/名称/序列号/厂商/关联业务/备注/RAID级别/MA':"输IP/名称/序列号/厂商型号/资产编号"}
                          
                        /></Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>查询</Button>
                        {leftNavData.status > 0 && leftNavData.status < 4 && (
                          <Button style={{ marginLeft: '10px' }} onClick={() => handlerAll(states)}> {states ? '更多▲' : '收起▽'}</Button>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row hidden={states} className='row-spe'>
                    <Col span={4}>
                      <Form.Item name="device_producer" className='input_query'>
                        <Select
                          showSearch
                          placeholder="选择厂商"
                          allowClear={true}
                          options={optionMap["producers"]}
                        /></Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="finish_at" label=" " style={{ marginLeft: "20px" }} colon={false} className='input_query'>
                        <DatePicker allowClear placeholder={`请输入维保结束日`} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="manager"   >
                        <Select
                          showSearch
                          placeholder="选择责任人"
                          allowClear={true}
                          options={optionMap["system_users"]}

                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="owning_cabinet"   >
                        <Select
                          showSearch
                          placeholder="选择机柜"
                          allowClear={true}
                          options={optionMap["cabinets"]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="affiliated_organization" className='input_query' >
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
              </div>
              <div className='assets-list_1'>
                <div className='operate-container' >
                  <Fragment>
                   {leftNavData.status >= 0 && leftNavData.status >= 0 && (
                  <div className='biz-oper-action'>
                    <Space>
                      <Dropdown
                        trigger={['click']}
                        overlay={
                          <Menu
                            style={{ width: '100px' }}
                            onClick={({ key }) => {
                              let operates = "changeOrganize,changeRoom,createdCode,changeResponsible,changeDept";
                              if (key == OperateType.DeleteAssets) {
                                if (selectedRowKeys.length <= 0) {
                                  message.warning("请选择要批量操作的设备")
                                  return
                                } else {

                                  Modal.confirm({
                                    title: "确认要删除吗",
                                    onOk: async () => {
                                      let rows = selectedRowKeys?.map((item) => parseInt(item));
                                      deleteDeviceOnline(rows).then(res => {
                                        message.success("删除成功！");
                                        setRefreshFlag(_.uniqueId('refreshFlag_'));
                                      })
                                    },
                                    onCancel() { },
                                  });
                                }
                                // assetBatchExport
                              } else if (key == OperateType.SelectDeviceType) {
                                setSelectedRows(deviceTypeOption);
                                setModalWidth(650);
                                setOperateType(key as OperateType);
                              } else if (key == OperateType.AssetBatchExport) {
                                if (selectedRowKeys.length <= 0) {
                                  message.warning("请选择要批量操作的设备")
                                  return
                                } else {
                                  message.error("开发中")
                                }
                              } else if (key == OperateType.NetConfigExport) {
                                let url = "/api/n9e/asset-expansion/netconfig/export-xls";
                                let exportTitle = "网络配置"
                                let params = {
                                    status: parseInt(leftNavData.status)
                                }
                                exportTemplet(url, params).then((res) => {
                                  const url = window.URL.createObjectURL(new Blob([res],
                                    // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式                          
                                    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                                  const link = document.createElement('a');
                                  link.href = url;
                                  const fileName = exportTitle + "_" + moment().format('MMDDHHmmss') + ".xls"
                                  link.setAttribute('download', fileName);
                                  document.body.appendChild(link);
                                  link.click();
                                });

                                return
                              } else if (key == OperateType.AddScrap) {
                                //添加报废表单数据
                                setFormData({});
                                console.log("initialized data", initData);
                                businessForm.isOpen = true;
                                businessForm.operate = "添加-";
                                businessForm.businessId = "scrap_set";
                                setBusinessForm(_.cloneDeep(businessForm));
                                let business:any = SetConfigForms["scrap_set"];
                                business.Modal.width = 650;
                                business.Modal.cancel = ()=> {
                                  businessForm.isOpen = false;
                                  setBusinessForm(_.cloneDeep(businessForm))
                                };
                                business.Modal.submit = (values) => {
                                  formSubmit(values, businessForm, "add")
                                };
                                setProps(business);
                              } else if (key == OperateType.ExportScrap) {
                                let businessForm = {
                                   url:'/api/n9e/device-model/outport',
                                   title:'报废记录',
                                   businessId:'scrap_set',
                                }
                                exportDatas(businessForm)
                              } else {
                                console.log("selectedAssetRows", selectedRowKeys)
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
                            items={SetOperateTypes["status_" + leftNavData.status]["batch_operations"]}
                          >

                          </Menu>
                        }
                      >
                        <Button>
                          {t('批量操作')} <DownOutlined />
                        </Button>
                      </Dropdown>
                      {SetOperateTypes["status_" + leftNavData.status]["flow_operations"].length > 0 && (
                        <Dropdown
                          trigger={['click']}
                          overlay={
                            <Menu
                              style={{ width: '100px' }}
                              onClick={({ key }) => {
                                if (selectedRowKeys.length <= 0) {
                                  message.warning("请选择要批量操作的设备")
                                  return
                                }
                                if (key === OperateType.Online) {
                                  setModalWidth(1050);
                                  setOperateType(key as OperateType);
                                } else if (key === OperateType.Offline) {
                                  //离线处理
                                  setModalWidth(650);
                                  let offlineInit = {};
                                  console.log("offline init: " + offlineInit)
                                  getAssetsTree(leftNavData.status).then(({ dat }) => {
                                    console.log("查询当前资产所属的树   ")
                                    offlineInit["init_tree_data"] = dat;
                                    offlineInit["init_asset_id"] = dat;
                                    offlineInit["selected_asset_id"] = selectedRowKeys;
                                    getAssetTreeBelongId(selectedRowKeys).then(({ dat }) => {
                                      let ids = new Array<number>();
                                      dat.forEach((item) => {
                                        ids.push(item.id);
                                      });
                                      offlineInit["init_catalog_id"] = ids;
                                      setSelectedRows(offlineInit);
                                      setOperateType(key as OperateType);
                                    })


                                  })

                                }
                              }}

                              items={SetOperateTypes["status_" + leftNavData.status]["flow_operations"]}
                            ></Menu>
                          }
                        >
                          <Button>
                            {t('流程操作')} <DownOutlined />
                          </Button>
                        </Dropdown>
                      )}
                    </Space>
                  </div>
                   )}
                   </Fragment>
                   {leftNavData.status <4 && leftNavData.status >= 0 && (
                   <Popover placement="bottom" content={pupupContent} trigger="click" className='filter_columns' >
                     <Button style={{marginRight: '10px'}} icon={<UnorderedListOutlined />}>字段筛选</Button>
                   </Popover>
                   )}
                </div>
                
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
                  rowSelection={rowSelection}
                  columns={ scrapTableColumns}//leftNavData.status < 4 ? selectColum :
                  rowKey='id'
                  size='small'

                  
                ></Table>
                {/* <TableComponent
                    columns={leftNavData.status < 4 ? assetTableColumns : scrapTableColumns}
                    dataSource={getTableData}
                    total={listTotal}
                    size={listSize}
                    defaultCurrent={current}
                    current={current}
                    paginationChange={paginationChange}
                  /> */}
                <OperationModal
                  operateType={operateType}
                  width={modalWidth}
                  theme={''}
                  setOperateType={setOperateType}
                  initData={selectedRows}
                  reloadList={async (value: any, operateType: string) => {

                    if(operateType=='changeCatalog'){
                      setRefreshLeftTreeFlag(_.uniqueId('refresh_left'))
                    }
                    setRefreshFlag(_.uniqueId('refreshFlag_'));
                    onSelectNone();
                  }}
                />
              </div>
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('数据中心')} key='datalist'>
          <DataCenter></DataCenter>
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
      <CommonModal
        Modal={props.Modal}
        Form={props.Form}
        initial={initData}
        FormOnChange={FormOnChange}
        defaultValue={formData}
        id={randomId}
        operate={businessForm.operate}
        isOpen={businessForm.isOpen} >
      </CommonModal>
    </PageLayout>
  );
}
