import { IRawTimeRange } from '@/components/TimeRangePicker/types';
import { IPanel } from '@/pages/dashboard/types';
import { Datum } from '@ant-design/graphs';
import { Area } from '@ant-design/plots';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { convertTimeseriesToG2Data } from '../../utils/seriesConvert';
import valueFormatter from '../../utils/valueFormatter';
import './style.less';

interface IProps {
  values: IPanel;
  series: any[];
  themeMode?: 'dark';
  time?: IRawTimeRange;
}

const TimeSeriesN = function (props: IProps) {
  const { values, series, themeMode } = props;
  const { custom, options, datasourceCate } = values;
  const [seriesData, setseriesData] = useState<any[]>([]);

  useEffect(() => {
    if (datasourceCate === 'prometheus') {
      setseriesData(convertTimeseriesToG2Data(series));
    } else {
      setseriesData(series);
    }
  }, [series]);

  let curMaxValue;
  if (options.standardOptions?.max) {
    curMaxValue = options.standardOptions?.max;
  } else {
    curMaxValue = _.maxBy(seriesData, 'value')?.value || 0;
    curMaxValue = curMaxValue * 1.2;
  }

  const customOptions = {
    ...custom,
    xField: 'time',
    yField: 'value',
    seriesField: 'name',
    animation: false,
    smooth: custom.lineInterpolation === 'smooth',
    isStack: custom.stack === 'noraml',
    isPercent: false,
    areaStyle: {
      fillOpacity: custom.fillOpacity || 0.5,
    },
    line: {
      size: custom.lineWidth || 1,
    },
    legend:
      options?.legend?.displayMode === 'list'
        ? {
            layout: options?.legend?.placement === 'bottom' ? 'horizontal' : 'vertical',
            position: options?.legend?.placement === 'bottom' ? 'bottom' : 'right',
            flipPage: false,
            itemSpacing: 0,
          }
        : false,
    xAxis: {
      tickCount: 10,
      label: {
        formatter: (val: string) => {
          return moment(val, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss');
        },
      },
    },
    yAxis: {
      tickCount: 4,
      max: custom.stack === 'noraml' ? undefined : curMaxValue,
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
      shared: options?.tooltip?.mode === 'all',
      reversed: options.tooltip?.sort === 'desc',
      formatter: (datum: Datum) => {
        const val = {
          name: datum.name,
          value: valueFormatter(
            {
              unit: options?.standardOptions?.util,
              decimals: options?.standardOptions?.decimals,
              dateFormat: options?.standardOptions?.dateFormat,
            },
            datum.value,
          ).text,
          time: moment.unix(datum.time).format('YYYY-MM-DD HH:mm'),
        };
        return val;
      },
    },
    annotations: options.thresholds?.steps.map((v) => {
      return {
        type: 'line',
        start: ['min', v.value],
        end: ['max', v.value],
        style: {
          stroke: v.color,
          lineDash: [2, 2],
        },
      };
    }),
  };

  return (
    <div className='renderer-timeseries-n-container'>
      <Area {...customOptions} data={seriesData} renderer="canvas"></Area>
    </div>
  );
};

export default TimeSeriesN;
