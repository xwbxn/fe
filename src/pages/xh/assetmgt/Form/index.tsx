import './style.less';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, FormInstance, Input, message, Row, Select, Space, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { CommonStateContext } from '@/App';
import { insertXHAsset, getXhAsset, getAssetsIdents, getAssetsStypes, updateXHAsset, addXHAssetExpansion } from '@/services/assets';
import { MinusCircleOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { factories } from '../catalog';
export default function () {
  const { t } = useTranslation('assets');
  const [assetTypes, setAssetTypes] = useState<any[]>([]);
  const { busiGroups } = useContext(CommonStateContext);
  const [formItems, setFormItems] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState<string>('base_set');
  const [editType, setEditType] = useState<string>('insert');
  const history = useHistory();

  const [hasSave, setHasSave] = useState<boolean>(true);

  const { search } = useLocation();
  const { mode, id } = queryString.parse(search);

  const [properties, setProperties] = useState({});

  const [params, setParams] = useState<{ label: string; name: string; required?: boolean; type: string; options?: [] }[]>([]);
  const [form] = Form.useForm();
  const refForm = React.createRef<FormInstance>();

  const panelBaseProps: any = {
    size: 'small',
    bodyStyle: { padding: '24px 24px 8px 24px' },
  };

  const genForm = (assetTypes) => {
    const assetType: any = assetTypes.find((v) => v.name === form.getFieldValue('type'));
    if (assetType) {
      setParams(assetType.form || []); // 显示form表单
      
      if(!id) { // 新增时不显示扩展选项卡
        return
      }
      //TODO：处理分组属性
      let items = new Array();
      let extra_props = assetType.extra_props;
      let map = new Map();
      for (let property in extra_props) {
        let group = extra_props[property];
        map.set(group.sort, property);
      }
      var arrayObj = Array.from(map);
      arrayObj.sort(function (a, b) {
        return a[0] - b[0];
      });

      for (var [key, value] of arrayObj) {
        let group = extra_props[value];
        if (group != null && group.props) {
          let baseItems = new Array();
          let listItems = new Array();
          group.props.map((item, index) => {
            if (item.type === 'list') {
              item.items.forEach((element) => {
                listItems.push(element);
                properties[value + '.' + element.name] = element.label;
              });
            } else {
              baseItems.push(item);
              properties[value + '.' + item.name] = item.label;
            }
          });
          items.push({
            name: value,
            label: group.label,
            base: baseItems,
            list: listItems,
          });
        }
      }
      setProperties(properties);
      setFormItems(items);
    }
  };

  const loadAssetInfo = (id, isTabLoading, assetTypes) => {
    if (!!id) {
      setEditType('edit');
      getXhAsset('' + id).then(({ dat }) => {
        console.log(dat);
        let expands = dat.exps;
        if (expands != null && expands.length > 0) {
          const map = new Map();
          expands.forEach((item, index, arr) => {
            if (!map.has(item.config_category)) {
              map.set(
                item.config_category,
                arr.filter((a) => a.config_category == item.config_category),
              );
            }
          });
          //以上分组加载数据
          let mapValues = {};
          map.forEach(function (value, key) {
            const formDataMap = new Map();
            value.forEach((item, index, arr) => {
              if (!formDataMap.has(item.group_id)) {
                formDataMap.set(
                  item.group_id,
                  arr.filter((a) => a.group_id == item.group_id),
                );
              }
            });
            let group: any = [];
            formDataMap.forEach(function (value, i) {
              let itemsChars = '';
              value.forEach((item, index, arr) => {
                itemsChars += '"' + item.name + '":"' + item.value + '",';
              });
              itemsChars = '{' + itemsChars.substring(0, itemsChars.length - 1) + '}';
              group.push(JSON.parse(itemsChars));
            });
            mapValues[key] = group;
            dat[key] = group;
          });
          delete dat.exps;
        }
        form.setFieldsValue(dat);
        try {
          form.setFieldsValue(JSON.parse(dat.params));
        } catch {
          console.debug('parse param error:', dat.params);
        }
        if (isTabLoading) {
          setTimeout(() => {
            genForm(assetTypes);
          }, 1500);
        }
      });
    }
  };

  useEffect(() => {
    getAssetsStypes().then((res) => {
      const items = res.dat.map((v) => {
        return {
          value: v.name,
          label: v.name,
          ...v,
        };
      });
      setAssetTypes(items);
    });
  }, []);

  useEffect(() => {
    if (assetTypes.length > 0) {
      loadAssetInfo(id, true, assetTypes);
    }
  }, [assetTypes]);

  const TabOperteClick = (tabIndex: string) => {
    setTabIndex(tabIndex);
    if (tabIndex != 'base_set' && id == null) {
      setHasSave(false);
    } else {
      setHasSave(true);
    }
  };

  const submitForm = async (values) => {
    console.log('提交数据');
    values.params = JSON.stringify(values);
    if (tabIndex == 'base_set') {
      if (editType === 'edit' && id != null) {
        values.id = parseInt('' + id);
        await updateXHAsset(values).then(() => {
          message.success('修改成功');
        });
      } else {
        await insertXHAsset(values).then((res) => {
          message.success('添加成功');
          history.goBack();
        });
      }
    } else {
      if (id != null) {
        let listValues = values[tabIndex];
        console.log(listValues);
        let subItem = new Array();
        for (let values of listValues) {
          let groupId = uuidv4();
          for (let key in values) {
            let row = {
              // property_category: tabIndex,
              name: key,
              value: values[key],
              name_cn: properties[tabIndex + '.' + key],
              group_id: groupId,
              assets_id: parseInt('' + id),
              config_category: tabIndex,
            };
            subItem.push(row);
          }
        }
        console.log('提交的数据', subItem);
        addXHAssetExpansion(subItem, id, tabIndex).then((res) => {
          message.success('操作成功');
          loadAssetInfo(id, false, null);
        });
      } else {
        message.error('当前资产信息未找到，不能添加该信息！');
      }
    }
  };

  const renderFormItem = (v) => {
    console.log('renderFormItem', v);
    if (v.type === 'select') {
      return (
        <Select
          key={'v' + v.name}
          style={{ width: '100%' }}
          options={v.options?.map((v) => {
            return { label: v.label, value: v.value };
          })}
        ></Select>
      );
    }
    if (v.type === 'password') {
      return <Input.Password key={'v' + v.name} placeholder={`请输入${v.label}`} />;
    }
    return <Input key={'v' + v.name} placeholder={`请填写${v.label}`} name={v.name} />;
  };

  const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 10 } };
  return (
    <Fragment>
      <div className='assetmgt_header_select'>
        <Tabs
          className='assetmgt_list_2'
          activeKey={tabIndex}
          type="card"
          size='small'
          onTabClick={(key) => {
            TabOperteClick(key);
          }}
        >
          <Tabs.TabPane tab={'基本信息'} key='base_set' className='tab_header'></Tabs.TabPane>
          {formItems.map((groupItem, index) => {
            return <Tabs.TabPane tab={groupItem.label} key={groupItem.name} className='tab_header'></Tabs.TabPane>;
          })}
        </Tabs>
      </div>
      <Form
        name='asset'
        form={form}
        layout='horizontal'
        disabled={mode == 'view' ? true : false}
        {...formItemLayout}
        onFinish={submitForm}
        ref={refForm}
        className='asset_xh_form'
        onValuesChange={() => {
          genForm(assetTypes);
        }}
      >
        <Form.Item hidden name='id'>
          <Input></Input>
        </Form.Item>
        {tabIndex == 'base_set' && (
          <div className='card-wrapper'>
            <Card {...panelBaseProps} title={t('basic')} className='card_base'>
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item label='类型' name='type' rules={[{ required: true }]}>
                    <Select style={{ width: '100%' }} options={assetTypes} placeholder='请选择资产类型' disabled={id != null} />
                  </Form.Item>
                </Col>
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
                  <Form.Item label='厂商' name='manufacturers' rules={[{ required: false }]}>
                    <Select
                      style={{ width: '100%' }}
                      options={factories.map(({ key, value }) => ({
                        label: value,
                        value: value,
                      }))}
                      placeholder='请选择厂商'
                    />

                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='位置' name='position' rules={[{ required: false }]}>
                    <Input placeholder='请输入位置' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='业务组' name='group_id' rules={[{ required: true }]}>
                    <Select
                      style={{ width: '100%' }}
                      options={busiGroups.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      }))}
                      placeholder='请选择业务组'
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='备注' name='memo'>
                    <Input placeholder='填写备注' />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            {params.length > 0 && (
              <Card {...panelBaseProps} title={'扩展属性'} className='card_base'>
                <Row gutter={10}>
                  {params.map((v) => {
                    return (
                      <Col span={12} key={`col-${v.name}`}>
                        <Form.Item label={v.label} name={v.name} key={`formitem=${v.name}`}>
                          {renderFormItem(v)}
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            )}
          </div>
        )}
        {tabIndex != 'base_set' && (
          <div className='card-wrapper'>
            {formItems.map((groupItem, index) => {
              if (tabIndex == groupItem.name) {
                return (
                  <Fragment>
                    {groupItem.base.length > 0 && (
                      <Card {...panelBaseProps} key={'groupItem' + index} title={'基本信息'} className='card_group'>
                        <Row gutter={10}>
                          {groupItem.base.map((v) => {
                            return (
                              <Col key={`col=${v.name}`} span={12}>
                                <Form.Item
                                  key={`form-item${v.name}`}
                                  label={v.label}
                                  name={v.name}
                                  rules={[{ required: v.required ? v.required : false, message: `请选择您的${v.label}` }]}
                                >
                                  {renderFormItem(v)}
                                </Form.Item>
                              </Col>
                            );
                          })}
                        </Row>
                      </Card>
                    )}
                    <Form.List key={'group_list_' + index} name={groupItem.name} initialValue={[{}]}>
                      {(field, { add, remove }) => {
                        return (
                          <Fragment>
                            <Card
                              {...panelBaseProps}
                              key={'groupItem' + index}
                              title={groupItem.label}
                              className='card_group'
                              extra={
                                <>
                                  {mode == 'edit' && (
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
                                  )}
                                </>
                              }
                            >
                              {field.map((item, _suoyi) => (
                                <Fragment>
                                  <div className='group_title' key={'groupForm' + index}>
                                    <span style={{ marginLeft: '3px' }}>
                                      {'项'}-{_suoyi + 1}
                                    </span>
                                    {mode == 'edit' && (
                                      <MinusCircleOutlined
                                        className='dynamic-delete-button'
                                        style={{ position: 'absolute', color: 'red', right: '2%', marginTop: 5, marginLeft: 8 }}
                                        onClick={() => remove(_suoyi)}
                                      />
                                    )}
                                  </div>

                                  <Row gutter={10}>
                                    {groupItem.list.map((property, index_) => {
                                      console.log('field', item, property);
                                      return (
                                        <Col key={property.name + index_} span={12}>
                                          <Form.Item
                                            label={property.label}
                                            name={[item.name, property.name]}
                                            rules={[{ required: property.required ? property.required : false, message: `请选择您的${property.label}` }]}
                                          >
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
                        );
                      }}
                    </Form.List>
                  </Fragment>
                );
              }
            })}
          </div>
        )}
        {mode == 'edit' && (
          <div className='button-wrapper'>
            <Form.Item>
              <Space>
                <Button type='primary' htmlType='submit' disabled={!hasSave}>
                  保存
                </Button>
                <Button
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  关闭
                </Button>
              </Space>
            </Form.Item>
          </div>
        )}
      </Form>
      {mode == 'view' && (
        <div className='asset_manage_button_zone'>
          <Button
            onClick={() => {
              history.goBack();
            }}
          >
            关闭
          </Button>
        </div>
      )}
    </Fragment>
  );
}
