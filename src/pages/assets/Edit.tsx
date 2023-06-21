import PageLayout from '@/components/pageLayout';
import { getAsset } from '@/services/assets';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Form from './Form';

export default function () {
  const { t } = useTranslation('assets');
  const { id } = useParams<{ id: string }>();
  const [initVal, setInitVal] = useState({});

  useEffect(() => {
    getAsset(id).then((res) => {
      setInitVal(res.dat);
    });
  }, []);

  return (
    <PageLayout title={t('title')} showBack>
      <Form initialValues={initVal} mode="edit"></Form>
    </PageLayout>
  );
}
