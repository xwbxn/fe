import React, { useMemo, forwardRef, memo } from 'react';

import './style.less';

const defaultColor = ['rgba(255, 255, 255, 0.35)', 'gray'];

interface IWidgetProps {
  data: any;
  field: string;
  options: any;
}

const BorderBox6 = ({ options }: IWidgetProps) => {
  const { width, height } = options;

  const mergedColor = defaultColor;
  const backgroundColor = 'transparent';
  const classNames = 'dv-border-box-6';

  return (
    <div className={classNames}>
      <svg className='dv-border-svg-container' width={width} height={height}>
        <polygon
          fill={backgroundColor}
          points={`
          9, 7 ${width - 9}, 7 ${width - 9}, ${height - 7} 9, ${height - 7}
        `}
        />
        <circle fill={mergedColor[1]} cx='5' cy='5' r='2' />
        <circle fill={mergedColor[1]} cx={width - 5} cy='5' r='2' />
        <circle fill={mergedColor[1]} cx={width - 5} cy={height - 5} r='2' />
        <circle fill={mergedColor[1]} cx='5' cy={height - 5} r='2' />
        <polyline stroke={mergedColor[0]} points={`10, 4 ${width - 10}, 4`} />
        <polyline stroke={mergedColor[0]} points={`10, ${height - 4} ${width - 10}, ${height - 4}`} />
        <polyline stroke={mergedColor[0]} points={`5, 70 5, ${height - 70}`} />
        <polyline stroke={mergedColor[0]} points={`${width - 5}, 70 ${width - 5}, ${height - 70}`} />
        <polyline stroke={mergedColor[0]} points={`3, 10, 3, 50`} />
        <polyline stroke={mergedColor[0]} points={`7, 30 7, 80`} />
        <polyline stroke={mergedColor[0]} points={`${width - 3}, 10 ${width - 3}, 50`} />
        <polyline stroke={mergedColor[0]} points={`${width - 7}, 30 ${width - 7}, 80`} />
        <polyline stroke={mergedColor[0]} points={`3, ${height - 10} 3, ${height - 50}`} />
        <polyline stroke={mergedColor[0]} points={`7, ${height - 30} 7, ${height - 80}`} />
        <polyline stroke={mergedColor[0]} points={`${width - 3}, ${height - 10} ${width - 3}, ${height - 50}`} />
        <polyline stroke={mergedColor[0]} points={`${width - 7}, ${height - 30} ${width - 7}, ${height - 80}`} />
      </svg>

      <div className='border-box-content'></div>
    </div>
  );
};

export default memo(BorderBox6);
