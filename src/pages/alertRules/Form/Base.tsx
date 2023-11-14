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

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Select, Card, Row, Col, Tag, Tooltip } from 'antd';
import { panelBaseProps } from '../constants';
import { getAssetsByCondition } from '@/services/assets';

// 校验单个标签格式是否正确
function isTagValid(tag) {
  const contentRegExp = /^[a-zA-Z_][\w]*={1}[^=]+$/;
  return {
    isCorrectFormat: contentRegExp.test(tag.toString()),
    isLengthAllowed: tag.toString().length <= 64,
  };
}

export default function Base({ type }) {
  const { t } = useTranslation('alertRules');
 
  type = 1;

  const [assetList, setAssetList] = useState<any>({});
  const [assetOptions, setAssetOptions] = useState<any[]>([]);
  const [assetIp, setAssetIp] = useState<string>("");


  useEffect(() => {
    let param = {};
    window.localStorage.removeItem('select_monitor_asset_id');
    if(type==1){
      getAssetsByCondition(param).then((res) => {
        let options = new Array();
        res.dat.list.map((v) => {
          assetList[v.id] = v;
          options.push({
            value: v.id,
            label: v.name + ' [' + v.type + ']',
          });
        });
        setAssetOptions(options);
        setAssetList({...assetList});
      })
    }
    
  }, []);

  // 渲染标签
  function tagRender(content) {
    const { isCorrectFormat, isLengthAllowed } = isTagValid(content.value);
    return isCorrectFormat && isLengthAllowed ? (
      <Tag closable={content.closable} onClose={content.onClose}>
        {content.value}
      </Tag>
    ) : (
      <Tooltip title={isCorrectFormat ? t('append_tags_msg1') : t('append_tags_msg2')}>
        <Tag color='error' closable={content.closable} onClose={content.onClose} style={{ marginTop: '2px' }}>
          {content.value}
        </Tag>
      </Tooltip>
    );
  }

  // 校验所有标签格式
  function isValidFormat() {
    return {
      validator(_, value) {
        const isInvalid =
          value &&
          value.some((tag) => {
            const { isCorrectFormat, isLengthAllowed } = isTagValid(tag);
            if (!isCorrectFormat || !isLengthAllowed) {
              return true;
            }
          });
        return isInvalid ? Promise.reject(new Error(t('append_tags_msg'))) : Promise.resolve();
      },
    };
  }
  return (
    <Card {...panelBaseProps} title={t('basic_configs')}>      
      {type == 1 && (
        <Row gutter={10}>
        <Col span={8}>
          <Form.Item label={'告警名称'} name='name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('资产名称')} name='asset_id' rules={[{ required: true }]}>
            <Select 
            onChange={(value)=>{               
              let ip = assetList[value].ip
              window.localStorage.setItem('select_monitor_asset_id',value);
              setAssetIp(ip)
           }}
            options={assetOptions}
          />
          </Form.Item>
        </Col>
        <Col span={8}>
          {/* <Form.Item label={t('资产IP')} name='asset_id'> */}
            <div className='ip_show'><div className='title'>资产IP:</div><span className='content'>{assetIp}</span></div>
          {/* </Form.Item> */}
        </Col>

      </Row>
      )}
      {type == 0 && (
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item label={t('name')} name='name' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('append_tags')} name='append_tags' rules={[isValidFormat]}>
              <Select mode='tags' tokenSeparators={[' ']} open={false} placeholder={t('append_tags_placeholder')} tagRender={tagRender} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t('note')} name='note'>
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
      )}
    </Card>
  );
}