import React, { useMemo, forwardRef, memo } from 'react';

import './style.less';

const defaultColor = ['rgba(128,128,128,0.3)', 'rgba(128,128,128,0.5)'];

interface IWidgetProps {
  data: any;
  field: string;
  options: any;
}

const BorderBox7 = ({ options }: IWidgetProps) => {
  const { width, height } = options;

  const mergedColor = defaultColor;
  const backgroundColor = 'transparent';
  const classNames = 'dv-border-box-7';

  const styles = useMemo(
    () => ({
      boxShadow: `inset 0 0 40px ${mergedColor[0]}`,
      border: `1px solid ${mergedColor[0]}`,
      backgroundColor,
    }),
    [mergedColor, backgroundColor],
  );

  return (
    <div className={classNames} style={styles}>
      <svg className='dv-border-svg-container' width={width} height={height}>
        <polyline className='dv-bb7-line-width-2' stroke={mergedColor[0]} points={`0, 25 0, 0 25, 0`} />
        <polyline className='dv-bb7-line-width-2' stroke={mergedColor[0]} points={`${width - 25}, 0 ${width}, 0 ${width}, 25`} />
        <polyline className='dv-bb7-line-width-2' stroke={mergedColor[0]} points={`${width - 25}, ${height} ${width}, ${height} ${width}, ${height - 25}`} />
        <polyline className='dv-bb7-line-width-2' stroke={mergedColor[0]} points={`0, ${height - 25} 0, ${height} 25, ${height}`} />
        <polyline className='dv-bb7-line-width-5' stroke={mergedColor[1]} points={`0, 10 0, 0 10, 0`} />
        <polyline className='dv-bb7-line-width-5' stroke={mergedColor[1]} points={`${width - 10}, 0 ${width}, 0 ${width}, 10`} />
        <polyline className='dv-bb7-line-width-5' stroke={mergedColor[1]} points={`${width - 10}, ${height} ${width}, ${height} ${width}, ${height - 10}`} />
        <polyline className='dv-bb7-line-width-5' stroke={mergedColor[1]} points={`0, ${height - 10} 0, ${height} 10, ${height}`} />
      </svg>

      <div className='border-box-content'></div>
    </div>
  );
};

export default memo(BorderBox7);
