import './style.less';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Image, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { CommonStateContext } from '@/App';
import { addAsset, getAssetDefaultConfig, getAssetsStypes, getAssetsByCondition } from '@/services/assets';
import TextArea from 'antd/lib/input/TextArea';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons/lib/icons';

export default function (props: { initialValues: object; initParams: object; mode?: string }) {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [assetTypes, setAssetTypes] = useState<{ name: string; form: any }[]>([]);
  const [assetList, setAssetList] = useState<{ name: string; id: any }[]>([]);
  const [identList, setIdentList] = useState([]);
  const [params, setParams] = useState<{ label: string; name: string; editable?: boolean; password?: boolean; items?: [] }[]>([]);
  const [form] = Form.useForm();

  const panelBaseProps: any = {
    size: 'small',
    bodyStyle: { padding: '24px 124px 8px 124px' },
  };


  useEffect(() => {
    const param = {
      page: 1,
      limit: 10000,
    };
    getAssetsStypes().then((res) => {
      const items = res.dat
        .map((v) => {
          return {
            value: v.name,
            label: v.name,
            ...v,
          };
        })
        .filter((v) => v.name !== '主机'); //探针自注册的不在前台添加
      setAssetTypes(items);
    });

    getAssetsByCondition(param).then((res) => {
      // const items = res.dat.list.map((v) => {
      const items = res.dat.map((v) => {
        return {
          value: v.id,
          label: v.name + "[" + v.type + "]",
          ...v,
        };
      })
      setAssetList(items);
    });

  }, []);

  const genForm = () => {
    const asset: any = assetList.find((v) => v.id === form.getFieldValue('asset_id'));
    if (asset) {
      form.setFieldsValue({ type: asset.type });
      const assetType: any = assetTypes.find((v) => v.name === asset.type);
      setParams(assetType.form || []);
      genDefaultConfig()
    }
  };

  const renderForm = (v) => {
    if (v.items) {
      return (
        <Select
          style={{ width: '100%' }}
          options={v.items.map((v) => {
            return { label: v, value: v };
          })}
        ></Select>
      );
    }
    if (v.password) {
      return <Input.Password placeholder={`填写${v.label}`} />;
    }
    return <Input placeholder={`填写${v.label}`} />;
  };

  const submitForm = async (values) => {
    // values.group_id = curBusiId;
    debugger;
    values.params = JSON.stringify(values);

    console.log("submitForm", values);
    // values.organization_id = organizationId;
    // if (props.mode === 'edit') {
    //   await updateAsset(values);
    // } else {
    //   await addAsset(values);
    // }
    message.success('操作成功');
    history.back();
  };

  const genDefaultConfig = () => {
    const name = form.getFieldValue('type');
    const data = form.getFieldsValue();
    // if (data.configs) {
    //   Modal.confirm({
    //     title: '将会覆盖原有配置,是否继续?',
    //     onOk: () => {
    //       delete data.configs;
    getAssetDefaultConfig(name, data).then((res) => {
      form.setFieldsValue({ configs: res.dat.content });
    });
    // },
    // });
    // } else {
    //   getAssetDefaultConfig(name, data).then((res) => {
    //     form.setFieldsValue({ configs: res.dat.content });
    //   });
    // }
  };

  return (
    <Form
      name='asset'
      form={form}
      layout='vertical'
      onFinish={submitForm}
      onValuesChange={() => {
        genForm();
      }}
    >
      <div className='view-form' >
        <div className='card-wrapper'>
          <Card {...panelBaseProps} title={'基本信息'}>
            <div className='asset_info'>
              <div className='images'>
                <Image
                  width={120}
                  height={60}
                  src="error"
                />
              </div>
              <div className='info'>
                <Row gutter={10} className='row'>
                  <Col>资产名称：</Col>
                  <Col>资产类型：</Col>
                  <Col>IP地址：</Col>
                  <Col>厂商：</Col>
                </Row>
                <Row gutter={10} className='row'>
                  <Col>资产位置：</Col>
                  <Col>监控配置：</Col>
                  <Col>状态：</Col>
                  <Col></Col>
                </Row>
              </div>


            </div>
            <div className='monitor_info'>
              <div className='base'>
                <Row gutter={10} className='row'>
                  <Col>资产位置：</Col>
                </Row>
                <Row gutter={10} className='row'>
                  <Col>监控配置：</Col>
                </Row>
                <Row gutter={10} className='row'>
                  <Col>状态：</Col>
                </Row>
              </div>
              <div className='script'>
                <div className='title'>监控脚本：</div>
                <div className='content'></div>
              </div>

            </div>
            <div className='party_info'>
              <div className='assembly show_image'>
                <div className='title'>CPU(2)</div>
                <div className='image cpu'></div>
                <div className='status'>状态：
                   {false ? (
                      <div>正常<CheckCircleFilled  className='normal'/></div>
                   ):(
                      <div>故障<CloseCircleFilled  className='no_normal'/></div>
                   )}</div>
              </div>
              <div className='assembly show_image'>
                <div className='title'>网卡(2)</div>
                <div className='image net'></div>
                <div className='status'>状态：
                   {true ? (
                      <div>正常<CheckCircleFilled  className='normal'/></div>
                   ):(
                      <div>故障<CloseCircleFilled  className='no_normal'/></div>
                   )}
                
                </div>
              </div>

            </div>
          </Card>
        </div>
        <div className='card-wrapper'>
          <Card {...panelBaseProps} title={'配置信息'}>

          </Card>
        </div>
      </div>
    </Form>
  );
}
