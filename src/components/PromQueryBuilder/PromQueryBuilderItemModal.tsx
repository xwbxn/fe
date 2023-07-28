import React, { useState } from 'react';
import { Modal, message } from 'antd';
import moment from 'moment';
import ModalHOC, { ModalWrapProps } from '@/components/ModalHOC';
import { IRawTimeRange, parseRange } from '@/components/TimeRangePicker';
import { putOptionalMetrics } from '@/services/assets';

import PromQueryBuilder, { renderQueryMap, buildPromVisualQueryFromPromQL, PromVisualQuery } from './item';

interface IProps {
  datasourceValue: number;
  range: IRawTimeRange;
  value?: string;
  type?: string;
  onChange: (value: string) => void;
}
/**
 * 存储数据库中的格式
 */
export interface MetricItem {
  name: string;
  metric: string;
}

function PromQueryBuilderItemModal(props: ModalWrapProps & IProps) {
  const { visible, datasourceValue, range, value = '', type, onChange } = props;
  const parsedRange = parseRange(range);
  const start = moment(parsedRange.start).unix();
  const end = moment(parsedRange.end).unix();
  const queryContext = buildPromVisualQueryFromPromQL(value);
  const [query, setQuery] = useState<PromVisualQuery>(queryContext.query);

  const cancel = () => {
    message.error('指标(包括)信息不完整！');
  };
  return (
    <Modal
      width={950}
      title='资产指标设置'
      visible={visible}
      closable={false}
      onOk={() => {

        let dealMetrics = query.items != null ? query.items : [];
        var isSubmitted = true;
        dealMetrics.forEach(item => {
          if (item.metric == null || item.metric.length == 0 || item.name == null || item.name.length == 0) {
            isSubmitted = false;
          }
        })
        if (!isSubmitted) {
          message.error('指标或名称信息不完整！');
          return;
        }
        var postParams = [];
        if (dealMetrics != null && dealMetrics.length > 0) {
          var maps = renderQueryMap(query);
          dealMetrics.forEach((item) => {
            if (maps.has(item.metric)) {
              var selectItem: MetricItem = ({
                name: item.name,
                metric: maps.get(item.metric) != null ? maps.get(item.metric) : ''
              });
              postParams.push(selectItem)
            }
          })
        }
        putOptionalMetrics({
          id: parseInt(value),
          optional_metrics: JSON.stringify(postParams)
        }).then(res => {
          if (dealMetrics.length > 0) {
            message.success('该资产可选指标已设置！');
          } else {
            message.success('该资产可选指标取消/未设置！');
          }
          props.destroy();
        });
      }}
      onCancel={() => {
        props.destroy();
      }}
    >
      <PromQueryBuilder
        datasourceValue={datasourceValue}
        params={{
          start,
          end,
        }}
        id={value}
        type={type}
        value={query}
        onChange={(query) => {
          setQuery(query);
        }}
      />
    </Modal>
  );
}

export default ModalHOC<IProps>(PromQueryBuilderItemModal);
