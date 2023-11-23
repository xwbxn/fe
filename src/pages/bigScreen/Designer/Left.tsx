import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Collapse, Image } from 'antd';
import React, { useState } from 'react';
import { widgetType } from '../configuration';

const Left = ({ leftFlag, setLeftFlag }) => {
  return (
    <>
      <div
        className='designer-left'
        style={{
          left: leftFlag ? 0 : -200,
        }}
      >
        <Collapse bordered={false} defaultActiveKey={widgetType[0].name}>
          {widgetType.map((item) => {
            return (
              <Collapse.Panel key={item.name} header={item.name}>
                <div className='designer-left-menu'>
                  {item.list.map((subItem) => {
                    return (
                      <div
                        className='designer-left-menu-item'
                        key={subItem.name}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('code', subItem.code || '');
                        }}
                      >
                        <Image width={40} height={40} preview={false} src={subItem.url}></Image>
                        <span>{subItem.name}</span>
                      </div>
                    );
                  })}
                </div>
              </Collapse.Panel>
            );
          })}
        </Collapse>
        <div onClick={() => setLeftFlag(!leftFlag)} className='designer-left-opertion'>
          {leftFlag ? <LeftOutlined /> : <RightOutlined />}
        </div>
      </div>
    </>
  );
};

export default Left;
