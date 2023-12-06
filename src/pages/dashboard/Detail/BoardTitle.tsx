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
import { Button, Checkbox, Col, Dropdown, Menu, Modal, Radio, Row, Select, Space, Switch } from 'antd';

import { IRawTimeRange, TimeRangePickerWithRefresh } from '@/components/TimeRangePicker';
import VariableConfig, { IVariable } from '../VariableConfig';
import { dashboardTimeCacheKey } from './Detail';

interface IProps {
  dashboard: any;
  range: IRawTimeRange;
  setRange: (range: IRawTimeRange) => void;
  variableConfig?: IVariable[];
  handleVariableChange: (value, b, valueWithOptions) => void;
  id: string;
  stopAutoRefresh: () => void;
  handlePanelChange: (v: any[]) => void;
}

export default function BoardTitle(props: IProps) {
  const { dashboard, range, setRange, variableConfig, handleVariableChange, id, stopAutoRefresh, handlePanelChange } = props;
  const [openView, setOpenView] = useState(false);

  const options =
    dashboard?.configs?.panels.map((v) => {
      return { label: v.name, value: v.id, checked: !v.hidden };
    }) || [];

  const defaultOptions = options.filter((v) => !v.hidden).map(v => v.value);
  console.log('options', options)
  console.log('defaultOptions', defaultOptions)

  return (
    <div className='dashboard-detail-header'>
      <div className='dashboard-detail-header-left'>
        <Radio.Group>
          <Radio.Button value='now-1h'>近1小时</Radio.Button>
          <Radio.Button value='now-3h'>近3小时</Radio.Button>
          <Radio.Button value='now-12h'>近12小时</Radio.Button>
          <Radio.Button value='now-24h'>近24小时</Radio.Button>
          <Radio.Button value='now-7d'>近7天</Radio.Button>
          <Radio.Button value='now-30d'>近30天</Radio.Button>
        </Radio.Group>
      </div>

      <div className='dashboard-detail-header-right'>
        <Space>
          <Button
            onClick={() => {
              setOpenView(true);
            }}
          >
            设置
          </Button>
          {variableConfig && <VariableConfig isPreview onChange={handleVariableChange} value={variableConfig} range={range} id={id} onOpenFire={stopAutoRefresh} />}
          <TimeRangePickerWithRefresh
            localKey={dashboardTimeCacheKey}
            dateFormat='YYYY-MM-DD HH:mm:ss'
            // refreshTooltip={t('refresh_tip', { num: getStepByTimeAndStep(range, step) })}
            value={range}
            onChange={setRange}
          />
        </Space>
      </div>

      <Modal
        title='指标设置'
        visible={openView}
        onOk={() => {
          setOpenView(false);
        }}
      >
        <Checkbox.Group defaultValue={defaultOptions} onChange={handlePanelChange}>
          <Row gutter={8}>
            {options.map((v) => {
              return (
                <Col span={8}>
                  <Checkbox style={{ padding: 8 }} value={v.value}>
                    {v.label}
                  </Checkbox>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
      </Modal>
    </div>
  );
}
