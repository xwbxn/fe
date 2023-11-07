import './style.less';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Image, Space, Radio, RadioChangeEvent } from 'antd';
import { useTranslation } from 'react-i18next';
import echarts from 'echarts/lib/echarts'
import { CommonStateContext } from '@/App';
import { addAsset, getAssetDefaultConfig, getAssetsStypes, getAssetsByCondition } from '@/services/assets';
import TextArea from 'antd/lib/input/TextArea';
import { CheckCircleFilled, FullscreenOutlined, PlusOutlined } from '@ant-design/icons';
import Timeseries from '@/pages/dashboard/Renderer/Renderer/Timeseries';
import Graph from '../Graph';
import _ from 'lodash';
import { parse, describeTimeRange, valueAsString, isMathString } from '@/components/TimeRangePicker/utils';
import moment from 'moment';
import { setSelectedCompletion } from '@codemirror/autocomplete';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
enum ChartType {
  Line = 'line',
  StackArea = 'stackArea',
}

export default function (props: { initialValues: object; initParams: object; mode?: string }) {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [assetTypes, setAssetTypes] = useState<{ name: string; form: any }[]>([]);
  const [assetList, setAssetList] = useState<{ name: string; id: any }[]>([]);
  const [identList, setIdentList] = useState([]);
  const [operateType, setOperateType] = useState<any>({
      visual:false,
      title:"指标名称"
  });
  

  const [params, setParams] = useState<{ label: string; name: string; editable?: boolean; password?: boolean; items?: [] }[]>([]);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [range, setRange] = useState<any>({
    start: parse('now-3h'),//"2023-11-02 01:00:00",
    end: parse('now')//moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  });

  const [dialogRange, setDialogRange] = useState<any>({
    start: parse('now-3h'),//"2023-11-02 01:00:00",
    end: parse('now')//moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  });

  const [size, setSize] = useState<SizeType>('middle');
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));

  const panelBaseProps: any = {
    size: 'small',
    bodyStyle: { padding: '24px 124px 8px 124px' },
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    range.start = parse(e.target.value);
    setRange(range);
    console.log('handleSizeChange', range);
    setRefreshKey(_.uniqueId('refreshKey_'));
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


  const [chartType, setChartType] = useState<ChartType>(ChartType.Line);

  const [highLevelConfig, setHighLevelConfig] = useState({
    shared: true,
    sharedSortDirection: 'desc',
    legend: false,
    unit: 'none',
    reverseColorOrder: false,
    colorDomainAuto: true,
    colorDomain: [],
    chartheight: 300,
  });

  const lineGraphProps = {
    custom: {
      drawStyle: 'lines',
      fillOpacity: chartType === ChartType.Line ? 0 : 0.5,
      stack: chartType === ChartType.Line ? 'hidden' : 'noraml',
      lineInterpolation: 'smooth',
    },
    options: {
      legend: {
        displayMode: highLevelConfig.legend ? 'table' : 'hidden',
      },
      tooltip: {
        mode: highLevelConfig.shared ? 'all' : 'single',
        sort: highLevelConfig.sharedSortDirection,
      },
      standardOptions: {
        util: highLevelConfig.unit,
      },
    },
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
    getAssetDefaultConfig(name, data).then((res) => {
      form.setFieldsValue({ configs: res.dat.content });
    });

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
                  <Col>状态：<CheckCircleFilled /></Col>
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
                  {true ? (
                    <div>正常<CheckCircleFilled className='normal' /></div>
                  ) : (
                    <div>故障<CheckCircleFilled className='no_normal' /></div>
                  )}
                </div>
              </div>
              <div className='assembly show_image'>
                <div className='title'>CPU(2)</div>
                <div className='image net'></div>
                <div className='status'>状态：
                  {false ? (
                    <div>正常<CheckCircleFilled className='normal' /></div>
                  ) : (
                    <div>故障<CheckCircleFilled className='no_normal' /></div>
                  )}</div>
              </div>

            </div>
          </Card>
        </div>
        <div className='card-wrapper'>
          <Card {...panelBaseProps} title={'配置信息'} className='default_monitor'>
            <div className='header_'>

              <Radio.Group value={size} onChange={handleSizeChange}>
                <Radio.Button value="now-1h">近1小时</Radio.Button>
                <Radio.Button value="now-3h">近3小时</Radio.Button>
                <Radio.Button value="now-12h">近12小时</Radio.Button>
                <Radio.Button value="now-24h">近24小时</Radio.Button>
                <Radio.Button value="now-7d">近7天</Radio.Button>
                <Radio.Button value="now-30d">近30天</Radio.Button>
              </Radio.Group>

            </div>
            <div className='body_'>
              <div className='monitor_' >
                 <div className='monitor_title'>
                      <div className='title'>{'内存占用率'}</div>
                      <div className='icons'><PlusOutlined /><FullscreenOutlined  onClick={() => {
                           operateType.visual = true;
                           setOperateType(_.cloneDeep(operateType));
                       }}/> </div>
                </div>
                <Graph
                  url={'/api/n9e/proxy'}
                  datasourceValue={1}
                  title={'CPU占用率'}
                  promql={'cpu_usage_active'}
                  contentMaxHeight={200}
                  range={range}
                  setRange={(erang) => {
                    const newValue = {
                      start: isMathString(erang.start) ? parse(erang.start) : moment(erang.start),
                      end: isMathString(erang.end) ? parse(erang.end) : moment(erang.end),
                    }
                    setRange(newValue);
                  }}
                  step={12}
                  graphOperates={{
                    enabled: true
                  }}
                  refreshFlag={""}
                />
              </div>
              <div className='monitor_'>
                  <div className='monitor_title'>
                      <div className='title'>{'内存占用率'}</div>
                      <div className='icons'><PlusOutlined /><FullscreenOutlined  onClick={() => {
                        operateType.visual = true;
                        setOperateType(_.cloneDeep(operateType));
                        debugger;
                       }}/> </div>
                </div>
                <Graph
                  url={'/api/n9e/proxy'}
                  datasourceValue={1}
                  promql={'mem_available_percent'}
                  contentMaxHeight={200}
                  title={'内存占用率'}
                  range={range}
                  setRange={(erang) => {
                    const newValue = {
                      start: isMathString(erang.start) ? parse(erang.start) : moment(erang.start),
                      end: isMathString(erang.end) ? parse(erang.end) : moment(erang.end),
                    }
                    setRange(newValue);
                  }}
                  step={12}
                  graphOperates={{
                    enabled: true
                  }}
                  refreshFlag={refreshKey}
                />
              </div>
              <div className='monitor_'>
                <div className='monitor_title'>
                      <div className='title'>{'CPU占用率'}</div>
                      <div className='icons'><PlusOutlined /><FullscreenOutlined  onClick={() => {
                           operateType.visual = true;
                           setOperateType(_.cloneDeep(operateType));
                       }}/> </div>
                </div>
                <Graph
                  url={'/api/n9e/proxy'}
                  datasourceValue={1}
                  title={'CPU占用率'}
                  promql={'cpu_usage_active'}
                  contentMaxHeight={220}
                  range={range}
                  setRange={(erang) => {
                    const newValue = {
                      start: isMathString(erang.start) ? parse(erang.start) : moment(erang.start),
                      end: isMathString(erang.end) ? parse(erang.end) : moment(erang.end),
                    }
                    setRange(newValue);
                  }}
                  step={12}
                  graphOperates={{
                    enabled: true
                  }}
                  refreshFlag={""}
                />
              </div>
            </div>

          </Card>
        </div>
        <Modal
              visible={operateType.visual}
              title={operateType.title}
              confirmLoading={false}
              width={window.innerWidth*0.8}
              okButtonProps={{
                // danger: operateType === OperateType.RemoveBusi || operateType === OperateType.Delete,
              }}
              // okText={operateType === OperateType.RemoveBusi ? t('remove_busi.btn') : operateType === OperateType.Delete ? t('batch_delete.btn') : t('common:btn.ok')}
              onOk={submitForm}
              onCancel={() => {
                operateType.visual = false;
                setOperateType(_.cloneDeep(operateType));
                form.resetFields();
              }}
            >

              <Graph
                  url={'/api/n9e/proxy'}
                  datasourceValue={1}
                  title={'CPU占用率'}
                  promql={'cpu_usage_active'}
                  contentMaxHeight={220}
                  range={dialogRange}
                  setRange={(erang) => {
                    const newValue = {
                      start: isMathString(erang.start) ? parse(erang.start) : moment(erang.start),
                      end: isMathString(erang.end) ? parse(erang.end) : moment(erang.end),
                    }
                    setDialogRange(newValue);
                  }}
                  step={12}
                  graphOperates={{
                    enabled: true
                  }}
                  refreshFlag={""}
                />



              
            </Modal>
      </div>
    </Form>
  );
}
