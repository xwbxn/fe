import './style.less';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, InputNumber, message, Modal, Radio, Radio, Row, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { CommonStateContext } from '@/App';
import { getAssetsIdents, getAssetsStypes, getAssetsByCondition } from '@/services/assets';
import { getMonitorUnit, createXhMonitor, getXhMonitor, updateXhMonitor } from '@/services/manage';
import PromBox from './PromBox';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { cn_name, en_name } from '@/components/PromQueryBuilder/components/metrics_translation'
import { type } from 'os';
const { TextArea } = Input;
import { factories, unitTypes } from '../../assetmgt/catalog';
import { MinusCircleOutlined } from '@ant-design/icons';

export default function (props: { initialValues: object; initParams: object; mode?: string, disabled?: boolean }) {
  const { t } = useTranslation('assets');
  const history = useHistory();
  const [assetTypes, setAssetTypes] = useState<any[]>([]);
  const [assetList, setAssetList] = useState<any[]>([]);
  const [assetOptions, setAssetOptions] = useState<any[]>([]);
  const [sqlCN, setSqlCN] = useState<string>("")
  const [identList, setIdentList] = useState([]);
  const [params, setParams] = useState<{ label: string; name: string; editable?: boolean; required?: boolean; password?: boolean; items?: [] }[]>([]);
  const [form] = Form.useForm();
  const [datasource, setDatasource] = useState(1);
  const { search } = useLocation();
  const { id } = queryString.parse(search);
  const { action } = queryString.parse(search);
  const [monitor, setMonitor] = useState<any>({});



  const panelBaseProps: any = {
    size: 'small',
    // bodyStyle: { padding: '24px 124px 8px 124px' },
  };


  useEffect(() => {
    if (action == null || 'addeditview'.indexOf(action + '') < 0) {
      history.goBack();
    }
    const param = {
      page: 1,
      limit: 10000,
    };

    getAssetsStypes().then((res) => {
      const types = res.dat.map((v) => {
        return {
          value: v.name,
          label: v.name,
          ...v,
        };
      });
      // .filter((v) => v.name !== '主机'); //探针自注册的不在前台添加
      setAssetTypes(types);
      getAssetsByCondition(param).then((assets) => {
        let options = new Array();
        const items = assets.dat.list.map((v) => {
          options.push({
            value: v.id,
            label: v.name + '[' + v.type + ']',
          });
        });
        setAssetOptions(options);
        setAssetList(assets.dat.list);
        if (id != null && id.length > 0 && id != 'null') {
          getXhMonitor(id).then(({ dat }) => {
            if (dat != null) {
              setMonitor(dat);
              let config = dat['config'];
              delete dat['config'];
              if (config != null && config.length > 0) {
                let configJson = JSON.parse(config);
                dat = { ...configJson, ...dat };
              }
              form.setFieldsValue(dat);
              setMonitor(dat);
              setTimeout(() => {
                genForm(assets.dat.list, types);
              }, 1500);
            }
          });
        }
      });


    });

    getAssetsIdents().then((res) => {
      const items = res.dat.map((v) => {
        return {
          value: v.id,
          label: v.ident,
        };
      });
      setIdentList(items);
    });
    form.setFieldsValue({ datasource_id: 1 })

  }, []);


  const genForm = (assets, types) => {
    if (assets == null || assets.length <= 0 || types == null || types.length <= 0) return
    console.log('genForm');
    let formValue = form.getFieldsValue();
    console.log(formValue);
    const asset: any = assets ? assets.find((v: any) => v.id === formValue['asset_id']) : assetList.find((v: any) => v.id === formValue['asset_id']);
    if (asset) {
      form.setFieldsValue({ type: asset.type });
      let typeList = types ? types : assetTypes;
      const assetType: any = typeList.find((v) => v.name === asset.type);
      if (assetType) setParams(assetType.form || []);
      console.log('gen---Form', assetType.form);
    }
    if (formValue['monitoring_sql'] != null) {
      let sql = formValue['monitoring_sql'];;
      if (cn_name[sql]) {
        setSqlCN(sql + ":" + cn_name[sql])
        console.log("中文", sql + ":" + cn_name[sql])
      } else if (en_name[sql]) {
        setSqlCN(sql + ":" + en_name[sql])
        console.log("英文", setSqlCN(cn_name[sql]))
      } else {
        setSqlCN("")
      }
    }
  };

  const renderForm = (v) => {
    console.log("config form item,", v)
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
    if (v.type == "password") {
      return <Input.Password placeholder={`填写${v.label}`} />;
    }
    return <Input placeholder={`填写${v.label}`} />;
  };

  const submitForm = async (values) => {
    console.log('submitForm', values);
    if(values.alert_rules!=null && values.alert_rules.length>0){
      values.alert_rules.forEach(rule => {
        let relation = rule.relation==">"?"大于":(rule.relation=="=="?"等于":"小于")
        rule["rule_config_cn"]=values.monitoring_name+relation+rule.value;
      });
    }
    let config = {};
    if (params != null && params.length > 0) {
      for (let param in params) {
        let group = params[param];
        config[group.name] = values[group.name];
        delete values[group.name];
      }
    }
    if (id != null && id.length > 0 && id != 'null') {
      values.id = parseInt('' + id);
      values['config'] = JSON.stringify(config);
      updateXhMonitor(values).then((res) => {
        message.success('修改成功');
        history.push('/xh/monitor')
      });
    } else {
      values['config'] = JSON.stringify(config);
      createXhMonitor(values).then((res) => {
        message.success('操作成功');
        history.push(`/xh/monitor?assetId=${values['asset_id']}`)
      });
    }
  };

  return (
    <>
      <Form
        name='asset'
        form={form}
        layout='vertical'
        className='monitor_form'
        onFinish={submitForm}
        disabled={props.disabled}
        onValuesChange={() => {
          genForm(assetList, assetTypes);
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
                  <Select style={{ width: '100%' }} showSearch filterOption optionFilterProp={"label"} options={assetOptions} placeholder='请选择资产' disabled={action === 'edit'} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='监控名称' name='monitoring_name' rules={[{ required: true }]}>
                  <Input placeholder='请输入资产名称' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='数据源类型' name='datasource_id' rules={[{ required: true }]}>
                  <Select
                    onChange={(v) => {
                      setDatasource(v);
                    }}
                    options={[
                      {
                        value: 1,
                        label: '普罗米修斯',
                      },
                    ]}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={20}>
                <Form.Item label='监控脚本' rules={[{ required: false }]}>
                  <Form.Item name='monitoring_sql' rules={[{ required: false }]}>
                    <PromBox datasource={datasource} value={monitor.monitoring_sql}></PromBox>
                  </Form.Item>
                  {sqlCN != null && sqlCN.length > 0 && (
                    <div className='chinese_remark'><span className='title' style={{ color: '#0A4B9D', fontSize: "14px" }}>指标关键词说明：</span>{sqlCN}</div>
                  )}

                </Form.Item>

              </Col>
              <Col span={4}>
                <Form.Item label='指标计算单位' rules={[{ required: false }]}>
                  <Form.Item name='unit' rules={[{ required: true }]}>
                    <Select >
                      {Object.keys(unitTypes).map((key) => {
                        return (<Select.Option value={key}>{unitTypes[key]}</Select.Option>)
                      })}
                    </Select>
                  </Form.Item>
                </Form.Item>

              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label='状态' name='status'>
                  <Select
                    style={{ width: '100%' }}
                    options={[
                      { value: 0, label: '正常' },
                      { value: 1, label: '失效' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='采集器' name='target_id'>
                  <Select style={{ width: '100%' }} options={identList} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item label='描述' name='remark'>
                  <TextArea placeholder='填写描述' />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </div>
        <div className='card-wrapper'>
          <Card title={'告警消息'} className='alert_rule_card'>
            <Row gutter={10}>
              <Form.List name={'alert_rules'} initialValue={[{}]}>
                {(field, { add, remove }) => {
                  return (
                    <Fragment>
                      <Card
                        className='rule_card_group'
                        extra={
                          <>
                            <Button
                              type='primary'
                              className='form_add'
                              onClick={() => {
                                add();
                              }}
                            >
                              {' '}
                              ＋添加
                            </Button>
                          </>
                        }
                      >
                        <Row gutter={10} className='rule-row'>
                          <Col span={6}>关系</Col>
                          <Col span={6}>阈值</Col>
                          <Col span={12}>告警级别</Col>
                        </Row>
                        {field.map((item, _suoyi) => (
                          <Fragment>
                            <Row gutter={10} className='rule-row'>
                              <Col span={6}>
                                <Form.Item
                                  // label={'关系'}
                                  name={[item.name, 'relation']}
                                  rules={[{ required: true, message: `请选择符号` }]}
                                >
                                  <Select options={[
                                    { value: ">", label: '大于' }, { value: "=", label: '等于' }, { value: "<", label: '小于' },
                                  ]}></Select>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  // label={'阈值'}
                                  name={[item.name, 'value']}
                                  rules={[{ required: true, message: `请选择阈值` }]}
                                >
                                  <InputNumber placeholder="请输入值" />
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item
                                  // label={'告警级别'}
                                  name={[item.name, 'severity']}
                                  rules={[{ required: true, message: `请选择告警级别` }]}
                                >
                                  <Radio.Group>
                                    <Radio value={1}>{t('common:severity.1')}</Radio>
                                    <Radio value={2}>{t('common:severity.2')}</Radio>
                                    <Radio value={3}>{t('common:severity.3')}</Radio>
                                  </Radio.Group>
                                </Form.Item>
                              </Col>
                              <Col span={2}>
                                  <MinusCircleOutlined
                                    className='dynamic-delete-button'
                                    style={{ color: 'red', marginTop:14, marginLeft: 8 }}
                                    onClick={() => remove(_suoyi)}
                                  />
                              </Col>
                            </Row>
                          </Fragment>
                        ))}
                      </Card>
                    </Fragment>
                  );
                }}
              </Form.List>

            </Row>
          </Card>
        </div>
        <div className='card-wrapper'>
          <Card {...panelBaseProps} title={'配置信息'}>
            <Row gutter={10}>
              {params.map((v) => {
                return (
                  <Col key={`col=${v.name}`} span={12}>
                    <Form.Item key={`form-item${v.name}`}
                      label={v.label}
                      name={v.name}
                      rules={[{ required: v.required ? v.required : false, message: `请选择您的${v.label}` }]}
                      initialValue={props.initParams[v.name]}>
                      {renderForm(v)}
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </div>
        {props.disabled == false && (
          <div className='card-wrapper'>
            <Form.Item>
              <div className='bottom_button'>
                <Space>
                  <Button type='primary' htmlType='submit'>
                    保存
                  </Button>
                  <Button
                    onClick={() => {
                      history.goBack()
                    }}
                  >
                    取消
                  </Button>
                </Space>
              </div>
            </Form.Item>
          </div>
        )}

      </Form>
      {props.disabled == true && (
        <div className='monitor_management_button_zone'>
          <Button
            onClick={() => {
              history.goBack()
            }}
          >
            取消
          </Button>


        </div>
      )}
    </>

  );
}
