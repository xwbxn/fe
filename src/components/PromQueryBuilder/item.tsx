import React, { useEffect, useState } from 'react';
import MetricSelect from './FixMetricSelect';
import LabelFilters from './LabelFilters';
import { PromVisualQuery, PromVisualQueryLabelFilter } from './types';
import { normalizeDefaultValue } from './utils';
import './style.less';
import { PlusCircleOutlined } from '@ant-design/icons';
import { GetAssetType } from '@/services/metric';
import { getAsset } from '@/services/assets';
import { Input, message } from 'antd';
import { buildPromVisualQueryFromPromQL } from './utils/buildPromVisualQueryFromPromQL';


export type { PromVisualQuery } from './types';
export { renderQueryMap } from './RawQuery';
export { buildPromVisualQueryFromPromQL } from './utils/buildPromVisualQueryFromPromQL';

export interface MetricItem {
  name: string;
  metric: string;
  labels: PromVisualQueryLabelFilter[];
}
interface IProps {
  datasourceValue: number;
  params: {
    start: number;
    end: number;
  };
  id: string;
  type?: string;
  item?: MetricItem[];
  rawQueryOpen?: boolean;
  value: PromVisualQuery;
  onChange: (query: PromVisualQuery) => void;
}

export default function index(props: IProps) {
  const { datasourceValue, params, rawQueryOpen = true, value, type, onChange, id } = props;
  const query = normalizeDefaultValue(value);
  const [num, setNum] = useState<number>(1);
  const [optionalMetrics, setOptionalMetrics] = useState<string[]>([]);
  const [defaultMerics, setDefaultMerics] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  useEffect(() => {
    GetAssetType().then(({ dat }) => {
      dat.forEach(element => {
        if (element.name === type) {
          if (element.metrics != null && element.metrics.length > 0) {
            element.metrics.forEach(item => {
              defaultMerics.push(item)
            })
            setDefaultMerics([...defaultMerics])
          }
          if (element.optional_metrics != null && element.optional_metrics.length > 0) {
            element.optional_metrics.forEach(item => {
              optionalMetrics.push(item)
            })
            setOptionalMetrics([...optionalMetrics])
          }
        }
      });
    });
    getAsset(id).then(({ dat }) => {
      if (dat.optional_metrics != null && dat.optional_metrics.length > 0) {
        let metrics = JSON.parse(dat.optional_metrics);
        let current_metric = []
        metrics.forEach(metric => {
          let queryContext = buildPromVisualQueryFromPromQL(metric.metric);
          let label: MetricItem = {
            name: metric.name,
            metric: queryContext.query.metric,
            labels: queryContext.query.labels,
          };
          current_metric.push(label)
        })
        setMetrics(current_metric);
      }
    });

  }, []);
  return (
    <div className='prom-query-builder-container' >
      <div style={{ marginLeft: '0px' }} onClick={() => {
        if (optionalMetrics.length > 0) {
          setNum(num + 1);
          metrics.push({
            metric: '',
            name: '',
            labels: [],
          })
          setMetrics([...metrics])
        } else {
          message.error('该资产未有可选指标！');
        }

      }}>添加指标
        <PlusCircleOutlined style={{ paddingLeft: "2px" }} />
      </div>

      {metrics.map((item, index) => {

        return (
          <div key={index} className='prom-query-builder-metric-label-container1'>
            <div style={{ width: '40%', height: '65px', display: 'flex' }}>
              <MetricSelect
                datasourceValue={datasourceValue}
                metrics={optionalMetrics}
                params={params}
                value={item.metric}
                onChange={(val) => {
                  metrics[index].metric = val;
                  item.name = val;
                  query.items = metrics;
                  onChange({
                    ...query,
                    metric: val,
                  });
                  // setMetrics(metrics)
                }}
              />
              <div><Input className='metric_title' placeholder="填写名称" value={item.name} onChange={(e) => {
                metrics[index].name = e.target.value;
                query.items = metrics;
                onChange({
                  ...query,
                  name: e.target.value,
                });
              }} /></div>
              <div className="metrics-titile-input-close_div" title='删除该指标'
                onClick={() => {
                  metrics.splice(index, 1);
                  setMetrics([...metrics])
                }} ><span className="metrics-titile-input-close" >X</span></div>
            </div>
            <LabelFilters
              datasourceValue={datasourceValue}
              metric={metrics[index].metric}
              params={params}
              value={metrics[index].labels}
              onChange={(val) => {
                metrics[index].labels = val;
                query.items = metrics;
                onChange({
                  ...query,
                  labels: val,
                });
              }}
            />
          </div>
        )
      })}


      {/* {rawQueryOpen && <RawQuery query={query} datasourceValue={datasourceValue} />} */}
      <div className='prom-query-builder-operation-container' style={{ marginLeft: "0px" }}>
        默认指标：
        <div style={{ display: "inline-grid" }}>
          {defaultMerics.map((item, index) => {
            return <span key={index}>{item}</span>;
          })}
        </div>
      </div>


    </div>
  );
}