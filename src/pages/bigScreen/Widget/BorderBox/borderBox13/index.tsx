import React, { useMemo, forwardRef, memo } from 'react';

import './style.less';

const defaultColor = ['#6586ec', '#2cf7fe'];
interface IWidgetProps {
  data: any;
  field: string;
  options: any;
}
const BorderBox13 = ({ options }: IWidgetProps) => {
  const { width, height } = options;

  const mergedColor = defaultColor;
  const backgroundColor = 'transparent';
  const classNames = 'dv-border-box-13';

  return (
    <div className={classNames}>
      <svg className='dv-border-svg-container' width={width} height={height}>
        <path
          fill={backgroundColor}
          stroke={mergedColor[0]}
          d={`
            M 5 20 L 5 10 L 12 3  L 60 3 L 68 10
            L ${width - 20} 10 L ${width - 5} 25
            L ${width - 5} ${height - 5} L 20 ${height - 5}
            L 5 ${height - 20} L 5 20
          `}
        />

        <path fill='transparent' strokeWidth='3' strokeLinecap='round' strokeDasharray='10, 5' stroke={mergedColor[0]} d='M 16 9 L 61 9' />

        <path fill='transparent' stroke={mergedColor[1]} d='M 5 20 L 5 10 L 12 3  L 60 3 L 68 10' />

        <path fill='transparent' stroke={mergedColor[1]} d={`M ${width - 5} ${height - 30} L ${width - 5} ${height - 5} L ${width - 30} ${height - 5}`} />
      </svg>
      <div className='border-box-content'></div>
    </div>
  );
};

export default memo(BorderBox13);
