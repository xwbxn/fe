import React, { useEffect, useState } from 'react';
import { IWidget } from '../type';
import Grid from './Grid';
import Ruler from './Ruler';
import { v4 as uuidv4 } from 'uuid';

import './index.less';
import Auxiliary from './Auxiliary';
import { useLocalStorageState } from 'ahooks';
import { Rnd } from 'react-rnd';
import _ from 'lodash';
import Left from './Left';
import { Button, Modal, Slider, Space } from 'antd';
import { widgetConfigure } from '../configuration';
import Right from './Right';
import ContextMenu from './ContextMenu';
import Data from './Data';
import page from '../configuration/page';
import { useHistory } from 'react-router-dom';

const defaultScreen = page.configureValue;

const Design = () => {
  const history = useHistory();
  // 获取放大缩小比例
  const [cale, setCale] = useState(0);
  // 是否显示左边
  const [leftFlag, setLeftFlag] = useState(true);
  const [rightFlag, setRightFlag] = useState(true);
  // 右键菜单位置
  const [ctxMenuOption, setCtxMenuOption] = useState({ x: 0, y: 0, visible: false });

  // 大屏配置数据
  const [screen, setScreen] = useLocalStorageState('CURRENT_SCREEN', {
    defaultValue: defaultScreen,
  });
  // 当前选择的组件
  const [currentWidget, setCurrentWidget] = useLocalStorageState<IWidget>('CURRENT_WIDGET');

  // 拖拽添加组件
  const handleDrop = ({ code, x, y }) => {
    const config = widgetConfigure[code];
    if (!config) {
      Modal.error({
        title: '该功能暂不支持，敬请期待',
      });
      return;
    }
    screen.widgets.push({
      id: uuidv4(),
      code: code,
      configureValue: config.configureValue || {},
      coordinateValue: {
        ...config.coordinateValue,
        x: Math.floor(x / cale) + 1,
        y: Math.floor(y / cale),
      },
      dataValue: config.dataConfigureValue,
      data: config.data,
    });
    setScreen(_.cloneDeep(screen));
  };

  // 选择组件
  const handleSelect = (widget) => {
    setCurrentWidget(widget);
  };

  // 右键菜单选择
  const handleCtxMenu = (e) => {
    if (currentWidget) {
      const index = screen.widgets.findIndex((v) => v.id === currentWidget?.id);
      switch (e) {
        case 'copy':
          const newWidget = _.cloneDeep(currentWidget);
          newWidget.coordinateValue.x = (newWidget.coordinateValue.x || 0) + 50;
          newWidget.coordinateValue.y = (newWidget.coordinateValue.y || 0) + 50;
          newWidget.id = uuidv4();
          screen.widgets.push(newWidget);
          setScreen(_.cloneDeep(screen));
          break;
        case 'delete':
          screen.widgets.splice(index, 1);
          setScreen(_.cloneDeep(screen));
          setCurrentWidget(undefined);
          break;
        case 'top':
          const topTmp = screen.widgets.splice(index, 1);
          screen.widgets = screen.widgets.concat(topTmp);
          setScreen(_.cloneDeep(screen));
          break;
        case 'up':
          const upTemp = screen.widgets.splice(index, 1);
          screen.widgets.splice(index + 1, 0, upTemp[0]);
          setScreen(_.cloneDeep(screen));
          break;
        case 'down':
          const downTemp = screen.widgets.splice(index, 1);
          screen.widgets.splice(index - 1, 0, downTemp[0]);
          setScreen(_.cloneDeep(screen));
          break;
        case 'bottom':
          const bottomTmp = screen.widgets.splice(index, 1);
          screen.widgets = bottomTmp.concat(screen.widgets);
          setScreen(_.cloneDeep(screen));
          break;

        default:
          break;
      }
    }
    setCtxMenuOption({ ...ctxMenuOption, visible: false });
  };

  // 这里主要设置默认的缩放比例
  useEffect(() => {
    if (screen.width) {
      setCale(Number(((Number(screen.width) - 800 - 132) / Number(screen.width)).toFixed(4)));
    }
  }, [screen.width]);

  return (
    <>
      <div
        className='designer'
        style={{
          paddingLeft: leftFlag ? 200 : 0,
        }}
      >
        <Left leftFlag={leftFlag} setLeftFlag={setLeftFlag}></Left>
        <div
          className='designer-paint'
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            if (e.button === 0) {
              setCurrentWidget(undefined);
              setCtxMenuOption({ ...ctxMenuOption, visible: false });
            }
          }}
        >
          <ContextMenu option={ctxMenuOption} onClick={handleCtxMenu}></ContextMenu>
          <Ruler scale={cale}></Ruler>
          <Grid screen={screen}></Grid>
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              left: 16 + 50 * cale,
              top: 16 + 50 * cale,
              width: screen.width,
              height: screen.height,
              transform: `scale(${cale})`,
              transformOrigin: '0 0',
              background: `url(${screen.backgroundImage}) no-repeat ${screen.backgroundColor}  0% 0% / 100% 100%`,
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              const code = e.dataTransfer.getData('code');
              // 需要减去左侧菜单 和 顶部菜单的宽度
              const x = e.clientX - 200 - 66;
              const y = e.clientY - 45 - 66;
              handleDrop({ code, x, y });
            }}
          >
            <Auxiliary screen={screen}></Auxiliary>
            {screen.widgets.map((item) => {
              const Widget = widgetConfigure[item.code] && widgetConfigure[item.code].component;
              return (
                <Rnd
                  key={item.id}
                  className={`designer-widget ${item.id === currentWidget?.id && 'designer-widget-selected'}`}
                  bounds='parent'
                  size={{
                    width: item.coordinateValue.width,
                    height: item.coordinateValue.height,
                  }}
                  position={{
                    x: item.coordinateValue.x || 0,
                    y: item.coordinateValue.y || 0,
                  }}
                  onDragStop={(e: any, d: any) => {
                    if (item.coordinateValue.x !== d.x || item.coordinateValue.y !== d.y) {
                      item.coordinateValue.x = Math.floor(d.x);
                      item.coordinateValue.y = Math.floor(d.y);
                      setScreen(_.cloneDeep(screen));
                      setCurrentWidget(_.cloneDeep(item));
                    }
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    item.coordinateValue.width = ref.offsetWidth;
                    item.coordinateValue.height = ref.offsetHeight;
                    setScreen(_.cloneDeep(screen));
                    setCurrentWidget(_.cloneDeep(item));
                  }}
                  scale={cale}
                >
                  <div
                    className='mask'
                    onContextMenu={(e) => {
                      handleSelect(item);
                      setCtxMenuOption({
                        x: e.pageX - 200,
                        y: e.pageY - 45,
                        visible: true,
                      });
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                    onClick={(e) => {
                      handleSelect(item);
                      setCtxMenuOption({ ...ctxMenuOption, visible: false });
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                  >
                    {/* 辅助线 */}
                    <div className='line-top'></div>
                    <div className='line-left'></div>
                    {/* 坐标值 */}
                    <div className='label'>
                      {item.coordinateValue.x},{item.coordinateValue.y}
                    </div>
                  </div>
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
          <div className='footer'>
            <Space>
              <span>缩放比例：</span>
              <Slider
                style={{
                  width: 500,
                }}
                min={5}
                max={100}
                onChange={(value) => setCale(value / 100)}
                value={cale * 100}
              />
              <Button
                size='small'
                ghost
                onClick={() => {
                  history.push('/bigscreen/preview');
                }}
              >
                预览
              </Button>
            </Space>
          </div>
        </div>
        <Right
          screen={screen}
          currentWidget={currentWidget}
          rightFlag={rightFlag}
          setRightFlag={setRightFlag}
          onChange={({ screen, widget }) => {
            setScreen(screen);
            setCurrentWidget(widget);
          }}
        ></Right>
      </div>
    </>
  );
};

export default Design;
