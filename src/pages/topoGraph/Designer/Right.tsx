import React, { useEffect, useState } from 'react';
import './index.less';
import { Tabs, Form, Input, InputNumber, FormInstance, Row, Col, Select, Collapse, Switch, Slider, Button } from 'antd';
import { ChromePicker } from 'react-color';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import _ from 'lodash';
import ReactCodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { Compartment } from '@codemirror/state';
import { Cell } from '@antv/x6';
import { widgetConfigure } from '../configuration';

let language = new Compartment();
// 微件配置文件

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

interface IRightProps {
  selection?: Cell[];
  setRightFlag: React.Dispatch<React.SetStateAction<boolean>>;
  rightFlag: Boolean;
  onUpdateData?: (val: any) => void;
}

const Right = ({ selection, setRightFlag, rightFlag, onUpdateData }: IRightProps) => {
  const [key, setKey] = useState('1');
  // 配置from
  const [dataForm] = Form.useForm();
  const [attrForm] = Form.useForm();

  const [widgetConfiguration, setwidgetConfiguration] = useState<{
    data: any[];
    attr: any[];
  }>({ data: [], attr: [] });

  useEffect(() => {
    // 组合所有已选择组件的配置项和配置值。配置值默认以最后一个为准，配置项已选择组件的交集
    const combinedData = {}; // 合并数据值
    const combinedAttr = {}; // 合并属性
    const allConfigure: any[] = [];
    selection?.forEach((v) => {
      Object.assign(combinedData, v.data);
      Object.assign(combinedAttr, v.attrs?.body);
      allConfigure.push(widgetConfigure[v.shape].configuration || []);
    });
    dataForm.setFieldsValue(combinedData);
    attrForm.setFieldsValue(combinedAttr);

    // 合并配置项
    const combinedConfigure = {
      data: _.intersectionBy<any>(...allConfigure.map((v) => v.data), 'name'),
      attr: _.intersectionBy<any>(...allConfigure.map((v) => v.attr), 'name'),
    };
    setwidgetConfiguration(combinedConfigure);
  }, [selection, dataForm, attrForm]);

  // 判断数据是Array 或者 object
  const judgeType = (data: any, type: string) => {
    return Object.prototype.toString.call(data) == type;
  };

  /**
   *
   * @param callback 返回的方法
   * @param name 表单名
   * @param value 表单值
   * @param field 字段名
   */
  const onChangeHandler = (callback: Function, name: string, value: any, field: string) => {
    return (
      callback &&
      callback({
        [name]: value,
      })
    );
  };

  const modifyData = (val: any) => {
    console.log('🚀 ~ file: Right.tsx:82 ~ modifyData ~ val:', val);
    if (onUpdateData) {
      onUpdateData(val);
    }
  };

  const modifyAttr = (val: any) => {
    console.log('🚀 ~ file: Right.tsx:88 ~ modifyAttr ~ val:', val);
    selection?.forEach((v) => {
      v.setAttrs({
        body: val,
      });
    });
  };

  /**
   * 基础表单
   * @param item 单个配置项
   * @param form 表单实例
   * @param callback 返回方法
   * @param field 字段名
   * @param isUpdate 是否change更新
   * @returns
   */
  const baseForm = (item: any, form: FormInstance<any>, callback: Function, field: string, isUpdate: boolean = true) => {
    return (
      <>
        {item.componentName === 'Input' && (
          <Form.Item label={item.label} name={item.name} tooltip={item.tooltip} rules={[{ required: item.require }]}>
            <Input allowClear disabled={item.disabled} onBlur={(e) => isUpdate && onChangeHandler(callback, item.name, e.target.value, field)} placeholder={item.placeholder} />
          </Form.Item>
        )}
        {item.componentName === 'InputNumber' && (
          <Form.Item label={item.label} name={item.name} tooltip={item.tooltip} rules={[{ required: item.require }]}>
            <InputNumber
              disabled={item.disabled}
              min={item.min}
              max={item.max}
              onBlur={(e) => isUpdate && onChangeHandler(callback, item.name, e.target.value ? Number(e.target.value) : 0, field)}
              style={{ width: '100%' }}
              placeholder={item.placeholder}
            />
          </Form.Item>
        )}
        {item.componentName === 'TextArea' && (
          <Form.Item label={item.label} name={item.name} tooltip={item.tooltip} rules={[{ required: item.require }]}>
            <TextArea
              allowClear
              disabled={item.disabled}
              onBlur={(e) => isUpdate && onChangeHandler(callback, item.name, e.target.value, field)}
              rows={8}
              placeholder={item.placeholder}
            />
          </Form.Item>
        )}
        {item.componentName === 'Switch' && (
          <Form.Item label={item.label} name={item.name} tooltip={item.tooltip} valuePropName='checked' rules={[{ required: item.require }]}>
            <Switch disabled={item.disabled} onChange={(value) => isUpdate && onChangeHandler(callback, item.name, value, field)} />
          </Form.Item>
        )}
        {item.componentName === 'Slider' && (
          <Form.Item label={item.label} name={item.name} tooltip={item.tooltip} rules={[{ required: item.require }]}>
            <Slider
              min={item.min || 0}
              max={item.max || 100}
              disabled={item.disabled}
              step={item.step || 1}
              onAfterChange={(value) => isUpdate && onChangeHandler(callback, item.name, value, field)}
            />
          </Form.Item>
        )}
        {item.componentName === 'Select' && (
          <Form.Item label={item.label} name={item.name} tooltip={item.tooltip} rules={[{ required: item.require }]}>
            <Select allowClear disabled={item.disabled} onChange={(value: string) => isUpdate && onChangeHandler(callback, item.name, value, field)} placeholder={item.placeholder}>
              {item.options.map((item: any) => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {item.componentName === 'SketchPicker' && (
          <Form.Item label={item.label}>
            <Row>
              <Col span={12}>
                <Form.Item noStyle name={item.name} tooltip={item.tooltip} rules={[{ required: item.require }]}>
                  <Input
                    allowClear
                    disabled={item.disabled}
                    onBlur={(e) => isUpdate && onChangeHandler(callback, item.name, e.target.value, field)}
                    placeholder={item.placeholder}
                  />
                </Form.Item>
              </Col>
              <Col span={11} offset={1}>
                <Form.Item shouldUpdate noStyle>
                  {() => (
                    <div
                      className='color-wrapper'
                      style={{
                        background: form.getFieldValue(item.name),
                        width: '100%',
                      }}
                    >
                      获取颜色
                      <div className='color'>
                        <ChromePicker
                          color={form.getFieldValue(item.name)}
                          onChangeComplete={(e) => {
                            form.setFieldsValue({
                              [item.name]: `rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`,
                            });
                            onChangeHandler(callback, item.name, `rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`, field);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        )}
        {item.componentName === 'JsonEdit' && (
          <Form.Item label={item.label} name={item.name} tooltip={item.tooltip} rules={[{ required: item.require }]}>
            <Form.Item shouldUpdate noStyle>
              <ReactCodeMirror
                theme={'dark'}
                height='200px'
                extensions={[language.of(json())]}
                value={JSON.stringify(form.getFieldValue(item.name), null, 2)}
                onChange={(e) => {
                  try {
                    const mock = JSON.parse(e);
                    if (mock) {
                      isUpdate ? onChangeHandler(callback, item.name, e, field) : form.setFieldsValue({ [item.name]: mock });
                    }
                  } catch {}
                }}
              ></ReactCodeMirror>
            </Form.Item>
          </Form.Item>
        )}
      </>
    );
  };

  /**
   * 动态渲染表单
   * @param datas 数据
   * @param form 表单实例
   * @param callback 返回函数
   * @param field 字段名
   * @param isUpdate 是否change更新
   * @returns
   */
  const renderDynamicForm = (datas: any, form: FormInstance<any>, callback: Function, field: string, isUpdate: boolean = true) => {
    return datas.map((item: any, index: number) => {
      if (judgeType(item, '[object Object]')) {
        const relationFields = item.relationFields !== undefined ? item.relationFields.split(',') : [];
        return (
          <div key={index}>
            {!relationFields.length ? (
              baseForm(item, form, callback, field, isUpdate)
            ) : (
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  if (relationFields.every((subItem: string) => item.relationValues.includes(String(getFieldValue(subItem))))) {
                    return baseForm(item, form, callback, field, isUpdate);
                  }
                }}
              </Form.Item>
            )}
          </div>
        );
      }
      if (judgeType(item, '[object Array]')) {
        return (
          <div key={index}>
            {item.map((subItem: any, subIndex: number) => {
              const relationFields = subItem.relationFields !== undefined ? subItem.relationFields.split(',') : [];
              return (
                <Collapse key={subIndex}>
                  {subItem.relationFields === undefined ? (
                    <Panel header={subItem.name} key={subItem + subIndex}>
                      {renderDynamicForm(subItem.list, form, callback, field, isUpdate)}
                    </Panel>
                  ) : (
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) => {
                        if (relationFields.every((subbItem: string) => subItem.relationValues.includes(String(getFieldValue(subbItem))))) {
                          return (
                            <Collapse key={subIndex}>
                              <Panel header={subItem.name} key={subItem + subIndex}>
                                {renderDynamicForm(subItem.list, form, callback, field, isUpdate)}
                              </Panel>
                            </Collapse>
                          );
                        }
                      }}
                    </Form.Item>
                  )}
                </Collapse>
              );
            })}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div
      className='topo-designer-right'
      style={{
        right: rightFlag ? 0 : -400,
      }}
    >
      <div onClick={() => setRightFlag(!rightFlag)} className='operation'>
        {rightFlag ? <LeftOutlined /> : <RightOutlined />}
      </div>
      <Tabs className='custom-tabs' activeKey={key} onChange={(key) => setKey(key)} destroyInactiveTabPane>
        <Tabs.TabPane tab='数据' key={'1'}>
          <Form preserve form={dataForm} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete='off' labelAlign='left'>
            {renderDynamicForm(widgetConfiguration.data || [], dataForm, modifyData, '', true)}
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab='样式' key={'2'}>
          <Form preserve form={attrForm} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete='off' labelAlign='left'>
            {renderDynamicForm(widgetConfiguration.attr || [], attrForm, modifyAttr, '', true)}
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
export default Right;
