import { useLocalStorageState, useSessionStorageState } from 'ahooks';
import React from 'react';
import { Rnd } from 'react-rnd';
import { widgetConfigure } from '../configuration';
import page from '../configuration/page';
import Data from '../Designer/Data';

const defaultScreen = page.configureValue;

const Preview = () => {
  const cale = 1;

  // 大屏配置数据
  const [screen, setScreen] = useLocalStorageState('CURRENT_SCREEN', {
    defaultValue: defaultScreen,
  });

  return (
    <>
      <div
        className='preview'
        style={{
          position: 'absolute',
          zIndex: 1,
          left: 0,
          top: 0,
          width: screen.width,
          height: screen.height,
          transform: `scale(${cale})`,
          transformOrigin: '0 0',
          background: `url(${screen.backgroundImage}) no-repeat ${screen.backgroundColor}  0% 0% / 100% 100%`,
        }}
      >
        {screen.widgets.map((item) => {
          const Widget = widgetConfigure[item.code] && widgetConfigure[item.code].component;
          return (
            <Rnd
              key={item.id}
              bounds='parent'
              size={{
                width: item.coordinateValue.width,
                height: item.coordinateValue.height,
              }}
              position={{
                x: item.coordinateValue.x || 0,
                y: item.coordinateValue.y || 0,
              }}
              scale={cale}
              disableDragging
            >
              <div style={{ height: '100%' }}>
                <Data
                  interval={item.dataValue?.interval || screen.interval}
                  options={item.dataValue}
                  render={(data) => {
                    return (
                      <Widget
                        field={item.dataValue?.field}
                        data={data}
                        options={{ ...item.configureValue, ...item.coordinateValue }}
                        className={`${item.configureValue.animateName}`}
                      ></Widget>
                    );
                  }}
                ></Data>
              </div>
            </Rnd>
          );
        })}
      </div>
    </>
  );
};

export default Preview;
