import React, { useState } from 'react';
import { Modal, message } from 'antd';
import moment from 'moment';
import ModalHOC, { ModalWrapProps } from '@/components/ModalHOC';
import { IRawTimeRange, parseRange } from '@/components/TimeRangePicker';
import { putOptionalMetrics } from '@/services/assets';

import PromQueryBuilder, {MetricItem, PromVisualQuery, buildPromVisualQueryFromPromQL } from './item';

interface IProps {
  datasourceValue: number;
  range: IRawTimeRange;
  value?: string;
  type?: string;
  onChange: (value: string) => void;
}

function PromQueryBuilderItemModal(props: ModalWrapProps & IProps) {
  const { visible, datasourceValue, range, value = '', type,onChange } = props;
  const parsedRange = parseRange(range);
  const start = moment(parsedRange.start).unix();
  const end = moment(parsedRange.end).unix();
  const queryContext = buildPromVisualQueryFromPromQL(value);
  const [query, setQuery] = useState<PromVisualQuery>(queryContext.query);
  const [messageApi] = message.useMessage();
  return (
    <Modal
      width={800}
      title='资产指标设置'
      visible={visible}
      closable={false}
      onOk={() => {
        let  metrics:MetricItem[];
          metrics = query.items!=null?query.items:[];        
          let param ={
             id:parseInt(value),
             optional_metrics:metrics.length>0?JSON.stringify(metrics):''
          }
          putOptionalMetrics(param).then((res)=>{            
            props.destroy();
          })
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
        id = {value}
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
