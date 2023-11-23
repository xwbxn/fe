import React, { memo, useState } from 'react';
import { getStyles } from '../../utils';
import moment from 'moment';
import { useInterval } from 'ahooks';

const TimeText = ({ options }) => {
  // 初始化时间
  const [text, setText] = useState(moment().format(options.fmtDate || 'yyyy-MM-dd hh:mm:ss'));

  useInterval(() => {
    setText(moment().format(options.fmtDate || 'yyyy-MM-dd hh:mm:ss'));
  }, 1000);

  return <div style={getStyles(options)}>{text}</div>;
};
export default memo(TimeText);
