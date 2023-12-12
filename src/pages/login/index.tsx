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
import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message, Checkbox } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { PictureOutlined, UserOutlined, LockOutlined, SafetyCertificateTwoTone, LockTwoTone, IdcardTwoTone } from '@ant-design/icons';
import { ifShowCaptcha, getCaptcha, getSsoConfig, getRedirectURL, getRedirectURLCAS, getRedirectURLOAuth, authLogin, getRSAConfig } from '@/services/login';
import './login.less';
// import cookie from "react-cookies";
// @ts-ignore
import useSsoWay from 'plus:/parcels/SSOConfigs/useSsoWay';

import { useTranslation } from 'react-i18next';
import { RsaEncry } from '@/utils/rsa';
import _ from 'lodash';

export interface DisplayName {
  oidc: string;
  cas: string;
  oauth: string;
}


export default function Login() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const redirect = location.search && new URLSearchParams(location.search).get('redirect');
  const [displayName, setDis] = useState<DisplayName>({
    oidc: 'OIDC',
    cas: 'CAS',
    oauth: 'OAuth',
  });
  const [showcaptcha, setShowcaptcha] = useState(true);
  const verifyimgRef = useRef<HTMLImageElement>(null);
  const captchaidRef = useRef<string>();
  const [remember, setRemember] = useState(false);
  const refreshCaptcha = () => {
    getCaptcha().then((res) => {
      if (res.dat && verifyimgRef.current) {
        verifyimgRef.current.src = res.dat.imgdata;
        captchaidRef.current = res.dat.captchaid;
      } else {
        message.warning('获取验证码失败');
      }
    });
  };
  useSsoWay();
  useEffect(()=>{

}, [remember]);
  useEffect(() => {
    // 从 localStorage 中读取用户的登录信息
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const remember = localStorage.getItem('remember') === 'true';
    //console.log("1111",remember)
    if(username){
      form.setFieldsValue({
        username,
    });
  }
    // 如果记住密码，则填充表单
    if (remember  && password) {
      form.setFieldsValue({
        // username,
        password,
        remember
      });
    }
     // 更新记住密码的状态
    setRemember(remember);
    getSsoConfig().then((res) => {
      if (res.dat) {
        setDis({
          oidc: res.dat.oidcDisplayName,
          cas: res.dat.casDisplayName,
          oauth: res.dat.oauthDisplayName,
        });
      }
    });

    ifShowCaptcha().then((res) => {
      // setShowcaptcha(res?.dat?.show);
      // if (res?.dat?.show) {
        getCaptcha().then((res) => {
          if (res.dat && verifyimgRef.current) {
            verifyimgRef.current.src = res.dat.imgdata;
            captchaidRef.current = res.dat.captchaid;
          } else {
            message.warning('获取验证码失败');
          }
        });
      // }
    });
  }, []);
  const handleRememberChange = (e) => {
    // setRemember(_.cloneDeep(e.target.checked))
    setRemember(e.target.checked);
    //console.log("FFFFFFFFFF",remember);
  };
  const handleSubmit = () => {
    form.validateFields().then(() => {
      login();
    });
  };
  

  const login = async () => {
    let { username, password, verifyvalue } = form.getFieldsValue();
     // 将用户的登录信息存储到 localStorage 中
     localStorage.setItem('username', username);
     localStorage.setItem('password', password);
     localStorage.setItem('remember', remember ? 'true' : 'false');
    // const rsaConf = await getRSAConfig();
    // const {
    //   dat: { OpenRSA, RSAPublicKey },
    // } = rsaConf;
    // const authPassWord = OpenRSA ? RsaEncry(password, RSAPublicKey) : password;
    authLogin(username, password, captchaidRef.current!, verifyvalue)
      .then((res) => {
        const { dat, err } = res;
        const { access_token, refresh_token } = dat;
        sessionStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        if (!err) {
          window.location.href = redirect || '/home';
        }
      })
      .catch(() => {
        if (showcaptcha) {
          refreshCaptcha();
        }
      });
  };

  return (
    <div className='login-warp'>
      <div className='login-panel'>
        <div className='login-main'>
          <div className='title'> </div>
          <div className='main'> </div>
        </div>
        <div className='integration'>
          <div className='form_title'>登录账号</div>
          <Form form={form} layout='vertical' className='login_form' requiredMark={true}>
            <Form.Item
              name='username'
              rules={[
                {
                  required: true,
                  message: t('请输入用户名'),
                },
              ]}
            >
              <Input placeholder={t('请输入用户名')} prefix={<IdcardTwoTone  />} />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: t('请输入密码'),
                },
              ]}
            >
              <Input type='password' placeholder={t('请输入密码')} onPressEnter={handleSubmit} prefix={<LockTwoTone  className='site-form-item-icon' />} />
            </Form.Item>

            <div className='verifyimg-div'>
              <Form.Item
                name='verifyvalue'
                className='verifyimg-input'
                rules={[
                  {
                    required: showcaptcha,
                    message: t('请输入验证码'),
                  },
                ]}
                hidden={!showcaptcha}
              >
                <Input placeholder={t('请输入验证码')} onPressEnter={handleSubmit} prefix={<SafetyCertificateTwoTone className='site-form-item-icon' />} />
              </Form.Item>
              <img
                ref={verifyimgRef}
                style={{
                  display: showcaptcha ? 'inline-block' : 'none',
                  float: 'right',
                  width:'110px',
                  height: '36px'
                }}
                onClick={refreshCaptcha}
                alt='点击获取验证码'
              />
            </div>
            <Form.Item name="remember" valuePropName='checked'   wrapperCol={{offset:0,span:24}}>
               <Checkbox onChange={handleRememberChange}>记住密码</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type='primary' className='submit_button' onClick={handleSubmit} onKeyPress={e=>{
                 handleSubmit
              }}>
                {t('登录')}
              </Button>
            </Form.Item>            
          </Form>
        </div>
      </div>
    </div>
  );
}
