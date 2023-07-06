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
import { Form, Input, Select, Space } from 'antd';
import { getUserInfo, getNotifyChannels, getRoles } from '@/services/manage';
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
    <Form layout='vertical' form={form} initialValues={initialValues} preserve={false}>
      {!userId && (
        <Form.Item
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
      )}
      <Form.Item label={t('巡检负责人')} name='nickname'>
        <Input />
      </Form.Item>     
      <Form.Item
        label={t('巡检时间')}
        name='roles'
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select mode='multiple'>
          {roleList.map((item, index) => (
            <Option value={item.name} key={index}>
              <div>
                <div>{item.name}</div>
                <div style={{ color: '#8c8c8c' }}>{item.note}</div>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t('巡检区域')} name='email'>
        <Input />
      </Form.Item>
      <Form.Item label={t('巡检报备')} name='phone'>
        <Input />
      </Form.Item>
      <Form.Item label={t('报告接收人')} name='phone'>
        <Input />
      </Form.Item>
      <Form.Item label={t('asdf')} name='phone'>
        <Input />
      </Form.Item>
    </Form>
  ) : null;
});
export default UserForm;
