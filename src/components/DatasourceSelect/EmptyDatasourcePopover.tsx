import React, { useContext } from 'react';
import { CommonStateContext } from '@/App';
import { Popover } from 'antd';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface IProps {
  datasourceList: any[];
  children: React.ReactNode;
}

export default function EmptyDatasourcePopover(props: IProps) {
  const { t } = useTranslation();
  const { profile } = useContext(CommonStateContext);
  const { datasourceList, children } = props;

  return (
    <Popover
      content={
        <>
          {t('common:datasource.empty_modal.title')} {_.includes(profile?.roles, 'Admin') ? <Link to='/help/source'>{t('common:datasource.empty_modal.btn1')}</Link> : null}
        </>
      }
      visible={_.isEmpty(datasourceList)}
      placement='top'
    >
      {children}
    </Popover>
  );
}
