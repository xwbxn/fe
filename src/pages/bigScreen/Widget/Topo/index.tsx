// import Preview from '@/pages/topoGraph/Preview';
import React from 'react';
import { getStyles } from '../../utils';

interface ITopoProps {
  data: any;
  field: string;
  options: any;
}

const Topology = ({ data, field, options }: ITopoProps) => {
  return (
    <div style={getStyles(options)}>
      {/* <Preview height={options.height} width={options.width} json={options.graph}></Preview> */}
    </div>
  );
};

export default Topology;
