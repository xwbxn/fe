import React from 'react';
import { useLocation } from 'react-router-dom';
import PageLayout from '@/components/pageLayout';
import Form from './Form/index';
import View from './Form/view';
import Monitor from './Form/chart';

export default function () {
  
  const location = useLocation();
  const params=new URLSearchParams(location.search);  

  return (
    <PageLayout title={'监控管理'} showBack>
      {params.get('type')=="asset" && (
          <Form initialValues={{}} initParams={{}}></Form>
      )}
      {params.get('type')=="view" && (
          <View initialValues={{}} initParams={{}}></View>
      )}
      {params.get('type')=="monitor" && (
          <Monitor initialValues={{}} initParams={{}}></Monitor>
      )}      
    </PageLayout>
  );
}
