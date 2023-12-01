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
import React from 'react';
import { Form, Select, Row, Col, InputNumber, Switch, Input, Slider } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useTranslation, Trans } from 'react-i18next';
import { Panel } from '../../Components/Collapse';
import { legendLayout, legendPositionN } from '../../config';

export default function GraphStyles() {
  const { t, i18n } = useTranslation('dashboard');
  const namePrefix = ['custom'];

  return (
    <Panel header={t('panel.custom.title')}>
      <>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item label='数据字段' name={[...namePrefix, 'angleField']}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='类型字段' name={[...namePrefix, 'colorField']}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'图例布局'} name={[...namePrefix, 'legend', 'layout']}>
              <Select suffixIcon={<CaretDownOutlined />}>
                {legendLayout.map((item) => {
                  return (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'图例位置'} name={[...namePrefix, 'legend', 'position']}>
              <Select suffixIcon={<CaretDownOutlined />}>
                {legendPositionN.map((item) => {
                  return (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'内环大小'} name={[...namePrefix, 'innerRadius']} tooltip={'小于1显示为环形图'}>
              <Slider max={1} min={0} defaultValue={1} step={0.05}></Slider>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'统计标题'} name={[...namePrefix, 'statistic', 'title', 'content']}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </>
    </Panel>
  );
}
