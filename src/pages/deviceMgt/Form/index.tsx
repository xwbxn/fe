import React, { createRef, useEffect, useState } from 'react';
import './index.less';
import { MinusCircleOutlined } from '@ant-design/icons';
import { OperationModal } from './OperationModal';
import { getProducersByType } from '@/services/assets/producer';
import { Button, Card, Checkbox, Col, DatePicker, Form, FormInstance, Input, Modal, Radio, Row, Select, Space, Table, Tabs, TimePicker, TreeSelect, Upload, message } from 'antd';
import { getDictValueEnum } from '@/services/system/dict';
import { getAssetsTree,insertAssetAlert, getAssetTableByTypeAndId, getAssetAlerts, getAssetTreeByDeviceType, getAssetById, getAssetExtendsById } from '@/services/assets/asset';
import { getAssetTreeBelongId } from '@/services/assets/asset-tree';
import { getCabinetList } from '@/services/assets/device-cabinet';
import {modelsAttributes as modelsAttributes} from './device_type_models';

import CommonModal from '@/components/CustomForm/CommonModal';
import moment from 'moment';
import { ColumnsType } from 'antd/lib/table/Table';
import { OperateType } from './operate_type';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

interface Props {
  handleClick: (value, id, fields, category, recordId) => Promise<void>;  //回调函数
  text: string;   //【未使用】
  type: number;  //资产设备类型
  keyId: number; //资产Id， >0 则有资产信息
  options: {}    //初始化参数值 Map
}

