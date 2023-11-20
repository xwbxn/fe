import React, { memo, useEffect, useState } from 'react';
import Mock from 'mockjs';
import { useInterval } from 'ahooks';

const Data = ({ render, options, interval = 0 }) => {
  const [data, setData] = useState<any>({});

  function getData() {
    if (options?.dataType === 'mock') {
      setData(Mock.mock(options.mock));
    }
  }

  useEffect(() => {
    getData();
  }, [options]);

  const _interval = options?.autoRefresh ? interval * 1000 : 0;
  useInterval(getData, _interval);

  return render(data);
};

export default memo(Data);
