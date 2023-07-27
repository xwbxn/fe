import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import _ from 'lodash';
import { getMetric } from '@/services/dashboardV2';
import FormItem from '../components/FormItem';

interface IProps {
  datasourceValue: number;
  metrics: string[];
  params: {
    start: number;
    end: number;
  };
  value?: string;
  onChange: (val: string) => void;
}

export default function index(props: IProps) {
  const { datasourceValue,metrics, params, value, onChange } = props;
  const [metricData, setMetricData] = useState<string[]>(metrics);
  const [searchValue, setSearchValue] = useState<string | undefined>();

  useEffect(() => {

  }, []);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  return (
    <FormItem  label='指标'  >
      <AutoComplete
        style={{ width: '100%' }}
        options={_.map(metricData, (item) => {
          return {
            value: item,
          };
        })}
        value={searchValue}
        filterOption={(inputValue, option) => {
          if (option && option.value && typeof option.value === 'string') {
            return option.value.indexOf(inputValue) !== -1;
          }
          return true;
        }}
        onSearch={(val) => {
          setSearchValue(val);
        }}
        onBlur={(e: any) => {
          onChange(e.target.value);
        }}
        onSelect={(val) => {
          setSearchValue(val);
          onChange(val);
        }}
      />
    </FormItem>
  );
}
