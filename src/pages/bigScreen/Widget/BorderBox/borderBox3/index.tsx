import React, { useMemo, forwardRef, memo } from 'react';

import './style.less';

const defaultColor = ['#2862b7', '#2862b7'];

interface IWidgetProps {
  data: any;
  field: string;
  options: any;
}

const BorderBox3 = ({ options }: IWidgetProps) => {
  const { width, height } = options;

  const mergedColor = defaultColor;
  const classNames = 'dv-border-box-3';
  const backgroundColor = 'transparent';

  return (
    <div className={classNames}>
      <svg className='dv-border-svg-container' width={width} height={height}>
        <polygon
          fill={backgroundColor}
          points={`
          23, 23 ${width - 24}, 23 ${width - 24}, ${height - 24} 23, ${height - 24}
        `}
        />
        <polyline className='dv-bb3-line1' stroke={mergedColor[0]} points={`4, 4 ${width - 22} ,4 ${width - 22}, ${height - 22} 4, ${height - 22} 4, 4`} />
        <polyline className='dv-bb3-line2' stroke={mergedColor[1]} points={`10, 10 ${width - 16}, 10 ${width - 16}, ${height - 16} 10, ${height - 16} 10, 10`} />
        <polyline className='dv-bb3-line2' stroke={mergedColor[1]} points={`16, 16 ${width - 10}, 16 ${width - 10}, ${height - 10} 16, ${height - 10} 16, 16`} />
        <polyline className='dv-bb3-line2' stroke={mergedColor[1]} points={`22, 22 ${width - 4}, 22 ${width - 4}, ${height - 4} 22, ${height - 4} 22, 22`} />
      </svg>

      <div className='border-box-content'></div>
    </div>
  );
};

export default memo(BorderBox3);
