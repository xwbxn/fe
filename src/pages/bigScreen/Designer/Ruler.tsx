import React from 'react';

import './index.less';

const Ruler = ({ scale = 1 }) => {
  const arr = Array.from(new Array(100).keys());

  return (
    <div>
      <div className='designer-ruler-h'>
        <span className='ruler-h-50' style={{ width: 50 * scale }}>
          <b>50</b>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        {arr.map((item: any, index: number) => (
          <span className='ruler-h-50' key={index} style={{ width: 50 * scale }}>
            <b>{index * 50}</b>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>
        ))}
      </div>
      <div className='designer-ruler-v'>
        <span className='ruler-h-50' style={{ height: 50 * scale }}>
          <b>50</b>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        {arr.map((item: any, index: number) => (
          <span className='ruler-h-50' key={index} style={{ height: 50 * scale }}>
            <b>{index * 50}</b>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ruler;
