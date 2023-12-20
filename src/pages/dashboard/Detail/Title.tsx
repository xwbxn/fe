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
import { useHistory, useLocation } from 'react-router-dom';
import querystring from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Button, Space, Dropdown, Menu, Switch, Modal, Form, Select, message, Checkbox, Row, Col } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { TimeRangePickerWithRefresh, IRawTimeRange } from '@/components/TimeRangePicker';
import { AddPanelIcon } from '../config';
import { visualizations } from '../Editor/config';
import { dashboardTimeCacheKey } from './Detail';
import VariableConfig, { IVariable } from '../VariableConfig';
import { useLocalStorageState } from 'ahooks';
import { getAssetstypes } from '@/services/assets';
import { GetAssetType } from '@/services/metric';
import { setDashboardAssetType } from '@/services/dashboardV2';
import { updateSelfBoard } from '@/services/account';
import { CommonStateContext } from '@/App';

interface IProps {
  dashboard: any;
  range: IRawTimeRange;
  setRange: (range: IRawTimeRange) => void;
  onAddPanel: (type: string) => void;
  isPreview: boolean;
  isBuiltin: boolean;
  isAuthorized: boolean;
  isHome: boolean;
  gobackPath?: string;
  variableConfig?: IVariable[];
  handleVariableChange: (value, b, valueWithOptions) => void;
  id: string;
  stopAutoRefresh: () => void;
  handlePanelChange?: (v: any[]) => void;
}

const cachePageTitle = document.title;

export default function Title(props: IProps) {
  const { t, i18n } = useTranslation('dashboard');
  const { dashboard, range, setRange, onAddPanel, isPreview, isBuiltin, isAuthorized, variableConfig, handleVariableChange, id, stopAutoRefresh, isHome, handlePanelChange } =
    props;
  const history = useHistory();
  const location = useLocation();
  const query = querystring.parse(location.search);
  const { viewMode, themeMode } = query;
  const [defaultModal, setdefaultModal] = useState(false);
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const { profile, setProfile } = useContext(CommonStateContext);
  const setHomePage = () => {
    // setHome(id);
    updateSelfBoard({
      board_id: _.toNumber(id),
    }).then((res) => {
      setProfile({
        ...profile,
        board_id: _.toNumber(id),
      });
      message.success('设置成功');
    });
  };

  const [openView, setOpenView] = useState(false);
  const panelOptions =
    dashboard?.configs?.panels.map((v) => {
      return { label: v.name, value: v.id, checked: !v.hidden };
    }) || [];
  const defaultOptions = panelOptions.filter((v) => !v.hidden).map((v) => v.value);

  const formSubmit = () => {
    form.validateFields().then((values) => {
      setDashboardAssetType(id, values).then(() => {
        message.success('设置成功');
        setdefaultModal(false);
      });
    });
  };

  useEffect(() => {
    document.title = `${dashboard.name} - ${cachePageTitle}`;
    return () => {
      document.title = cachePageTitle;
    };
  }, [dashboard.name]);

  useEffect(() => {
    getAssetstypes().then((res) => {
      setOptions(
        res.dat.map((v) => {
          return { label: v.name, value: v.name };
        }),
      );
    });
  }, []);

  return (
    <div className='dashboard-detail-header'>
      <div className='dashboard-detail-header-left'>
        {isPreview && !isBuiltin ? null : (
          <RollbackOutlined
            className='back'
            onClick={() => {
              if (props.gobackPath) history.push(props.gobackPath);
              else history.goBack();
            }}
          />
        )}
        <div className='title' style={{ width: '205px' }}>
          {dashboard.name}
        </div>
      </div>
      {
        <div className='dashboard-detail-header-right' style={{ display: isHome ? 'none' : '' }}>
          <Space>
            {isAuthorized && (
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    {_.map([{ type: 'row', name: '分组' }, ...visualizations], (item) => {
                      return (
                        <Menu.Item
                          key={item.type}
                          onClick={() => {
                            onAddPanel(item.type);
                          }}
                        >
                          {i18n.language === 'en_US' ? item.type : item.name}
                        </Menu.Item>
                      );
                    })}
                  </Menu>
                }
              >
                <Button type='primary' icon={<AddPanelIcon />}>
                  {t('add_panel')}
                </Button>
              </Dropdown>
            )}
            {variableConfig && (
              <VariableConfig isPreview={!isAuthorized} onChange={handleVariableChange} value={variableConfig} range={range} id={id} onOpenFire={stopAutoRefresh} />
            )}
            <TimeRangePickerWithRefresh
              localKey={dashboardTimeCacheKey}
              dateFormat='YYYY-MM-DD HH:mm:ss'
              // refreshTooltip={t('refresh_tip', { num: getStepByTimeAndStep(range, step) })}
              value={range}
              onChange={setRange}
            />
            {!isPreview && (
              <Button
                onClick={() => {
                  const newQuery = _.omit(query, ['viewMode', 'themeMode']);
                  if (!viewMode) {
                    newQuery.viewMode = 'fullscreen';
                  }
                  history.replace({
                    pathname: location.pathname,
                    search: querystring.stringify(newQuery),
                  });
                  // TODO: 解决仪表盘 layout resize 问题
                  setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                  }, 500);
                }}
              >
                {viewMode === 'fullscreen' ? t('exit_full_screen') : t('full_screen')}
              </Button>
            )}
            {viewMode === 'fullscreen' && (
              <Switch
                checkedChildren='dark'
                unCheckedChildren='light'
                checked={themeMode === 'dark'}
                onChange={(checked) => {
                  const newQuery = _.omit(query, ['themeMode']);
                  if (checked) {
                    newQuery.themeMode = 'dark';
                  }
                  history.replace({
                    pathname: location.pathname,
                    search: querystring.stringify(newQuery),
                  });
                }}
              />
            )}
            <Button onClick={() => setHomePage()}>设为首页</Button>
            <Button
              onClick={() => {
                setdefaultModal(true);
              }}
            >
              设置默认
            </Button>
            <Button
              onClick={() => {
                setOpenView(true);
              }}
            >
              可见
            </Button>
          </Space>
        </div>
      }
      {isHome && (
        <div className='dashboard-detail-header-right'>
          <Button
            onClick={() => {
              // setOpenView(true);
              history.push(`/dashboards/${dashboard.id}?${location.search}`);
            }}
          >
            设置
          </Button>
        </div>
      )}
      <Modal
        title={'默认看板设置'}
        visible={defaultModal}
        onOk={formSubmit}
        onCancel={() => {
          setdefaultModal(false);
        }}
      >
        <Form name='control-ref' form={form} labelCol={{ span: 8 }}>
          <Form.Item name='asset_type' label='请选择资产类型' rules={[{ required: true }]}>
            <Select options={options}></Select>
          </Form.Item>
          <Form.Item name='apply_all' valuePropName='checked' label='应用到所有资产' help={'选中后将会其他资产的看板,请谨慎选择'}>
            <Checkbox></Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title='指标设置' visible={openView} onOk={() => setOpenView(false)} onCancel={() => setOpenView(false)}>
        <Checkbox.Group defaultValue={defaultOptions} onChange={handlePanelChange}>
          <Row gutter={8}>
            {panelOptions.map((v) => {
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
