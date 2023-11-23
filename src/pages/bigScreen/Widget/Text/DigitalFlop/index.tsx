import React, { useEffect, useRef, memo, useState, useMemo } from 'react';

import CRender from '@jiaminghi/c-render';

import '@jiaminghi/charts/lib/extend/index';

import './style.less';
import { IWidgetProps } from '@/pages/bigScreen/type';
import { getStyles } from '@/pages/bigScreen/utils';
import _ from 'lodash';

const DigitalFlop = ({ options, data = {}, field = 'value' }: IWidgetProps) => {
  const { width, height } = options;
  const domRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const graphRef = useRef<any>(null);
  const optionsRef = useRef(options);

  function getGraph(config) {
    const { animationCurve, animationFrame } = config;
    return rendererRef.current.add({
      name: 'numberText',
      animationCurve,
      animationFrame,
      shape: getShape(config, data),
      style: getStyles(config),
    });
  }

  function getShape({ content, toFixed, styleTextAlign, rowGap, formatter }, data) {
    const [w, h] = rendererRef.current.area;
    const number = data && data[field] ? data[field] : [1234567890];
    const position = [w / 2, h / 2];

    if (styleTextAlign === 'left') position[0] = 0;
    if (styleTextAlign === 'right') position[0] = w;

    return { number, content, toFixed, position, rowGap, formatter };
  }

  useEffect(() => {
    console.log('data', data);
    if (graphRef.current) {
      const graph = graphRef.current;
      graph.animationEnd();

      const shape = getShape(options, data);
      const cacheNum = graph.shape.number.length;
      const shapeNum = shape.number.length;
      cacheNum !== shapeNum && (graph.shape.number = shape.number);

      const { animationCurve, animationFrame } = options;
      Object.assign(graph, { animationCurve, animationFrame });
      graph.animation('style', getStyles, true);
      graph.animation('shape', shape);
    }
  }, [data]);

  useEffect(() => {
    if (!rendererRef.current || !_.isEqual(optionsRef.current, options)) {
      rendererRef.current = new CRender(domRef.current);
      graphRef.current = getGraph(options);
      optionsRef.current = options;
      console.log('🚀 ~ file: index.tsx:63 ~ useEffect ~ options:', options);
    }
  }, [options]);

  const classNames = 'dv-digital-flop';

  return (
    <div className={classNames} style={{ height: height, width: width }}>
      <canvas ref={domRef} />
    </div>
  );
};

export default memo(DigitalFlop);
