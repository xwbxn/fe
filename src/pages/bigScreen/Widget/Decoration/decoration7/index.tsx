import React, { memo, useMemo } from 'react'

import './style.less'

const defaultColor = ['#1dc1f5', '#1dc1f5']

const Decoration = ({ options }: any) => {
  const { width, height, title } = options
  const mergedColor = defaultColor
  const classNames = 'dv-decoration-7'

  return (
    <div className={classNames}>
      <svg width='21px' height='20px'>
        <polyline
          strokeWidth='4'
          fill='transparent'
          stroke={mergedColor[0]}
          points='10, 0 19, 10 10, 20'
        />
        <polyline
          strokeWidth='2'
          fill='transparent'
          stroke={mergedColor[1]}
          points='2, 0 11, 10 2, 20'
        />
      </svg>
      <div className='dv-decoration-7-title'>{title}</div>
      <svg width='21px' height='20px'>
        <polyline
          strokeWidth='4'
          fill='transparent'
          stroke={mergedColor[0]}
          points='11, 0 2, 10 11, 20'
        />
        <polyline
          strokeWidth='2'
          fill='transparent'
          stroke={mergedColor[1]}
          points='19, 0 10, 10 19, 20'
        />
      </svg>
    </div>
  )
}

export default memo(Decoration)
