import React, { useEffect, useState } from 'react';
import './index.less';
import { Tabs, Form, Input, InputNumber, FormInstance, Row, Col, Select, Collapse, Switch, Slider, Button, Space } from 'antd';
import { ChromePicker } from 'react-color';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
// 配置文件
// JSON编辑器
import { IScreen, IWidget } from '../type';
import { widgetConfigure } from '../configuration';
import page from '../configuration/page';
import _ from 'lodash';
import ReactCodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { Compartment } from '@codemirror/state';
import { useHistory } from 'react-router-dom';

let language = new Compartment();
// 微件配置文件

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

interface IRightProps {
  screen: IScreen;
  currentWidget?: IWidget;
  setRightFlag: Function;
  rightFlag: boolean;
  onChange: ({ screen, widget }) => void;
  onSave: () => void;
}

const Right = ({ screen, currentWidget, setRightFlag, rightFlag, onChange, onSave }: IRightProps) => {
  const [key, setKey] = useState('1');
  // 配置
  const [configureForm] = Form.useForm();
  // 页面
  const [pageForm] = Form.useForm();
  // 坐标
  const [dynamicForm] = Form.useForm();
  // 数据
  const [dataForm] = Form.useForm();
  // 配置
  const [configuration, setConfiguration] = useState<any>({});

  const history = useHistory();

  useEffect(() => {
    if (currentWidget?.configureValue) {
      configureForm.setFieldsValue(currentWidget.configureValue);
    }
    if (currentWidget?.coordinateValue) {
      dynamicForm.setFieldsValue(currentWidget.coordinateValue);
    }
    if (currentWidget?.dataValue) {
      dataForm.setFieldsValue(currentWidget.dataValue);
    }
    if (currentWidget?.code) {
      const dataConf: any[] = widgetConfigure[currentWidget.code].configuration?.dataConfigure || [];
      const resolves: any[] = []; // 配置项中异步更新options的
      for (const item of dataConf) {
        if (item.list) {
          for (const subItem of item.list) {
            if (subItem.componentName == 'Select' && _.isFunction(subItem.options)) {
              resolves.push([subItem, subItem.options()]);
            }
          }
        } else {
          if (item.componentName == 'Select' && _.isFunction(item.options)) {
            resolves.push([item, item.options()]);
          }
        }
      }
      // 同步所有的option异步方法，最后统一更新state，再渲染页面
      Promise.all(resolves.map(v => v[1])).then(res => {
        console.log('res', res)
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          resolves[index][0].options = element.dat          
        }
      })
      setConfiguration(widgetConfigure[currentWidget.code].configuration);
    }
  }, [currentWidget, configureForm, dataForm, dynamicForm]);
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
    if (!field) {
      return (
        callback &&
        callback({
          [name]: value,
        })
      );
    } else {
      const newCurrentWidget = _.cloneDeep(currentWidget);
      if (newCurrentWidget) {
        newCurrentWidget[field][name] = value;
        return callback && callback(newCurrentWidget);
      }
    }
  };

  const onPageChange = (page) => {
    const newPage = _.cloneDeep(screen);
    Object.assign(newPage, page);
    onChange({ screen: newPage, widget: currentWidget });
  };

  const onWidgetChange = (widget) => {
    const oldWidget = screen.widgets.find((v) => v.id === widget.id);
    if (oldWidget) {
      Object.assign(oldWidget, widget);
    }
    onChange({ screen, widget });
  };

  const saveData = () => {
    if (currentWidget) {
      const newWidget = _.cloneDeep(currentWidget);
      newWidget.dataValue = dataForm.getFieldsValue();
      onWidgetChange(newWidget);
    }
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
            <Select
              allowClear
              disabled={item.disabled}
              onChange={(value: string) => isUpdate && onChangeHandler(callback, item.name, value, field)}
              placeholder={item.placeholder}
              fieldNames={{ label: 'name', value: 'code' }}
              options={item.options}
            ></Select>
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

  useEffect(() => {
    if (!currentWidget) {
      setKey('1');
    } else if (currentWidget.configureValue) {
      setKey('2');
    } else if (currentWidget.dataValue) {
      setKey('3');
    } else if (currentWidget.coordinateValue) {
      setKey('4');
    }
  }, [currentWidget]);

  return (
    <div
      className='designer-right'
      style={{
        right: rightFlag ? 0 : -400,
      }}
    >
      <div onClick={() => setRightFlag(!rightFlag)} className='operation'>
        {rightFlag ? <LeftOutlined /> : <RightOutlined />}
      </div>
      <Tabs className='custom-tabs' activeKey={key} onChange={(key) => setKey(key)} destroyInactiveTabPane>
        <Tabs.TabPane tab='页面配置' key={'1'}>
          <Form preserve form={pageForm} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete='off' labelAlign='left' initialValues={screen}>
            {renderDynamicForm(page.configure || [], pageForm, onPageChange, '')}
          </Form>
        </Tabs.TabPane>
        {currentWidget && (
          <Tabs.TabPane tab='组件配置' key={'2'}>
            <Form form={configureForm} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete='off' labelAlign='left'>
              {renderDynamicForm(configuration?.widgetConfigure || [], configureForm, onWidgetChange, 'configureValue', true)}
              {currentWidget.code === 'Topology' && (
                <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    block
                    onClick={() => {
                      history.push('/bigscreen/topo');
                    }}
                  >
                    打开编辑器
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Tabs.TabPane>
        )}
        {currentWidget && (
          <Tabs.TabPane tab='数据' key={'3'}>
            <Form preserve form={dataForm} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete='off' labelAlign='left' onFinish={saveData}>
              {renderDynamicForm(configuration?.dataConfigure || [], dataForm, onWidgetChange, 'dataValue', false)}
              <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                <Button type='primary' htmlType='submit' block>
                  保存
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        )}
        {currentWidget && (
          <Tabs.TabPane tab='坐标' key={'4'}>
            <Form preserve form={dynamicForm} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete='off' labelAlign='left'>
              {renderDynamicForm(configuration?.coordinateConfigure || [], dynamicForm, onWidgetChange, 'coordinateValue', true)}
            </Form>
          </Tabs.TabPane>
        )}
      </Tabs>
      <div className='designer-right-toolbar'>
        <Space>
          <Button ghost size='small' href='/bigscreen/preview' target='_blank'>
            预览
          </Button>
          <Button
            ghost
            size='small'
            onClick={() => {
              onSave();
            }}
          >
            保存
          </Button>
        </Space>
      </div>
    </div>
  );
};
export default Right;
