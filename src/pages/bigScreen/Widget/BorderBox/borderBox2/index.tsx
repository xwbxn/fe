import React, { useMemo, forwardRef, memo } from 'react';

import './style.less';

const defaultColor = ['#fff', 'rgba(255, 255, 255, 0.6)'];

interface IWidgetProps {
  data: any;
  field: string;
  options: any;
}

const BorderBox2 = ({ options }: IWidgetProps) => {
  const { width, height } = options;

  const mergedColor = defaultColor;
  const backgroundColor = 'transparent';
  const classNames = 'dv-border-box-2';

  return (
    <div className={classNames}>
      <svg className='dv-border-svg-container' width={width} height={height}>
        <polygon
          fill={backgroundColor}
          points={`
          7, 7 ${width - 7}, 7 ${width - 7}, ${height - 7} 7, ${height - 7}
        `}
        />
        <polyline stroke={mergedColor[0]} points={`2, 2 ${width - 2} ,2 ${width - 2}, ${height - 2} 2, ${height - 2} 2, 2`} />
        <polyline stroke={mergedColor[1]} points={`6, 6 ${width - 6}, 6 ${width - 6}, ${height - 6} 6, ${height - 6} 6, 6`} />
        <circle fill={mergedColor[0]} cx='11' cy='11' r='1' />
        <circle fill={mergedColor[0]} cx={width - 11} cy='11' r='1' />
        <circle fill={mergedColor[0]} cx={width - 11} cy={height - 11} r='1' />
        <circle fill={mergedColor[0]} cx='11' cy={height - 11} r='1' />
      </svg>
      <div className='border-box-content'></div>
    </div>
  );
};

export default memo(BorderBox2);
