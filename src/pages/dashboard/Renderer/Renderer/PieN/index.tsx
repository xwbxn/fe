import { IPanel } from '@/pages/dashboard/types';
import { Pie } from '@ant-design/plots';
import _ from 'lodash';
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
    radius: 1,
    innerRadius: 0.64,
    legend: {
      layout: 'vertical',
      position: 'right',
    },
    meta: {
      value: {
        formatter: (v) => `${v}`,
      },
    },
    statistic: {
      title: {
        content: '',
      },
      content: {
        customHtml: (container, view, datum, data) => {
          const total = _.sumBy(data, (v: any) => {
            return v.value;
          });
          const max = _.maxBy(data, (v: any) => {
            return v.value;
          });
          return `${((max.value * 100) / total).toFixed(0)}%`;
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      style: { textAlign: 'center' },
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
    },
  };

  return (
    <div className='renderer-column-container'>
      <Pie data={series} {...custom}></Pie>
    </div>
  );
}
