import { v4 as guid } from 'uuid';
import React, { useMemo, useRef, forwardRef, memo } from 'react';
import { colord } from 'colord';

import './style.less';

const defaultColor = ['#2e6099', '#7ce7fd'];

interface IWidgetProps {
  data: any;
  field: string;
  options: any;
}

const BorderBox12 = ({ options }: IWidgetProps) => {
  const { width, height } = options;
  const filterId = useRef(`border-box-12-filterId-${guid()}`).current;

  const mergedColor = defaultColor;
  const backgroundColor = 'transparent';
  const classNames = 'dv-border-box-12';

  return (
    <div className={classNames}>
      <svg className='dv-border-svg-container' width={width} height={height}>
        <defs>
          <filter id={filterId} height='150%' width='150%' x='-25%' y='-25%'>
            <feMorphology operator='dilate' radius='1' in='SourceAlpha' result='thicken' />
            <feGaussianBlur in='thicken' stdDeviation='2' result='blurred' />
            <feFlood
              floodColor={colord(mergedColor[1] || defaultColor[1])
                .alpha(0.7)
                .toRgbString()}
              result='glowColor'
            >
              <animate
                attributeName='flood-color'
                values={`
                ${colord(mergedColor[1] || defaultColor[1])
                  .alpha(0.7)
                  .toRgbString()};
                ${colord(mergedColor[1] || defaultColor[1])
                  .alpha(0.3)
                  .toRgbString()};
                ${colord(mergedColor[1] || defaultColor[1])
                  .alpha(0.7)
                  .toRgbString()};
              `}
                dur='3s'
                begin='0s'
                repeatCount='indefinite'
              />
            </feFlood>
            <feComposite in='glowColor' in2='blurred' operator='in' result='softGlowColored' />
            <feMerge>
              <feMergeNode in='softGlowColored' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {width && height && (
          <path
            fill={backgroundColor}
            strokeWidth='2'
            stroke={mergedColor[0]}
            d={`
            M15 5 L ${width - 15} 5 Q ${width - 5} 5, ${width - 5} 15
            L ${width - 5} ${height - 15} Q ${width - 5} ${height - 5}, ${width - 15} ${height - 5}
            L 15, ${height - 5} Q 5 ${height - 5} 5 ${height - 15} L 5 15
            Q 5 5 15 5
          `}
          />
        )}

        <path strokeWidth='2' fill='transparent' strokeLinecap='round' filter={`url(#${filterId})`} stroke={mergedColor[1]} d={`M 20 5 L 15 5 Q 5 5 5 15 L 5 20`} />

        <path
          strokeWidth='2'
          fill='transparent'
          strokeLinecap='round'
          filter={`url(#${filterId})`}
          stroke={mergedColor[1]}
          d={`M ${width - 20} 5 L ${width - 15} 5 Q ${width - 5} 5 ${width - 5} 15 L ${width - 5} 20`}
        />

        <path
          strokeWidth='2'
          fill='transparent'
          strokeLinecap='round'
          filter={`url(#${filterId})`}
          stroke={mergedColor[1]}
          d={`
          M ${width - 20} ${height - 5} L ${width - 15} ${height - 5}
          Q ${width - 5} ${height - 5} ${width - 5} ${height - 15}
          L ${width - 5} ${height - 20}
        `}
        />

        <path
          strokeWidth='2'
          fill='transparent'
          strokeLinecap='round'
          filter={`url(#${filterId})`}
          stroke={mergedColor[1]}
          d={`
          M 20 ${height - 5} L 15 ${height - 5}
          Q 5 ${height - 5} 5 ${height - 15}
          L 5 ${height - 20}
        `}
        />
      </svg>
      <div className='border-box-content'></div>
    </div>
  );
};

export default memo(BorderBox12);
