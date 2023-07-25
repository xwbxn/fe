import React from 'react';
import { Row, Col, Button } from 'antd';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import PromQueryBuilderModal from '@/components/PromQueryBuilder/PromQueryBuilderModal';
import PromQLInput, { CMExpressionInputProps } from './index';
import './locale';

export function PromQLInputWithBuilder(props: CMExpressionInputProps & { datasourceValue: number }) {
  const { t } = useTranslation('promQLInput');
  const inputProps: any = props;

  // @ts-ignore
  if (props.id) {
    // @ts-ignore
    inputProps.key = props.id; // TODO 在 Form.List 中修改 list 后重置组件，解决状态更新 field.name 错误问题
  }

  return (
    <Row gutter={8}>
      <Col flex='auto'>
        <PromQLInput {...inputProps} />
      </Col>
      <Col flex='74px'>
        <Button
          onClick={() => {
            PromQueryBuilderModal({
              // TODO: PromQL 默认是最近12小时，这块应该从使用组件的环境获取实际的时间范围
              range: {
                start: 'now-12h',
                end: 'now',
              },
              datasourceValue: props.datasourceValue,
              value: props.value,
              onChange: (val) => {
                props.onChange && props.onChange(val);
              },
            });
          }}
          disabled={props.readonly}
        >
          {t('builder_btn')}
        </Button>
      </Col>
    </Row>
  );
}
