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
import _, { concat } from 'lodash';
import moment from 'moment';
import { Table, Tag, Switch, Modal, Space, Button, Row, Col, message, Select, Tooltip, Input } from 'antd';
import { ColumnType } from 'antd/lib/table';
import RefreshIcon from '@/components/RefreshIcon';
import SearchInput from '@/components/BaseSearchInput';
import usePagination from '@/components/usePagination';
import { getStrategyGroupSubList, updateAlertRules, deleteStrategy } from '@/services/warning';
import { CommonStateContext } from '@/App';
import { getAssetsStypes } from '@/services/assets';
import Tags from '@/components/Tags';
import './style.less';
import { DatasourceSelect, ProdSelect } from '@/components/DatasourceSelect';
import { AlertRuleType, AlertRuleStatus } from '../types';
import MoreOperations from './MoreOperations';
import { CopyTwoTone, DeleteOutlined, EditOutlined, FileSearchOutlined, PoweroffOutlined, SearchOutlined } from '@ant-design/icons';
import parameters from '@/pages/system/parameters';

interface ListProps {
  bgid?: number;
  assetid?: number;
}

let queryFilter = [
  { name: 'ip', label: 'IP地址', type: 'input' },
  { name: 'rule_name', label: '规则名称', type: 'input' },
  { name: 'severity', label: '告警级别', type: 'select' },
  { name: 'type', label: '资产类型', type: 'select' },
  { name: 'name', label: '资产名称', type: 'input' },
  { name: 'alert_rule', label: '告警规则', type: 'input' }
]

interface Filter {
  cate?: string;
  datasourceIds?: number[];
  search?: string;
  query?: any;
}

