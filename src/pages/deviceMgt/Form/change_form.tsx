import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Button, Divider, Modal, Card, Form, Space, DatePicker, Select, Table } from 'antd'
import { useTranslation } from 'react-i18next';
import './index.less';
import { getDictValueEnum } from '@/services/system/dict';
import {getAssetAlerts} from '@/services/assets/asset'

interface Props {//【未使用】
  assetId: number; //资产Id， >0 则有资产信息
}

  
export default function QueryForm(props: Props) {  

    const { t } = useTranslation('assets');
    const [data, setData] = useState([{}])
    const formOnRef = null;
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    type LayoutType = Parameters<typeof Form>[0]['layout'];

    const [formLayout, setFormLayout] = useState<LayoutType>('inline');

    const [initData, setInitData] = useState({});

    const [queryList, setQueryList] = useState<any>([]);

    const [dialogIsOpen, setDiallogIsOpen] = useState<boolean>(false);

    const buttonItemLayout = formLayout === 'horizontal' ? { wrapperCol: { span: 14, offset: 4 } } : null;

 
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    useEffect(() => {
      //变更变更事项字典
      getDictValueEnum("alert_event").then((value) => {
        initData["alertType"] =  value;
        setInitData({...initData});
      })
    },[]);

    const getList = (start,limit,other) => {
      let param ={
        asset:props.assetId,
        start:start,
        limit:limit,
      }
      param = {...param, ...other}
      getAssetAlerts(param).then(({dat,err}) => {
        console.log(dat);
         if(err==""){
            setQueryList(dat.list);
         }         
      });
    }

    useEffect(() => {
      getList(1,10,null);      
    },[])
    
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    return (
        <div>
            <Card style={{ width: '100%' }}>
                <Form
                  // layout={formLayout}
                  // form={queryForm}
                  initialValues={{ layout: 'inline' }}
                  style={{display:'inline-flex',marginTop:'10px',marginLeft:'10px' }}
                >

                 <Space>
                  <Form.Item label="变更日期：">
                    <DatePicker.RangePicker  style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item >
                    <Select
                      showSearch
                      placeholder="请选择变更实现"
                      optionFilterProp="children"
                      options={initData["alertType"]}
                    />
                  </Form.Item>
                  <Form.Item {...buttonItemLayout}>
                    <Button type="primary">搜索</Button>
                  </Form.Item>
                  </Space>
                </Form>

              </Card>
              <Card style={{ width: '100%' }}>
              <Table
                  dataSource={queryList}
                  rowSelection={{
                    onChange: (_, rows) => {
                      // setSelectedAssets(rows ? rows.map(({ id }) => id) : []);
                      // setSelectedAssetsName(rows ? rows.map(({ name }) => name) : []);
                    },
                  }}
                  columns={[
                    {
                      title: t('管理IP'),
                      dataIndex: 'management_ip',
                    },
                    {
                      title: t('设备名称'),
                      dataIndex: 'device_name',
                    },
                    {
                      title: t('序列号'),
                      dataIndex: 'serial_number',
                    },
                    {
                      title: t('型号'),
                      dataIndex: 'device_model_name',
                    },
                    {
                      title: t('设备类型'),
                      dataIndex: 'device_type_name',
                    },
                    {
                      title: t('纳管状态'),
                      dataIndex: 'managed_state',
                      render(val) {
                        return '未定义来源';
                      },
                    },                   
                    {
                      title: t('common:table.operations'),
                      width: '180px',
                      render: (e) => (
                        <></>
                      ),
                    },
                  ]}
                  rowKey='id'
                  size='small'
                ></Table>
              </Card>
        </div>
    )
}