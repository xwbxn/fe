import './style.less';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Space, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';

import { CommonStateContext } from '@/App';
import { addAsset, getAssetDefaultConfig, getAssetsIdents, getAssetsStypes, updateAsset } from '@/services/assets';
import { MinusCircleOutlined } from '@ant-design/icons';


export default function (props: { initialValues: object; initParams: object; mode?: string }) {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [organizationId] = useState<number>(commonState.organizationId);
  const [assetTypes, setAssetTypes] = useState<{ name: string; form: any }[]>([]);
  const [identList, setIdentList] = useState([]);

  const [formItems, setFormItems] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState<string>("base_set");


  const [params, setParams] = useState<{ label: string; name: string; editable?: boolean; password?: boolean; items?: [] }[]>([]);
  const [form] = Form.useForm();

  const panelBaseProps: any = {
    size: 'small',
    bodyStyle: { padding: '24px 24px 8px 24px' },
  };


  const genForm = () => {
    const assetType: any = assetTypes.find((v) => v.name === form.getFieldValue('type'));
    if (assetType) {
      setParams(assetType.form || []);
      //TODO：处理分组属性
      let items = new Array();
      let extra_props = assetType.extra_props; 
      for (let property in extra_props) {
        let group = extra_props[property];
        // console.log("group.props",group,group.props)
        if(group!=null &&  group.props){

          let baseItems = new Array();
          let listItems = new Array();
          
          group.props.map((item, index) => {
            if (item.type === "list") {
              listItems = (item.items);
            } else {
              baseItems.push(item);
            }
          })
          items.push({
            name: property,
            label: group.label,
            base: baseItems,
            list: listItems
          });

        }
        
      }
      setFormItems(items);
      console.log("items", items);
    }

  }

  const genDefaultConfig = () => {
    const name = form.getFieldValue('type');
    // debugger;
    const data = form.getFieldsValue();
    if (data.configs) {
      Modal.confirm({
        title: '将会覆盖原有配置,是否继续?',
        onOk: () => {
          delete data.configs;
          getAssetDefaultConfig(name, data).then((res) => {
            form.setFieldsValue({ configs: res.dat.content });
          });
        },
      });
    } else {
      getAssetDefaultConfig(name, data).then((res) => {
        form.setFieldsValue({ configs: res.dat.content });
      });
    }
  };

  useEffect(() => {
    getAssetsIdents().then((res) => {
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
        // .filter((v) => v.name !== '主机'); //探针自注册的不在前台添加
      setAssetTypes(items);
    });
  }, []);

  const TabOperteClick = (tabIndex: string) => {
    setTabIndex(tabIndex);
  }
  useEffect(() => {
    genForm();
    form.setFieldsValue(props.initialValues);
  }, [props]);

  const submitForm = async (values) => {
    values.params = JSON.stringify(values);
    if (props.mode === 'edit') {
      await updateAsset(values);
    } else {
      await addAsset(values);
    }
    message.success('操作成功');
    history.back();
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
  const renderFormItem = (v) => {
    if (v.type === "select") {
      return (
        <Select
          style={{ width: '100%' }}

          options={v.options?.map((v) => {
            return { label: v, value: v };
          })}
        ></Select>
      );
    }
    if (v.type === "password") {
      return <Input.Password placeholder={`请输入${v.label}`} />;
    }
    return <Input placeholder={`请填写${v.label}`} />;
  };

  const formItemLayout ={ labelCol: { span: 8 }, wrapperCol: { span: 10 } };
  return (
    <Fragment>

      <Tabs className='assetmgt_list_2' activeKey={tabIndex} onTabClick={key => {
        TabOperteClick(key);
      }}>
        <Tabs.TabPane tab={('基本信息')} key='base_set' >

        </Tabs.TabPane>
        {formItems.map((groupItem, index) => {
          return (
            <Tabs.TabPane tab={groupItem.label} key={groupItem.name}>

            </Tabs.TabPane>
          )
        })}
      </Tabs>

      <Form
        name='asset'
        form={form}
        layout='horizontal'
        {...formItemLayout}
        onFinish={submitForm}
        className='asset_xh_form'
        onValuesChange={() => {
          genForm();
        }}
      >
        <Form.Item hidden name='id'>
          <Input></Input>
        </Form.Item>
        {tabIndex == "base_set" && (
          <div className='card-wrapper' >
            <Card {...panelBaseProps} title={t('basic')} className='card_base'>
              <Row gutter={10}>                
                <Col span={12}>
                  <Form.Item label='名称' name='name' rules={[{ required: true }]}>
                    <Input placeholder='请输入资产名称' />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item label='IP地址' name='ip' rules={[{ required: true }]}>
                    <Input placeholder='请输入IP地址' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='类型' name='type' rules={[{ required: true }]}>
                    <Select style={{ width: '100%' }} options={assetTypes} placeholder='请选择资产类型' disabled={props.mode === 'edit'} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='厂商' name='manufacturers' rules={[{ required: false }]}>
                    <Input placeholder='请输入厂商' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='位置' name='position' rules={[{ required: false }]}>
                    <Input placeholder='请输入位置' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='状态' name='status' rules={[{ required: true }]}>
                    <Select style={{ width: '100%' }} options={[{value:'正常',label:'正常'},{value:'下线',label:'下线'}]} placeholder='请选择状态' disabled={props.mode === 'edit'} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='备注' name='memo'>
                    <Input placeholder='填写备注' />
                  </Form.Item>
                </Col>
              </Row>

            </Card>
          </div>
        )}
        {tabIndex != "base_set" && (
          <div className='card-wrapper' >
            {formItems.map((groupItem, index) => {
              if (tabIndex == groupItem.name) {
                return (
                  <Form.List key={"group_list_" + index} name={groupItem.name} initialValue={[{}]}>
                    {(fields, { add, remove }) => {
                      return (
                        <Fragment>
                          <Card {...panelBaseProps} key={"groupItem" + index} title={groupItem.label} className='card_group'
                            extra={
                              <>
                                <Button type="primary" className='form_add' onClick={() => {
                                  add()
                                }}> ＋添加</Button>
                              </>

                            }
                          >
                            <Row gutter={10}>
                              {groupItem.base.map((v) => {
                                return (
                                  <Col key={`col=${v.name}`} span={12}>
                                    <Form.Item key={`form-item${v.name}`} label={v.label} name={v.name} initialValue={props.initParams[v.name]}>
                                      {renderFormItem(v)}
                                    </Form.Item>
                                  </Col>
                                );
                              })}
                            </Row>
                            {fields.map((item, _suoyi) => (
                              <Fragment>
                                <div className='group_title' key={"groupForm" + index}>
                                  <span style={{ marginLeft: '3px' }}>{'项'}-{_suoyi + 1}</span>
                                  {_suoyi > 0 ? (
                                    <MinusCircleOutlined
                                      className="dynamic-delete-button"
                                      style={{ position: 'absolute', color: 'red', right: '2%', marginTop: 5, marginLeft: 8 }}
                                      onClick={() => remove(_suoyi)} />
                                  ) : null}
                                </div>

                                <Row gutter={10}>
                                  {groupItem.list.map((property, index_) => {
                                    console.log("field", property);
                                    return (
                                      <Col key={`col=${index_}`} span={12}>
                                        <Form.Item label={property.label} name={[item.name, property.name]} initialValue={props.initParams[property.name]}>
                                          {renderFormItem(property)}
                                        </Form.Item>
                                      </Col>
                                    );
                                  })}
                                </Row>
                              </Fragment>
                            ))}
                          </Card>

                        </Fragment>
                      )
                    }}
                  </Form.List>

                )
              }
            })}

          </div>
        )}
        <div className='button-wrapper'>
          <Form.Item>
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
          </Form.Item>
        </div>

      </Form>

    </Fragment>

  );
}
