import { IPanel } from '@/pages/dashboard/types';
import { Column } from '@ant-design/plots';
import React from 'react';
import { convertTimeseriesToG2Data } from '../../utils/seriesConvert';

import './style.less';

interface IProps {
  values: IPanel;
  series: any[];
  themeMode?: 'dark';
}

export default function (props: IProps) {
  const { values, series, themeMode } = props;
  const { custom, options } = values;

  const data = convertTimeseriesToG2Data(series)

  console.log('data', data)

  const customOptions = {
    isStack: true,
    xField: 'type',
    yField: 'value',
    seriesField: 'name',
  };

  return (
    <div className='renderer-column-container'>
      <Column {...customOptions} data={data}></Column>
    </div>
  );
}
