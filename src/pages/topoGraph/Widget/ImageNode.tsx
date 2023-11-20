import React from 'react';
import { Node } from '@antv/x6';
import { Image } from 'antd';
import { register } from '@antv/x6-react-shape';

export const createImageNode = (img: any, label: string, name: string) => {
  const component = ({ node }: { node: Node }) => {
    const data = node?.getData();

    return (
      <>
        <Image src={img} alt='' preview={false} width='100%' height='100%'></Image>
        <div className='node-label'>{data?.label || label}</div>
      </>
    );
  };

  register({
    shape: name,
    effect: ['data'],
    component: component,
  });

  return component;
};
