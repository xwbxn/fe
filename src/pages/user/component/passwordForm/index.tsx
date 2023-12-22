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
import React, { useImperativeHandle, ReactNode } from 'react';
import { Form, Input } from 'antd';
import { UserAndPasswordFormProps } from '@/store/manageInterface';
import { useTranslation } from 'react-i18next';
const PasswordForm = React.forwardRef<ReactNode, UserAndPasswordFormProps>((props, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    form: form,
  }));
  const validatePassword = (_, value) => {
    if (value && value.length >= 8) {
      const count = [/[a-z]/, /[A-Z]/, /\d/, /[!@#$%^&*]/].reduce((acc, regex) => {
        return acc + (regex.test(value) ? 1 : 0);
      }, 0);
      if (count >= 3) {
        return Promise.resolve();
      }
    }
    return Promise.reject('密码必须大于8位，并且包含大写字母、小写字母、数字和符号中的至少3种');
  };
  return (
    <Form layout='vertical' form={form}>
      <Form.Item
        name='password'
        label={t('account:password.name')}
        rules={[
          {
            required: true,
          },
          {
            validator: validatePassword,
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name='confirm'
        label={t('account:password.confirm')}
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error(t('account:password.notMatch')));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  );
});
export default PasswordForm;
