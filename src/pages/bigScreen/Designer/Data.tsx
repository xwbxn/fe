import React, { memo, useEffect, useState } from 'react';
import Mock from 'mockjs';
import { useInterval } from 'ahooks';
import request from '@/utils/request';

const Data = ({ render, options, interval = 0 }) => {
  const [data, setData] = useState<any>({});

  function getData() {
    if (options?.dataType === 'mock') {
      setData(Mock.mock(options.mock));
    } else {
      request(options?.url, {
        method: options?.method,
      }).then((res) => {
        setData(res.dat);
      });
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
