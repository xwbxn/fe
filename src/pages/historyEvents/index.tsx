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
import React, { useContext, useState } from 'react';
import { AlertOutlined, CopyTwoTone, DeleteOutlined, DownloadOutlined, EditOutlined, FileSearchOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import _ from 'lodash';
import { useAntdTable } from 'ahooks';
import { Input, Tag, Button, Space, Table, Select, message, Modal, DatePickerProps } from 'antd';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/pageLayout';
import RefreshIcon from '@/components/RefreshIcon';
import { hoursOptions } from '@/pages/event/constants';
import { CommonStateContext } from '@/App';
import { getProdOptions } from '@/pages/alertRules/Form/components/ProdSelect';
import DatasourceSelect from '@/components/DatasourceSelect/DatasourceSelect';
import exportEvents, { downloadFile } from './exportEvents';
import { getStrategiesByRuleIds } from '@/services/warning';
import { getEvents, deleteHistoryEvents} from './services';
import { SeverityColor } from '../event';
import '../event/index.less';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './locale';
import DatePicker, { RangePickerProps } from 'antd/es/date-picker';
const { RangePicker } = DatePicker;
export const getDefaultHours = () => {
  const locale = window.localStorage.getItem('alert_events_hours');
  if (locale) {
    return _.toNumber(locale) || 6;
  }
  return 6;
};

export const setDefaultHours = (hours: number) => {
  window.localStorage.setItem('alert_events_hours', `${hours}`);
};

const Event: React.FC = () => {
  const { t } = useTranslation('AlertHisEvents');
  const { groupedDatasourceList, busiGroups, feats } = useContext(CommonStateContext);
  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_'));
  const [selectRowKeys, setSelectRowKeys] = useState<any[]>([]);
  const [start,setStart] = useState<number>(0);
  const [end,setEnd] = useState<number>(0);
  const [filter, setFilter] = useState<{
    hours: number;
    datasourceIds: number[];
    bgid?: number;
    severity?: number;
    eventType?: number;
    query: string;
    // rule_prods: string[];
    type:any|number;
  }>({
    hours: getDefaultHours(),
    datasourceIds: [],
    query: '',
    type:null
  });
  const columns:any= [
    {
      title: '规则名称',
      dataIndex: 'rule_name',
      width: 150,
      render(title, { id, tags }) {
        return (
          <>
            {title}
          </>
        );
      },
    },
    {
      title: '资产名称',
      dataIndex: 'asset_name',
      width: 100,
      render: (value) => {
        return value;
      },
    },
    {
      title: '资产IP',
      dataIndex: 'asset_ip',
      width: 100,
      render: (value) => {
        return value;
      },
    },
    {
      title: '告警规则',
      dataIndex: 'rule_config_cn',
      width: 180,
      render: (value) => {
        return value;
      },
    },
    {
      title: '触发时间',
      dataIndex: 'last_eval_time',
      // fixed:  'right',
      width: 100,
      render(value) {
        return moment((value ? value : 0) * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      width: '120px',
      align: 'center',
      fixed: 'right',
      render: (record: any) => {
        return (
          <Space>
            <Link
              title='查看'
              to={{
                pathname: `/alert-his-events/${record.id}`,
              }}
              target='_blank'
            >
              <FileSearchOutlined />
            </Link>
            <DownloadOutlined className='down_icon' title='导出'
              onClick={() => {
              }}
            />
            <DeleteOutlined onClick={() => {
              Modal.confirm({
                title: '确认要强制删除历史告警信息？',
                onOk: () => {
                  let ids = new Array<number>();
                  ids.push(record.id);
                  deleteHistoryEvents(ids).then((res)=>{
                     message.success("删除成功");
                     setRefreshFlag(_.uniqueId('refresh_'));
                  })
                },

                onCancel() { },
              });
            }} />

          </Space>
        );
      },
    },
  ];
  const [exportBtnLoadding, setExportBtnLoadding] = useState(false);

const onChange = (
  value: DatePickerProps['value'] | RangePickerProps['value'],
  dateString: [string, string] | string,
) => {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
};

const onOk = (value: DatePickerProps['value']  | RangePickerProps['value'] |any ) => {
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

  const filterObj = Object.assign(
    { hours: filter.hours },
    // filter.datasourceIds.length ? { datasource_ids: _.join(filter.datasourceIds, ',') } : {},
    // filter.severity !== undefined ? { severity: filter.severity } : {},
    filter.query ? { query: filter.query } : {},

    filter.eventType !== undefined ? { is_recovered: filter.eventType } : {},
    { bgid: filter.bgid },
    filter.type>0 ? { type:filter.type} : {},
  );

  let prodOptions = getProdOptions(feats);

  function renderLeftHeader() {
    return (
      <div className='table-operate-box'>
        <Space>
          <RefreshIcon
            onClick={() => {
              setRefreshFlag(_.uniqueId('refresh_'));
            }}
          />
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
          <DatasourceSelect
            style={{ width: 100 }}
            filterKey='alertRule'
            value={filter.datasourceIds}
            onChange={(val: number[]) => {
              setFilter({
                ...filter,
                datasourceIds: val,
              });
            }}
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
            onPressEnter={(e) => {
              setRefreshFlag(_.uniqueId('refresh_'));
            }}
          />
          <Button
            loading={exportBtnLoadding}
            onClick={() => {
              setExportBtnLoadding(true);
              exportEvents({ ...filterObj, limit: 1000000, p: 1 }, (err, csv) => {
                if (err) {
                  message.error(t('export_failed'));
                } else {
                  downloadFile(csv, `events_${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
                }
                setExportBtnLoadding(false);
              });
            }}
          >
            {t('export')}
          </Button>
        </Space>
      </div>
    );
  }

  const fetchData = ({ current, pageSize }) => {
    if(start>0){
      filterObj["start"] = start
    }
    if(end>0){
      filterObj["end"] = end
    }
    return getEvents({
      page: current,
      limit: pageSize,
      ...filterObj,
    }).then(async (res) => {
      let list = res.dat.list;
      if (list != null) {
        let ruleIds = Array.from(new Set(list.map(obj => obj.rule_id)))
        await getStrategiesByRuleIds(ruleIds).then((res) => {
          let rules = {};
          res.dat.forEach(rule => {
            return rules[rule.id] = rule;
          });
          list.forEach(item => {
            if (rules[item.rule_id]) {
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
    refreshDeps: [refreshFlag, JSON.stringify(filterObj)],
    defaultPageSize: 30,
    debounceWait: 500,
  });

  return (
    <PageLayout icon={<AlertOutlined />} title={t('title')}>
      <div className='event-content'>
        <div className='table-area'>
          {renderLeftHeader()}
          <Table
            size='small'
            className='history_events_list'
            rowKey='id'
            rowSelection={{
              onChange: (_, rows) => {
                setSelectRowKeys(rows ? rows.map(({ id }) => id) : []);
                console.log(selectRowKeys);
              },
              selectedRowKeys: selectRowKeys
            }}

            columns={columns}
            {...tableProps}
            rowClassName={(record: { severity: number; is_recovered: number }) => {
              return SeverityColor[record.is_recovered ? 3 : record.severity - 1] + '-left-border';
            }}
            pagination={{
              ...tableProps.pagination,
              pageSizeOptions: ['30', '100', '200', '500'],
            }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Event;
