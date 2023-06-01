/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import PageLayout from '@/components/pageLayout';
import { getCollect } from './services';
import { CollectType } from './types';
import Form from './Form';

export default function Edit() {
  const { t } = useTranslation('collects');
  const { id } = useParams<{ id: string }>();
  const collectID = Number(id);
  const [values, setValues] = useState<CollectType>();
  const { search } = useLocation();
  const { mode } = queryString.parse(search);

  useEffect(() => {
    if (collectID) {
      getCollect(collectID).then((res) => {
        setValues(res);
      });
    }
  }, [collectID]);

  if (!values) return null;

  return (
    <PageLayout title={t('title')} showBack backPath='/collects'>
      <Form type={mode === 'clone' ? 2 : 1} initialValues={values} />
    </PageLayout>
  );
}
