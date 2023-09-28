import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Form, message } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { GroupOutlined } from '@ant-design/icons';
import { useLocation, useParams } from 'react-router-dom'
import { CommonStateContext } from '@/App';
import { IRawTimeRange } from '@/components/TimeRangePicker';
import { v4 as uuidv4 } from 'uuid';
import Accordion from '@/components/Accordion';
import CustomForm from '@/components/CustomForm';
import './locale';
import './style.less';
import _ from 'lodash';
import {assetStatus} from './Form/asset_utils'
import { getOrganizationTree } from '@/services/assets';
import { getRoomList } from '@/services/assets/computer-room';
import { getCabinetList } from '@/services/assets/device-cabinet';
import { getUsers } from '@/services/account';
import { getDictValueEnum } from '@/services/system/dict';
import {insertAssetMaintenance,insertAssetManagement, updateAssetMaintenance, updateAssetManagement} from '@/services/assets/asset';
import { getDeviceModelByCondition } from '@/services/assets/device-models';
import { getAssetById, insertAsset, updateAsset ,insertAssetExtends } from '@/services/assets/asset';



export enum OperateType {
  ChangeOrganize = 'changeOrganize',
  None = 'none',
}

import modelsAttributes from './Form/device_type_models';
import queryString from 'query-string';
import moment from 'moment';

const deviceType = location.pathname.split('/')[3];
// 

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


const optionMap = {};

