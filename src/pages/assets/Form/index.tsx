import './style.less';

import React, { useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Row, Select, Space } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { useTranslation } from 'react-i18next';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/stream-parser';
import { toml } from '@codemirror/legacy-modes/mode/toml';
import { useForm } from 'antd/lib/form/Form';
import { addAsset, getAssetDefaultConfig, getAssetsIdents, getAssetsStypes, updateAsset } from '@/services/assets';
import { CommonStateContext } from '@/App';
import { FileAddOutlined } from '@ant-design/icons';

export default function (props) {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [curBusiId] = useState<number>(commonState.curBusiId);
  const [assetTypes, setAssetTypes] = useState<{ name: string; form: any }[]>([]);
  const [identList, setIdentList] = useState([]);
  const [params, setParams] = useState<{ label: string; name: string; editable?: boolean; items?: [] }[]>([]);
  const [form] = useForm();

  const panelBaseProps: any = {
    size: 'small',
    bodyStyle: { padding: '24px 24px 8px 24px' },
  };

  const genForm = () => {
    const assetType = assetTypes.find((v) => v.name === form.getFieldValue('type'));
    if (assetType) {
      setParams(assetType.form || []);
    }
  };

  const setDefaultConfig = () => {
    const name = form.getFieldValue('type');
    const data = form.getFieldsValue();
    delete data.configs;
    getAssetDefaultConfig(name, data).then((res) => {
      form.setFieldsValue({ configs: res.dat.content });
    });
  };

  useEffect(() => {
    getAssetsIdents({ bgid: -1 }).then((res) => {
      const items = res.dat.map((v) => {
        return {
          value: v.ident,
          label: v.ident,
        };
      });
      setIdentList(items);
    });

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
  }, []);

  useEffect(() => {
    form.setFieldsValue(props.initialValues);
    genForm();
  }, [props]);

  const submitForm = async (values) => {
    values.group_id = curBusiId;
    if (props.mode === 'edit') {
      await updateAsset(values);
    } else {
      await addAsset(values);
    }
    message.success('操作成功');
    history.back();
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
      <FormItem hidden name='id'>
        <Input></Input>
      </FormItem>
      <div className='card-wrapper'>
        <Card {...panelBaseProps} title={t('basic')}>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem label='类型' name='type' rules={[{ required: true }]}>
                <Select style={{ width: '100%' }} options={assetTypes} placeholder='请选择资产类型' disabled={props.mode === 'edit'} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='名称' name='name' rules={[{ required: true }]}>
                <Input placeholder='请输入资产名称' />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='标识' name='label' rules={[{ required: true }]}>
                <Input placeholder='请输入资产名称' />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='备注' name='memo'>
                <Input placeholder='填写备注' />
              </FormItem>
            </Col>
          </Row>
        </Card>
      </div>
      <div className='card-wrapper'>
        <Card {...panelBaseProps} title={t('info')}>
          <Row gutter={10}>
            {params.map((v) => {
              return (
                <Col span={12}>
                  <FormItem label={v.label} name={v.name}>
                    {v.items ? (
                      <Select
                        style={{ width: '100%' }}
                        options={v.items.map((v) => {
                          return { label: v, value: v };
                        })}
                      ></Select>
                    ) : (
                      <Input placeholder={`填写${v.label}`} />
                    )}
                  </FormItem>
                </Col>
              );
            })}
            <Col span={12}>
              <FormItem label='探针' name='ident'>
                <Select style={{ width: '100%' }} options={identList} />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                label={
                  <Space>
                    采集配置
                    <Button type='primary' icon={<FileAddOutlined />} size='small' onClick={setDefaultConfig}>
                      生成
                    </Button>
                  </Space>
                }
                name='configs'
                rules={[{ required: true }]}
              >
                <CodeMirror height='200px' extensions={[StreamLanguage.define(toml)]}></CodeMirror>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </div>
      <div className='card-wrapper'>
        <FormItem>
          <Space>
            <Button type='primary' htmlType='submit'>
              保存
            </Button>
            <Button
              onClick={() => {
                history.back();
              }}
            >
              取消
            </Button>
          </Space>
        </FormItem>
      </div>
    </Form>
  );
}
