import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Tabs, Select } from 'antd';
import { getProducersByType, getProducersListByType, addDeviceProducer, updateDeviceProducer,deleteDeviceProducer } from '@/services/assets/producer';
import { getDeviceModelByCondition, updateDeviceModel, addDeviceModel, deleteDeviceModel } from '@/services/assets/device-models';
import CommonTable from '@/components/CustomForm/CommonTable';
import CommonModal from '@/components/CustomForm/CommonModal';
import pinyin from "pinyin";
import Accordion from './Accordion';
import { exportTemplet } from '@/services/assets/asset';
import { SetConfigTables, SetConfigForms } from './Accordion/catalog'
import moment from 'moment';
import _, { set } from 'lodash';
import { getDictValueEnum,getDictDataExpByType,deleteDictDatas} from '@/services/system/dict';
import { addDictDataBySingle, updateDictDataSingle} from '@/services/system/dictdata';
import { EditOutlined } from '@ant-design/icons';
import { v4 as uuid } from 'uuid'
import { OperationModal } from '../Form/OperationModal';
import { useAntdTable } from 'ahooks';
import { OperateType } from '../Form/operate_type';
import { render } from 'react-dom';


export default function () {
  const [tableData, setTableData] = useState<any[]>([]);
  const [props, setProps] = useState<any>({});
  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});

  
  const [randomId, setRandomId] = useState<string>();
  
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedAssetRows, setSelectedAssetRows] = useState<any>([]);
  const [deviceTypeOption, setDeviceTypeOption] = useState<any[]>();

  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_flag'));
  const [total, setTotal] = useState<number>(1);   
  const [pageSize, setPageSize] = useState<number>(10);  

  const [theme, setTheme] = useState({});

  const initialPage =()=>{
    getProducersByType('producer').then(({ dat }) => {
      console.log('厂商', dat);
      let producers = new Array()
      dat.forEach((values) => {
        producers.push({
          value: values.id,
          label: values.alias,
        })
      })
      initData["producer"] = producers;
      initData["producer_id"] = producers;
      setInitData({ ...initData })

    });
    getDictValueEnum('sub_type').then((res) => {
      initData["subtype"] = res;
      setInitData({ ...initData })
    });
    getDictValueEnum('outline_structure').then((res) => {
      initData["outline_structure"] = res;
      setInitData({ ...initData })
    });
    getDictValueEnum('out_band_version').then((res) => {
      initData["out_band_version"] = res;
      setInitData({ ...initData })
    });
  }

  useEffect(() => {    
     
  }, []);

  const deleteOperates = async (type, ids) => {
    if (type == "device_model_set") {
      await deleteDeviceModel(ids).then(res => {
        message.success("删除成功");        
        getListData(businessForm.query);  
      });
    }else if (type == "producer_set") {
      await deleteDeviceProducer(ids).then(res => {
        message.success("删除成功");        
        getListData(businessForm.query);  
      });
    }else if(type == "asset_expansion_set"){      
      await deleteDictDatas(ids).then(res => {
        message.success("删除成功");        
        getListData(businessForm.query);  
      });
    }
  }
  const exportDatas = async () => {
    let url = "/api/n9e/asset-basic/templet";
    let params = {};
    let exportTitle = "资产";
    console.log("exportDatas",businessForm);
    if (businessForm.businessId == "device_model_set") {
        url = "/api/n9e/device-model/export-xls";
        exportTitle = "设备型号"
        params["deviceType"] = parseInt(businessForm.key);
    } else if (businessForm.businessId == "producer_set") {
        url = "/api/n9e/device-producer/export-xls";
        exportTitle = businessForm.title;
        params["type"] = businessForm.key;
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
  }

  const getListData =(query)=>{
    if (businessForm.businessId == "device_model_set") {
      getDeviceModels(query);
    } else if (businessForm.businessId == "producer_set") {
      getProducersList(query);
    }else if(businessForm.businessId == "asset_expansion_set"){
      getDictData(query);
    }
  }

  const queryTable = (value,page, pagesize) => {
    if(page==undefined){
      page = 1;
      pagesize = 10;
    }else{
      setPageSize(pagesize);
    }
    console.log("查询表单数据", value);
    let query: any = {};
    if (businessForm.businessId == "device_model_set") {
        query.deviceType = businessForm.key; 
    }else if(businessForm.businessId == "producer_set"){
        query.type = businessForm.key; 
    }else if(businessForm.businessId == "asset_expansion_set"){
      query.code = "basic_expansion"; 
  }
    query = { ...query, ...value };
    query.page = page;
    query.limit = pagesize;
    console.log("queryTable", query)
    businessForm.query = query;
    setBusinessForm(businessForm)
    getListData(query)

  }
  const getProducersList = (params) => {
    getProducersListByType(businessForm.key, params).then((res) => {
      console.log("getProducersListByType", res)
      setTableData(res.dat.list);
      setTotal(res.dat.total);
    })
  }
  const getDictData = (params) => {
    getDictDataExpByType(params).then((res) => {
      console.log("getDictDataListByType", res)
      setTableData(res.dat.list);
      setTotal(res.dat.total);
    })
  }
  const getDeviceModels =async (params) => {
    await getDeviceModelByCondition(params).then((res) => {      
      setTableData(res.dat.list);
      setTotal(res.dat.total);    
      
    })
    // setTotal(1000)
    console.log("getDeviceModelByCondition", tableData,total)
  }

  const showModal = (show, text, action) => {
    setRandomId(uuid)
    console.log("showModal", show, text, action);
    if (action == "add") {//添加表单弹框
      setFormData(null);
      businessForm.isOpen = show;
      businessForm.operate = text;
      businessForm.operateEN = action;
      setBusinessForm(_.cloneDeep(businessForm));
       
      console.log("初始化数据",initData)


    } else if (action == "delete") {//删除操作
      // debugger;
      let rowsKey = localStorage.getItem(businessForm.businessId + "-select-rows")?.split(",");
      if (rowsKey != null && rowsKey.length > 0) {
        Modal.confirm({
          title: "确认要删除吗",
          onOk: async () => {
            let rows = rowsKey?.map((item) => parseInt(item));
            deleteOperates(businessForm.businessId, rows)
          },
          onCancel() { },
        });
      } else {
        message.error("请选择要删除的数据");
      }
    } else if (action == "import") {//导入弹框
      setOperateType(OperateType.AssetSetBatchImport as OperateType);      
      setTheme(businessForm);
      console.log("businessForm", businessForm);
    }else if(action == "export") {//导出数据
      exportDatas()
    }


  }
  const EditTableFun = (operate, row, businessForm) => {
    console.log("EditTableFun", operate, row, businessForm);
    setRandomId(uuid)
    setFormData(_.cloneDeep(row))
    let business = businessForm;
    business.isOpen = true;
    business.operate = "修改";
    business.operateEN = operate;
    business.operateId = row.id;
    setBusinessForm(_.cloneDeep(business));    
    console.log("当前操作的Id",business)

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
    return fieldMap;
  }
  const datalDealValue=(value,data_type) => {
    if(value!=null ){
      if (data_type == "date") {
        value = moment(moment(value).format('YYYY-MM-DD')).valueOf() / 1000
      } else if (data_type == "int") {
        value = parseInt(value);
      } else if (data_type == "float") {
        value = parseFloat(value);
      } else if (data_type == "timestamp") {
        value = moment(moment(value).format('YYYY-MM-DD HH:mm:ss')).valueOf() / 1000
      }else if (data_type == "boolean") {
        value = value==true ? 1 : 0;
      }
      return value;
    }else{
      return null;
    }      
}
  const renderFields = (text,record, field, currentConfigId)=>{
      console.log("渲染数据列",text,record,field,currentConfigId);
      let value = record[field];
      if(currentConfigId=="device_model_set"){//型号
         if(field=="producer_id"){
          initData[field].forEach((item)=>{
              if(item.value==text){
                value = item.label;
              }
          })

         }
      }

      return value;

  }

  const formSubmit = (values, businessForm) => {
    let currentID = businessForm.businessId;
    if (businessForm.type === "single") {
      currentID = businessForm.key;
    }
    let fields =dealFieldsToForm(currentID); 
    console.log("_Submit", values, businessForm);
    let submitFieldMap = new Map(); 
    for (let item in values) {
      let value =  datalDealValue(values[item],fields.get(item).data_type);
      if(value){
        submitFieldMap.set(item,value)
      }
    }
    if (businessForm.businessId == "device_model_set") {
        if (businessForm.operateEN == "add"){
          let postParams :any= { device_type: parseInt(businessForm.key), ...Object.fromEntries(submitFieldMap)};
          addDeviceModel(postParams).then((res) =>{
                message.success("添加成功"); 
                getListData(businessForm.query);  
                businessForm.isOpen =false;
                setBusinessForm(businessForm)  
          })
        }else if (businessForm.operateEN == "update"){
          let postParams :any= { device_type: parseInt(businessForm.key), ...Object.fromEntries(submitFieldMap)};
          postParams.id = businessForm.operateId;
          updateDeviceModel(postParams).then((res) =>{
                message.success("修改加成功"); 
                getListData(businessForm.query);  
                businessForm.isOpen =false;
                setBusinessForm(businessForm)  
          })
        }
    } else if (businessForm.businessId == "producer_set") {
      if (businessForm.operateEN == "add"){
        let postParams :any= { producer_type: businessForm.key, ...Object.fromEntries(submitFieldMap)};
        addDeviceProducer(postParams).then((res) =>{
              message.success("添加成功"); 
              getListData(businessForm.query);  
              businessForm.isOpen =false;
              setBusinessForm(businessForm)  
        })
      }else if (businessForm.operateEN == "update"){
        let postParams :any= { producer_type: businessForm.key, ...Object.fromEntries(submitFieldMap)};
        postParams.id = businessForm.operateId;
        updateDeviceProducer(postParams).then((res) =>{
              message.success("修改成功"); 
              getListData(businessForm.query);  
              businessForm.isOpen =false;
              setBusinessForm(businessForm)  
        })
      }

    }else if(businessForm.businessId == "asset_expansion_set"){
      //汉字转拼音处理字符串
      let pinyincharts =pinyin(values.dict_value,{
            style: "normal"
      });
      const nameToPinyin = pinyincharts.map(item=>item[0]).join('').trim()
      if (businessForm.operateEN == "add"){
        let postParams :any= { type_code: "basic_expansion", ...Object.fromEntries(submitFieldMap)};
        postParams["dict_key"]=  nameToPinyin;
        addDictDataBySingle(postParams).then((res) =>{
              message.success("添加成功"); 
              getListData(businessForm.query);  
              businessForm.isOpen =false;
              setBusinessForm(businessForm)  
        })
      }else if (businessForm.operateEN == "update"){
        let postParams :any= { type_code: "basic_expansion", ...Object.fromEntries(submitFieldMap)};
        postParams["dict_key"]=  nameToPinyin;
        postParams.id = businessForm.operateId;
        updateDictDataSingle(postParams).then((res) =>{
              message.success("修改成功"); 
              getListData(businessForm.query);  
              businessForm.isOpen =false;
              setBusinessForm(businessForm)  
        })
      }   
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '400px', display: 'list-item' }}>
        <Accordion
          handleClick={async (values: any) => {
            setTableData([])
            console.log("选中----------------------",values);
            initialPage();
            let currentConfigId = "";
            if (values.type === "group") {
               currentConfigId = values.businessId;
            } else {
              currentConfigId = values.key;
            }
            businessForm["isOpen"] = false;
            businessForm["title"] = values.title;
            businessForm["businessId"] = values.businessId;
            businessForm["key"] = values.key;
            businessForm["type"] = values.type;
            setBusinessForm((businessForm))            
            console.log("本次要配置的表单业务数据", businessForm);
            queryTable(null,1,pageSize);
            const businessZip = SetConfigTables[currentConfigId];
            businessZip.ButtonArr.forEach(e => {
              e.ClickFun = async () => {
                showModal(true, e.ButtonText, e.Action)
              }
            });
            businessZip.businessId = currentConfigId;
            businessZip.Modal = SetConfigForms[currentConfigId].Modal;
            businessZip.Modal.title = "-" + businessForm.title;
            businessZip.renderFields =(text,record,field)=>{
                 return renderFields(text,record,field,currentConfigId);
            };
            businessZip.Modal.cancel = () => {
              businessForm.isOpen = false;
              setBusinessForm(_.cloneDeep(businessForm))
            };
            businessZip.Modal.submit = async (values) => {
              formSubmit(values, businessForm)
            };
            businessZip.Form = SetConfigForms[currentConfigId].Form;
            businessZip.initData = initData;
            let tableColumns = new Array();
            businessZip.TableColumns.forEach((e) => {
              if (e.title != "操作") {
                tableColumns.push(e)
              }
            })
            tableColumns.push({
              title: '操作',
              key: 'action',
              fixed: 'right',
              width: 100,
              render: (text, row) => (
                <Space size="middle">
                  <EditOutlined onClick={() => { EditTableFun("update", row, businessForm) }}>编辑</EditOutlined>
                </Space>
              ),
            });
            businessZip.TableColumns = tableColumns;
            setProps((businessZip));
            console.log("初始化页面加载信息", businessZip);
            localStorage.removeItem(businessForm.businessId + "-select-rows")
            
          }}
        />
      </div>
      <div className='table-content' style={{ marginLeft: "20px" }}>
        <CommonModal
          Modal={props.Modal}
          Form={props.Form}
          initial={initData}
          defaultValue={formData}
          id={randomId}
          operate={businessForm.operate}
          isOpen={businessForm.isOpen} >
        </CommonModal>
        <CommonTable
          searchOption={props.searchOption}
          initial={props.initData}
          ButtonArr={props.ButtonArr}
          TableColumns={props.TableColumns}
          businessId={businessForm.businessId}
          total={total}
          queryTable={queryTable}
          TableData={tableData}
        ></CommonTable>


        <OperationModal
          operateType={operateType}
          setOperateType={setOperateType}
          initData={selectedAssetRows}
          theme={theme}
          width={650}
          reloadList={async(value:any,operateType:string) => {
            if(operateType=="assetSetBatchImport"){
              queryTable(businessForm.query,1,pageSize);
              setOperateType(OperateType.None);
            }

          }}
        />
      </div>
    </div>

  );
}
