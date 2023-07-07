/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useEffect, useState, useImperativeHandle, ReactNode } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { getUserInfo, getNotifyChannels, getRoles } from '@/services/manage';
import PageLayout from '@/components/pageLayout';
import { UserAndPasswordFormProps, Contacts, ContactsItem, User } from '@/store/manageInterface';
import { MinusCircleOutlined, PlusCircleOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Link } from 'react-router-dom';

const { Option } = Select;
const UserForm = React.forwardRef<ReactNode, UserAndPasswordFormProps>((props, ref) => {
  const { t } = useTranslation();
  const { userId } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [contactsList, setContactsList] = useState<ContactsItem[]>([]);
  const [roleList, setRoleList] = useState<{ name: string; note: string }[]>([]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 6,
      },
    },
  };
  useImperativeHandle(ref, () => ({
    form: form,
  }));
  useEffect(() => {
    if (userId) {
      getUserInfoDetail(userId);
    } else {
      setLoading(false);
    }

    getContacts();
    getRoles().then((res) => setRoleList(res));
  }, []);

  const getContacts = () => {
    getNotifyChannels().then((data: Array<ContactsItem>) => {
      setContactsList(data);
    });
  };

  const getUserInfoDetail = (id: string) => {
    getUserInfo(id).then((data: User) => {
      let contacts: Array<Contacts> = [];

      if (data.contacts) {
        Object.keys(data.contacts).forEach((item: string) => {
          let val: Contacts = {
            key: item,
            value: data.contacts[item],
          };
          contacts.push(val);
        });
      }

      setInitialValues(
        Object.assign({}, data, {
          contacts,
        }),
      );
      setLoading(false);
    });
  };

  return !loading ? (
    <PageLayout title={t('添加巡检计划')} showBack backPath='/inspection/plans'>
      <div className='event-detail-container'>
        <Form  {...layout} form={form} initialValues={initialValues} preserve={false}>
          <Form.Item
            {...formItemLayout}
            label={t('巡检任务名称')}
            name='username'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={t('巡检负责人')} name='nickname'  {...formItemLayout}>
            <Input />
          </Form.Item>
          <Form.Item label={t('巡检区域')}
            name='roles'
            {...formItemLayout}
            rules={[
              {
                required: true,
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={t('巡检时间')}
            name='roles'
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label={t('时')} name='recover_duration' tooltip={t('recover_duration_tip')}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={t('时')} name='recover_duration' tooltip={t('recover_duration_tip')}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t('分')}
                  name='notify_repeat_step'
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t('秒')}
                  name='notify_max_number'
                  // rules={[
                  //   {
                  //     required: true,
                  //   },
                  // ]}
                  tooltip={t('notify_max_number_tip')}
                >
                  <InputNumber min={0} precision={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item  {...formItemLayout} label={t('巡检报备')} name='phone'>
            <Input />
          </Form.Item>
          <Form.Item  {...formItemLayout} label={t('报告接收人')} name='phone'>
            <Input />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </div>
    </PageLayout>
  ) : null;
});
export default UserForm;
