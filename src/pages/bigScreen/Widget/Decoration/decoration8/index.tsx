import React, { useMemo, forwardRef, memo } from 'react'

import './style.less'

const defaultColor = ['#3f96a5', '#3f96a5']

const Decoration = ({ options }: any) => {
  const { width, height, reverse } = options

  const mergedColor = defaultColor

  const [pointsOne, pointsTwo, pointsThree] = useMemo(() => {
    const xPos = (pos: number) => (!reverse ? pos : width - pos)
    return [
      `${xPos(0)}, 0 ${xPos(30)}, ${height / 2}`,
      `${xPos(20)}, 0 ${xPos(50)}, ${height / 2} ${xPos(width)}, ${height / 2}`,
      `${xPos(0)}, ${height - 3}, ${xPos(200)}, ${height - 3}`
    ]
  }, [reverse, width, height])

  const classNames = 'dv-decoration-8'

  return (
    <div className={classNames}>
      <svg width={width} height={height}>
        <polyline
          stroke={mergedColor[0]}
          strokeWidth='2'
          fill='transparent'
          points={pointsOne}
        />

        <polyline
          stroke={mergedColor[0]}
          strokeWidth='2'
          fill='transparent'
          points={pointsTwo}
        />

        <polyline
          stroke={mergedColor[1]}
          fill='transparent'
          strokeWidth='3'
          points={pointsThree}
        />
      </svg>
    </div>
  )
}

export default memo(Decoration)
