import React, { FC, useMemo } from 'react';
// 自定义ehcarts
import CustomEcharts from '../Echarts';
// echarts类型
// 处理options
import { handleEchartsOption, handleData } from '../Echarts/utils';
import { IEchartConfig } from '../../type';
import { getStyles } from '../../utils';

interface IBaseLineProps extends IEchartConfig {
  options: any;
  data: any;
  field: string;
}

const Line = ({ data, field, options }: IBaseLineProps) => {
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
            ...configuration.line.series,
            ...item,
          }))
        : [],
    };
  }, [data, field, options]);

  return <CustomEcharts style={getStyles(options)} options={getOption} />;
};

export default Line;
