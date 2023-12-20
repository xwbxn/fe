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
import React, { useContext, useEffect, useState } from 'react';
import { AlertOutlined, CopyTwoTone, DeleteOutlined, DownOutlined, DownloadOutlined, EditOutlined, FileSearchOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import _ from 'lodash';
import { useAntdTable } from 'ahooks';
import { Input, Tag, Button, Space, Table, Select, message, Modal, DatePickerProps, Menu, Dropdown, Radio } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import PageLayout from '@/components/pageLayout';
import RefreshIcon from '@/components/RefreshIcon';
import { hoursOptions } from '@/pages/event/constants';
import { CommonStateContext } from '@/App';
import { getProdOptions } from '@/pages/alertRules/Form/components/ProdSelect';
import DatasourceSelect from '@/components/DatasourceSelect/DatasourceSelect';
import exportEvents, { downloadFile } from './exportEvents';
import { getStrategiesByRuleIds } from '@/services/warning';
import { getEvents, deleteHistoryEvents, exportTemplet } from './services';
import { SeverityColor,SeverityFont } from '../event';
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
let queryFilter = [
  { name: 'ip', label: 'IP地址', type: 'input' },
  { name: 'severity', label: '告警级别', type: 'select' },
  { name: 'group_id', label: '业务组', type: 'select' },
  { name: 'rule_name', label: '告警名称', type: 'input' },
  { name: 'name', label: '资产名称', type: 'input' },
  { name: 'alert_rule', label: '告警规则', type: 'input' },
]

export const setDefaultHours = (hours: number) => {
  window.localStorage.setItem('alert_events_hours', `${hours}`);
};

const Event: React.FC = () => {
  const { t } = useTranslation('AlertHisEvents');
  const { busiGroups } = useContext(CommonStateContext);
  const [filterType, setFilterType] = useState<string>("");
  const [searchVal, setSearchVal] = useState<any>(null);
  const [filterParam, setFilterParam] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_'));
  const [selectRowKeys, setSelectRowKeys] = useState<any[]>([]);
  const [rowKeys, setRowKeys] = useState<any[]>([]);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [ftype, setFtype] = useState<number>(1);
  const [filter, setFilter] = useState<{
    datasourceIds: number[];
    bgid?: number;
    severity?: number;
    eventType?: number;
    query: string;
    // rule_prods: string[];
    type: any | number;
  }>({
    datasourceIds: [],
    query: '',
    type: null
  });

  useEffect(() => {  
    filterOptions["group_id"]=busiGroups.map(group => {
      return {
        value: ""+group.id,
        label: group.name,
      }
    })  
    filterOptions["severity"]=[
          { label: 'S1', value: '1' },
          { label: 'S2', value: '2' },
          { label: 'S3', value: '3' },
    ];
    setFilterOptions({...filterOptions})
  }, []);
  const columns: any = [
    {
      title: '显示级别',
      dataIndex: 'severity',
      align: "center",
      width: 60,
      render(val,record) {
        return (
          <>
          <Tag  color={SeverityColor[val-1]}>
             {SeverityFont[val-1]} 
            </Tag>
          </>
        );
      },
      sorter: (a, b) =>{
        return (a.rule_name).localeCompare(b.rule_name)
      },
    },
    {
      title: '规则名称',
      dataIndex: 'rule_name',
      width: 150,
      ellipsis: true,
      render(title, { id, tags }) {
        return (
          <>
            {title}
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
      align: 'center',
      ellipsis: true,
      render(name, record, index) {
        return <div style={{ color: '#2B7EE5', cursor: 'pointer' }} onClick={(e) => {
          history.push("/xh/monitor/add?type=monitor&id=" + record.asset_id + "&action=asset");
        }}>{name}</div>;
      },
      sorter: (a, b) =>{
        return (a.asset_name).localeCompare(b.asset_name)
      },
    },
    {
      title: '资产IP',
      dataIndex: 'asset_ip',
      width: 100,
      align: 'center',
      render(name, record, index) {
        return <div style={{ color: '#2B7EE5', cursor: 'pointer' }} onClick={(e) => {
          history.push("/xh/monitor/add?type=monitor&id=" + record.asset_id + "&action=asset");
        }}>{name}</div>;
      },
      sorter: (a, b) =>{
        return (a.asset_ip).localeCompare(b.asset_ip)
      },
    },
    {
      title: '告警规则',
      dataIndex: 'rule_config_cn',
      width: 180,
      align: 'center',
      render: (value) => {
        return value;
      },
      sorter: (a, b) =>{
        return (a.rule_config_cn).localeCompare(b.rule_config_cn)
      },
    },
    {
      title: '触发时间',
      dataIndex: 'last_eval_time',
      // fixed:  'right',
      align: 'center',
      width: 100,
      render(value) {
        return moment((value ? value : 0) * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
      sorter: (a, b) =>{
        return a.last_eval_time > b.last_eval_time ? 1 : -1
      },
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (record: any) => {
        return (
          <Space>
            <FileSearchOutlined title='详情'
               onClick={()=>{
                 history.push(`/alert-his-events/${record.id}?from=history`);
               }} />
            <DownloadOutlined className='down_icon' title='导出'
              onClick={() => {                   
                   let ids = new Array();
                   ids.push(record.id);
                   setRowKeys(_.cloneDeep(ids));
                   setModalOpen(true);
              }}
            />
            <DeleteOutlined title='删除' onClick={() => {
              Modal.confirm({
                title: '确认要强制删除历史告警信息？',
                onOk: () => {
                  let ids = new Array<number>();
                  ids.push(record.id);
                  deleteHistoryEvents(ids).then((res) => {
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
  
  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value'] | any) => {
    console.log('onOk: ', value);
    value?.forEach((element, index) => {
      if (index == 0 && element != null) {
        setStart(moment(element).unix())
      }
      if (index == 1 && element != null) {
        setEnd(moment(element).unix())
      }
    });
    setRefreshFlag(_.uniqueId('refresh_'));
  };

  const filterObj = Object.assign(
    (filterParam!=null && searchVal!=null && searchVal.length>0)?{ filter: filterParam } : {},
    (searchVal!=null && searchVal.length>0) ? { query: searchVal } : {},
    { group: filter.bgid },
    { alert_type: 2 },
  );

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    if (value == null) {
      localStorage.removeItem('current_query_time')
      delete filter["start"];
      delete filter["end"];    
      setStart(0)  
      setEnd(0)
      setRefreshFlag(_.uniqueId('refresh_'));
    }
  };

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
            // defaultValue="lucy"
            placeholder="选择过滤器"
            style={{ width: 120 }}
            allowClear
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
          <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm"
            locale={locale}
            onChange={onChange}
            onOk={onOk}
          />



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
        <div>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu
                  style={{ width: '100px' }}
                  onClick={({ key }) => {
                    if (key == "export") {
                      if (selectRowKeys.length <= 0) {
                        Modal.confirm({
                          title: "确认导出所有告警信息吗",
                          onOk: async () => {
                            setModalOpen(true);
                          },
                          onCancel() { },
                        });
                      } else {
                        setModalOpen(true);
                        setRowKeys(selectRowKeys);
                      }
                    } else if (key == "delete") {
                      if (selectRowKeys.length <= 0) {
                        message.warning("请选择要批量记录")
                        return
                      } else {
                        Modal.confirm({
                          title: "确认要删除吗",
                          onOk: async () => {
                            deleteHistoryEvents(selectRowKeys).then((res) => {
                              message.success("删除成功");
                              setRefreshFlag(_.uniqueId('refresh_'));
                            })
                          },
                          onCancel() { },
                        });
                      }
                    }

                  }}
                  items={[
                    { key: "export", label: '导出' },
                    { key: "delete", label: '批量删除' },
                  ]}
                ></Menu>
              }
            >
              <Button>
                {t('common:btn.batch_operations')} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
      </div>
    );
  }

  const fetchData = ({ current, pageSize }) => {
    // debugger;
    if (start > 0) {
      filterObj["start"] = start
    }
    if (end > 0) {
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

  const handleModal = (action: string,rowKeys:any[]) => {
    if (action == "open") {
      let params: any = {};
      if (rowKeys != null && rowKeys.length > 0) {
        params.ids = rowKeys;
      }
      filter["ftype"] = ftype;
      filter["alert_type"] = 2;
      let url = "/api/n9e/alert-events/export-xls";
      let exportTitle = "告警信息";
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
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `总共 ${total} 条`,
              pageSizeOptions: [30, 50, 100, 200]
            }}
          />
        </div>
      </div>

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


    </PageLayout>
  );
};

export default Event;
