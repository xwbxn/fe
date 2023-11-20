import React, { useMemo } from 'react';
import { IEchartConfig } from '../../type';
import { getStyles } from '../../utils';
import Echarts from '../Echarts';
import { handleEchartsOption, handleData } from '../Echarts/utils';

interface IPieProps extends IEchartConfig {
  options: any;
  data: any;
  field: string;
}

const Pie = ({ options, data, field }: IPieProps) => {
  // 处理echarts数据
  const getOption = useMemo(() => {
    const configuration = handleEchartsOption(options);
    const currentData = data && data[field] ? data[field] : [];
    const { legendData, xAxisData, yAxisData, series } = handleData(currentData);
    return {
      ...configuration,
      tooltip: {
        trigger: 'item',
      },
      legend: {
        ...configuration.legend,
        data: legendData,
      },
      xAxis: {
        ...configuration.xAxis,
        data: xAxisData,
      },
      yAxis: {
        ...configuration.yAxis,
        data: yAxisData,
      },
      series: series
        ? series.map((item, index) => ({
            ...configuration.pie.series,
            ...item,
            data: currentData[index].data,
          }))
        : [],
    };
  }, [data, field, options]);

  return <Echarts style={getStyles(options)} options={getOption} />;
};

export default Pie;
