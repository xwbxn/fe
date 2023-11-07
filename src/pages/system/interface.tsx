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

  useEffect(() => {

  }, []);

  const renderFields = (text, record, field, currentConfigId) => {
    console.log("渲染数据列", text, record, field, currentConfigId);
    let value = record[field];
    return value;
  }

  const handleClick = (action: any, id: any) => {
      console.log('handleClick',action,id);
  }


  return (
    <PageLayout icon={<GroupOutlined />} title={'接口访问设置'}>
      <div className='body-list' style={{width:'94%',margin:'0 auto'}}>
        {InterfaceForms.map((modelFF, index) => {
          refArr[modelFF.id] = createRef<FormInstance>();
          return (
            <Card
              hoverable
              title={modelFF.title}
              key={'card-hoverable'+index}
              className='interface_set'
            >
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                className='interface_submit_form'
                layout="inline"
                initialValues={{ remember: true }}
                ref={refArr[modelFF.id]}
                onFinish={e => {
                  handleClick(e, modelFF.id);
                }}
                autoComplete="off"
              >
                <Form.Item name="ipv" key={'ipv-'+index}>
                  <Checkbox value={1}>IP验证</Checkbox>
                </Form.Item>
                <Form.Item label="访问IP白名单" name="white_ips" key={'white_ips-'+index}>
                  <Input placeholder='填写IP地址，逗号隔开'></Input>
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
