import React, { memo } from 'react';
import { IWidgetProps } from '../../type';
import { getStyles } from '../../utils';

const BaseText = ({ data = {}, options, field = 'value' }: IWidgetProps) => {
  return <div style={{ ...getStyles(options), height: '100%' }}>{data && data[field] ? data[field] : '文本框'}</div>;
};
export default memo(BaseText);
