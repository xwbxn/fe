import React, { createRef, useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Row, Form, Checkbox, Card, FormInstance } from 'antd';
import PageLayout from '@/components/pageLayout';
import { CheckCircleOutlined, DownOutlined, GroupOutlined, SearchOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import { SetConfigTables, SetConfigForms,InterfaceForms } from './catalog'
import { CommonStateContext } from '@/App';
import './style.less';
import _ from 'lodash';

export default function () {
  const commonState = useContext(CommonStateContext);

  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});

  const [refArr, setRefArr] = useState({});
  const [checks, setChecks] = useState<any>({});
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
     setChecks({...checks})
  }, []);

  const renderFields = (text, record, field, currentConfigId) => {
    console.log("渲染数据列", text, record, field, currentConfigId);
    let value = record[field];
    return value;
  }
  const onChange = (e,id) => {
    console.log('checked = ', e.target.checked);
    // setChecked(e.target.checked);
    checks[id] =e.target.checked?false:true;
    setChecks(_.cloneDeep({...checks}))
    console.log('checked = ', checks);
  };

  const handleClick = (action: any, id: any) => {
      console.log('handleClick',action,id);
  }


  return (
    <PageLayout icon={<GroupOutlined />} title={'接口访问设置'}>
      <div className='body-list' >
        {InterfaceForms.map((modelFF, index) => {
          refArr[modelFF.id] = createRef<FormInstance>();
          checks[modelFF.id] = true;
          return (
            <Card
              hoverable
              title={modelFF.title}
              key={'card-hoverable'+index}
              className='interface_set'
            >
              <Form
                name={modelFF.id}
                labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                className='interface_submit_form'
                layout="inline"
                initialValues={{}}
                ref={refArr[modelFF.id]}
                onFinish={e => {
                  // handleClick(e, modelFF.id);
                }}
                // autoComplete="off"
              >
                

                <Form.Item name={'Q'+modelFF.id} key={'ipv-'+index}>
                  <Checkbox onChange={e=>{
                    onChange(e,modelFF.id)
                  }} >IP验证</Checkbox>                 
                </Form.Item>
                <Form.Item  label="访问IP白名单" name="white_ips" key={'white_ips-'+index} >
                  <Input disabled={checks[modelFF.id]}  ></Input>
                </Form.Item>

                <Form.Item name="pdv"  key={'pdv-'+index}>
                  <Checkbox value={1}>密码验证</Checkbox>
                </Form.Item>
                <Form.Item label="密码" name="pwd" key={'pwd-'+index}>
                  <Input.Password placeholder='填写密码'></Input.Password>
                </Form.Item>
                <Form.Item className='submit_buttons'>
                  <Space >
                    <Button className='view_passwd'>
                      查看秘钥
                    </Button>
                    <Button htmlType="submit" className='save_button'>
                      保存
                    </Button>
                  </Space>
                </Form.Item>


              </Form>
            </Card>

          )

        })}


      </div>
    </PageLayout>
  );
}

