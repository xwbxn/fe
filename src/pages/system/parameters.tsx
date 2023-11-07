import React, { createRef, useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Row, Form, Checkbox, Card, FormInstance, Select } from 'antd';
import PageLayout from '@/components/pageLayout';
import { CheckCircleOutlined, DownOutlined, GroupOutlined, SearchOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import { SetConfigTables, SetConfigForms, ParametersForms } from './catalog'
import { CommonStateContext } from '@/App';
import './style.less';
import _ from 'lodash';

export default function () {
  const commonState = useContext(CommonStateContext);

  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});

  const [refArr, setRefArr] = useState({});

  useEffect(() => {

  }, []);

  const renderFields = (text, record, field, currentConfigId) => {
    console.log("渲染数据列", text, record, field, currentConfigId);
    let value = record[field];
    return value;
  }

  const handleClick = (action: any, id: any) => {
    console.log('handleClick', action, id);
  }

  const submitForm = (formId:string) => {
    let refForm = refArr[formId].current;
    // 
    let formValues = refForm.getFieldsValue();
    console.log('submit',formValues)
  }

  return (
    <PageLayout icon={<GroupOutlined />} title={'系统参数设置'}>
      <div className='body-list' style={{ width: '94%', margin: '0 auto' }}>
        {ParametersForms.map((modelFF, index) => {
          refArr[modelFF.id] = createRef<FormInstance>();
          return (
            <div className='parameters_set' key={"main_"+modelFF.id}>
              <Form
                name="basic"
                key={"form_"+modelFF.id}
                labelCol={modelFF.items?.length>1 ? { span:6 }: { span:8 }}  
                wrapperCol={modelFF.items?.length>1 ? { span: 8 }: { span:20 }}                
                className='interface_submit_form'
                layout="inline"
                ref={refArr[modelFF.id]}
                onFinish={e => {
                     handleClick(e, modelFF.id);
                }}
                // autoComplete="off"
              >
              <div className='parameters_title' key={"div_button_"+modelFF.id}><div className='title'>{modelFF.title}</div><div className='right_button'><Button type="primary"  htmlType="submit" >保存</Button></div></div>
               {modelFF.items?.map((item, _index) => {  
                    {if(item.type==="select"){
                      return(
                      <Form.Item label={item.label} name={item.name} className={modelFF.items.length>1?'column2':'column1'}  key={modelFF.id +"_"+ item.name} labelAlign='right'>                         
                        <Select options={item.options}></Select>
                      </Form.Item>
                    )
                    }else if(item.type==="checkbox" ){
                      return (
                      <Form.Item label={item.label} name={item.name} className={modelFF.items.length>1?'column2':'column1'}  key={modelFF.id +"_"+ item.name} labelAlign='right'>                         
                           <Checkbox.Group style={{ width: '100%' }} options={item.options}></Checkbox.Group>
                      </Form.Item>
                     )
                    }
              } } )}            
              {modelFF.tips && (
                <div  key={"div_tip_"+modelFF.id} className='form_hint' dangerouslySetInnerHTML={{ __html: modelFF.tips}}></div>
              )}
              </Form>
            </div>
          )

        })}


      </div>
    </PageLayout>
  );
}
