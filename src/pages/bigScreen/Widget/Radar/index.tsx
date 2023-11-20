import React, { useMemo } from 'react';
import { IEchartConfig } from '../../type';
import { getStyles } from '../../utils';
import Echarts from '../Echarts';
import { handleEchartsOption, handleData } from '../Echarts/utils';

interface IRadarProps extends IEchartConfig {
  options: any;
  data: any;
  field: string;
}

const Radar = ({ options, data, field }: IRadarProps) => {
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
      radar: {
        ...configuration.radar.config,
        indicator: xAxisData.map((item) => ({
          name: item,
        })),
      },
      series: series
        ? [
            {
              ...configuration.radar.series,
              data: series.map((item, index) => ({
                name: item.name,
                value: item.data,
                areaStyle: {
                  color: configuration.color[index],
                },
                lineStyle: {
                  width: 1,
                },
              })),
            },
          ]
        : [],
    };
  }, [data, field, options]);

  return <Echarts style={getStyles(options)} options={getOption} />;
};

export default Radar;
