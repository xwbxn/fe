import { ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import React from 'react';

export default ({ option, onClick }) => {
  return (
    option.visible && (
      <div className='designer-context-menu' style={{ left: option.x, top: option.y }}>
        <div className='menu-item' onClick={() => onClick('copy')}>
          <CopyOutlined /> 复制
        </div>
        <div className='menu-item' onClick={() => onClick('delete')}>
          <DeleteOutlined /> 删除
        </div>
        <div className='menu-item' onClick={() => onClick('top')}>
          <VerticalAlignTopOutlined /> 置顶
        </div>
        <div className='menu-item' onClick={() => onClick('up')}>
          <ArrowUpOutlined /> 上移一层
        </div>
        <div className='menu-item' onClick={() => onClick('down')}>
          <ArrowDownOutlined /> 下移一层
        </div>
        <div className='menu-item' onClick={() => onClick('bottom')}>
          <VerticalAlignBottomOutlined /> 置底
        </div>
      </div>
    )
  );
};
