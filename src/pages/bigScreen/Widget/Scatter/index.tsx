import React, { useMemo } from 'react';
import { IEchartConfig } from '../../type';
import { getStyles } from '../../utils';
import Echarts from '../Echarts';
import { handleEchartsOption, handleData } from '../Echarts/utils';

interface IScatterProps extends IEchartConfig {
  options: any;
  data: any;
  field: string;
}

const Scatter = ({ options, data, field }: IScatterProps) => {
  // 处理echarts数据
  const getOption = useMemo(() => {
    const configuration = handleEchartsOption(options);
    const currentData = data && data[field] ? data[field] : [];
    const { legendData, xAxisData, yAxisData, series } = handleData(currentData);
    return {
      ...configuration,
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
        ? series.map((item) => ({
            ...configuration.scatter.series,
            ...item,
          }))
        : [],
    };
  }, [data, field, options]);

  return <Echarts style={getStyles(options)} options={getOption} />;
};

export default Scatter;
