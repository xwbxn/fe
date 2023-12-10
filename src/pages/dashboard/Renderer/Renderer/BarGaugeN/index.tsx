import { IPanel } from '@/pages/dashboard/types';
import { Bar } from '@ant-design/plots';
import _ from 'lodash';
import React from 'react';
import getCalculatedValuesBySeries from '../../utils/getCalculatedValuesBySeries';

import './style.less';

interface IProps {
  values: IPanel;
  series: any[];
  themeMode?: 'dark';
}

export default function (props: IProps) {
  const { values, series, themeMode } = props;
  const { custom, options } = values;

  const { calc, maxValue, sortOrder = 'desc' } = custom;
  let calculatedValues = getCalculatedValuesBySeries(
    series,
    calc,
    {
      unit: options?.standardOptions?.util,
      decimals: options?.standardOptions?.decimals,
      dateFormat: options?.standardOptions?.dateFormat,
    },
    options?.valueMappings,
  );
  if (sortOrder && sortOrder !== 'none') {
    calculatedValues = _.orderBy(calculatedValues, ['stat'], [sortOrder]);
  }

  const data = calculatedValues.map((v) => {
    return {
      name: v.name,
      value: v.stat,
    };
  });

  const customOptions = {
    xField: 'value',
    yField: 'name',
  };

  return (
    <div className='renderer-bar-gauge-n-container'>
      <Bar {...customOptions} data={data.slice(0, 5)}></Bar>
    </div>
  );
}
