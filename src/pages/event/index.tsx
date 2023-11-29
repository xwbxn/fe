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
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Input, message, Modal, Select, Space, Row, Col, Dropdown, Menu, DatePickerProps, Radio } from 'antd';
import { AlertOutlined, ExclamationCircleOutlined, SearchOutlined, AppstoreOutlined, UnorderedListOutlined, DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import PageLayout from '@/components/pageLayout';
import { deleteAlertEvents } from '@/services/warning';
import { AutoRefresh } from '@/components/TimeRangePicker';
import { CommonStateContext } from '@/App';
import { getProdOptions } from '@/pages/alertRules/Form/components/ProdSelect';
import Card from './card';
import Table from './Table';
import { hoursOptions } from './constants';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './locale';
import DatePicker, { RangePickerProps } from 'antd/es/date-picker';
const { RangePicker } = DatePicker;
import './index.less';
import { exportTemplet } from '../historyEvents/services';
// @ts-ignore
import BatchAckBtn from 'plus:/parcels/Event/Acknowledge/BatchAckBtn';
import moment from 'moment';

const { confirm } = Modal;
export const SeverityColor = ['red', 'orange', 'yellow', 'green'];
export function deleteAlertEventsModal(ids: number[], onSuccess = () => { }, t) {
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
    onCancel() { },
  });
}
let cardQueryFilter = [
  { name: 'severity', label: '告警级别', type: 'select' },
  { name: 'group_id', label: '业务组', type: 'select' },
  { name: 'rule_name', label: '告警名称', type: 'input' },
  { name: 'name', label: '资产名称', type: 'input' },
  { name: 'alert_rule', label: '告警规则', type: 'input' },
]

const Event: React.FC = () => {
  const { t } = useTranslation('AlertCurEvents');
  const [view, setView] = useState<'card' | 'list'>('card');
  const { busiGroups, feats } = useContext(CommonStateContext);
  const [selectRowKeys, setSelectRowKeys] = useState<any[]>([]);
  const [ftype, setFtype] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [display, setDisplay] = useState<'card' | 'list'>(localStorage.getItem('current_alert_display')?_.toString(localStorage.getItem('current_alert_display')):"card");

  const [filter, setFilter] = useState<any | {
    group?: number;
    severity?: number;
    query: string;
    start: number;
    end: number;
    type: any | number;
  }>({
    query: '',
    type: null,
    start: 0,
    end: 0,
  });
  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_'));
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [rowKeys, setRowKeys] = useState<any[]>([]);
  let prodOptions = getProdOptions(feats);

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value'] | any) => {
    value?.forEach((element, index) => {
      if (index == 0 && element != null) {
        filter["start"] = moment(element).unix()
        setFilter({ ...filter });
      }
      if (index == 1 && element != null) {
        filter["end"] = moment(element).unix()
        setFilter({ ...filter });
      }
    });
    setRefreshFlag(_.uniqueId('refresh_'));
  };
  useEffect(()=>{
       setView(display);
  },[])
  function renderLeftHeader() {
    return (
      <Row justify='space-between' style={{ width: '100%' }}>
        <Space>
          <Button icon={<AppstoreOutlined />} onClick={() => setView('card')} />
          <Button icon={<UnorderedListOutlined />} onClick={() => setView('list')} />

           



          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            locale={locale}
            onOk={onOk}
          />
          <Select
            style={{ minWidth: 60 }}
            placeholder={t('severity')}
            allowClear
            value={filter.severity}
            onChange={(val) => {
              setFilter({
                ...filter,
                severity: val,
              });
            }}
          >
            <Select.Option value={1}>S1</Select.Option>
            <Select.Option value={2}>S2</Select.Option>
            <Select.Option value={3}>S3</Select.Option>
          </Select>
          <Select
            style={{ minWidth: 120 }}
            placeholder={t('common:business_group')}
            allowClear
            value={filter.group}
            onChange={(val) => {
              setFilter({
                ...filter,
                group: val,
              });
            }}
          >
            {_.map(busiGroups, (item) => {
              return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>;
            })}
          </Select>
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
            <>
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
                    <Menu.Item
                      onClick={() => {

                        if (selectRowKeys.length <= 0) {
                          Modal.confirm({
                            title: "确认导出所有告警信息吗",
                            onOk: async () => {
                              setModalOpen(true);
                            },
                            onCancel() { },
                          });
                          setRowKeys([]);
                        } else {
                          setModalOpen(true);
                          setRowKeys(selectRowKeys);
                        }
                      }}>导出</Menu.Item>

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
            </>

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
    filter.severity ? { severity: filter.severity } : {},
    filter.query ? { query: filter.query } : {},
    { group: filter.group },
    filter.start > 0 ? { start: filter.start } : {},
    filter.end > 0 ? { end: filter.end } : {},
    { alert_type: 1 },
  );

  const handleModal = (action: string,row:any[]) => {
    if (action == "open") {
      let params: any = {};
      if (row != null && row.length > 0) {
        params.ids = row;
      }
      filter["ftype"] = ftype;
      filter["alert_type"] = 1;
      if (filter.query == null || filter.query.length == 0) {
        delete filter["query"];
      }
      if (filter.start <= 0) {
        delete filter["start"];
      }
      if (filter.end <= 0) {
        delete filter["end"];
      }


      let url = "/api/n9e/alert-events/export-xls";
      let exportTitle = "活跃告警告警信息";
      exportTemplet(url, filter, params).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res],
          // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式                          
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url;
        let fileType = ".xls"
        if (ftype === 1) {
          fileType = ".xls"
        } else if (ftype === 2) {
          fileType = ".xml"
        } else if (ftype === 3) {
          fileType = ".txt"
        }
        const fileName = exportTitle + "数据_" + moment().format('MMDDHHmmss') + fileType //decodeURI(res.headers['filename']);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        setModalOpen(false)
      })
    } else {
      setModalOpen(false)
    }
  }
  return (
    <PageLayout icon={<AlertOutlined />} title={t('title')}>
      {view === 'card' ? (
        <Card header={renderLeftHeader()} filter={filterObj} refreshFlag={refreshFlag} />
      ) : (
        <>

          <Table
            header={renderLeftHeader()}
            filter={filter}
            filterObj={filterObj}
            setFilter={setFilter}
            refreshFlag={refreshFlag}
            selectedRowKeys={selectedRowKeys}
            deleteAlert={(value)=>{
              debugger;
              let ids = new Array();
               ids.push(value);
              setModalOpen(true);
              setRowKeys(ids);
            }}
            setSelectedRowKeys={setSelectedRowKeys}
          />
          <Modal title="告警信息导出" visible={modalOpen} onOk={e => { handleModal("open",rowKeys) }} onCancel={e => { handleModal("close",rowKeys) }} >
            <Radio.Group style={{ width: '100%', display: "flex", justifyContent: 'center' }} defaultValue={ftype}>
              <Radio value={1} onChange={e => {
                setFtype(parseInt("" + e.target.value))
              }}>Excle</Radio>
              <Radio value={2} onChange={e => {
                setFtype(parseInt("" + e.target.value))
              }}>XML</Radio>
              <Radio value={3} onChange={e => {
                setFtype(parseInt("" + e.target.value))
              }}>TXT</Radio>
            </Radio.Group>
          </Modal>
        </>
      )}
    </PageLayout>
  );
};

export default Event;
