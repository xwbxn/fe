import React, { useMemo, forwardRef, memo } from 'react'

import './style.less'

const defaultColor = ['#3faacb', '#fff']

const Decoration = ({ options }: any) => {
  const { width, height, dur, reverse } = options

  function calcSVGData() {
    return reverse
      ? { w: 1, h: height, x: width / 2, y: 0 }
      : { w: width, h: 1, x: 0, y: height / 2 }
  }

  const mergedColor = defaultColor
  const { x, y, w, h } = useMemo(calcSVGData, [reverse, width, height])
  const classNames = 'dv-decoration-2'

  return (
    <div className={classNames}>
      <svg width={`${width}px`} height={`${height}px`}>
        <rect x={x} y={y} width={w} height={h} fill={mergedColor[0]}>
          <animate
            attributeName={reverse ? 'height' : 'width'}
            from='0'
            to={reverse ? height : width}
            dur={`${dur}s`}
            calcMode='spline'
            keyTimes='0;1'
            keySplines='.42,0,.58,1'
            repeatCount='indefinite'
          />
        </rect>

        <rect x={x} y={y} width='1' height='1' fill={mergedColor[1]}>
          <animate
            attributeName={reverse ? 'y' : 'x'}
            from='0'
            to={reverse ? height : width}
            dur={`${dur}s`}
            calcMode='spline'
            keyTimes='0;1'
            keySplines='0.42,0,0.58,1'
            repeatCount='indefinite'
          />
        </rect>
      </svg>
    </div>
  )
}

export default memo(Decoration)
