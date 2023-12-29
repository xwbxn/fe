import { useGlobalState } from '@/pages/dashboard/globalState';
import { IPanel } from '@/pages/dashboard/types';
import { Datum } from '@ant-design/graphs';
import { Column } from '@ant-design/plots';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import getCalculatedValuesBySeries from '../../utils/getCalculatedValuesBySeries';
import { convertTimeseriesToG2Data } from '../../utils/seriesConvert';
import valueFormatter from '../../utils/valueFormatter';

import './style.less';

interface IProps {
  values: IPanel;
  series: any[];
  themeMode?: 'dark';
}

const getColumnsKeys = (data: any[]) => {
  const keys = _.reduce(
    data,
    (result, item) => {
      return _.union(result, _.keys(item.metric));
    },
    [],
  );
  return _.uniq(keys);
};

export default function (props: IProps) {
  const { values, series, themeMode } = props;
  const { custom, options } = values;
  const { calc } = custom;

  const seriesData = convertTimeseriesToG2Data(series);
  const [, setTableFields] = useGlobalState('tableFields');

  useEffect(() => {
    const data = getCalculatedValuesBySeries(
      series,
      calc,
      {
        unit: options?.standardOptions?.util,
        decimals: options?.standardOptions?.decimals,
        dateFormat: options?.standardOptions?.dateFormat,
      },
      options?.valueMappings,
    );

    setTableFields(getColumnsKeys(data));
  }, [series]);

  const customOptions = {
    xField: 'name',
    yField: 'value',
    seriesField: custom?.seriesField,
    isStack: custom.stack === 'noraml',
    yAxis: {
      tickCount: 4,
      label: {
        formatter: (val) => {
          return valueFormatter(
            {
              unit: options?.standardOptions?.util,
              decimals: options?.standardOptions?.decimals,
              dateFormat: options?.standardOptions?.dateFormat,
            },
            val,
          ).text;
        },
      },
    },
    tooltip: {
      formatter: (datum: Datum) => {
        const val = {
          name: custom.stack === 'noraml' ? datum[custom.seriesField] : datum.name,
          value: valueFormatter(
            {
              unit: options?.standardOptions?.util,
              decimals: options?.standardOptions?.decimals,
              dateFormat: options?.standardOptions?.dateFormat,
            },
            datum.value,
          ).text,
        };
        return val;
      },
    },
  };

  return (
    <div className='renderer-column-container'>
      <Column {...customOptions} data={seriesData} renderer="canvas"></Column>
    </div>
  );
}
