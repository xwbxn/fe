import React, { useMemo } from 'react';
import { IEchartConfig } from '../../type';
import { getStyles } from '../../utils';
import Echarts from '../Echarts';
import { handleEchartsOption, handleData } from '../Echarts/utils';

interface IGaugeProps extends IEchartConfig {
  options: any;
  data: any;
  field: string;
}

const Gauge = ({ options, data, field }: IGaugeProps) => {
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
            ...configuration.gauge.series,
            ...item,
            data: currentData[index].data,
          }))
        : [],
    };
  }, [data, field, options]);

  return <Echarts style={getStyles(options)} options={getOption} autoplay={{ interval: 0 }} />;
};

export default Gauge;
