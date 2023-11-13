import './style.less';
import React, { useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { CommonStateContext } from '@/App';
import { addAsset, getAssetDefaultConfig, getAssetsIdents, getAssetsStypes, updateAsset, getAssetsByCondition } from '@/services/assets';
import { createXhMonitor,getXhMonitor,updateXhMonitor} from '@/services/manage';
import { useLocation } from 'react-router-dom';


export default function (props: { initialValues: object; initParams: object; mode?: string }) {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [organizationId] = useState<number>(commonState.organizationId);
  const [assetTypes, setAssetTypes] = useState<{ name: string; form: any }[]>([]);
  const [assetList, setAssetList] = useState<any[]>([]);
  const [assetOptions, setAssetOptions] = useState<any[]>([]);
  const [identList, setIdentList] = useState([]);
  const [params, setParams] = useState<{ label: string; name: string; editable?: boolean; password?: boolean; items?: [] }[]>([]);
  const [form] = Form.useForm();
  const { search } = useLocation();
  const { id } = queryString.parse(search);
  const { action } = queryString.parse(search);
  const [monitor, setMonitor] = useState<any>(null);
  


  const panelBaseProps: any = {
    size: 'small',
    bodyStyle: { padding: '24px 124px 8px 124px' },
  };


  useEffect(() => {

    if(action==null || "addeditview".indexOf(action+"")<0){
      history.back()
    }
    const param = {
      page: 1,
      limit: 10000,
    };
    getAssetsStypes().then((res) => {
      const assetTypes = res.dat
        .map((v) => {
          return {
            value: v.name,
            label: v.name,
            ...v,
          };
        })
        // .filter((v) => v.name !== '主机'); //探针自注册的不在前台添加
      setAssetTypes(assetTypes);
      getAssetsByCondition(param).then((res) => {
        let options = new Array;
        res.dat.list.map((v) => {
          options.push({
            value: v.id,
            label: v.name + "[" + v.type + "]"
          });
        })
        setAssetOptions(options);
        setAssetList(res.dat.list);
        if(id!=null && id.length>0 && id!="null"){
          getXhMonitor(id).then(({dat})=>{
            if(dat!=null){
              setMonitor(dat)
              let config = dat["config"];
              delete dat["config"];
              if(config!=null && config.length>0){
                let configJson = JSON.parse(config);
                dat = {...configJson,...dat};
              }              
              form.setFieldsValue(dat);
                setTimeout(()=>{
                  genForm(res.dat.list,assetTypes);
                },1000)           
            }
          })
        }
      });

    });
    getAssetsIdents().then((res) => {
      const items = res.dat.map((v) => {
        return {
          value: v.id,
          label: v.ident,
        };
      });
      setIdentList(items);
    });
    
    
    

  }, []);

  const genForm = (assetList,assetTypes) => {
    console.log("genForm")
    let formValue = form.getFieldsValue();
    console.log(formValue);
    const asset:any = assetList.find((v:any) => v.id === formValue["asset_id"]);
    if (asset) {
      form.setFieldsValue({ type: asset.type });
      const assetType:any = assetTypes.find((v) => v.name === asset.type);
      setParams(assetType.form || []);
    }
  };
  
  const renderForm = (v) => {
    if (v.items) {
      return (
        <Select
          style={{ width: '100%' }}
          disabled={action=="view"}
          options={v.items.map((v) => {
            return { label: v, value: v };
          })}
        ></Select>
      );
    }
    if (v.password) {
      return <Input.Password disabled={action=="view"} placeholder={`填写${v.label}`} />;
    }
    return <Input disabled={action=="view"} placeholder={`填写${v.label}`} />;
  };

  const submitForm = async (values) => {
    console.log("submitForm",values);
    let config ={};
    if(params!=null && params.length>0){
      
      for(let param in params){
        let group = params[param];
        config[group.name]= values[group.name];
        delete values[group.name];
      }
      
    }
    if(id!=null && id.length>0 && id!="null"){
      values.id = parseInt(""+id);
      values["config"] = JSON.stringify(config);      
      updateXhMonitor(values).then(res=>{
        message.success('修改成功');
        location.href = "/xh/monitor"
      })
    }else{
      values["config"] = JSON.stringify(config);   
      createXhMonitor(values).then(res=>{
        message.success('操作成功');
        location.href = "/xh/monitor?assetId="+values["asset_id"]
      })
    } 
  };


  return (
    <Form
      name='asset'
      form={form}
      layout='vertical'
      onFinish={submitForm}
      onValuesChange={() => {
           genForm(assetList,assetTypes);
      }}
    >
      <Form.Item hidden name='id'>
        <Input></Input>
      </Form.Item>
      <Form.Item hidden name='type'>
        <Input></Input>
      </Form.Item>
      <div className='card-wrapper'>
        <Card {...panelBaseProps} title={t('basic')}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item label='资产名称' name='asset_id' rules={[{ required: true }]} >
                <Select style={{ width: '100%' }} disabled={action!="add"} showSearch options={assetOptions} placeholder='请选择资产'  />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='监控名称' name='monitoring_name' rules={[{ required: true }]}>
                <Input placeholder='请输入资产名称' disabled={action=="view"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='数据源类型' name='datasource_id' rules={[{ required: true }]}>
                <Select disabled={action=="view"} options={[{
                    value:1,label:'普罗米修斯'
                }]}></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item  label='监控脚本' name='monitoring_sql' rules={[{ required: false }]}>
                <Input.TextArea placeholder='请输入监控脚本'  rows={5} disabled={action=="view"}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Row gutter={10}>
                <Col span={24}>
                <Form.Item label='状态' name='status'>
                  <Select style={{ width: '100%' }} disabled={action=="view"} options={
                    [
                      { value: 0, label: '正常' }, { value: 1, label: '失效' }
                    ]

                  } />
                </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label='采集器' name='target_id'>
                    <Select style={{ width: '100%' }} disabled={action=="view"} options={identList} />
                  </Form.Item>
                </Col>
              </Row>
           </Col>
           </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label='描述' name='memo'>
                <Input.TextArea placeholder='填写描述' disabled={action=="view"} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </div>
      <div className='card-wrapper'>
      <Card {...panelBaseProps} title={'配置信息'}>
          <Row gutter={10}>
            {params.map((v) => {
              return (
                <Col key={`col=${v.name}`} span={12}>
                  <Form.Item key={`form-item${v.name}`} label={v.label} name={v.name} initialValue={props.initParams[v.name]}>
                    {renderForm(v)}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Card>
      </div>
      <div className='card-wrapper'>
        <Form.Item >
          <div className='bottom_button'>
          <Space>
            {action!=="view" && (
              <Button type='primary' htmlType='submit'  disabled={action=="view"}>
                保存
              </Button>
            )
            
            
            
            }
            
            <Button
              onClick={() => {
                window.location.href="/xh/monitor"
              }}
            >
              取消
            </Button>
          </Space>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
}
