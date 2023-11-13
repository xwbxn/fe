import './style.less';
import React, { useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { CommonStateContext } from '@/App';
import { addAsset, getAssetDefaultConfig, getAssetsIdents, getAssetsStypes, updateAsset, getAssetsByCondition } from '@/services/assets';
import { createMonitor,} from '@/services/manage';

const {TextArea} = Input

export default function (props: { initialValues: object; initParams: object; mode?: string }) {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [organizationId] = useState<number>(commonState.organizationId);
  const [assetTypes, setAssetTypes] = useState<{ name: string; form: any }[]>([]);
  const [assetList, setAssetList] = useState<any[]>([]);
  const [assetOptions, setAssetOptions] = useState<any[]>([]);
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
      let options = new Array;
      const items = res.dat.list.map((v) => {
        options.push({
          value: v.id,
          label: v.name + "[" + v.type + "]"
        });
      })
      setAssetOptions(options);
      setAssetList(res.dat.list);
    });

  }, []);

  const genForm = () => {
    console.log("genForm")
    let formValue = form.getFieldsValue();
    console.log(formValue);
    const asset:any = assetList.find((v:any) => v.id === formValue["asset_id"]);
    if (asset) {

      form.setFieldsValue({ type: asset.type });
      const assetType:any = assetTypes.find((v) => v.name === asset.type);
      setParams(assetType.form || []);
      // genDefaultConfig()
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
    //debugger;
    //values.params = JSON.stringify(values);

    console.log("submitForm",values);
    createMonitor(values).then(res=>{
      message.success('操作成功');
      history.back();
    })
    // values.organization_id = organizationId;
    // if (props.mode === 'edit') {
    //   await updateAsset(values);
    // } else {
    //   await addAsset(values);
    // }
    
  };

  const genDefaultConfig = () => {
    const name = form.getFieldValue('type');
    // debugger;
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
      <Form.Item hidden name='id'>
        <Input></Input>
      </Form.Item>
      <Form.Item hidden name='type'>
        <Input></Input>
      </Form.Item>
      <div className='card-wrapper'>
        <Card {...panelBaseProps} title={t('basic')}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item label='资产名称' name='asset_id' rules={[{ required: true }]}>
                <Select style={{ width: '100%' }}  showSearch options={assetOptions} placeholder='请选择资产' disabled={props.mode === 'edit'} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='监控名称' name='name' rules={[{ required: true }]}>
                <Input placeholder='请输入资产名称' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='数据源类型' name='datasource_id' rules={[{ required: true }]}>
                <Select options={[{
                    value:1,label:'普罗米修斯'
                }]}></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label='监控脚本' name='configs' rules={[{ required: false }]}>
                <TextArea placeholder='请输入监控脚本'  rows={5}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Row gutter={10}>
                <Col span={24}>
                <Form.Item label='状态' name='status'>
                  <Select style={{ width: '100%' }} options={
                    [
                      { value: 0, label: '正常' }, { value: 1, label: '失效' }
                    ]

                  } />
                </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label='采集器' name='ident'>
                    <Select style={{ width: '100%' }} options={identList} />
                  </Form.Item>
                </Col>
              </Row>
           </Col>
           </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label='描述' name='memo'>
                <TextArea placeholder='填写描述' />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </div>
      <div className='card-wrapper'>
      <Card {...panelBaseProps} title={'配置信息'}>
          <Row gutter={10}>
            {params.map((v) => {
              return (
                <Col key={`col=${v.name}`} span={12}>
                  <Form.Item key={`form-item${v.name}`} label={v.label} name={v.name} initialValue={props.initParams[v.name]}>
                    {renderForm(v)}
                  </Form.Item>
                </Col>
              );
            })}
            {/* <Col span={12}>
              <Form.Item label='探针' name='ident'>
                <Select style={{ width: '100%' }} options={identList} />
              </Form.Item>
            </Col> */}
            {/* <Col span={24}>
              <Form.Item
                label={
                  <Space>
                    采集配置
                    <Button type='primary' icon={<FileAddOutlined />} size='small' onClick={genDefaultConfig}>
                      自动生成
                    </Button>
                  </Space>
                }
                name='configs'
                rules={[{ required: true }]}
              >
                <CodeMirror height='200px' extensions={[StreamLanguage.define(toml)]}></CodeMirror>
              </Form.Item>
            </Col> */}
          </Row>
        </Card>
      </div>
      <div className='card-wrapper'>
        <Form.Item >
          <div className='bottom_button'>
          <Space>
            <Button type='primary' htmlType='submit'>
              保存
            </Button>
            <Button
              onClick={() => {
                window.location.href="/xh/monitor"
              }}
            >
              取消
            </Button>
          </Space>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
}
