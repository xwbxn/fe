import { getBigscreen } from '@/services/bigscreen';
import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useParams } from 'react-router-dom';
import { widgetConfigure } from '../configuration';
import page from '../configuration/page';
import Data from '../Designer/Data';

const defaultScreen = page.configureValue;

const View = () => {
  const cale = 1;
  const { id } = useParams<{ id: string }>();

  // 大屏配置数据
  const [screen, setScreen] = useState(defaultScreen);

  useEffect(() => {
    if (id !== undefined && id !== '') {
      getBigscreen(id).then((res) => {
        const config = JSON.parse(res.dat.config);
        setScreen(config);
      });
    }
  }, [id]);

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

export default View;
