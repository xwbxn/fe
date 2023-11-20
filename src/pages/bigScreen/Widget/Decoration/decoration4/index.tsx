import React, { useMemo, forwardRef, memo } from 'react'

import './style.less'

const defaultColor = ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.3)']

const Decoration = ({ options }: any) => {
  const { width, height, dur, reverse } = options

  const mergedColor = defaultColor

  const classNames = 'dv-decoration-4'

  return (
    <div className={classNames}>
      <div
        className={`container ${reverse ? 'reverse' : 'normal'}`}
        style={
          reverse
            ? {
                width: `${width}px`,
                height: `5px`,
                animationDuration: `${dur}s`
              }
            : {
                width: `5px`,
                height: `${height}px`,
                animationDuration: `${dur}s`
              }
        }>
        <svg width={reverse ? width : 5} height={reverse ? 5 : height}>
          <polyline
            stroke={mergedColor[0]}
            points={reverse ? `0, 2.5 ${width}, 2.5` : `2.5, 0 2.5, ${height}`}
          />
          <polyline
            className='bold-line'
            stroke={mergedColor[1]}
            strokeWidth='3'
            strokeDasharray='20, 80'
            strokeDashoffset='-30'
            points={reverse ? `0, 2.5 ${width}, 2.5` : `2.5, 0 2.5, ${height}`}
          />
        </svg>
      </div>
    </div>
  )
}

export default memo(Decoration)
