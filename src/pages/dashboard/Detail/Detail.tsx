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
import React, { useState, useRef, useEffect, useContext } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useLocation } from 'react-router-dom';
import { Alert } from 'antd';
import PageLayout from '@/components/pageLayout';
import { IRawTimeRange, getDefaultValue } from '@/components/TimeRangePicker';
import { Dashboard } from '@/store/dashboardInterface';
import { getDashboard, updateDashboardConfigs, getDashboardPure, getBuiltinDashboard } from '@/services/dashboardV2';
import { SetTmpChartData } from '@/services/metric';
import { CommonStateContext } from '@/App';
import VariableConfig, { IVariable } from '../VariableConfig';
import { replaceExpressionVars } from '../VariableConfig/constant';
import { ILink } from '../types';
import DashboardLinks from '../DashboardLinks';
import Panels from '../Panels';
import Title from './Title';
import { JSONParse } from '../utils';
import Editor from '../Editor';
import { defaultCustomValuesMap, defaultOptionsValuesMap } from '../Editor/config';
import { sortPanelsByGridLayout, panelsMergeToConfigs, updatePanelsInsertNewPanelToGlobal } from '../Panels/utils';
import { useGlobalState } from '../globalState';
import { getLocalDatasourceValue, getDatasourceValue, getLocalStep, setLocalStep } from './utils';
import './style.less';
import './dark.antd.less';
import './dark.less';

interface URLParam {
  id: string;
}

export const dashboardTimeCacheKey = 'dashboard-timeRangePicker-value';
const fetchDashboard = ({ id, builtinParams }) => {
  if (builtinParams) {
    return getBuiltinDashboard(builtinParams);
  }
  return getDashboard(id);
};

