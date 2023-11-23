import { v4 as guid } from 'uuid';
import React, { useState, useMemo, forwardRef, memo } from 'react';

import './style.less';

const defaultColor = ['#235fa7', '#4fd2dd'];

interface IWidgetProps {
  data: any;
  field: string;
  options: any;
}

const BorderBox8 = ({ options }: IWidgetProps) => {
  const { width, height, dur } = options;
  const [{ path, gradient, mask }] = useState(() => {
    const id = guid();
    return {
      path: `border-box-8-path-${id}`,
      gradient: `border-box-8-gradient-${id}`,
      mask: `border-box-8-mask-${id}`,
    };
  });
  const pathD = useMemo(
    () =>
      options.reverse
        ? `M 2.5, 2.5 L 2.5, ${height - 2.5} L ${width - 2.5}, ${height - 2.5} L ${width - 2.5}, 2.5 L 2.5, 2.5`
        : `M2.5, 2.5 L${width - 2.5}, 2.5 L${width - 2.5}, ${height - 2.5} L2.5, ${height - 2.5} L2.5, 2.5`,
    [width, height, options.reverse],
  );

  const mergedColor = defaultColor;
  const backgroundColor = 'transparent';
  const length = useMemo(() => (width + height - 5) * 2, [width, height]);

  const classNames = 'dv-border-box-8';

  return (
    <div className={classNames}>
      <svg className='dv-border-svg-container' width={width} height={height}>
        <defs>
          <path id={path} d={pathD} fill='transparent' />
          <radialGradient id={gradient} cx='50%' cy='50%' r='50%'>
            <stop offset='0%' stopColor='#fff' stopOpacity='1' />
            <stop offset='100%' stopColor='#fff' stopOpacity='0' />
          </radialGradient>

          <mask id={mask}>
            <circle cx='0' cy='0' r='150' fill={`url(#${gradient})`}>
              <animateMotion dur={`${dur}s`} path={pathD} rotate='auto' repeatCount='indefinite' />
            </circle>
          </mask>
        </defs>

        <polygon fill={backgroundColor} points={`5, 5 ${width - 5}, 5 ${width - 5} ${height - 5} 5, ${height - 5}`} />

        <use stroke={mergedColor[0]} strokeWidth='1' href={`#${path}`} />

        <use stroke={mergedColor[1]} strokeWidth='3' href={`#${path}`} mask={`url(#${mask})`}>
          <animate attributeName='stroke-dasharray' from={`0, ${length}`} to={`${length}, 0`} dur={`${dur}s`} repeatCount='indefinite' />
        </use>
      </svg>

      <div className='border-box-content'></div>
    </div>
  );
};

export default memo(BorderBox8);
