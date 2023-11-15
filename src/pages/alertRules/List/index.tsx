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
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { Table, Tag, Switch, Modal, Space, Button, Row, Col, message, Select, Tooltip } from 'antd';
import { ColumnType } from 'antd/lib/table';
import RefreshIcon from '@/components/RefreshIcon';
import SearchInput from '@/components/BaseSearchInput';
import usePagination from '@/components/usePagination';
import { getStrategyGroupSubList, updateAlertRules, deleteStrategy } from '@/services/warning';
import { CommonStateContext } from '@/App';
import { priorityColor } from '@/utils/constant';
import Tags from '@/components/Tags';
import './style.less';
import { DatasourceSelect, ProdSelect } from '@/components/DatasourceSelect';
import { AlertRuleType, AlertRuleStatus } from '../types';
import MoreOperations from './MoreOperations';
import { CopyTwoTone, DeleteOutlined, DiffTwoTone, EditOutlined, FileSearchOutlined, PoweroffOutlined, ProfileTwoTone } from '@ant-design/icons';

interface ListProps {
  bgid?: number;
}

interface Filter {
  cate?: string;
  datasourceIds?: number[];
  search?: string;
  prod?: string;
  severities?: number[];
}

export default function List(props: ListProps) {
  const { bgid } = props;
  const { t } = useTranslation('alertRules');
  const history = useHistory();
  const { datasourceList } = useContext(CommonStateContext);
  const pagination = usePagination({ PAGESIZE_KEY: 'alert-rules-pagesize' });
  const [filter, setFilter] = useState<Filter>({});
  const [selectRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<AlertRuleType<any>[]>([]);
  const [data, setData] = useState<AlertRuleType<any>[]>([]);
  const [loading, setLoading] = useState(false);
  const columns: ColumnType<AlertRuleType<any>>[] = [
    {
      title: '告警名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '资产名称',
      dataIndex: 'asset_name',
      width: 100,
    },
    {
      title: '资产IP',
      dataIndex: 'asset_ip',
      width: 100,
    },
    {
      title: '告警规则',
      dataIndex: 'rule_config_cn',
      width: 100,
    },
    // {
    //   title: '数据源类型',
    //   dataIndex: 'cate',
    //   width: 100,
    // },
    // {
    //   title: '数据源',
    //   dataIndex: 'datasource_ids',
    //   width: 100,
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render(value) {
    //     if (!value) return '-';
    //     return (
    //       <Tags
    //         width={70}
    //         data={_.compact(
    //           _.map(value, (item) => {
    //             if (item === 0) return '$all';
    //             const name = _.find(datasourceList, { id: item })?.name;
    //             if (!name) return '';
    //             return name;
    //           }),
    //         )}
    //       />
    //     );
    //   },
    // },
    // {
    //   title: '名称 & 级别 & 附加标签',
    //   dataIndex: 'name',
    //   render: (data, record) => {
    //     return (
    //       <div
    //         style={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           gap: 2,
    //         }}
    //       >
    //         <div>
    //           <Link
    //             className='table-text'
    //             to={{
    //               pathname: `/alert-rules/edit/${record.id}`,
    //             }}
    //           >
    //             {data}
    //           </Link>
    //         </div>
    //         <div
    //           style={{
    //             display: 'flex',
    //             flexWrap: 'wrap',
    //             gap: 4,
    //           }}
    //         >
    //           {_.map(record.severities, (severity) => {
    //             return (
    //               <Tag
    //                 key={severity}
    //                 color={priorityColor[severity - 1]}
    //                 style={{
    //                   marginRight: 0,
    //                 }}
    //               >
    //                 S{severity}
    //               </Tag>
    //             );
    //           })}
    //         </div>
    //         <div>
    //           {_.map(record.append_tags, (item) => {
    //             return (
    //               <Tooltip key={item} title={item}>
    //                 <Tag color='purple' style={{ maxWidth: '100%' }}>
    //                   <div
    //                     style={{
    //                       maxWidth: 'max-content',
    //                       overflow: 'hidden',
    //                       textOverflow: 'ellipsis',
    //                     }}
    //                   >
    //                     {item}
    //                   </div>
    //                 </Tag>
    //               </Tooltip>
    //             );
    //           })}
    //         </div>
    //       </div>
    //     );
    //   },
    // },
    {
      title: '告警接收组',
      dataIndex: 'notify_groups_obj',
      width: 140,
      render: (data) => {
        return (
          <Tags
            width={110}
            data={_.map(data, (user) => {
              return user.nickname || user.username || user.name;
            })}
          />
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'update_at',
      width: 90,
      render: (text: string) => {
        return <div className='table-text'>{moment.unix(Number(text)).format('YYYY-MM-DD HH:mm:ss')}</div>;
      },
    },
    {
      title: '更新人',
      dataIndex: 'update_by',
      width: 65,
    },
    // {
    //   title: t('common:table.enabled'),
    //   dataIndex: 'disabled',
    //   width: 65,
    //   render: (disabled, record) => (
    //     <Switch
    //       checked={disabled === AlertRuleStatus.Enable}
    //       size='small'
    //       onChange={() => {
    //         const { id, disabled } = record;
    //         bgid &&
    //           updateAlertRules(
    //             {
    //               ids: [id],
    //               fields: {
    //                 disabled: !disabled ? 1 : 0,
    //               },
    //             },
    //             bgid,
    //           ).then(() => {
    //             getAlertRules();
    //           });
    //       }}
    //     />
    //   ),
    // },
    {
      title: '操作',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (record: any) => {
        return (
          <Space>
            <PoweroffOutlined
              title={record.disabled === AlertRuleStatus.Enable ? '已启动' : '未启动'}
              style={{ color: record.disabled === AlertRuleStatus.Enable ? 'green' : 'gray' }}
              onClick={(e) => {
                const { id, disabled } = record;
                bgid &&
                  updateAlertRules(
                    {
                      ids: [id],
                      fields: {
                        disabled: !disabled ? 1 : 0,
                      },
                    },
                    bgid,
                  ).then(() => {
                    getAlertRules();
                  });
              }}
            />
            <Link title='克隆' 
              className='table-operator-area-normal'
              to={{
                pathname: `/alert-rules/edit/${record.id}?mode=clone`,
              }}
              target="_blank"
            >
              <CopyTwoTone />
            </Link>
            <FileSearchOutlined title='查看' onClick={() => {
                history.push(`alert-rules/edit/${record.id}?mode=view`);
              }}/>
            <EditOutlined title='编辑' 
              onClick={() => {
                history.push(`alert-rules/edit/${record.id}`);
              }}
            />
            <div
              title='删除'
              className='table-operator-area-warning'
              onClick={() => {
                Modal.confirm({
                  title: t('common:confirm.delete'),
                  onOk: () => {
                    bgid &&
                      deleteStrategy([record.id], bgid).then(() => {
                        message.success('删除成功');
                        getAlertRules();
                      });
                  },

                  onCancel() {},
                });
              }}
            >
              <DeleteOutlined />
            </div>
            {record.prod === 'anomaly' && (
              <div>
                <Link to={{ pathname: `/alert-rules/brain/${record.id}` }}>{t('brain_result_btn')}</Link>
              </div>
            )}
          </Space>
        );
      },
    },
  ];
  const includesProm = (ids?: number[]) => {
    return _.some(ids, (id) => {
      return _.some(datasourceList, (item) => {
        if (item.id === id) return item.plugin_type === 'prometheus';
      });
    });
  };

  const filterData = () => {
    return data.filter((item) => {
      const { cate, datasourceIds, search, prod, severities } = filter;
      const lowerCaseQuery = search?.toLowerCase() || '';
      return (
        (item.name.toLowerCase().indexOf(lowerCaseQuery) > -1 || item.append_tags.join(' ').toLowerCase().indexOf(lowerCaseQuery) > -1) &&
        ((prod && prod === item.prod) || !prod) &&
        ((item.severities &&
          _.some(item.severities, (severity) => {
            if (_.isEmpty(severities)) return true;
            return _.includes(severities, severity);
          })) ||
          !item.severities) &&
        (_.some(item.datasource_ids, (id) => {
          if (includesProm(datasourceIds) && id === 0) return true;
          return _.includes(datasourceIds, id);
        }) ||
          datasourceIds?.length === 0 ||
          !datasourceIds)
      );
    });
  };
  const getAlertRules = async () => {
    if (!bgid) {
      return;
    }
    setLoading(true);
    const { success, dat } = await getStrategyGroupSubList({ id: bgid });
    if (success) {
      setData(dat || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bgid) {
      getAlertRules();
    }
  }, [bgid]);

  if (!bgid) return null;
  const filteredData = filterData();

  return (
    <div className='alert-rules-list-container' style={{ height: '100%', overflowY: 'auto' }}>
      <Row justify='space-between'>
        <Col span={20}>
          <Space>
            <RefreshIcon
              onClick={() => {
                getAlertRules();
              }}
            />
            <ProdSelect
              style={{ width: 90 }}
              value={filter.prod}
              onChange={(val) => {
                setFilter({
                  ...filter,
                  prod: val,
                });
              }}
            />
            <DatasourceSelect
              style={{ width: 100 }}
              filterKey='alertRule'
              value={filter.datasourceIds}
              onChange={(val) => {
                setFilter({
                  ...filter,
                  datasourceIds: val,
                });
              }}
            />
            <Select
              mode='multiple'
              placeholder={t('severity')}
              style={{ width: 120 }}
              maxTagCount='responsive'
              value={filter.severities}
              onChange={(val) => {
                setFilter({
                  ...filter,
                  severities: val,
                });
              }}
            >
              <Select.Option value={1}>S1</Select.Option>
              <Select.Option value={2}>S2</Select.Option>
              <Select.Option value={3}>S3</Select.Option>
            </Select>
            <SearchInput
              placeholder={t('search_placeholder')}
              onSearch={(val) => {
                setFilter({
                  ...filter,
                  search: val,
                });
              }}
              allowClear
            />
          </Space>
        </Col>
        <Col>
          <Space>
            <Button
              type='primary'
              onClick={() => {
                window.localStorage.removeItem('select_monitor_asset_ip');
                history.push(`/alert-rules/add/${bgid}`);
              }}
              className='strategy-table-search-right-create'
            >
              {t('common:btn.add')}
            </Button>
            <MoreOperations bgid={bgid} selectRowKeys={selectRowKeys} selectedRows={selectedRows} getAlertRules={getAlertRules} />
          </Space>
        </Col>
      </Row>
      <Table
        tableLayout='fixed'
        size='small'
        rowKey='id'
        pagination={pagination}
        loading={loading}
        dataSource={filteredData}
        className='ruler-table_columns'
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item.id),
          onChange: (selectedRowKeys: React.Key[], selectedRows: AlertRuleType<any>[]) => {
            setSelectRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
          },
        }}
        columns={columns}
      />
    </div>
  );
}