export default function DetailV2(props: { isPreview?: boolean; isBuiltin?: boolean; gobackPath?: string; builtinParams?: any }) {
  const { isPreview = false, isBuiltin = false, gobackPath, builtinParams } = props;
  const { t, i18n } = useTranslation('dashboard');
  const { groupedDatasourceList, datasourceList } = useContext(CommonStateContext);
  const datasources = groupedDatasourceList.prometheus || [];
  const [dashboardMeta, setDashboardMeta] = useGlobalState('dashboardMeta');
  const { search } = useLocation();
  const { id } = useParams<URLParam>();
  const refreshRef = useRef<{ closeRefresh: Function }>();
  const [dashboard, setDashboard] = useState<Dashboard>({} as Dashboard);
  const [datasourceValue, setDatasourceValue] = useState<number>();
  const [variableConfig, setVariableConfig] = useState<IVariable[]>();
  const [variableConfigWithOptions, setVariableConfigWithOptions] = useState<IVariable[]>();
  const [dashboardLinks, setDashboardLinks] = useState<ILink[]>();
  const [panels, setPanels] = useState<any[]>([]);
  const [range, setRange] = useState<IRawTimeRange>(
    getDefaultValue(dashboardTimeCacheKey, {
      start: 'now-1h',
      end: 'now',
    }),
  );
  const [step, setStep] = useState<number | null>(getLocalStep(id));
  const [editable, setEditable] = useState(true);
  const [editorData, setEditorData] = useState({
    visible: false,
    id: '',
    initialValues: {} as any,
  });
  const [forceRenderKey, setForceRender] = useState(_.uniqueId('forceRenderKey_'));
  let updateAtRef = useRef<number>();
  const refresh = async (cbk?: () => void) => {
    let curDatasources = datasources;
    fetchDashboard({
      id,
      builtinParams,
    }).then((res) => {
      updateAtRef.current = res.update_at;
      const configs = _.isString(res.configs) ? JSONParse(res.configs) : res.configs;
      setDashboard({
        ...res,
        configs,
      });
      if (!datasourceValue) {
        const dashboardConfigs: any = configs;
        const localDatasourceValue = getLocalDatasourceValue(search, groupedDatasourceList);
        setDatasourceValue(getDatasourceValue(dashboardConfigs, curDatasources) || localDatasourceValue || curDatasources[0]?.id);
      }
      if (configs) {
        // TODO: configs 中可能没有 var 属性会导致 VariableConfig 报错
        const variableConfig = configs.var
          ? configs
          : {
              ...configs,
              var: [],
            };
        setVariableConfig(
          _.map(variableConfig.var, (item) => {
            return _.omit(item, 'options'); // 兼容性代码，去除掉已保存的 options
          }) as IVariable[],
        );
        setDashboardLinks(configs.links);
        setPanels(sortPanelsByGridLayout(configs.panels));
        if (cbk) {
          cbk();
        }
      }
    });
  };
  const handleUpdateDashboardConfigs = (id, configs) => {
    updateDashboardConfigs(id, configs).then((res) => {
      updateAtRef.current = res.update_at;
      refresh();
    });
  };
  const handleVariableChange = (value, b, valueWithOptions) => {
    const dashboardConfigs: any = dashboard.configs;
    dashboardConfigs.var = value;
    // 更新变量配置
    b && handleUpdateDashboardConfigs(dashboard.id, { configs: JSON.stringify(dashboardConfigs) });
    // 更新变量配置状态
    if (valueWithOptions) {
      setVariableConfigWithOptions(valueWithOptions);
      setDashboardMeta({
        dashboardId: _.toString(id),
        variableConfigWithOptions: valueWithOptions,
      });
    }
  };
  const stopAutoRefresh = () => {
    refreshRef.current?.closeRefresh();
  };

  useEffect(() => {
    refresh();
  }, [id]);

  useInterval(() => {
    if (import.meta.env.PROD && dashboard.id) {
      getDashboardPure(_.toString(dashboard.id)).then((res) => {
        if (updateAtRef.current && res.update_at > updateAtRef.current) {
          if (editable) setEditable(false);
        } else {
          setEditable(true);
        }
      });
    }
  }, 2000);

  if (!datasourceValue)
    return (
      <PageLayout>
        <div>{t('detail.datasource_empty')}</div>
      </PageLayout>
    );

  return (
    <PageLayout
      customArea={
        <Title
          isPreview={isPreview}
          isBuiltin={isBuiltin}
          gobackPath={gobackPath}
          datasources={datasources}
          datasourceValue={datasourceValue}
          setDatasourceValue={setDatasourceValue}
          dashboard={dashboard}
          refresh={() => {
            // 集群修改需要刷新数据
            refresh(() => {
              // TODO: cluster 和 vars 目前没办法做到同步，暂时用定时器处理
              setTimeout(() => {
                setForceRender(_.uniqueId('forceRenderKey_'));
              }, 500);
            });
          }}
          range={range}
          setRange={(v) => {
            setRange(v);
          }}
          step={step}
          setStep={(val) => {
            setStep(val);
            setLocalStep(id, val);
          }}
          onAddPanel={(type) => {
            if (type === 'row') {
              const newPanels = updatePanelsInsertNewPanelToGlobal(
                panels,
                {
                  type: 'row',
                  id: uuidv4(),
                  name: i18n.language === 'en_US' ? 'Row' : '分组',
                  collapsed: true,
                },
                'row',
              );
              setPanels(newPanels);
              handleUpdateDashboardConfigs(dashboard.id, {
                configs: panelsMergeToConfigs(dashboard.configs, newPanels),
              });
            } else {
              setEditorData({
                visible: true,
                id,
                initialValues: {
                  name: 'Panel Title',
                  type,
                  targets: [
                    {
                      refId: 'A',
                      expr: '',
                    },
                  ],
                  custom: defaultCustomValuesMap[type],
                  options: defaultOptionsValuesMap[type],
                },
              });
            }
          }}
        />
      }
    >
      <div className='dashboard-detail-container'>
        <div className='dashboard-detail-content'>
          {!editable && (
            <div style={{ padding: '5px 10px' }}>
              <Alert type='warning' message='仪表盘已经被别人修改，为避免相互覆盖，请刷新仪表盘查看最新配置和数据' />
            </div>
          )}
          <div className='dashboard-detail-content-header'>
            <div className='variable-area'>
              {variableConfig && (
                <VariableConfig
                  isPreview={isPreview}
                  onChange={handleVariableChange}
                  value={variableConfig}
                  datasourceValue={datasourceValue}
                  range={range}
                  id={id}
                  onOpenFire={stopAutoRefresh}
                />
              )}
            </div>
            {!isPreview && (
              <DashboardLinks
                value={dashboardLinks}
                onChange={(v) => {
                  const dashboardConfigs: any = dashboard.configs;
                  dashboardConfigs.links = v;
                  handleUpdateDashboardConfigs(id, {
                    configs: JSON.stringify(dashboardConfigs),
                  });
                  setDashboardLinks(v);
                }}
              />
            )}
          </div>
          {variableConfigWithOptions && (
            <Panels
              id={id}
              isPreview={isPreview}
              key={forceRenderKey}
              editable={editable}
              panels={panels}
              setPanels={setPanels}
              datasourceValue={datasourceValue}
              dashboard={dashboard}
              range={range}
              step={step}
              variableConfig={variableConfigWithOptions}
              onShareClick={(panel) => {
                const curDatasourceValue = panel.datasourceValue
                  ? replaceExpressionVars(panel.datasourceValue, variableConfigWithOptions, variableConfigWithOptions.length, id)
                  : datasourceValue;
                const serielData = {
                  dataProps: {
                    ...panel,
                    datasourceValue: curDatasourceValue,
                    // @ts-ignore
                    datasourceName: _.find(datasourceList, { id: curDatasourceValue })?.name,
                    targets: _.map(panel.targets, (target) => {
                      const realExpr = variableConfigWithOptions
                        ? replaceExpressionVars(target.expr, variableConfigWithOptions, variableConfigWithOptions.length, id)
                        : target.expr;
                      return {
                        ...target,
                        expr: realExpr,
                      };
                    }),
                    step,
                    range,
                  },
                };
                SetTmpChartData([
                  {
                    configs: JSON.stringify(serielData),
                  },
                ]).then((res) => {
                  const ids = res.dat;
                  window.open('/chart/' + ids);
                });
              }}
              onUpdated={(res) => {
                updateAtRef.current = res.update_at;
                refresh();
              }}
            />
          )}
        </div>
      </div>
      <Editor
        mode='add'
        visible={editorData.visible}
        setVisible={(visible) => {
          setEditorData({
            ...editorData,
            visible,
          });
        }}
        variableConfigWithOptions={variableConfigWithOptions}
        datasourceValue={datasourceValue}
        id={editorData.id}
        time={range}
        initialValues={editorData.initialValues}
        onOK={(values) => {
          const newPanels = updatePanelsInsertNewPanelToGlobal(panels, values, 'chart');
          setPanels(newPanels);
          handleUpdateDashboardConfigs(dashboard.id, {
            configs: panelsMergeToConfigs(dashboard.configs, newPanels),
          });
        }}
      />
    </PageLayout>
  );
}