export default function List(props: ListProps) {
  const { bgid, assetid } = props;
  const { t } = useTranslation('alertRules');
  const history = useHistory();
  const pagination = usePagination({ PAGESIZE_KEY: 'alert-rules-pagesize' });
  const [filter, setFilter] = useState<Filter>({});
  const [params, setParams] = useState<any>({
    limit: 10, page: 1
  });
  const [selectRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<AlertRuleType<any>[]>([]);
  const [data, setData] = useState<AlertRuleType<any>[]>([]);
  const [type, setType] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("input");
  const [searchVal, setSearchVal] = useState<any>(null);
  const [filterParam, setFilterParam] = useState<string>("ip");
  const [filterOptions, setFilterOptions] = useState<any>({});
  const { busiGroups } = useContext(CommonStateContext);
  const [typeOptions, setTypeOptions] = useState<any[]>([
    //  {
    //   label: '告警级别',
    //   options: [
    //     { label: 'S1', value: 1 },
    //     { label: 'S2', value: 2 },
    //     { label: 'S3', value: 3 },
    //   ]
    //  }
  ]);
  const [loading, setLoading] = useState(false);
  const columns: ColumnType<AlertRuleType<any>>[] = [
    {
      title: '告警规则名称',
      dataIndex: 'name',
      width: 100,
      sorter: (a, b) =>{
        return (a.name).localeCompare(b.name)
      },
    },
    {
      title: '资产名称',
      dataIndex: 'asset_name',
      align: "center",
      width: 100,
      sorter: (a, b) =>{
        return (a.asset_name).localeCompare(b.asset_name)
      },
    },
    {
      title: '资产IP',
      dataIndex: 'asset_ip',
      align: "center",
      width: 100,
      sorter: (a, b) =>{
        return (a.asset_ip).localeCompare(b.asset_ip)
      },
    },
    {
      title: '告警规则',
      dataIndex: 'rule_config_cn',
      align: "center",
      width: 100,
      sorter: (a, b) =>{
        return (a.rule_config_cn).localeCompare(b.rule_config_cn)
      },
    },
    {
      title: '告警接收组',
      dataIndex: 'notify_groups_obj',
      width: 140,
      align: "center",
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
      align: "center",
      width: 90,
      render: (text: string) => {
        return <div className='table-text'>{moment.unix(Number(text)).format('YYYY-MM-DD HH:mm:ss')}</div>;
      },
      sorter: (a, b) =>{
        return a.update_at > b.update_at ? 1 : -1
      },
    },
    {
      title: '更新人',
      dataIndex: 'update_by',
      align: "center",
      width: 65,
    },
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

                Modal.confirm({
                  title: `确认要修改状态为：${record.disabled === AlertRuleStatus.Enable ? '关闭' : '启动'}`,
                  onOk: () => {
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
                    getAlertRules(params);
                  });
                  },
                  onCancel() { },
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
            }} />
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
                        getAlertRules(params);
                      });
                  },

                  onCancel() { },
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

  const filterData = () => {
    // return data.filter((item) => {
    //   const { cate, datasourceIds, search, prod, severities } = filter;
    //   const lowerCaseQuery = search?.toLowerCase() || '';
    //   return (
    //     (item.name.toLowerCase().indexOf(lowerCaseQuery) > -1 || item.append_tags.join(' ').toLowerCase().indexOf(lowerCaseQuery) > -1) &&
    //     ((prod && prod === item.prod) || !prod) &&
    //     ((item.severities &&
    //       _.some(item.severities, (severity) => {
    //         if (_.isEmpty(severities)) return true;
    //         return _.includes(severities, severity);
    //       })) ||
    //       !item.severities) &&
    //     (_.some(item.datasource_ids, (id) => {
    //       if (includesProm(datasourceIds) && id === 0) return true;
    //       return _.includes(datasourceIds, id);
    //     }) ||
    //       datasourceIds?.length === 0 ||
    //       !datasourceIds)
    //   );
    // });
    return data["list"];
  };
  const getAlertRules = async (params) => {
    if (!bgid) {
      return;
    }
    setLoading(true);
    params["id"] = bgid;
    const { success, dat } = await getStrategyGroupSubList(params);
    if (success) {
      setData(dat || []);
      setLoading(false);
    }
  };
  useEffect(() => {
    getAssetsStypes().then((res) => {
      filterOptions["type"]= res.dat.map((v) => {
        return {
          value: v.name,
          label: v.name,
        };
      });
      setFilterOptions({...filterOptions})
      const items = res.dat.map((v) => {
        return {
          value: v.name,
          label: v.name,
          ...v,
        };
      });
      typeOptions.push({
        label: '资产类型',
        options: items
      })
      setTypeOptions(_.cloneDeep(typeOptions));
    });
    filterOptions["severity"]=[
          { label: 'S1', value: '1' },
          { label: 'S2', value: '2' },
          { label: 'S3', value: '3' },
    ];
    setFilterOptions({...filterOptions})
  }, []);

  useEffect(() => {
    if (bgid) {
      if (assetid != null && assetid > 0) {
           params["filter"] = "asset_id";
           params["query"] = "" + assetid;
      } else if (searchVal != null && searchVal.length > 0) {
           params["query"] = searchVal;
           params["filter"] = filterParam;       
      } else {
        delete params["filter"];
        delete params["query"];
      }
      getAlertRules(params);
    }
  }, [bgid, searchVal]);

  if (!bgid) return null;
  const filteredData = filterData();

  return (
    <div className='alert-rules-list-container' style={{ height: '100%', overflowY: 'auto' }}>
      <Row justify='space-between'>
        <Col span={20}>
          <Space>
            <RefreshIcon
              onClick={() => {
                getAlertRules(params);
              }}
            />
            <Select
              placeholder="选择过滤器"
              style={{ width: 120 }}
              value={filterParam}
              onChange={(value) => {
                queryFilter.forEach((item) => {
                  if (item.name == value) {
                    setFilterType(item.type);
                  }
                })
                setFilterParam(value);
                setSearchVal(null)
              }}>
              {queryFilter.map((item, index) => (
                <Select.Option value={item.name} key={index}>{item.label}</Select.Option>
              ))
              }
            </Select>
            {filterType == "input" && (
              <Input
                className={'searchInput'}
                value={searchVal}
                allowClear
                onChange={(e) => setSearchVal(e.target.value)}
                suffix={<SearchOutlined />}
                placeholder={'输入模糊检索关键字'}
              />
            )}
            {filterType == "select" && (
              <Select
                className={'searchInput'}
                value={searchVal}
                allowClear
                options={filterOptions[filterParam]?filterOptions[filterParam]:[]}
                onChange={(val) => setSearchVal(val)}
                placeholder={'选择要查询的条件'}
              />
            )}           
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
