import React, { useEffect, useRef } from 'react';

import './index.less';
import { Options } from '@antv/x6/lib/graph/options';
import { Graph } from '@antv/x6';

import _ from 'lodash';
import '../Widget';

// 注册连接点位置
Graph.registerPortLayout(
  'center',
  (portsPositionArgs, elemBBox) => {
    return portsPositionArgs.map(() => {
      return {
        position: {
          x: elemBBox.width / 2,
          y: elemBBox.height / 2,
        },
        angle: 0,
      };
    });
  },
  true,
);

const graphOptions: Partial<Options.Manual> = {
  autoResize: true,
};

function createGraph(graphDom: React.MutableRefObject<null>) {
  const graph = new Graph({
    container: graphDom.current || undefined,
    ...graphOptions,
  });

  return graph;
}

const Preview = ({ height, width, json }) => {
  const graphDom = useRef(null);
  const graph = useRef<Graph>();

  useEffect(() => {
    graph.current = createGraph(graphDom);
    return () => {
      graph.current?.dispose();
    };
  }, []);

  useEffect(() => {
    graph.current?.fromJSON(json);
  }, [json]);

  useEffect(() => {
    graph.current?.resize(width, height);
    graph.current?.center();
  }, [width, height]);

  return (
    <>
      <div className='preview'>
        <div ref={graphDom}></div>
      </div>
    </>
  );
};

export default Preview;
