import React, { Fragment, createRef, useContext, useEffect, useState } from 'react';
import { Button, Checkbox, Col, DatePicker, Form, FormInstance, Input, Radio, Row, Select, Space, Table, Tabs, TimePicker, TreeSelect, message } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { GroupOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { CommonStateContext } from '@/App';
import { v4 as uuidv4 } from 'uuid';
import Accordion from './Accordion';
import CustomForm from './Form';
import './locale';
import './style.less';
import './Form/index.less'
import _ from 'lodash';
import { AssetStatusUtils } from './Form/operate_type';
import { getOrganizationTree } from '@/services/assets';
import { getRoomList } from '@/services/assets/computer-room';
import { getCabinetList } from '@/services/assets/device-cabinet';
import { getUsers } from '@/services/account';
import { getDictValueEnum } from '@/services/system/dict';
import { getProducersByType } from '@/services/assets/producer';
import { getAssetExtendsById, getAssetTableByTypeAndId,insertAssetMaintenance, insertAssetManagement, updateAssetMaintenance, updateAssetManagement } from '@/services/assets/asset';
import { getDeviceModelByCondition } from '@/services/assets/device-models';
import { getAssetById, insertAsset, updateAsset, insertAssetExtends } from '@/services/assets/asset';



export enum OperateType {
  ChangeOrganize = 'changeOrganize',
  None = 'none',
}

import { modelsAttributes } from './Form/device_type_models';
import queryString from 'query-string';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';

const deviceType = location.pathname.split('/')[3];

export default function () {

  const { t } = useTranslation('assets');
  let attrs: any = modelsAttributes["type_" + deviceType].models;
  const commonState = useContext(CommonStateContext);
  const assetId = queryString.parse(location.search).id === undefined ? 0 : parseInt("" + queryString.parse(location.search).id);

  const [formRef, setFormRef] = useState<any>()
  //后期要优化的内容，Jeff Guo
  const [tabFIndex, setTabFIndex] = useState<string>("form_base_position")
  const [tabFFIndex, setTabFFIndex] = useState<string>();
  const [initOptions, setInitOptions] = useState({});  //选项值
  const [formPosition, setFormPosition] = useState<string>("");
  const [formModel, setFormModel] = useState<any>({});
  const [formRelations, setFormRelations] = useState<any>({});
  const [selectMap, setSelectMap] = useState({});
  const [hasEdit, setHasEdit] = useState<boolean>(true);
  const [categoryData, setCategoryData] = useState({});
  //设备/资产信息
  const [assetInfo, setAssetInfo] = useState<any>({});
  //处理各个表单的字段和中文信息
  const [formFieldMap, setFormFieldMap] = useState<any>({});

  const [formIdMap, setFormIdMap] = useState({});

  //页面表单运维服务项选择
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  //服务项
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


  const history = useHistory();
  const [refreshLeft, setRefreshLeft] = useState<string>(_.uniqueId('refresh_left'))
  const getFieldsMap = (form_id, current_form) => {
    let strMap = new Map();
    console.log("form_id", current_form)
    current_form.map((modelF, _) => {
      if (form_id == modelF.name) {
        if (modelF.has_next) {
          modelF.item.map((modelFF, _) => {
            strMap.set(modelFF.name, {
              name_cn: modelFF.name_cn,
              data_type: modelFF.data_type ? modelFF.data_type : "string"
            })
          })
        } else {
          current_form.map((modelF, _) => {
            strMap.set(modelF.name, {
              name_cn: modelF.name_cn,
              data_type: modelF.data_type ? modelF.data_type : "string"
            })
          })
        }
      }
    })
    return strMap
  }
  //后期要优化的内容，Jeff Guo
  const fieldSpecialEvent = (e, item: any, formId: string, groupId: string, index) => {
    // item.formId = formId;
    // item.groupId = groupId;
    // console.log('extendEvent', item);
    // if (item.extend.type === "dialog") {
    //   console.log("extendEvent", item);
    //   item.index = index;
    //   item.groupId = groupId
    //   setOperateField(item);
    //   getAssetTreeByDeviceType(13, 1).then(({ dat }) => {
    //     setDialogInitData(dat);
    //     setOperateType(OperateType.SelectUseStorage)
    //     setOperateName(item.extend.label);

    //   })

    // } else if (item.extend.type === "checkbox") {
    //   console.log("hasCheckoutEvt", e.target.checked);
    //   let refForm = refArr[formId].current;
    //   // 
    //   let formValues = refForm.getFieldsValue();
    //   formValues[groupId][0][item.extend.ctrl_name] = (e.target.checked ? 1 : 0);
    //   console.log("formValues", formValues)
    //   refForm.setFieldsValue(formValues);
    // }

  }
  //后期要优化的内容，Jeff Guo
  const onFieldsChange = (formId: string, id: string, value: any, group_id, field_list_index: number) => {
    // 该方法对所有表单根据业务情况 来判断处理，每一个表单 form 每一个属性 id 来控制
    console.log("※※※※※※※※※后期优化部分※※※※※※※※※※", formId);
    let refForm = formRef.current;
    if (formId == "form_base_position") {//处理资产基本信息的表单
      let formValues = refForm?.getFieldsValue();
      if (id == "device_producer") {
        formValues[group_id][field_list_index].subtype = "";
        formValues[group_id][field_list_index].outline_structure = "";
        formValues[group_id][field_list_index].specifications = "";
        formValues[group_id][field_list_index].u_number = "";
        formValues[group_id][field_list_index].device_model = ""
        refForm?.setFieldsValue(formValues);
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
        let formValues = refForm?.getFieldsValue();
        selectMap["device_models"].forEach(item => {
          if (item.id == value) {
            formValues[group_id][field_list_index]["subtype"] = item.subtype;
            formValues[group_id][field_list_index]["outline_structure"] = item.outline_structure;
            formValues[group_id][field_list_index]["specifications"] = item.specifications;
            formValues[group_id][field_list_index]["u_number"] = item.u_number;

          }
        });
        refForm?.setFieldsValue(formValues);
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
      let formValues = refForm?.getFieldsValue();
      console.log("调试", formId, formValues);
      if (id == "maintenance_type") {
        formValues[group_id][field_list_index]["maintenance_provider"] = null;
        refForm?.setFieldsValue(formValues);
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

  //渲染表单每一项
  const CreateForm = (formId, item, sn, span, multiple, field: any, group_id: any, field_list_index) => {
    // console.log("渲染表单每一项",formId, multiple, field,group_id);
    // console.log("渲染表单每一项",item);
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
        // debugger;
        return <Col span={span} key={"item-" + sn}>
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
            <Input.Password autoComplete='true'   disabled={item.readonly} placeholder={`请输入您的${item.label}`}
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
            options={item.refer?selectMap[item.refer]:selectMap[formId + "." + item.name]}
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
              treeData={item.refer?selectMap[item.refer]:selectMap[formId + "." + item.name]}
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
          <DatePicker format="YYYY-MM-DD" placeholder={`请输入您的${item.label}`} />
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

  useEffect(() => {
    initBaseOptions();
    dealFieldsToEveryForm();
    tabClick(tabFIndex, "0"); 
     
  }, []);


  useEffect(() => {
    console.log("更新表单")
    if (formPosition=="form_base_position"  && assetId > 0) {      
      getAssetById(assetId).then(({ dat }) => {
        let refForm = formRef.current;
        let formValues = refForm?.getFieldsValue();
        if(formValues!==undefined) {
          formValues["group_base"][0] = dat;
          formValues["group_position"][0] = dat;
          refForm?.setFieldsValue(formValues);
        }        
        let modelList = new Array();
        selectMap["device_models"].forEach(item => {
          if (item.producer_id == dat.device_producer) {
            modelList.push({
              value: item.id,
              label: item.name
            })
          }
        });
        selectMap[formPosition + ".device_model"] = modelList;
        setSelectMap({ ...selectMap })
        getCabinetList(dat.equipment_room).then((res) => {
          let cabinetList = new Array()
          res.dat.forEach((item) => {
            cabinetList.push({
              value: item.id,
              label: item.cabinet_code
            });
          })
          selectMap[formPosition + ".owning_cabinet"] = cabinetList;
          setSelectMap({ ...selectMap });
        });

        setAssetInfo(formValues);
      })
    }
    initSelectOptions(formPosition);
    if(formPosition!=="form_base_position" && (formPosition.indexOf("form-") > -1 || formPosition.indexOf("form_") > -1) && assetId > 0){
       dealExtendsion(formPosition);
    }
    if(formPosition.indexOf("table-") > -1){
      dealMantiance2Manage(formPosition);
    }
    
  }, [formPosition]);
  //处理维保和管理信息
  const dealMantiance2Manage =(formPosition:string) => {
    // 处理不同数据源的信息
    if(assetId<=0){
       return 
    }
    let keys = formPosition.split("-");
    getAssetTableByTypeAndId(keys[1], assetId).then((res) => {
      console.log("优化处理--------对应不同的设备");
      if (res != null && res.dat != null) {
        const valueMap = new Map()
        for (const k of Object.keys(res.dat)) {
          valueMap.set(k, res.dat[k])
        }
        //优化处理--------对应不同的设备
        if (formPosition == "table-maintenance" || res.dat.maintenance_type != undefined) {
          getProducersByType(res.dat.maintenance_type).then(({ dat }) => {
            let list = new Array()
            dat.forEach((item) => {
              list.push({
                value: item.id,
                label: item.alias
              });
            })
            selectMap[formPosition + ".maintenance_provider"] = list;
            setSelectMap({ ...selectMap });
          })
        }
        formIdMap[formPosition] = res.dat.id;
        setFormIdMap({ ...formIdMap })
        let formFields = formFieldMap[formPosition];

        let mapValues = {};

        for (let index in formFields) {
          let groupFields = formFields[index];
          let rowDataMap = new Map()
          for (let itemIndex in groupFields.item) {
            let field = groupFields.item[itemIndex];
            rowDataMap.set(field.name,showValue(valueMap.get(field.name),  field.data_type))
          }
          let group = new Array();
          group.push(Object.fromEntries(rowDataMap));
          mapValues[groupFields.name] = group;
          console.log("groupFields.name",groupFields.name,group);
        }
        formRef.current?.setFieldsValue(mapValues);     
        //从数据服务上加载数据完成
      }
    });
  }

  //处理扩展信息  
  const dealExtendsion =(formPosition)=>{
    if(formPosition!=="form_base_position" && (formPosition.indexOf("form-") > -1 || formPosition.indexOf("form_") > -1) && assetId > 0){
    let params = {
      asset_id: assetId,      
    };
    if(formPosition.indexOf("form_") > -1){
      params["property_category"] =formPosition
    }
    if(formPosition.indexOf("form-") > -1){
      params["config_category"] =formPosition
    }
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
            itemsChars += "\"" + item.property_name + "\":\"" + item.property_value + "\",";
          })
          itemsChars = "{" + itemsChars.substring(0, itemsChars.length - 1) + "}";
          group.push(JSON.parse(itemsChars));
        })
        mapValues[key] = group;
      }) 
      formRef.current?.setFieldsValue(mapValues);     
      //从数据服务上加载数据完成
      })
    }
  }

  const dealFieldsToEveryForm = () => {
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


  //页面初始化-赋值操作
  const initBaseOptions = () => {
    if (deviceType != null) {
      getRoomList({}).then(({ dat }) => {
        var roomList = new Array()
        dat.list.forEach((item) => {
          roomList.push({
            value: item.id,
            label: item.room_name
          });
        })
        selectMap["rooms"] = roomList;
        setSelectMap({ ...selectMap });
      });
      getOrganizationTree({}).then(({ dat }) => {
        selectMap["organs"] = dat;
        setSelectMap({ ...selectMap });
      });
      let params = {
        deviceType: deviceType
      }
      getDeviceModelByCondition(params).then(({ dat }) => {
        var map = new Map()
        var producerList = new Array()
        var modelList = new Array()
        dat.list.forEach((item) => {
          if (!map.has(item.producer_id)) {
            producerList.push({
              value: item.producer_id,
              label: item.alias
            })
            map.set(item.producer_id, item.alias);
          }
          modelList.push(item)
        })
        selectMap["device_models"] = modelList;
        selectMap["device_producers"] = producerList;
        setSelectMap({ ...selectMap });
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
        selectMap["system_users"] = userList;
        setSelectMap({ ...selectMap });
      });
    }
  }

  const datalDealValue = (value, data_type) => {
    if (value != null && data_type == "date") {
      value = moment(moment(value).format('YYYY-MM-DD')).valueOf() / 1000
    } else if (value != null && data_type == "int") {
      value = parseInt(value);
    } else if (value != null && data_type == "float") {
      value = parseFloat(value);
    } else if (value != null && data_type == "timestamp") {
      value = moment(moment(value).format('YYYY-MM-DD HH:mm:ss')).valueOf() / 1000
    } else if(value != null && data_type == "json"){
      value = "";
    }
    return value;
  }
  //回显结果调用
  const showValue = (value, data_type) => {    
    if (value != null && data_type == "date") {
      value = moment(value * 1000);
    } else if (value != null && data_type == "timestamp") {
      value = moment(value * 1000);
    }
    return value;
  }

  const backToList = () => {
    history.push('/devicemgt')
  }

  const submitForm = (formValue: any, formId: string, fields: {}, recordId:any) => {
    console.log("submitForm", formId, fields)
    if (formId === 'form_base_position') {
      let postParams: any = { device_status: 1, device_type: parseInt(deviceType) };
      let baseFieldMap = getFieldsMap("group_base", fields);
      let positionFieldMap = getFieldsMap("group_position", fields);
      let submitFieldMap = new Map();
      for (let fieldkey in formValue.group_base[0]) {
        let value = formValue.group_base[0][fieldkey];
        if (baseFieldMap.has(fieldkey)) {
          submitFieldMap.set(fieldkey, datalDealValue(value, baseFieldMap.get(fieldkey).data_type))
        }
      }
      for (let fieldkey in formValue.group_position[0]) {
        let value = formValue.group_position[0][fieldkey];
        if (positionFieldMap.has(fieldkey)) {
          submitFieldMap.set(fieldkey, datalDealValue(value, positionFieldMap.get(fieldkey).data_type))
        }
      }
      if (assetId > 0) {
        postParams.id = assetId
        let params = { ...postParams, ...Object.fromEntries(submitFieldMap) }
        delete params.device_status;
        updateAsset(params).then((res) => {
          message.success('修改成功');
        })
      } else {
        insertAsset({ ...postParams, ...Object.fromEntries(submitFieldMap) }).then((res) => {
          message.success('添加成功');
          setRefreshLeft(_.uniqueId('refresh_left'));
          window.location.href = "/devicemgt/add/" + deviceType + "?id=" + res.dat + "&status=1&index=2&edit=1";
        })
        // }   
        console.log('Success:', postParams);
      }
    }else if(formId === 'form_cpu' || formId === 'form_memory' || formId === 'form_physical_disk' || formId === 'form_logical_disk'
      || formId === 'form_power' || formId === 'form_network_port' || formId === 'form_display_code' || formId === 'form_fan'
      || formId === 'form-netconfig') {

      let subItem = new Array;
      for (let nodeKey in formValue) {
        let fieldMap = getFieldsMap(nodeKey, fields);
        for (let key in formValue[nodeKey]) {
          console.log(nodeKey, key)
          let value = formValue[nodeKey][key];
          let groupId = uuidv4();

          for (let item in value) {
            let cn_datatype = fieldMap.has(item) ? fieldMap.get(item) : null;
            let row = {
              property_category: nodeKey,
              property_name: item,
              property_value: datalDealValue(value[item],cn_datatype != null ? cn_datatype.data_type :"string" ),
              property_name_cn: cn_datatype != null ? cn_datatype.name_cn : item,
              group_id: groupId,
              asset_id: assetId,
              config_category: tabFIndex,
            }
            subItem.push(row)
          }
        }
      }
      insertAssetExtends(subItem).then((res) => {
        message.success('添加成功');
      })
    } else if (formId === 'table-maintenance') {
      console.log('submit form', fields, formValue)
      let fieldMap = getFieldsMap("form-maintenance", fields);
      let submitFieldMap = new Map();
      for (let fieldkey in formValue["form-maintenance"][0]) {
        let value = formValue["form-maintenance"][0][fieldkey];
        if (fieldMap.has(fieldkey)) {
          let field = fieldMap.get(fieldkey);
          submitFieldMap.set(fieldkey, datalDealValue(value, field.data_type))
        }
      }
      let postParams: any = { ...{ asset_id: assetId }, ...Object.fromEntries(submitFieldMap) };
      if (postParams.maintenance_type != undefined && postParams.maintenance_type != null) {
        postParams.maintenance_type = postParams.maintenance_type
      }
      if (recordId != null && parseInt(recordId) > 0) {
        postParams.id = recordId;
        updateAssetMaintenance(postParams).then((res) => {
          message.success('修改成功');
        })
      } else {
        insertAssetMaintenance(postParams).then((res) => {
          message.success('添加成功');
        })
      }

    } else if (formId === 'table-management') {
      let submitFieldMap = new Map();
      for (let nodeKey in formValue) {
        console.log(nodeKey);
        let fieldMap = getFieldsMap(nodeKey, fields);
        for (let fieldkey in formValue[nodeKey]) {
          console.log(nodeKey, fieldkey)
          let value = formValue[nodeKey][fieldkey];
          for (let item in value) {
            if (fieldMap.has(item)) {
              submitFieldMap.set(item, datalDealValue(value[item], fieldMap.get(item).data_type))
            }
          }
        }
      }
      let postParams: any = { ...{ asset_id: assetId }, ...Object.fromEntries(submitFieldMap) };
      if (recordId != null && parseInt(recordId) > 0) {
        postParams.id = recordId;
        updateAssetManagement(postParams).then((res) => {
          message.success('修改成功');
        })
      } else {
        insertAssetManagement(postParams).then((res) => {
          message.success('添加成功');
        })
      }
    }
  }

  const initSelectOptions =(operateFormId) => {
    for (let i = 0; i < initOptions[operateFormId]?.length; i++) {
      let item = initOptions[operateFormId][i];
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
            selectMap[operateFormId + "." + item.name] = options;
            setSelectMap({ ...selectMap })
          } else {
            selectMap[operateFormId + "." + item.name] = value;
            setSelectMap({ ...selectMap })
          }
        })
      } else if (item.source == 'table') {

      } else if (item.source == 'initial') {
        selectMap[operateFormId + "." + item.name] = selectMap[item.refer];
        setSelectMap({ ...selectMap })
      }
    }  
  }
  //后期要优化的内容，Jeff Guo
  const tabClick = (key: string, parentId?: any) => {
    console.log('TAB change', key, parentId);
    let operateFormId = "";
    if (parentId == "0") {
      setTabFIndex(key)
      //不处理表单数据  
      operateFormId = key;
      if (formRelations[key].length > 1) {
        setTabFFIndex(formRelations[key][0]) //二级TAB
        operateFormId = formRelations[key][0];
      }
    } else {
      setTabFFIndex(key) //二级TAB
      operateFormId = key;
    }
    setFormPosition(operateFormId);
    setFormRef(createRef<FormInstance>());
    // console.log("表单属性信息", formModel[operateFormId]);
    // console.log("是否是数组", _.isArray(formModel[operateFormId]));
    console.log("operateFormId",operateFormId);
  }
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log("selectedRowKeys: " + selectedRows)
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  }
  //提交表单数据
  const handleClick = (values: any,  category) => {
    let record_id = formIdMap[formPosition] != undefined ? formIdMap[formPosition] : null;
    if (formPosition == "table-maintenance") {
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
    submitForm(values, formPosition, formFieldMap[formPosition], record_id);
  };

  return (

    <PageLayout icon={<GroupOutlined />} title={t('title')}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '400px', display: 'list-item' }}>
          <Accordion
            isAutoInitialized={false}
            assetStatus={AssetStatusUtils}
            handleClick={async (value: any, status, index: any) => {
              var querysJSON = value.query != null ? eval(value.query) : '{}'
              if (value.type === 'asset') {
                getAssetById(querysJSON.ID).then(({ dat }) => {
                  window.location.href = "/devicemgt/add/" + dat.device_type + "?id=" + querysJSON.ID + "&index=" + index + "&status=" + status;
                })
              } else {
                commonState.setQueryCondition(JSON.stringify(value.query));
                window.location.href = "/devicemgt?query=1&index=" + index + "&status=" + status;
              }

            }}
          />
        </div>
        <div className='table-content' style={{ paddingLeft: '0px', marginTop: "0px" }}>

          <Tabs className='tab-list' activeKey={tabFIndex} onTabClick={(key) => {
            tabClick(key, "0");
          }}>
            {attrs.length > 0 && attrs.map((modelF, i) => {
              if (modelF.form_type === 'group') {
                let children = new Array<any>();
                children.push(modelF.id);
                formModel[modelF.id] = modelF.models;
                formRelations[modelF.id] = children;
                initOptions[modelF.id] = modelF.initial_data
              }
              if (modelF.form_type === 'form') {
                let modelIds = Array.from(new Set(modelF.models.map(obj => obj.id)))
                formRelations[modelF.id] = modelIds;
              }

              return (
                <Tabs.TabPane tab={modelF.name} key={modelF.id} >
                  {modelF.form_type === "form" && (
                    <Tabs className='tab-child-list' activeKey={tabFFIndex} onTabClick={key => {
                      tabClick(key, modelF.id);
                    }}>
                      {modelF.models.map((modelFF, index) => {
                        formModel[modelFF.id] = modelFF;
                        initOptions[modelF.id] = modelFF.initial_data
                        return (
                          <Tabs.TabPane tab={modelFF.name} key={modelFF.id}  >
                          </Tabs.TabPane>
                        )
                      })}
                    </Tabs>
                  )}
                </Tabs.TabPane>
              )
            })}
          </Tabs>

          <Form
            labelAlign="right"
            ref={formRef}
            key={formPosition}
            style={{ width: '100%' }}
            onFinish={e => {
              handleClick(e, null);
            }}
          >
            {_.isArray(formModel[formPosition]) == true && formModel[formPosition]?.map((formInfo, index) => {
              return (
                <Form.List key={"Formlist" + index} name={formInfo.id} initialValue={[{}]}>
                  {(feilds, { add, remove }) => {
                    return (
                      <React.Fragment key={'key' + index} >
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
                          <div key={"big_row_zone" + _suoyi} className='item_zone'>
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
                                return (CreateForm(formPosition, property, sn, span, true, item, formInfo.id, _suoyi))
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
            {_.isArray(formModel[formPosition]) == false && (
              <Form.List key={"field_list_" + formPosition} name={formPosition} initialValue={[{}]}>
                {(field, { add, remove }) => {
                  return (
                    <>
                      {field.map((item, _index) => (
                        <div key={"F" + _index} className='item_zone'>
                          <Row key={'index-' + _index}>
                            <div className='head_card'>
                              <div className="title" >{formModel[formPosition]?.name}{_index + 1}</div>
                              <div className="dashed"><hr className='dhr'></hr></div>
                              {_index > 0 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  style={{ position: 'absolute', color: 'red', right: '2%', marginLeft: 8 }}
                                  onClick={() => remove(_index)} />
                              ) : null}
                            </div>
                          </Row>
                          <Row style={{ marginTop: '0px' }}>
                            {formModel[formPosition]?.attributes.map((property, sn) => {
                              let span = property.span ? property.span : formModel[formPosition]?.span;
                              return (CreateForm(formPosition, property, sn, span, true, item, formPosition, _index))
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
                          {formModel[formPosition]?.multiple && (
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
            )}
            {_.isArray(formModel[formPosition]) == true && (
              <Row>
                <Space
                  style={{ marginLeft: '33%', display: 'flex', marginBottom: 8, width: '100%', marginTop: '10px', textAlign: 'center' }}
                >
                  {hasEdit && (
                    <Button type="primary" htmlType="submit" className='button_form'>保存</Button>
                  )}
                  <Button className='ret_button_form' onClick={backToList}>返回</Button>
                </Space>
              </Row>
            )}
          </Form>

          {/* <CustomForm
              type={parseInt(deviceType)}
              text='资产表单信息'
              options={optionMap}
              keyId={assetId}
              handleClick={async (formValue: any, formId: string,fields:{},category,recordId) => {
                  submitForm(formValue,formId,fields,category,recordId);
              }}
          /> */}

        </div>
      </div>
    </PageLayout>
  );
}
