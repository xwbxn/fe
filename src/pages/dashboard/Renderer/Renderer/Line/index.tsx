import { IPanel } from '@/pages/dashboard/types';
import { Line } from '@ant-design/plots';
import React from 'react';

import './style.less';

interface IProps {
  values: IPanel;
  series: any[];
  themeMode?: 'dark';
}

export default function (props: IProps) {
  const { values, series, themeMode } = props;
  const { custom, options } = values;

  const customOptions = {
    xField: 'name',
    yField: 'value',
    xAxis: {
      // type: 'timeCat',
      tickCount: 10,
    },
    smooth: true,
  };

  return (
    <div className='renderer-line-container'>
      <Line {...customOptions} data={series}></Line>
    </div>
  );
}
