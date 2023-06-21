import PageLayout from '@/components/pageLayout';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Form from './Form';

export default function () {
  const { t } = useTranslation('assets');

  return (
    <PageLayout title={t('title')} showBack>
      <Form initialValues={{ }}></Form>
    </PageLayout>
  );
}
