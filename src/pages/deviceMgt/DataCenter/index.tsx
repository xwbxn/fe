import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Checkbox, Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Tabs, Select, Card } from 'antd';
import { getProducersListByType, addDeviceProducer, updateDeviceProducer, deleteDeviceProducer } from '@/services/assets/producer';
import { getDeviceModelByCondition, updateDeviceModel, addDeviceModel, deleteDeviceModel } from '@/services/assets/device-models';
import CommonModal from '@/components/CustomForm/CommonModal';
import { addDataCenter, updateDataCenter, deleteDataCenter, getDataCenterById } from '@/services/assets/data-center';
import { addRoom, updateRoom, deleteRoom } from '@/services/assets/computer-room';
import './index.less';
import { getDataCenterList } from '@/services/assets/data-center';
import Accordion from './Accordion';
import CommonForm from "@/components/CustomForm/CommonForm";
import { exportTemplet } from '@/services/assets/asset';
import { SetConfigTables, SetConfigForms } from './Accordion/catalog'
import moment from 'moment';
import _, { deburr, set } from 'lodash';
import { getDictValueEnum, getDictDataExpByType, deleteDictDatas } from '@/services/system/dict';
import { DeleteOutlined, DownOutlined, DownloadOutlined, EditOutlined, OrderedListOutlined } from '@ant-design/icons';
import { v4 as uuid } from 'uuid'
import { OperationModal } from '../Form/OperationModal';
import { OperateType } from '../Form/operate_type';
// import echarts from 'echarts/lib/echarts';
import * as echarts from 'echarts/lib/echarts.js'
import { PieChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
const CheckboxGroup = Checkbox.Group;
import { Responsive, WidthProvider } from "react-grid-layout";
import CommonTable from '@/components/CustomForm/CommonTable';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function () {
  const [tableData, setTableData] = useState<any[]>([]);
  const [props, setProps] = useState<any>({});
  const [roomProps, setRoomProps] = useState<any>({});
  const [formProps, setFormProps] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});

  const [initData, setInitData] = useState({});
  const [randomId, setRandomId] = useState<string>();


  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedAssetRows, setSelectedAssetRows] = useState<any>([]);
  const [refreshLeft, setRefreshLeft] = useState<string>(_.uniqueId('refresh_left'));
  const [theme, setTheme] = useState({});
  const [dataCenterId, setDataCenterId] = useState<number>(0);
  const [dataCenterList, setDataCenterList] = React.useState<any[]>();
  const [dataCenter, setDataCenter] = useState();
  const [type, setType] = useState<string>("data_center")
  const [tabIndex, setTabIndex] = useState<string>("room_view");
  const [tabOperteIndex, setTabOperteIndex] = useState<string>("room_set");
  const [operateFlag, setOperateFlag] = useState<string>("view_mode");
  const [total, setTotal] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const plainOptions = ['显示门', '显示不可用空间', '显示分区'];
  echarts.use([GridComponent]);


  // var layouts = getLayoutsFromSomewhere();
  const generateDOM = (props) => {
    // return _.map(_.range(props.items), function(i) {
    //   return (
    //     <div key={i}>
    //       <span className="text">{i}</span>
    //     </div>
    //   );
    // });
    return [
      <div key={"1"}>
        <span className="text">{"1"}</span>
      </div>,
      <div key={"2"}>
        <span className="text">{"2"}</span>
      </div>,
      <div key={"3"}>
        <span className="text">{"3"}</span>
      </div>
    ];
  }

  const generateLayout = (p: any) => {
    // return _.map(new Array(p.items), function(item, i) {
    //   const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
    //   return {
    //     x: (i * 2) % 12,
    //     y: Math.floor(i / 6) * y,
    //     w: 2,
    //     h: y,
    //     i: i.toString()
    //   };
    // });
    return [
      {
        x: 0, y: 0, w: 1, h: 1,
        i: "1"
      },
      {
        x: 1, y: 0, w: 1, h: 1,
        i: "2"
      },
      {
        x: 0, y: 1, w: 2, h: 2,
        i: "3"
      }
    ];
  }


  useEffect(() => {
    loadDataCenter();
  }, []);


  const queryTable = (value, page, pagesize) => {
    if (page == undefined) {
      page = 1;
      pagesize = 10;
    }
    console.log("查询表单数据", value);
    let query: any = {};


  }

  const loadDataCenter = () => {
    getDataCenterList({}).then(({ dat }) => {
      let dataHasAdd = new Array();
      let datas = new Array();
      if (dat.list?.length > 0) {
        dat.list.forEach((item) => {
          dataHasAdd.push({
            value: item.id,
            label: item.datacenter_name
          });
          datas.push({
            value: item.id,
            label: item.datacenter_name
          });

        })
        initData["idc_location"] = datas;
        setInitData({ ...initData });
      }
      dataHasAdd.push({ value: 0, label: "添加数据中心" });
      setDataCenterList(dataHasAdd);
      console.log("useEffect----datas", dataCenter)
    })
  }

  useEffect(() => {
    const chart1 = document.getElementById("chart1");
    const chart2 = document.getElementById("chart2");
    const myChart_1 = echarts.init(chart1);
    const myChart_2 = echarts.init(chart2)
    const option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'pie',
          radius: ['40%', '70%'],
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    myChart_1.setOption(option);
    myChart_2.setOption(option);
  }, []);



  const dealFieldsToForm = (businessId) => {
    //处理中文和每个表单每个块要提交的字段名称+类型
    let fieldMap = new Map();
    let items = SetConfigForms[businessId].Form.items;
    items.map((item, index) => {
      fieldMap.set(item.name, {
        name_cn: item.label,
        data_type: item.data_type ? item.data_type : "string"
      })
    })
    let groups = SetConfigForms[businessId].Form.groups;
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
  const onRoomChange = (e) => {
    debugger;
  }
  const menuClick = (key,id) => {
    debugger;
  }

  const tabClick = (key) => {
    setTabIndex(key);
    if (key != 'room_view') {
      let roomProps =SetConfigTables[key];
      if(roomProps.Menu){
        roomProps.Menu.ClickFun = (key,id) => {
           menuClick(key,id);
        }
      }
      setRoomProps(roomProps);
      businessForm.businessId = key;
      setBusinessForm(businessForm);
    }

  }
  const tabOperteClick = (key) => {
    setTabOperteIndex(key);    
    if (key == 'room_set') {
      setFormProps(_.cloneDeep(SetConfigForms[key]))
      businessForm.businessId = key;
      setBusinessForm(businessForm);
      console.log("'room_set'",formProps);
    }

  }
  

  const formSubmit = (values, businessForm, action) => {

    let currentID = businessForm.businessId;
    let fields = dealFieldsToForm(currentID);
    console.log("_Submit", values, businessForm);
    let submitFieldMap = new Map();
    for (let item in values) {
      let value = datalDealValue(values[item], fields.get(item).data_type);
      if (value) {
        submitFieldMap.set(item, value)
      }
    }
    console.log("提交数据", businessForm, values);
    if (businessForm.businessId == "data_center_set") {
      if (action == "add") {
        // 
        addDataCenter(Object.fromEntries(submitFieldMap)).then((res) => {
          setRefreshLeft(_.uniqueId('refresh_left'));
          console.log(refreshLeft);
          businessForm.isOpen = false;
          setBusinessForm(businessForm)
          loadDataCenter();
        })
      }
      if (action == "update") {
        let postParams: any = { id: dataCenterId, ...Object.fromEntries(submitFieldMap) };
        updateDataCenter(postParams).then(() => {
          businessForm.isOpen = false;
          setBusinessForm(businessForm)
          loadDataCenter();
        })
      }


    } else if (businessForm.businessId == "room_set") {
      let postParams: any = { idc_location: dataCenterId, ...Object.fromEntries(submitFieldMap) };
      addRoom(postParams).then(() => {
        businessForm.isOpen = false;
        setBusinessForm(businessForm)
      })
    }


  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '383px', display: 'list-item' }}>
        <Accordion
          isAutoInitialized={false}
          refreshLeft={refreshLeft}
          dataCenters={dataCenterList}
          handleClick={async (values: any, dataCenterId, type) => {
            setType(type);
            if (type == "data_center") {
              if (dataCenterId == 0) {
                setFormData(null);
                businessForm.isOpen = true;
                businessForm.operate = "添加-";
                businessForm.businessId = "data_center_set";
                setBusinessForm(_.cloneDeep(businessForm));
                let business = SetConfigForms["data_center_set"];
                business.Modal.width = 650;
                business.Modal.cancel = () => {
                  businessForm.isOpen = false;
                  setBusinessForm(_.cloneDeep(businessForm))
                };
                business.Modal.submit = (values) => {
                  formSubmit(values, businessForm, "add")
                };
                setProps(business);
              } else {
                setDataCenterId(dataCenterId);
                getDataCenterById(dataCenterId).then(({ dat }) => {
                  console.log("获取数据中心详情", dat);
                  setDataCenter(dat)
                })
              }
            } else {
              setOperateFlag("view_mode");
              setTabIndex("room_view")

            }
          }}
        />
      </div>
      <div className='table-content' style={{ marginLeft: "0px" }}>
        {operateFlag == "view_mode" && (
          <Fragment>
            {type === "data_center" && (
              <Fragment>
                <Card title={dataCenter ? dataCenter["datacenter_name"] : "未选中"} className='card_operate' >

                  <div className='assect_total_head'>
                    <div>
                      机房个数：(<span>{0}</span>)
                    </div>
                    <div>
                      设备总数 ：<span>{0}</span>
                    </div>
                    <div>
                      机柜数 ：<span>{0}</span>
                    </div>
                  </div>
                  <div className='asset_total_button'>

                    <Space>
                      <Button type="primary" onClick={() => {
                        setFormData(null);
                        businessForm.businessId = "room_set";
                        businessForm.isOpen = true;
                        businessForm.operate = "添加-";
                        setBusinessForm(_.cloneDeep(businessForm));
                        let business = SetConfigForms["room_set"];
                        business.Modal.width = 800;
                        business.Modal.cancel = () => {
                          businessForm.isOpen = false;
                          setBusinessForm(_.cloneDeep(businessForm))
                        };
                        business.Modal.submit = (values) => {
                          formSubmit(values, businessForm, "add")
                        };
                        setProps(business);

                      }}>
                        {('添加机房')}
                      </Button>
                      <Button type="primary"
                        onClick={() => {
                          let theme = {
                            title: "机柜",
                            businessId: "device-cabinet"
                          }
                          setOperateType(OperateType.AssetSetBatchImport as OperateType);
                          setTheme(theme);
                          businessForm["businessId"] = "device-cabinetr";
                          setBusinessForm(_.cloneDeep(businessForm));
                          console.log("theme", theme);
                        }}
                      >
                        {('导入机柜')}
                      </Button>
                      <Dropdown
                        trigger={['click']}
                        overlay={
                          <Menu
                            style={{ width: '100px' }}
                            onClick={({ key }) => {
                              if (key == "add") {//添加表单弹框
                                setFormData(null);
                                businessForm.isOpen = true;
                                businessForm.operate = "添加-";
                                businessForm.businessId = "data_center_set";
                                setBusinessForm(_.cloneDeep(businessForm));
                                let business = SetConfigForms["data_center_set"];
                                business.Modal.width = 650;
                                business.Modal.cancel = () => {
                                  businessForm.isOpen = false;
                                  setBusinessForm(_.cloneDeep(businessForm))
                                };
                                business.Modal.submit = (values) => {
                                  formSubmit(values, businessForm, "add")
                                };
                                setProps(business);

                              } else if (key == "update") {

                                setFormData(dataCenter);
                                businessForm.isOpen = true;
                                businessForm.operate = "修改-";
                                businessForm.businessId = "data_center_set";
                                setBusinessForm(_.cloneDeep(businessForm));
                                let business = SetConfigForms["data_center_set"];
                                business.Modal.width = 650;
                                business.Modal.cancel = () => {
                                  businessForm.isOpen = false;
                                  setBusinessForm(_.cloneDeep(businessForm))
                                };
                                business.Modal.submit = (values) => {
                                  formSubmit(values, businessForm, "update")
                                };
                                setProps(business);

                              } else if (key == "delete") {
                                if (dataCenterId <= 0) {
                                  message.warning("请选择要删除的数据中心信息")
                                  return
                                } else {
                                  Modal.confirm({
                                    title: "确认要删除吗",
                                    onOk: async () => {
                                      deleteDataCenter(dataCenterId).then(res => {
                                        message.success("删除成功！");
                                        loadDataCenter();
                                      })
                                    },
                                    onCancel() { },
                                  });
                                }
                              }
                            }}
                            items={[
                              { key: "update", label: ('修改数据中心') },
                              { key: "delete", label: ('删除数据中心') },
                              { key: "add", label: ('添加数据中心') }
                            ]}
                          ></Menu>
                        }>
                        <Button>
                          数据中心操作 <DownOutlined />
                        </Button>
                      </Dropdown>
                    </Space>
                  </div>
                </Card>
                <Card title="机房1" className='card_rooms' >

                  <div className='room_left'>
                    <div className='left_1' style={{ marginTop: "20px" }}>
                      <div className='left_label'>
                        <span>全部设备
                          <br />
                          {0}</span>
                      </div>
                      <div className='left_label'>
                        <span>机柜
                          <br />
                          {0}</span>
                      </div>
                      <div className='left_label'>
                        <span>满载机柜
                          <br />
                          {0}</span>
                      </div>
                    </div>
                    <div className='left_1'>

                      <div className='left_label'>
                        <span>可用U数
                          <br />
                          {0}</span>
                      </div>
                      <div className='left_label'>
                        <span>全部U数
                          <br />
                          {0}</span>
                      </div>
                      <div className='left_label'>
                        <span>空U数
                          <br />
                          {0}</span>
                      </div>
                    </div>

                  </div>
                  <div className='room_center'>
                    <div
                      id="chart1"
                      className='center_echart'
                      style={{ minHeight: "220px", width: "50%" }}
                    ></div>
                    <div
                      id="chart2"
                      className='center_echart'
                      style={{ minHeight: "220px", width: "50%" }}
                    ></div>
                  </div>
                  <div className='room_right_1'>
                    <div className='top'>


                    </div>
                    <div className='bottom'>
                      <div><div className='c_month'></div>本月新增：0</div>
                      <div><div className='c_year'></div>今年新增：0</div>
                    </div>




                  </div>
                  <div className='room_right_2'>

                    <div className='top'>


                    </div>
                    <div className='bottom'>



                    </div>



                  </div>

                </Card>
              </Fragment>
            )}
            {type === "room" && (
              <Fragment>
                <Tabs className='tab_list_2' activeKey={tabIndex} onTabClick={key => {
                  tabClick(key);
                }}>
                  <Tabs.TabPane tab={('机房一览')} key='room_view' >
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={('设备')} key='asset_room_set'>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={('机柜')} key='cabinet_room_set'>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={('机柜组')} key='cabinet_group_room_set'>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={('配线架')} key='distribution_frame_room_set'>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={('PDU')} key='pdu_room_set'>
                  </Tabs.TabPane>
                </Tabs>
                {tabIndex == "room_view" && (
                  <Fragment>
                    <div className='tool_header'>
                      <CheckboxGroup options={plainOptions} onChange={e => { onRoomChange(e) }} />
                      <OrderedListOutlined className='icon' />
                      <EditOutlined className='icon' onClick={() => {
                        setOperateFlag("update_mode");
                        set
                        tabOperteClick("room_set");
                      }} />
                      <DeleteOutlined className='icon' />
                      <DownloadOutlined className='icon' />
                    </div>
                    <div className='room_size'>
                      <ResponsiveGridLayout
                        className="grid_layout"
                        // layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                      >
                        {/* <div key="1" className='cell_content'>1</div>
                            <div key="2" className='cell_content'>2</div>
                            <div key="3" className='cell_content'>3</div> */}
                      </ResponsiveGridLayout>
                    </div>
                  </Fragment>
                )}
                {tabIndex != "room_view" && (
                  <CommonTable
                    searchOption={roomProps.searchOption}
                    initial={roomProps.initData}
                    ButtonArr={roomProps.ButtonArr}
                    Menu={roomProps.Menu}                    
                    TableColumns={roomProps.TableColumns}
                    businessId={businessForm.businessId}
                    total={total}
                    queryTable={queryTable}
                    TableData={tableData}
                  ></CommonTable>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
        {operateFlag == "update_mode" && (
          <Fragment>
              <Tabs className='tab_list_2' activeKey={tabOperteIndex} onTabClick={key => {
                  tabOperteClick(key);
                }}>
                  <Tabs.TabPane tab={('基本信息')} key='room_set' >
                   <div className='form_zone'>
                      <CommonForm
                          excelName={formProps.excelName}
                          that={formProps.that} //传入父组件 ，作用：可调用父组件中的属性及方法
                          FormOnChange={formProps.FormOnChange} //监听表单值变化事件
                          base64url={formProps.base64url} //为父组件base64传值
                          defaultValue={formData} 
                          initial={formProps.initial}
                          Form={formProps.Form} 
                          isInline = {formProps.isInline} 
                          cancel ={true}
                          CancelClick={e=>{
                            setOperateFlag("view_mode");
                            setTabIndex("room_view")
                          }}

                          Modal={formProps.Modal} 
                      ></CommonForm>
                  </div>

                  </Tabs.TabPane>
                  <Tabs.TabPane tab={('机房分区')} key='room_range'>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={('机房不可用分区')} key='room_no_use_range'>
                  </Tabs.TabPane>
                </Tabs>
                



          </Fragment>
        )}

        <CommonModal
          Modal={props.Modal}
          Form={props.Form}
          initial={initData}
          defaultValue={formData}
          id={randomId}
          operate={businessForm.operate}
          isOpen={businessForm.isOpen} >
        </CommonModal>
        <OperationModal
          operateType={operateType}
          setOperateType={setOperateType}
          initData={selectedAssetRows}
          theme={theme}
          width={650}
          reloadList={async (value: any, operateType: string) => {
            console.log('setRefreshKey')
          }}
        />





      </div>
    </div>

  );
}