if(deviceType!=null){
  getRoomList({}).then(({ dat }) => {
      var roomList  = new Array()
      dat.list.forEach((item) => {
        roomList.push({
          value: item.id,
          label: item.room_name
        });
      })
      optionMap["rooms"] = roomList;
  }); 
  getOrganizationTree({}).then(({ dat }) => {
    optionMap["organs"] = dat;
  });  
  let params ={
    deviceType:deviceType
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
    optionMap["device_models"] = modelList;
    optionMap["device_producers"] = producerList;
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
  getUsers().then(({ dat }) => {
    var userList = new Array()
    dat.forEach((item) => {
      userList.push({
        value: item.id,
        label: item.nickname
      })
    })
    optionMap["providers"] = userList;
  });

  
  
}



export default function () {

  const { t } = useTranslation('assets');

  const commonState = useContext(CommonStateContext);

  const assetId = queryString.parse(location.search).id === undefined ? 0 : parseInt("" + queryString.parse(location.search).id);


  const getFieldsMap=(form_id,current_form)=>{
    let strMap = new Map();
    console.log("form_id",current_form)
    current_form.map((modelF, _) => {
      if(form_id==modelF.name){
        if(modelF.has_next){
          modelF.item.map((modelFF, _) => {
             strMap.set(modelFF.name,{
               name_cn :modelFF.name_cn,
               data_type:modelFF.data_type?modelFF.data_type:"string"
             })          
          })
        }else{
          current_form.map((modelF, _) => {
            strMap.set(modelF.name,{
              name_cn :modelF.name_cn,
              data_type:modelF.data_type?modelF.data_type:"string"
            })         
         })
        }
      }      
    })
    return strMap
  }


  useEffect(() => {



  }, []);

  const datalDealValue=(value,key,data_type) => {
      if(value!=null && data_type=="date"){
          value= moment(moment(value).format('YYYY-MM-DD')).valueOf()/1000
      }else if(value!=null &&  data_type=="int"){
        value= parseInt(value);
      }else if(value!=null &&  data_type=="float"){
        value= parseFloat(value);
      }else if(value!=null && data_type=="timestamp"){
        value= moment(moment(value).format('YYYY-MM-DD HH:mm:ss')).valueOf()/1000
      }
      return value;  
  }

  const submitForm =(formValue: any, formId: string,fields:{},category,recordId)=>{
      console.log("submitForm",formId,fields)
      if (formId === 'form_base_position') {
        let postParams :any= { device_status: 1, device_type: parseInt(deviceType) };
        let baseFieldMap = getFieldsMap("group_base",fields);
        let positionFieldMap = getFieldsMap("group_position",fields);
        let submitFieldMap = new Map();
        for (let fieldkey in formValue.group_base[0]){
            let value = formValue.group_base[0][fieldkey];
            if(baseFieldMap.has(fieldkey)){
              submitFieldMap.set(fieldkey,datalDealValue(value,fieldkey,baseFieldMap.get(fieldkey).data_type) )
            }
        }
        for (let fieldkey in formValue.group_position[0]){
          let value = formValue.group_position[0][fieldkey];
          if(positionFieldMap.has(fieldkey)){
              submitFieldMap.set(fieldkey,datalDealValue(value,fieldkey,positionFieldMap.get(fieldkey).data_type) )
          }
        }
        if(assetId>0){
          postParams.id = assetId
          let params = {...postParams, ...Object.fromEntries(submitFieldMap)}
          delete params.device_status;
          updateAsset(params).then((res) => {
              message.success('修改成功');
          })
        }else{
          insertAsset({ ...postParams, ...Object.fromEntries(submitFieldMap) }).then((res) => {
            message.success('添加成功');
            window.location.href = "/devicemgt/add/" + deviceType + "?id=" + res.dat+"&status=1&index=2&edit=1";
          })
          // }   
          console.log('Success:', postParams);
        }                
      }
      
      if (formId === 'form_cpu' || formId === 'form_memory' || formId==='form_physical_disk' || formId==='form_logical_disk'
      || formId==='form_power' || formId === 'form_network_port' || formId === 'form_display_code'   || formId === 'form_fan'            
      || formId==='form-netconfig') {
        
        let subItem = new Array;                
        for (let nodeKey in formValue) {  
          let fieldMap = getFieldsMap(nodeKey,fields);
          for (let key in formValue[nodeKey]) {
            console.log(nodeKey,key)
            let value = formValue[nodeKey][key];
            let groupId = uuidv4();                   

            for (let item in value) {
              let cn_datatype = fieldMap.has(item)?fieldMap.get(item):null;
              let row = {
                property_category: nodeKey,
                property_name: item,
                property_value: datalDealValue(value[item],item,cn_datatype!=null?cn_datatype.data_type:"string"),
                property_name_cn: cn_datatype!=null?cn_datatype.name_cn:item,
                group_id: groupId,
                asset_id: assetId,
                config_category: category!=null?category:formId,
              }
              subItem.push(row)
            }
          }
        }
        insertAssetExtends(subItem).then((res) => {
          message.success('添加成功');
        })
      }else if(formId==='table-maintenance'){
          console.log('submit form',fields,formValue)
          let fieldMap = getFieldsMap("form-maintenance",fields);
          let submitFieldMap = new Map();
          for (let fieldkey in formValue["form-maintenance"][0]){
              let value = formValue["form-maintenance"][0][fieldkey];
              if(fieldMap.has(fieldkey)){
                 let field = fieldMap.get(fieldkey);
                 submitFieldMap.set(fieldkey, datalDealValue(value,fieldkey,field.data_type))
              }
          }
          let postParams :any= { ...{ asset_id: assetId}, ...Object.fromEntries(submitFieldMap)};
          if(postParams.maintenance_type!=undefined && postParams.maintenance_type!=null){
              postParams.maintenance_type =postParams.maintenance_type
          }
          if(recordId!=null && parseInt(recordId)>0){
            postParams.id =recordId;
            updateAssetMaintenance(postParams).then((res) => {
              message.success('修改成功');
            })           

          }else{
            insertAssetMaintenance(postParams).then((res) => {
              message.success('添加成功');
            })
          }
          
        }else if(formId==='table-management'){
          let submitFieldMap = new Map(); 
          for (let nodeKey in formValue) { 
            console.log(nodeKey);                        
            let fieldMap = getFieldsMap(nodeKey,fields);
            for (let fieldkey in formValue[nodeKey]) {
              console.log(nodeKey,fieldkey)
              let value = formValue[nodeKey][fieldkey];
              for (let item in value) {
                  if(fieldMap.has(item)){
                    submitFieldMap.set(item, datalDealValue(value[item],item,fieldMap.get(item).data_type))
                  }
              }
            }
          }
          let postParams :any= { ...{ asset_id: assetId}, ...Object.fromEntries(submitFieldMap)};
          if(recordId!=null && parseInt(recordId)>0){
              postParams.id =recordId;
              updateAssetManagement(postParams).then((res) => {
                  message.success('修改成功');
              })
          }else{
            insertAssetManagement(postParams).then((res) => {
              message.success('添加成功');
            })
          }
        }

  }


  return (

    <PageLayout icon={<GroupOutlined />} title={t('title')}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '300px', display: 'list-item' }}>
          <Accordion
            assetStatus={assetStatus}
            handleClick={async (value: any,status,index:any) => {
              var querysJSON =value.query!=null?eval(value.query):'{}'
              if (value.type === 'asset') {
                window.location.href = "/devicemgt/add/7?id="+querysJSON.ID+"&index="+index+"&status="+status; 
              } else {
                commonState.setQueryCondition(JSON.stringify(value.query));
                window.location.href = "/devicemgt?query=1&index="+index+"&status="+status;
              }

            }}
          />
        </div>
        <div className='table-content' style={{ paddingLeft: '2px' }}>
          <CustomForm
            type={parseInt(deviceType)}
            text='资产表单信息'
            options={optionMap}
            keyId={assetId}
            formAttrbutes={modelsAttributes}
            handleClick={async (formValue: any, formId: string,fields:{},category,recordId) => {
                  submitForm(formValue,formId,fields,category,recordId);
            }}
          />

        </div>
      </div>
    </PageLayout>
  );
}