//弹框操作 业务
// export enum OperateType {
//   ChangeOrganize = 'changeOrganize',
//   None = 'none',
// }
export default function CustomForm(props: Props) {

  
const history = useHistory();
  let attrs: any = modelsAttributes["type_"+props.type].models;
  type LayoutType = Parameters<typeof Form>[0]['layout'];
  const [modalWidth, setModalWidth] = useState<number>(650)
  const [dialogIsOpen, setDiallogIsOpen] = useState<boolean>(false);
  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const searchParams = new URLSearchParams(window.location.search);
  const [queryList, setQueryList] = useState<any>([]);
  const [formLayout, setFormLayout] = useState<LayoutType>('inline');
  const buttonItemLayout = formLayout === 'horizontal' ? { wrapperCol: { span: 14, offset: 4 } } : null;
  //处理各个表单的字段和中文信息
  const [formFieldMap, setFormFieldMap] = useState<any>({});
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [operateName, setOperateName] = useState<string>("");
  //弹框操作的信息
  const [operateField, setOperateField] = useState<any>({});
  //页面中所有表单 Ref
  const [refArr, setRefArr] = useState({});
  //弹框初始化数据 若存储弹框
  const [dialogInitData, setDialogInitData] = useState<any>();

  const [dataMap, setDataMap] = useState({});
  //  根据字段中数据来源渲染初始化数据
  const [initOptions, setInitOptions] = useState({});  //

  const [modalInitOptions, setModalInitOptions] = useState({});  //

  const [tabGroup, setTabGroup] = useState({});

  const [categoryData, setCategoryData] = useState({});

  const [formIdMap, setFormIdMap] = useState({});

  const [tabFIndex, setTabFIndex] = useState<string>("form_base_position")

  const [tabFFIndex, setTabFFIndex] = useState<string>()
  //页面表单初始化数据
  const [selectMap, setSelectMap] = useState({});
  //页面表单运维服务项选择
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  //设备/资产信息
  const [assetInfo, setAssetInfo] = useState<any>({});

  const [assetStatus, setAssetStatus] = useState<number>(0);

  const columns_maintain_services: ColumnsType<any> = [
    {
      title: '服务选项',
      dataIndex: 'service_id',
      render: (text: string) => {
        return text;
      },
      className: "notshow",
      key: 'service_id'
    },

    {
      title: '服务选项',
      dataIndex: 'service_name',
      render: (text: string) => {
        return text;
      },
      key: 'service_name'
    },
    {
      title: '服务对象',
      dataIndex: 'service_object',
      key: 'service_object',
      render: (text: string, record: any) => {
        return <div><Input style={{ width: "180px" }} id={"service_object:" + record.service_id} defaultValue={text}></Input></div>
      }
    }, {
      title: '服务期限',
      dataIndex: 'service_expire',
      key: 'service_expire',
    }
  ]



  //变更表单初始化
  const [alertState, setAlertState] = useState<any>({
    TableData: [],
    TableColumns: [],
    searchOption: [],
    ButtonArr: [],
    Modal: {
      title: "添加变更信息",
      width: 620,
      submit: async (value) => {
        value.asset_id = props.keyId;

        if (value.alter_at != undefined && value.alter_at != null) {
          value.alter_at = moment(moment(value.alter_at).format('YYYY-MM-DD HH:mm:ss')).valueOf() / 1000
        }
        if (value.alter_event_key != undefined && value.alter_event_key != null) {
          value.alter_event_code = "alert_event"
        }
        if (value.alter_status != undefined && value.alter_status != null) {
          value.alter_status = parseInt(value.alter_status[0])
        } else {
          value.alter_status = 0;
        }
        console.log(value);
        insertAssetAlert(value).then((res) => {
          setDiallogIsOpen(false)
          message.info('添加成功');
          loadingAlertQuery(null)
        })
      },
      cancel: async () => {
        setDiallogIsOpen(false)
      },
    },
    DeleteModal: {},
    FormOnChange: Function,
    Form: {
      col: 2,
      items: []
    },
    Loading: true,
  })



  const datalDealValue = (value, key, data_type, hasSelect) => {
    if (hasSelect) {
      value = "" + value;
    } else {
      if (value != null && data_type == "date") {
        value = moment(value * 1000);//.format("YYYY-MM-DD")
      } else if (value != null && data_type == "timestamp") {
        value = moment(value * 1000);//.format("YYYY-MM-DD HH:mm:ss")
      }
    }
    return value;
  }
  //变更表单编辑
  const EditTableFun = (row) => {
    let items = [{
      type: "label",
      name: "alert_theme",
      label: "变更主体",
      value: row.alert_theme
    }, {
      type: "label",
      name: "device_type",
      label: "设备类型",
      value: row.alert_theme
    }, {
      type: "label",
      name: "device_position",
      label: "所在位置",
    }, {
      type: "label",
      name: "producer_model",
      label: "厂商型号",
    }, {
      type: "datepicker",
      name: "alter_at",
      label: "变更日期",
      required: true,
      showTime: true,
    }, {
      type: "select",
      name: "alter_event_key",
      label: "变更事项",
      value: modalInitOptions["alertType"]
    }, {
      type: "textarea",
      name: "before_alter",
      label: "变更前",
      required: true,
    }, {
      type: "textarea",
      name: "after_alter",
      label: "变更后",
      required: true,
    }, {
      type: "input",
      name: "alter_sponsor",
      label: "变更发起人",
    }, {
      type: "checkbox",
      name: "alter_status",
      label: "确认状态",
      defaultValue: 0,
      value: [{ label: "已确认", value: 1 }]
    }, {
      type: "textarea",
      name: "alter_instruction",
      label: "变更说明",
    }, {
      type: "textarea",
      name: "confirm_opinion",
      label: "确认意见",
    }
    ];
    alertState.Form.items = items;
    setAlertState(alertState);
    setDiallogIsOpen(true)
  }

  const rowSelection = {

    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log("selectedRowKeys: " + selectedRows)
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRows(selectedRows);
      // var name = document.getElementById('service_object:'+selectedRowKeys[0]).value;
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  //初始化
  useEffect(() => {
    //加载选项初始数据
    for (let k of Object.keys(props.options)) {
      selectMap[k] = props.options[k];
      setSelectMap({ ...selectMap });
    }
    //初始化需要的字典---添加变更表单用
    getDictValueEnum("alert_event").then((value) => {
      modalInitOptions["alertType"] = value;
      setModalInitOptions({ ...modalInitOptions });
    })

    //处理每个表单对应的字段信息为保存数据存储来判断
    dealFieldsToEveryForm(attrs);
    if (searchParams.get("edit") != null && searchParams.get("edit") == "1") {
      setHasEdit(true)
    }

  }, []);

  const dealOnOffline=(e,status: number) => {
    console.log("dealOnOffline",status);
    if(status ==2){//上线
      getAssetById(props.keyId).then(({ dat }) => {
          let assets = new Array();  
          assets.push(dat);
          setDialogInitData(assets)
          setModalWidth(1050);
          setOperateType(OperateType.Online)         
      })

    }
    if(status ==1){//下线
      getAssetById(props.keyId).then(({ dat }) => {
        setModalWidth(650);
        // setOperateType(key as OperateType);
        let offlineInit ={};
        console.log("offline init: " + offlineInit)
        getAssetsTree(assetStatus).then(({dat}) => { 
          console.log("查询当前资产所属的树   ") 
          offlineInit["init_tree_data"] = dat;  
          offlineInit["init_asset_id"] = dat;         
          let assetIds = new Array();
          assetIds.push(dat.id);
          getAssetTreeBelongId(assetIds).then(({dat}) => {      
            let ids = new Array<number>();
            dat.forEach((item)=>{
              ids.push(item.id);
            });
            offlineInit["init_catalog_id"] = ids; 
            setDialogInitData(offlineInit);
            setOperateType(OperateType.Offline);
          })
  
  
        })


      })

    }
  };

  const dealFieldsToEveryForm = (attrs) => {
    //处理中文和每个表单每个块要提交的字段信息
    attrs.map((modelF, i) => {
      let id = modelF.id;
      let child = new Array()
      modelF.models.map((modelFF, index) => {
        let fieldItem = new Array();
        modelFF.attributes.map((property, sn) => {
          fieldItem.push({
            name: property.name,
            has_next: false,
            name_cn: property.label,
            data_type: property.data_type ? property.data_type : "string"
          })
        })
        child.push({
          name: modelFF.id,
          has_next: true,
          item: fieldItem
        })
        formFieldMap[modelFF.id] = child;
      })
      formFieldMap[modelF.id] = child;
    })
    setFormFieldMap({ ...formFieldMap })

  }


  useEffect(() => {
    if (tabFIndex.indexOf("component-") < 0) {
      tabRender(tabFIndex);
    }
    // if(tabFIndex==="form_base_position "){
    //   loadingAlertQuery(null);
    // }

  }, [tabFIndex]);

  useEffect(() => {
    tabRender(tabFFIndex);
  }, [tabFFIndex]);


  const addAlert = (event) => {
    console.log("assetInfo", assetInfo);
    EditTableFun({});
  }

  const loadingAlertQuery = (values) => {
    let others: any = {};
    let param = {
      asset: props.keyId,
      page: 1,
      limit: 10,
    }
    if (values != null) {
      if (values.alter_at != undefined && values.alter_at.length > 0) {
        others.start = moment(moment(values.alter_at[0]).format('YYYY-MM-DD HH:mm:ss')).valueOf() / 1000;
        others.end = moment(moment(values.alter_at[1]).format('YYYY-MM-DD HH:mm:ss')).valueOf() / 1000;
      }
      if (values.alter_event_key != undefined) {
        others.event = values.alter_event_key;
      }
    }

    getAssetAlerts({ ...param, ...others }).then(({ dat, err }) => {
      if (err == "") {
        setQueryList(dat.list);
      }
    });

  }

  useEffect(() => {
    for (let currentForm in initOptions) {
      if (initOptions[currentForm].length > 0) {
        for (let i = 0; i < initOptions[currentForm].length; i++) {
          let item = initOptions[currentForm][i];
          if (item.source == 'dict') {
            getDictValueEnum(item.refer).then((value) => {
              let options = new Array();
              if (item.name == "service_config") {
                value.forEach((item) => {
                  let option = {
                    service_id: item.value,
                    service_name: item.label,
                    service_object: '整机',
                    service_expire: ''
                  }
                  options.push(option);
                });
                selectMap[currentForm + "." + item.name] = options;
                setSelectMap({ ...selectMap })
              } else {
                selectMap[currentForm + "." + item.name] = value;
                setSelectMap({ ...selectMap })
              }
            })
          } else if (item.source == 'table') {



          } else if (item.source == 'initial') {
            // console.log(currentForm + "." + item.name, "value-3:", selectMap[item.refer]);
            selectMap[currentForm + "." + item.name] = selectMap[item.refer];
            setSelectMap({ ...selectMap })

          }
        }
      }

    }

    // console.log("initOptions", initOptions)

    // console.log("setSelectMap",selectMap);


  }, [initOptions]);

  useEffect(() => {
    console.log("更新主表单")
    let formId = "form_base_position";
    let refForm = refArr[formId];
    if (refForm != undefined && props.keyId > 0) {
      let formValues = refForm.current.getFieldsValue();
      getAssetById(props.keyId).then(({ dat }) => {
        formValues["group_base"][0] = dat;
        formValues["group_position"][0] = dat;
        setAssetStatus(dat.device_status);
        // console.log("formValues", formValues)
        refForm.current?.setFieldsValue(formValues);
        let modelList = new Array();
        selectMap["device_models"].forEach(item => {
          if (item.producer_id == dat.device_producer) {
            modelList.push({
              value: item.id,
              label: item.name
            })
          }
        });
        selectMap[formId + ".device_model"] = modelList;
        setSelectMap({ ...selectMap })
        getCabinetList(dat.equipment_room).then((res) => {
          let cabinetList = new Array()
          res.dat.forEach((item) => {
            cabinetList.push({
              value: item.id,
              label: item.cabinet_code
            });
          })
          selectMap[formId + ".owning_cabinet"] = cabinetList;
          setSelectMap({ ...selectMap });
        });

        setAssetInfo(formValues);
      })
    }
  }, [refArr]);

  const tabRender = (tabId: any) => {
    console.log('click TAB-ID', tabId, categoryData);
    if (tabId != undefined) {
      let cfg = tabGroup[tabId];
      if (cfg != undefined) {
        let cfg = tabGroup[tabId];
        if (cfg.type === "form") {
          let childId = cfg.items[0].id;
          setTabFFIndex(childId)
          let refForm = refArr[childId].current;
          if (refForm != null && categoryData[childId]) {
            let object = "{\"" + tabId + "\":" + JSON.stringify(categoryData[childId]) + "}";
            refForm.setFieldsValue(JSON.parse(object));
          }
        } else {
          let refForm = refArr[tabId].current;
          let formValues = refForm.getFieldsValue();
          // console.log("formValues",formValues)
          for (let i = 0; i < cfg.items.length; i++) {
            let id = cfg.items[i].id;
            if (refForm != null && categoryData[id]) {
              formValues[id] = categoryData[id];
            }
          }
          refForm.setFieldsValue(formValues);
        }
      } else {
        let refForm = refArr[tabId].current;
        if (refForm != null && categoryData[tabId]) {
          let object = "{\"" + tabId + "\":" + JSON.stringify(categoryData[tabId]) + "}";
          console.log(object);
          refForm.setFieldsValue(JSON.parse(object));
        }
      }
    }


  }
  const getFieldsMap = (form_id, current_form) => {
    let strMap = new Map();
    current_form.map((modelF, _) => {
      if (form_id == modelF.name) {
        if (modelF.has_next) {
          modelF.item.map((modelFF, _) => {
            strMap.set(modelFF.name, modelFF.name_cn)
          })
        } else {
          current_form.map((modelF, _) => {
            strMap.set(modelF.name, modelF.name_cn)
          })
        }
      }
    })
    return strMap
  }

  //点击 一级导航 TAB标记
  const tabClick = (key: string, parentId?: any) => {
    if (props.keyId < 1) {
      message.error("未保存基本信息，不能编辑其他信息")
      return
    }
    //初始化数据，来源资产扩展信息 根据大类来局部加载数据
    if (parentId == "0" && key.indexOf("component-") > -1) {
      setTabFIndex(key)
      //不处理表单数据
    } else if (parentId == "0" && key.indexOf("table-") > -1) {
      // 处理不同数据源的信息
      let keys = key.split("-");
      let formId = key;
      formIdMap[formId] = null;
      setFormIdMap({ ...formIdMap })
      let fieldMap = formFieldMap[formId];
      console.log("fieldMap", fieldMap);
      getAssetTableByTypeAndId(keys[1], props.keyId).then((res) => {
        console.log("优化处理--------对应不同的设备");
        if (res != null && res.dat != null) {
          const valueMap = new Map()
          for (const k of Object.keys(res.dat)) {
            valueMap.set(k, res.dat[k])
          }
          //优化处理--------对应不同的设备
          if (key == "table-maintenance" || res.dat.maintenance_type != undefined) {
            getProducersByType(res.dat.maintenance_type).then(({ dat }) => {
              let list = new Array()
              dat.forEach((item) => {
                list.push({
                  value: item.id,
                  label: item.alias
                });
              })
              selectMap[key + ".maintenance_provider"] = list;
              setSelectMap({ ...selectMap });
            })
          }
          formIdMap[formId] = res.dat.id;
          setFormIdMap({ ...formIdMap })
          let formFields = formFieldMap[formId];
          for (let index in formFields) {
            let groupFields = formFields[index];
            let rowDataMap = new Map()
            for (let itemIndex in groupFields.item) {
              let field = groupFields.item[itemIndex];
              rowDataMap.set(field.name, valueMap.has(field.name) ? datalDealValue(valueMap.get(field.name), field.name, field.data_type, field.type == "select" ? true : false) : null)
            }
            let group = new Array();
            group.push(Object.fromEntries(rowDataMap));
            categoryData[groupFields.name] = group;
            setCategoryData({ ...categoryData });
          }

        }
        setTabFIndex(key);
      });


    } else if (parentId == "0" && key.indexOf("form-") > -1) {
      let params = {
        asset_id: props.keyId,
        config_category: key
      };
      getAssetExtendsById(params).then(({ dat }) => {
        const map = new Map()
        dat.forEach((item, index, arr) => {
          if (!map.has(item.property_category)) {
            map.set(
              item.property_category,
              arr.filter(a => a.property_category == item.property_category)
            )
          }
        })
        //以上分组加载数据 
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
          let group = new Array()
          formDataMap.forEach(function (value, i) {
            let itemsChars = ""
            value.forEach((item, index, arr) => {
              itemsChars += "\"" + item.property_name + "\":\"" + item.property_value + "\",";
            })
            itemsChars = "{" + itemsChars.substring(0, itemsChars.length - 1) + "}";
            group.push(JSON.parse(itemsChars));
          })
          categoryData[key] = group;
          setCategoryData({ ...categoryData });
        })
        setTabFIndex(key);
        //从数据服务上加载数据完成
      })

    } else if (parentId != "0") {
      setTabFFIndex(key) //二级TAB
    } else {
      setTabFIndex(key)
    }

  }
  //修改字段值 调用的方法
  const onFieldsChange = (formId: string, id: string, value: any, group_id, field_list_index: number) => {
    // 该方法对所有表单根据业务情况 来判断处理，每一个表单 form 每一个属性 id 来控制
    // ※※※※※※※※※后期优化部分※※※※※※※※※※
    console.log("※※※※※※※※※后期优化部分※※※※※※※※※※", formId);
    let refForm = refArr[formId].current;
    if (formId == "form_base_position") {//处理资产基本信息的表单
      let formValues = refForm.getFieldsValue();
      if (id == "device_producer") {
        formValues[group_id][field_list_index].subtype = "";
        formValues[group_id][field_list_index].outline_structure = "";
        formValues[group_id][field_list_index].specifications = "";
        formValues[group_id][field_list_index].u_number = "";
        formValues[group_id][field_list_index].device_model = ""
        refForm.setFieldsValue(formValues);
        let modelList = new Array();
        selectMap["device_models"].forEach(item => {
          if (item.producer_id == value) {
            modelList.push({
              value: item.id,
              label: item.name
            })
          }
        });
        selectMap[formId + ".device_model"] = modelList;
        setSelectMap({ ...selectMap });
      } else if (id == "device_model") {
        let formValues = refForm.getFieldsValue();
        selectMap["device_models"].forEach(item => {
          if (item.id == value) {
            formValues[group_id][field_list_index]["subtype"] = item.subtype;
            formValues[group_id][field_list_index]["outline_structure"] = item.outline_structure;
            formValues[group_id][field_list_index]["specifications"] = item.specifications;
            formValues[group_id][field_list_index]["u_number"] = item.u_number;

          }
        });
        refForm.setFieldsValue(formValues);
      } else if (id == "equipment_room") {
        getCabinetList(value).then(({ dat }) => {

          let cabinetList = new Array()
          dat.forEach((item) => {
            cabinetList.push({
              value: item.id,
              label: item.cabinet_code
            });
          })
          selectMap[formId + ".owning_cabinet"] = cabinetList;
          setSelectMap({ ...selectMap });
        });
      }

    } else if (formId === "table-maintenance") {
      let formValues = refForm.getFieldsValue();
      console.log("调试", formId, formValues);

      if (id == "maintenance_type") {
        formValues[group_id][field_list_index]["maintenance_provider"] = null;
        refForm.setFieldsValue(formValues);
        getProducersByType(value).then(({ dat }) => {
          let list = new Array()
          dat.forEach((item) => {
            list.push({
              value: item.id,
              label: item.alias
            });
          })
          selectMap[formId + ".maintenance_provider"] = list;
          setSelectMap({ ...selectMap });
        })
      }

    }

  };
  //对个别参数进行定制化处理
  const fieldSpecialEvent = (e, item: any, formId: string, groupId: string, index) => {
    item.formId = formId;
    item.groupId = groupId;
    console.log('extendEvent', item);
    if (item.extend.type === "dialog") {
      console.log("extendEvent", item);
      item.index = index;
      item.groupId = groupId
      setOperateField(item);
      getAssetTreeByDeviceType(13, 1).then(({ dat }) => {
        setDialogInitData(dat);
        setOperateType(OperateType.SelectUseStorage)
        setOperateName(item.extend.label);
        
      })

    } else if (item.extend.type === "checkbox") {
      console.log("hasCheckoutEvt", e.target.checked);
      let refForm = refArr[formId].current;
      // 
      let formValues = refForm.getFieldsValue();
      formValues[groupId][0][item.extend.ctrl_name] = (e.target.checked ? 1 : 0);
      console.log("formValues", formValues)
      refForm.setFieldsValue(formValues);
    }

  }


  const backToList=()=>{
       history.push('/devicemgt')
  }

  //提交表单数据
  const handleClick = (values: any, formId: string, category) => {
    let record_id = formIdMap[formId] != undefined ? formIdMap[formId] : null;
    console.log("提交的数据", values, "---------", formId, category)
    if (formId == "table-maintenance") {
      if (selectedRows.length > 0) {
        
        let service_config = new Array();
        selectedRows.forEach(row => {
          let dom =document.getElementById('service_object:' + row.service_id);
          service_config.push({
            service_obj_key: row.service_id,
            service_option_code: "maintenance_service",
            service_obj_value: dom?.value,
            deadline: row.service_expire?row.service_expire:null
          })
        })
        values["form-maintenance"][0]["service_config"] = service_config;
      }
    }
    props.handleClick(values, formId, formFieldMap[formId], category, record_id);
  };
  //表单样式初始化
  const formItemLayout = {
    width: '100%',
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  //渲染表单每一项
  const CreateForm = (formId, item, sn, span, multiple, field: any, group_id: any, field_list_index) => {
    // console.log("渲染表单每一项",formId, multiple, field,group_id);
    switch (item.type) {
      case "hidden":
        return <React.Fragment key={sn}>
          <Form.Item hidden={true}
            name={multiple ? [field.name, item.name] : item.name}
            key={sn}
          >
            <Input placeholder={`请输入您的${item.label}`} />
          </Form.Item>
        </React.Fragment>
      case "input":
        debugger;
        return <Col span={span} >
          <Form.Item label={item.label}>
            <Form.Item

              name={multiple ? [field.name, item.name] : item.name}
              key={sn}
              rules={[{ required: item.required, message: `请输入您的${item.label}` }]}
            >
              <Input placeholder={`请输入您的${item.label}`} disabled={item.readonly} style={{ width: '150px' }} />

            </Form.Item>
            <template slot='append' style={(item.unit || item.extend) ? { display: 'block' } : {}}>
              {item.unit && (
                <span className='unit_style_gray'>{item.unit ? item.unit : ''}</span>
              )}
              {item.extend && item.extend.type == 'dialog' && (
                <span className='extends_style_button' onClick={e => { fieldSpecialEvent(e, item, formId, group_id, field_list_index) }}>{item.extend.label}</span>
              )}
              {item.extend && item.extend.type == 'checkbox' && (
                <span className='extends_style_gray' >{item.extend.title}
                  <Checkbox id="hasLine" className='checkbox_extend' onChange={e => { fieldSpecialEvent(e, item, formId, group_id, field_list_index) }}></Checkbox>
                </span>
              )}
            </template>
          </Form.Item>



        </Col>
      case "password":
        return <Col span={span} key={"item-" + sn}>
          <Form.Item
            label={item.label}
            name={multiple ? [field.name, item.name] : item.name}
            key={sn}
            rules={[{ required: item.required, message: `请输入您的${item.label}` }]}
          >
            <Input.Password disabled={item.readonly} placeholder={`请输入您的${item.label}`}
              style={{ width: '150px' }} />
          </Form.Item>
        </Col>
      case "radio":
        return <Col span={span} key={"item-" + sn}><Form.Item
          label={item.label}
          name={multiple ? [field.name, item.name] : item.name}
          key={sn}
          rules={[{ required: item.required, message: `请选择您的${item.label}` }]}
        >
          {
            item.isGroup ? (
              <Radio.Group>
                {
                  item.radioArr.map((radio, index) => {
                    return (
                      <Radio key={index} value={radio.value}>{radio.label}</Radio>
                    )
                  })
                }
              </Radio.Group>
            ) : (
              <>
                <Radio value={item.radio.value}>{item.radio.label}</Radio>
              </>
            )
          }

        </Form.Item></Col>
      case "select":
        if (item.options?.length > 0) {
          selectMap[formId + "." + item.name] = item.options
        }
        return <Col span={span} key={"item-" + sn}><Form.Item
          label={item.label}
          name={multiple ? [field.name, item.name] : item.name}
          key={sn}
          rules={[{ required: item.required, message: `请选择您的${item.label}` }]}
        >
          <Select
            placeholder={`请选择您的${item.label}`}
            options={selectMap[formId + "." + item.name]}
            style={{ width: '150px' }}
            onChange={(value: any) => onFieldsChange(formId, item.name, value, group_id, field_list_index)}
          >
          </Select>
        </Form.Item></Col>
      case "textarea":
        return <Col span={span} key={"item-" + sn}><Form.Item
          label={item.label}
          name={multiple ? [field.name, item.name] : item.name}
          key={sn}
          rules={[{ required: item.required, message: `请输入您的${item.label}` }]}
        >
          <Input.TextArea placeholder={`请输入您的${item.label}`} />
        </Form.Item></Col>
      case "treeselect":
        return <Col span={span} key={"item-" + sn}>
          <Form.Item
            label={item.label}
            name={multiple ? [field.name, item.name] : item.name}
            key={sn}
            rules={[{ required: item.required, message: `请输入您的${item.label}` }]}
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={`请输入您的${item.label}`}
              allowClear
              treeDataSimpleMode
              treeData={selectMap[formId + "." + item.name]}
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              treeDefaultExpandAll={true}
            ></TreeSelect>
          </Form.Item></Col>
      // 多选
      case "multiple":
        return <Col span={span} key={"item-" + sn}><Form.Item
          label={item.label}
          name={multiple ? [field.name, item.name] : item.name}
          key={sn}
          rules={[{ required: item.required, message: `请选择您的${item.label}` }]}
        >
        </Form.Item></Col>
      //checkbox
      // case "checkbox":
      //   return <Col span={span} key={"item-"+sn}></Col><Form.Item
      //     label={item.label}
      //     name={item.name}
      //     key={i}
      //     rules={[{ required: item.isRequired, message: `请选择您的${item.label}` }]}
      //   >
      //   </Form.Item></Col>
      //checkbox
      case "datepicker":
        return <Col span={span} key={"item-" + sn}><Form.Item
          label={item.label}
          name={multiple ? [field.name, item.name] : item.name}
          key={sn}
          rules={[{ required: item.required, message: `请选择您的${item.label}` }]}
        >
          <DatePicker  format="YYYY-MM-DD" placeholder={`请输入您的${item.label}`} />
        </Form.Item></Col>
      case "timepicker":
        return <Col span={span} key={"item-" + sn}><Form.Item
          label={item.label}
          name={multiple ? [field.name, item.name] : item.name}
          key={sn}
          rules={[{ required: item.required, message: `请选择您的${item.label}` }]}
        >
          <TimePicker placeholder={`请输入您的${item.label}`} />
        </Form.Item></Col>
      case "table":
        return <div className='table_specal1' key={"item-" + sn}>
          <span className='table_label'>{item.label}</span>
          <div>
            <Table
              rowSelection={rowSelection}
              rowKey={item.key}
              columns={columns_maintain_services}
              pagination ={false}
              dataSource={selectMap[formId + "." + item.name]} />
          </div>
        </div>
      // case "richtext":
      //     return <Form.Item
      //         label={item.label}
      //         name={item.name}
      //         key={i}
      //         rules={[{ message: `请选择您的${item.label}` }]}
      //     >
      //         <RichText that={this.props.that} ></RichText>
      //     </Form.Item>
      // case "uploadexcel":
      //     return <Form.Item
      //         label={item.label}
      //         name={item.name}
      //         key={i}
      //         valuePropName="fileList" getValueFromEvent={this.normFile}
      //     >
      //         <Upload.Dragger {...this.state.prexcel}>
      //             <p className="ant-upload-drag-icon">
      //                 <InboxOutlined />
      //             </p>
      //             <p className="ant-upload-text">单击或拖动文件到该区域进行上传</p>
      //             <p className="ant-upload-hint">支持单个或批量上传</p>
      //         </Upload.Dragger>
      //     </Form.Item>
      default:
        return (
          <>
          </>
        )
    }
  }

  //页面加载【TAB -List】
  return (
    <>
      <div style={{ position: 'relative' }}>
        <div className='top_right_zone'>
          <span style={{ zIndex: 10, display: tabFIndex == 'component-alert' ? 'block' : 'none' }}
            onClick={(e) => addAlert(e)}
          >添加变更</span>
          {assetStatus == 1 && (
            <span style={{ zIndex: 10}} onClick={(e)=>{dealOnOffline(e,2)}}>  上线  </span>
          )}
          {assetStatus == 2 && (
            <span style={{ zIndex: 10}} onClick={(e)=>{dealOnOffline(e,1)}}>  下线  </span>
          )}
        </div>
        <Tabs className='tab-list' activeKey={tabFIndex} onTabClick={(key) => {
          tabClick(key, "0");
        }}>
          {attrs.length <= 0 && (
            <Tabs.TabPane tab={'未找到配置信息,请于管理员联系'}>
              <div> 未找到配置信息</div>
            </Tabs.TabPane>
          )}

          {attrs.length > 0 && attrs.map((modelF, i) => {
            tabGroup[modelF.id] = {
              type: modelF.form_type,
              items: modelF.models
            }
            if (modelF.form_type === 'group') {
              refArr[modelF.id] = React.createRef<FormInstance>();
              initOptions[modelF.id] = modelF.initial_data
            }
            return (
              <Tabs.TabPane tab={modelF.name} key={modelF.id} >
                {modelF.form_type === "form" && (
                  <Tabs className='tab-child-list' activeKey={tabFFIndex} onTabClick={key => {
                    tabClick(key, modelF.id);
                  }}>
                    {modelF.models.map((modelFF, index) => {

                      refArr[modelFF.id] = createRef<FormInstance>();
                      initOptions[modelFF.id] = modelFF.initial_data;
                      dataMap[modelFF.id] = [{}];
                      if (modelFF.base_attributes?.length > 0) {
                        dataMap["base_" + modelFF.id] = [{}];
                      }
                      return (
                        <Tabs.TabPane tab={modelFF.name} key={modelFF.id}  >
                          <Card key={'card' + index} style={{ width: '100%' }}>
                            <Form
                              labelAlign="right"
                              {...formItemLayout}
                              key={modelFF.id}
                              ref={refArr[modelFF.id]}
                              onFinish={e => {
                                handleClick(e, modelFF.id, modelF.id);
                              }}
                            >
                              {modelFF.base_attributes?.length > 0 && (
                                <Form.List key={"bfield_list_" + index} name={'base_' + modelFF.id} initialValue={dataMap['base_' + modelFF.id]}>
                                  {(field, { add, remove }) => {

                                    return (
                                      <>
                                        {field.map((item, _idnex) => (
                                          <div key={"bF" + _idnex}>
                                            <Row style={{ marginTop: '0px' }}>
                                              {modelFF.base_attributes.map((property, sn) => {
                                                let span = property.span ? property.span : modelFF.span;
                                                return (CreateForm('base_' + modelFF.id, property, sn, modelFF.span, true, item, 'base_' + modelFF.id, _idnex))
                                              })}
                                            </Row>
                                          </div>
                                        ))}
                                      </>
                                    )
                                  }
                                  }
                                </Form.List>
                              )}
                              <Form.List key={"field_list_" + index} name={modelFF.id} initialValue={dataMap[modelFF.id]}>
                                {(field, { add, remove }) => {

                                  return (
                                    <>
                                      {field.map((item, _idnex) => (
                                        <div key={"F" + _idnex}>
                                          <Row key={'index-' + _idnex}>
                                            <div className='head_card'>
                                              <div className="title" >{modelFF.name}{_idnex + 1}</div>
                                              <div className="dashed"><hr className='dhr'></hr></div>
                                              {_idnex > 0 ? (
                                                <MinusCircleOutlined
                                                  className="dynamic-delete-button"
                                                  style={{ position: 'absolute', color: 'red', right: '2%', marginLeft: 8 }}
                                                  onClick={() => remove(_idnex)} />
                                              ) : null}
                                            </div>
                                          </Row>
                                          <Row style={{ marginTop: '0px' }}>
                                            {modelFF.attributes.map((property, sn) => {
                                              let span = property.span ? property.span : modelFF.span;
                                              return (CreateForm(modelFF.id, property, sn, modelFF.span, true, item, modelFF.id, _idnex))
                                            })}
                                          </Row>
                                        </div>
                                      ))}
                                      <Row style={{ marginTop: '0px' }}>
                                        <Space
                                          align="baseline"
                                          style={{ marginLeft: '33%', display: 'flex', marginBottom: 8, width: '100%', marginTop: '10px', textAlign: 'center' }}
                                        >
                                          {hasEdit && (
                                            <Button type="primary" htmlType="submit" className='button_form'>保存</Button>
                                          )}
                                          {modelFF.multiple && (
                                            <>
                                              <Button type="primary" className='button_form' onClick={() => {
                                                add()
                                              }}> 添加</Button>
                                            </>
                                          )}
                                          <Button className='ret_button_form' onClick={backToList}>返回</Button>
                                        </Space>
                                      </Row>
                                    </>
                                  )
                                }
                                }
                              </Form.List>
                            </Form>
                          </Card>
                        </Tabs.TabPane>

                      )

                    }
                    )

                    }
                  </Tabs>
                )}
                {modelF.form_type === "group" && (
                  <Form
                    labelAlign="right"
                    ref={refArr[modelF.id]}
                    key={modelF.id}
                    {...formItemLayout}
                    style={{ width: '100%' }}
                    onFinish={e => {
                      handleClick(e, modelF.id, null);
                    }}
                  >
                    {modelF.models.map((formInfo, index) => {

                      return (
                        <Form.List key={"Formlist" + index} name={formInfo.id} initialValue={dataMap[modelF.id] ? dataMap[modelF.id] : [{}]}>
                          {(feilds, { add, remove }) => {
                            return (
                              <React.Fragment key={'key' + index}>
                                <div className='group_title' key={"groupForm" + index}>
                                  <span style={{ marginLeft: '3px' }}>{formInfo.name}</span>
                                  {formInfo.multiple && (
                                    <>
                                      <Button type="primary" className='button_form_add' onClick={() => {
                                        add()
                                      }}> ＋添加</Button>
                                    </>
                                  )}
                                </div>
                                {feilds.map((item, _suoyi) => (
                                  <div key={"big_row_zone" + _suoyi}>
                                    {formInfo.multiple && (
                                      <Row key={'index-' + _suoyi}>
                                        <div className='head_card'>
                                          <div className="title" >{formInfo.name}{_suoyi + 1}</div>
                                          <div className="dashed"><hr className='dhr'></hr></div>
                                          {_suoyi > 0 ? (
                                            <MinusCircleOutlined
                                              className="dynamic-delete-button"
                                              style={{ position: 'absolute', color: 'red', right: '2%', marginTop: 5, marginLeft: 8 }}
                                              onClick={() => remove(_suoyi)} />
                                          ) : null}
                                        </div>
                                      </Row>
                                    )}
                                    <Row key={'ind-' + _suoyi} style={{ marginTop: '5px' }}>
                                      {formInfo.attributes.map((property, sn) => {
                                        let span = property.span ? property.span : formInfo.span;
                                        return (CreateForm(modelF.id, property, sn, span, true, item, formInfo.id, _suoyi))
                                      })}
                                    </Row>
                                  </div>
                                ))}
                              </React.Fragment>
                            )

                          }}
                        </Form.List>
                      )
                    })}

                    <Row>
                      <Space
                        style={{ marginLeft: '33%', display: 'flex', marginBottom: 8, width: '100%', marginTop: '10px', textAlign: 'center' }}
                      >
                        {/* <Button type="primary" htmlType="submit" className='button_form'>保存</Button> */}
                        {hasEdit && (
                          <Button type="primary" htmlType="submit" className='button_form'>保存</Button>
                        )}
                        <Button className='ret_button_form' onClick={backToList}>返回</Button>
                      </Space>
                    </Row>
                  </Form>
                )}
                {modelF.form_type == "component" && (
                  <div>
                    {/* <Card style={{ width: '100%' }}> */}
                    <Form
                      // layout={formLayout}
                      // form={queryForm}
                      onFinish={values => { loadingAlertQuery(values) }}
                      initialValues={{ layout: 'inline' }}
                      style={{ display: 'inline-flex', marginTop: '10px', marginLeft: '-70px', width: '100%' }}
                    >

                      <Space>
                        <Form.Item label="变更日期：" name={"alter_at"}>
                          <DatePicker.RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="变更事项" name={"alter_event_key"} >
                          <Select
                            showSearch
                            placeholder="请选择变更事项"
                            optionFilterProp="children"
                            options={modalInitOptions["alertType"]}
                          />
                        </Form.Item>
                        <Form.Item {...buttonItemLayout}>
                          <Button type="primary" htmlType="submit" >搜索</Button>
                        </Form.Item>
                      </Space>
                    </Form>

                    {/* </Card> */}
                    <Card style={{ width: '100%' }}>
                      <Table
                        dataSource={queryList}
                        rowSelection={{
                          onChange: (_, rows) => {
                            // setSelectedAssets(rows ? rows.map(({ id }) => id) : []);
                            // setSelectedAssetsName(rows ? rows.map(({ name }) => name) : []);
                          },
                        }}
                        columns={[
                          {
                            title: '变更日期',
                            dataIndex: 'alter_at',
                            render(value) {
                              return moment(value * 1000).format("YYYY-MM-DD HH:mm:ss")
                            }
                          },
                          {
                            title: '变更状态',
                            dataIndex: 'alter_status',
                            render(val) {
                              return val == 1 ? "已确认" : "未确认"
                            }
                          },
                          {
                            title: '变更事项',
                            dataIndex: 'alter_event_key',
                            render(val) {
                              let list = modalInitOptions["alertType"];
                              let title = "";
                              list.map((item, _) => {
                                if (item.value === val) {
                                  title = item.label
                                }
                              })
                              return title;
                            }
                          },
                          {
                            title: '变更前',
                            dataIndex: 'before_alter',
                          },
                          {
                            title: '变更后',
                            dataIndex: 'after_alter',
                          },
                          {
                            title: '变更说明',
                            dataIndex: 'alter_instruction',
                            render(val) {
                              return val;
                            },
                          },
                          {
                            title: '变更人',
                            dataIndex: 'managed_state',
                            render(val) {
                              return val;
                            },
                          },
                          {
                            title: '发起人',
                            dataIndex: 'alter_sponsor',
                            render(val) {
                              return val;
                            },
                          },
                          {
                            title: '创建方式',
                            width: '180px',
                            render: (e) => (
                              <></>
                            ),
                          },
                        ]}
                        rowKey='id'
                        size='small'
                      ></Table>
                    </Card>
                  </div>
                )}
              </Tabs.TabPane>
            )
          })}

        </Tabs>

      </div>
      <OperationModal
        width={modalWidth}
        theme={operateName}
        operateType={operateType}
        setOperateType={setOperateType}        
        initData={dialogInitData}
        reloadList={async(value:any,operateType:string) => {
          if(operateType==OperateType.SelectUseStorage){
            let refForm = refArr[operateField.formId].current;
            if (operateField.formId != operateField.groupId) {
              let formValues = refForm.getFieldsValue()
              formValues[operateField.groupId][operateField.index][operateField.extend.ctrl_name] = value.name;
              refForm.setFieldsValue(formValues);
            }
          }
          
        }}
      />
      <CommonModal Form={alertState.Form} operate="" Modal={alertState.Modal} isOpen={dialogIsOpen} ></CommonModal>

    </>
  );
}
