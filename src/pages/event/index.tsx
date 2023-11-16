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
import React, { useContext, useRef, useState } from 'react';
import { Button, Input, message, Modal, Select, Space, Row, Col, Dropdown, Menu, DatePickerProps } from 'antd';
import { AlertOutlined, ExclamationCircleOutlined, SearchOutlined, AppstoreOutlined, UnorderedListOutlined, DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import PageLayout from '@/components/pageLayout';
import { deleteAlertEvents } from '@/services/warning';
import { AutoRefresh } from '@/components/TimeRangePicker';
import { CommonStateContext } from '@/App';
import { getProdOptions } from '@/pages/alertRules/Form/components/ProdSelect';
import DatasourceSelect from '@/components/DatasourceSelect/DatasourceSelect';
import Card from './card';
import Table from './Table';
import { hoursOptions } from './constants';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './locale';
import DatePicker, { RangePickerProps } from 'antd/es/date-picker';
const { RangePicker } = DatePicker;
import './index.less';

// @ts-ignore
import BatchAckBtn from 'plus:/parcels/Event/Acknowledge/BatchAckBtn';
import moment from 'moment';

const { confirm } = Modal;
export const SeverityColor = ['red', 'orange', 'yellow', 'green'];
export function deleteAlertEventsModal(ids: number[], onSuccess = () => {}, t) {
  confirm({
    title: t('delete_confirm.title'),
    icon: <ExclamationCircleOutlined />,
    content: t('delete_confirm.content'),
    maskClosable: true,
    okButtonProps: { danger: true },
    zIndex: 1001,
    onOk() {
      return deleteAlertEvents(ids).then((res) => {
        message.success(t('common:success.delete'));
        onSuccess();
      });
    },
    onCancel() {},
  });
}

const Event: React.FC = () => {
  const { t } = useTranslation('AlertCurEvents');
  const [view, setView] = useState<'card' | 'list'>('card');
  const { busiGroups, feats } = useContext(CommonStateContext);
  const [start,setStart] = useState<number>(0);
  const [end,setEnd] = useState<number>(0);
  const [filter, setFilter] = useState<{
    hours: number;
    cate?: string;
    datasourceIds: number[];
    bgid?: number;
    severity?: number;
    query: string;
    type: any|number;
  }>({
    // hours: getDefaultHours(),
    hours: 6,
    datasourceIds: [],
    query: '',
    type:null,
  });
  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_'));
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  let prodOptions = getProdOptions(feats);

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };
  
  const onOk = (value: DatePickerProps['value']  | RangePickerProps['value'] |any) => {
    console.log('onOk: ', value);
    value?.forEach((element,index) => {
        if(index==0 && element!=null){
          setStart(moment(element).unix())
        }
        if(index==1 && element!=null){
          setEnd(moment(element).unix())
        }
    });
    setRefreshFlag(_.uniqueId('refresh_'));
  };
  function renderLeftHeader() {
    return (
      <Row justify='space-between' style={{ width: '100%' }}>
        <Space>
          <Button icon={<AppstoreOutlined />} onClick={() => setView('card')} />
          <Button icon={<UnorderedListOutlined />} onClick={() => setView('list')} />
          <Select
            allowClear
            placeholder={'查询类型'}
            style={{ minWidth: 80 }}
            value={filter.type}
            // mode='multiple'
            onChange={(val) => {
              setFilter({
                ...filter,
                type: val,
              });
            }}
            dropdownMatchSelectWidth={false}
          >

            {prodOptions.map((item) => {
              return (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            locale={locale}
            onOk={onOk}
          />
          
          <Input
            className='search-input'
            prefix={<SearchOutlined />}
            placeholder={t('search_placeholder')}
            value={filter.query}
            onChange={(e) => {
              setFilter({
                ...filter,
                query: e.target.value,
              });
            }}
          />
        </Space>
        <Col
          flex='200px'
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {view === 'list' && (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    disabled={selectedRowKeys.length === 0}
                    onClick={() =>
                      deleteAlertEventsModal(
                        selectedRowKeys,
                        () => {
                          setSelectedRowKeys([]);
                          setRefreshFlag(_.uniqueId('refresh_'));
                        },
                        t,
                      )
                    }
                  >
                    {t('common:btn.batch_delete')}{' '}
                  </Menu.Item>
                  <BatchAckBtn
                    selectedIds={selectedRowKeys}
                    onOk={() => {
                      setSelectedRowKeys([]);
                      setRefreshFlag(_.uniqueId('refresh_'));
                    }}
                  />
                </Menu>
              }
              trigger={['click']}
            >
              <Button style={{ marginRight: 8 }}>{t('batch_btn')}</Button>
            </Dropdown>
          )}
          <AutoRefresh
            onRefresh={() => {
              setRefreshFlag(_.uniqueId('refresh_'));
            }}
          />
        </Col>
      </Row>
    );
  }

  const filterObj = Object.assign(
    { hours: filter.hours },
    filter.datasourceIds.length ? { datasource_ids: filter.datasourceIds } : {},
    filter.severity ? { severity: filter.severity } : {},
    filter.query ? { query: filter.query } : {},
    { bgid: filter.bgid },
    filter.type ? { type:filter.type } : {},
  );

  return (
    <PageLayout icon={<AlertOutlined />} title={t('title')}>
      {view === 'card' ? (
        <Card header={renderLeftHeader()} filter={filterObj} refreshFlag={refreshFlag} />
      ) : (
        <Table
          header={renderLeftHeader()}
          filter={filter}
          filterObj={filterObj}
          setFilter={setFilter}
          refreshFlag={refreshFlag}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      )}
    </PageLayout>
  );
};

export default Event;
