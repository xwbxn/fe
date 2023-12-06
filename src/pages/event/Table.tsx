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
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Button, Table, Tooltip, Space, Modal, message } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import queryString from 'query-string';
import { useAntdTable } from 'ahooks';
import { CommonStateContext } from '@/App';
import { getEvents } from './services';
import { deleteAlertEventsModal } from './index';
import { SeverityColor } from './index';
import { getStrategiesByRuleIds } from '@/services/warning';
import '../event/index.less';
// @ts-ignore
import AckBtn from 'plus:/parcels/Event/Acknowledge/AckBtn';
import { FileSearchOutlined, DownloadOutlined, DeleteOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

interface IProps {
  filterObj: any;
  header: React.ReactNode;
  filter: any;
  setFilter: (filter: any) => void;
  deleteAlert:(id: any) => void;
  refreshFlag: string;
  selectedRowKeys: number[];
  setSelectedRowKeys: (selectedRowKeys: number[]) => void;
}

export default function TableCpt(props: IProps) {
  const { filterObj, filter, setFilter, header, selectedRowKeys, setSelectedRowKeys,deleteAlert } = props;
  const history = useHistory();
  const { t } = useTranslation('AlertCurEvents');
  const { groupedDatasourceList } = useContext(CommonStateContext);
  const [rowKeys, setRowKeys] = useState<any[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_'));
  const columns:any = [
    {
      title: '规则名称',
      dataIndex: 'rule_name',
      width: 150,
      render(title, { id, tags }) {
        return (
          <>
          <Link to={`/alert-cur-events/${id}`} target='_self'>{title}</Link>
          </>
        );
      },
      sorter: (a, b) =>{
        return (a.rule_name).localeCompare(b.rule_name)
      },
    },
    {
      title: '资产名称',
      dataIndex: 'asset_name',
      width: 100,
      align: "center",
      render: (value) => {
        return value;
      },
      sorter: (a, b) =>{
        return (a.asset_name).localeCompare(b.asset_name)
      },
    },
    {
      title: '资产IP',
      dataIndex: 'asset_ip',
      width: 100,
      align: "center",
      render: (value) => {
        return value;
      },
      sorter: (a, b) =>{
        return (a.asset_ip).localeCompare(b.asset_ip)
      },
    },
    {
      title: '告警规则',
      dataIndex: 'rule_config_cn',
      align: "center",
      width: 180,
      render: (value) => {
        return value;
      },
      sorter: (a, b) =>{
        return (a.rule_config_cn).localeCompare(b.rule_config_cn)
      },
    },    
    {
      title: t('trigger_time'),
      dataIndex: 'trigger_time',
      align: "center",
      width: 120,
      sorter: (a, b) =>{
        return a.trigger_time > b.trigger_time ? 1 : -1
      },
      render(value) {
        return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: t('common:table.operations'),
      dataIndex: 'operate',
      width: 80,
      align: 'center',
      fixed:'right',
      render(value, record) {
        return (
          <>
            <Space>
              <FileSearchOutlined title='详情' onClick={()=>{
                  history.push({
                    pathname: `/alert-cur-events/${record.id}`
                  });
              }}/>
            <EyeInvisibleOutlined  title='屏蔽'
              onClick={() => {
                history.push({
                  pathname: '/alert-mutes/add',
                  search: queryString.stringify({
                    busiGroup: record.group_id,
                    prod: record.rule_prod,
                    cate: record.cate,
                    from: "list",
                    datasource_ids: [record.datasource_id],
                    tags: record.tags,
                  }),
                });
              }}
            />
            <DownloadOutlined className='down_icon' title='导出'
              onClick={() => {
                deleteAlert(record.id);
              }}
            />
            <DeleteOutlined  title='删除' onClick={() => {
              deleteAlertEventsModal(
                [record.id],
                () => {
                  setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
                  setRefreshFlag(_.uniqueId('refresh_'));
                },
                t,
              )
            }} />

          </Space>




            <AckBtn
              data={record}
              onOk={() => {
                setRefreshFlag(_.uniqueId('refresh_'));
              }}
            />
            
          </>
        );
      },
    },
  ];
  if (import.meta.env.VITE_IS_PRO === 'true') {
    columns.splice(4, 0, {
      title: t('status'),
      dataIndex: 'status',
      width: 100,
      render: (value) => {
        return t(`status_${value}`) as string;
      },
    });
  }
  const fetchData = ({ current, pageSize }) => {
    filterObj["alert_type"] =1;
    return getEvents({
      page: current,
      limit: pageSize,
      ...filterObj,
    }).then(async (res) => {

      let list = res.dat.list;
      if(list!=null){
        let ruleIds  =Array.from(new Set(list.map(obj => obj.rule_id)))
        await getStrategiesByRuleIds(ruleIds).then((res)=>{
           let rules = {};
           res.dat.forEach(rule => {
              return rules[rule.id]=rule;
           });
           list.forEach(item => {
                if(rules[item.rule_id]){
                  item["rule_config_cn"] = rules[item.rule_id].rule_config_cn;
                   return item
                }
           });
        })
      }
      return {
        total: res.dat.total,
        list: list,
      };
    });
  };
  const { tableProps } = useAntdTable(fetchData, {
    refreshDeps: [refreshFlag, JSON.stringify(filterObj), props.refreshFlag],
    defaultPageSize: 30,
    debounceWait: 500,
  });

  return (
    <div className='event-content'>
      <div style={{ padding: 16, width: '100%', overflowY: 'auto' }}>
        <div style={{ display: 'flex' }}>{header}</div>
        <Table
          size='small'
          tableLayout='fixed'
          rowKey={(record) => record.id}
          columns={columns}
          className='current_events_list'
          {...tableProps}
          rowClassName={(record: { severity: number; is_recovered: number }) => {
            return SeverityColor[record.is_recovered ? 3 : record.severity - 1] + '-left-border';
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange(selectedRowKeys: number[]) {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `总共 ${total} 条`,
            pageSizeOptions: ['30', '100', '200', '500'],
          }}
        />
      </div>
    </div>
  );
}
