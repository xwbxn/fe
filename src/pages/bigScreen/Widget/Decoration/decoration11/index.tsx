import React, { useMemo, forwardRef, memo } from 'react'
import { colord } from 'colord'

import './style.less'

const defaultColor = ['#1a98fc', '#2cf7fe']

const Decoration = ({ options }: any) => {
  const { width, height, title } = options

  const mergedColor = defaultColor

  const classNames = 'dv-decoration-11'

  return (
    <div className={classNames}>
      <svg width={width} height={height}>
        <polygon
          fill={colord(mergedColor[1] || defaultColor[1])
            .alpha(0.1)
            .toRgbString()}
          stroke={mergedColor[1]}
          points={`20 10, 25 4, 55 4 60 10`}
        />

        <polygon
          fill={colord(mergedColor[1] || defaultColor[1])
            .alpha(0.1)
            .toRgbString()}
          stroke={mergedColor[1]}
          points={`20 ${height - 10}, 25 ${height - 4}, 55 ${height - 4} 60 ${
            height - 10
          }`}
        />

        <polygon
          fill={colord(mergedColor[1] || defaultColor[1])
            .alpha(0.1)
            .toRgbString()}
          stroke={mergedColor[1]}
          points={`${width - 20} 10, ${width - 25} 4, ${width - 55} 4 ${
            width - 60
          } 10`}
        />

        <polygon
          fill={colord(mergedColor[1] || defaultColor[1])
            .alpha(0.1)
            .toRgbString()}
          stroke={mergedColor[1]}
          points={`${width - 20} ${height - 10}, ${width - 25} ${height - 4}, ${
            width - 55
          } ${height - 4} ${width - 60} ${height - 10}`}
        />

        <polygon
          fill={colord(mergedColor[0] || defaultColor[0])
            .alpha(0.2)
            .toRgbString()}
          stroke={mergedColor[0]}
          points={`
            20 10, 5 ${height / 2} 20 ${height - 10}
            ${width - 20} ${height - 10} ${width - 5} ${height / 2} ${
            width - 20
          } 10
          `}
        />

        <polyline
          fill='transparent'
          stroke={colord(mergedColor[0] || defaultColor[0])
            .alpha(0.7)
            .toRgbString()}
          points={`25 18, 15 ${height / 2} 25 ${height - 18}`}
        />

        <polyline
          fill='transparent'
          stroke={colord(mergedColor[0] || defaultColor[0])
            .alpha(0.7)
            .toRgbString()}
          points={`${width - 25} 18, ${width - 15} ${height / 2} ${
            width - 25
          } ${height - 18}`}
        />
      </svg>

      <div className='decoration-content'>{title}</div>
    </div>
  )
}

export default memo(Decoration)
