import React, { useMemo, forwardRef, memo } from 'react';

import './style.less';

const border = ['left-top', 'right-top', 'left-bottom', 'right-bottom'];
const defaultColor = ['#1d48c4', '#d3e1f8'];

interface IWidgetProps {
  data: any;
  field: string;
  options: any;
}

const BorderBox10 = ({ options }: IWidgetProps) => {
  const { width, height } = options;

  const mergedColor = defaultColor;
  const backgroundColor = 'transparent';
  const classNames = 'dv-border-box-10';

  const styles = useMemo(
    () => ({
      boxShadow: `inset 0 0 25px 3px ${mergedColor[0]}`,
    }),
    [mergedColor],
  );

  return (
    <div className={classNames} style={styles}>
      <svg className='dv-border-svg-container' width={width} height={height}>
        <polygon
          fill={backgroundColor}
          points={`
          4, 0 ${width - 4}, 0 ${width}, 4 ${width}, ${height - 4} ${width - 4}, ${height}
          4, ${height} 0, ${height - 4} 0, 4
        `}
        />
      </svg>

      {border.map((borderName) => (
        <svg width='150px' height='150px' key={borderName} className={`${borderName} dv-border-svg-container`}>
          <polygon fill={mergedColor[1]} points='40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3' />
        </svg>
      ))}
      <div className='border-box-content'></div>
    </div>
  );
};

export default memo(BorderBox10);
