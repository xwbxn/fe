import './style.less';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Image, Space, Radio, RadioChangeEvent, Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { CommonStateContext } from '@/App';
import { CheckCircleFilled, FullscreenOutlined, PlusOutlined } from '@ant-design/icons';
import Graph from '../Graph';
import _, { values } from 'lodash';
import { parse, isMathString } from '@/components/TimeRangePicker/utils';
import { TimeRangePickerWithRefresh, IRawTimeRange } from '@/components/TimeRangePicker';
import moment from 'moment';
enum ChartType {
  Line = 'line',
  StackArea = 'stackArea',
}
import { useLocation } from 'react-router-dom';
import { getXhMonitor, getXhMonitorByAssetId } from '@/services/manage';
import { getXhAsset } from '@/services/assets';
import queryString from 'query-string';
import { getAssetsIdents, getAssetsMonitor } from '@/services/assets';
import { time } from 'echarts';

export default function (props: { initialValues: object; initParams: object; mode?: string }) {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [identList, setIdentList] = useState<any>({});
  const [operateType, setOperateType] = useState<any>({
    visual: false,
    title: "指标名称"
  });
  const { search } = useLocation();
  const { id } = queryString.parse(search);
  const { action } = queryString.parse(search);
  const [monitor, setMonitor] = useState<any>({});
  const [selectMonitor, setSelectMonitor] = useState<any>({});
  const [monitors, setMonitors] = useState<any[]>([]);
  const [assetInfo, setAssetInfo] = useState<any>({});
  const [assetItems, setAssetItems] = useState<any[]>([]);

  const [form] = Form.useForm();
  const [range, setRange] = useState<any>({
    start: parse('now-1h'),//"2023-11-02 01:00:00",
    end: parse('now')//moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  });

  const [dialogRange, setDialogRange] = useState<any>({
    start: parse('now-1h'),//"2023-11-02 01:00:00",
    end: parse('now')//moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  });

  const [size, setSize] = useState<any>('now-1h');
  const [identName, setIdentName] = useState<any>('');
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));

  const panelBaseProps: any = {
    size: 'small',
    bodyStyle: { padding: '24px 124px 8px 124px' },
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    range.start = parse(e.target.value);
    setRange(range);
    console.log('handleSizeChange',e.target.value)
    setSize(e.target.value)
    console.log('handleSizeChange', range);
    setRefreshKey(_.uniqueId('refreshKey_'));
  };


  useEffect(() => {

    if (action == "asset" && id != null && id.length > 0 && id != "null") {
      //资产信息
      loadAssetInfo(id);
      //获取资产所有监控信息
      getXhMonitorByAssetId(id).then(({ dat }) => {
        setMonitors(dat)
      })
    }
    if (action == "monitor" && id != null && id.length > 0 && id != "null") {
      //探针信息
      getAssetsIdents().then((res) => {
        res.dat.map((v) => {
          identList[v.id]= v.ident          
        });
        setIdentList({...identList});
      });
      //获取当前监控信息
      getXhMonitor(id).then(({ dat }) => {
        if (dat != null) {
          setMonitor(dat);
          console.log("监控数据", dat);
          let config = dat["config"];
          delete dat["config"];
          if (config != null && config.length > 0) {
            let configJson = JSON.parse(config);
            dat = { ...configJson, ...dat };
          }
          //资产信息
          loadAssetInfo(dat.asset_id);
        }
      })
    }
  }, []);


  const loadAssetInfo = (id) => {
    getXhAsset("" + id).then(({ dat }) => {
      console.log(dat);
      let expands = dat.exps;
      let items = new Array()
      if (expands != null && expands.length > 0) {
        const map = new Map()
        expands.forEach((item, index, arr) => {
          if (!map.has(item.config_category)) {
            map.set(
              item.config_category,
              arr.filter(a => a.config_category == item.config_category)
            )
          }
        })
        //以上分组加载数据
        map.forEach(function (value, key) {
          const formDataMap = new Map()
          value.forEach((item, index, arr) => {
            if (!formDataMap.has(item.group_id)) {
              formDataMap.set(
                item.group_id,
                arr.filter(a => a.group_id == item.group_id)
              )
            }
          })
          let group: any = [];
          formDataMap.forEach(function (value, i) {
            let itemsChars = ""
            value.forEach((item, index, arr) => {
              itemsChars += "\"" + item.name + "\":\"" + item.value + "\",";
            })
            itemsChars = "{" + itemsChars.substring(0, itemsChars.length - 1) + "}";
            group.push(JSON.parse(itemsChars));
          })
          items.push(
            {
              type: key,
              items: group
            }
          );

        })
        delete dat.exps;
      }
      setAssetItems(items)
      setAssetInfo(dat);
      console.log("资产信息以及配置信息", dat);
    });
  }



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


  return (
    <Form
      name='asset'
      form={form}
      layout='vertical'
    >
      <div className='view-form' >
        <div className='card-wrapper'>
          <Card {...panelBaseProps} title={'基本信息'}>
            <div className='asset_info'>
              <div className='images' >
                {assetInfo.type}
              </div>
              <div className='info'>
                <Row gutter={10} className='row'>
                  <Col className='theme'><div>资产名称:</div>{assetInfo.name}</Col>
                  <Col className='theme'><div>资产类型：</div>{assetInfo.type}</Col>
                  <Col className='theme'><div>IP地址：</div>{assetInfo.ip}</Col>
                  <Col className='theme'><div>厂商：</div>{assetInfo.manufacturers}</Col>
                </Row>
                <Row gutter={10} className='row'>
                  <Col className='theme'><div>资产位置：</div>{assetInfo.position}</Col>
                  <Col className='theme'><div>状态：</div>{assetInfo.status == 1 ? '正常' : "下线"}</Col>
                  <Col></Col>
                </Row>
              </div>
            </div>
            {action === "monitor" && (
              <div className='monitor_info'>
                <div className='base'>
                  <Row gutter={10} className='row'>
                    <Col className='theme'><div>监控名称：</div>{monitor.monitoring_name}</Col>
                  </Row>
                  <Row gutter={10} className='row'>
                    <Col  className='theme'><div>采集器:</div>{identList[monitor.target_id]}</Col>
                  </Row>
                  <Row gutter={10} className='row'>
                    <Col  className='theme'><div>描述:{monitor.remark}</div>{monitor.remark}</Col>
                  </Row>
                </div>
                <div className='script'>
                  <div className='title'>监控脚本：</div>
                  <div className='content'>{monitor.monitoring_sql}</div>
                </div>

              </div>

            )}

            <div className='party_info'>
              {assetItems.length > 0 && assetItems.map((element, index) => {
                return (
                  <div className='assembly show_image'>
                    <div className='title'>{element.type.toUpperCase()}({element.items.length})</div>
                    <div className={'image ' + element.type}></div>
                    <div className='status'>状态：
                      {true ? (
                        <div>正常<CheckCircleFilled className='normal' /></div>
                      ) : (
                        <div>故障<CheckCircleFilled className='no_normal' /></div>
                      )}
                    </div>
                  </div>
                )

              })}
            </div>
          </Card>
        </div>
        <div className='card-wrapper'>
          <Card {...panelBaseProps} title={'配置信息'} className='default_monitor'>
            <div className='header_'>
              
              <Radio.Group value={size} onChange={handleSizeChange}>
                <Radio.Button value="now-1h" >近1小时</Radio.Button>
                <Radio.Button value="now-3h">近3小时</Radio.Button>
                <Radio.Button value="now-12h">近12小时</Radio.Button>
                <Radio.Button value="now-24h">近24小时</Radio.Button>
                <Radio.Button value="now-7d">近7天</Radio.Button>
                <Radio.Button value="now-30d">近30天</Radio.Button>
              </Radio.Group>
              <TimeRangePickerWithRefresh
                  // refreshTooltip={t('refresh_tip', { num: getStepByTimeAndStep(range, step) })}
                  onChange={value=>{
                    console.log(value)
                    const newValue = {
                      start: isMathString(value.start) ? parse(value.start) : moment(value.start),
                      end: isMathString(value.end) ? parse(value.end) : moment(value.end),
                    }
                    setRefreshKey(_.uniqueId('refreshKey_'));
                    setRange(newValue);                    
                  }}
                  value={range}
                  localKey = 'monitor-timeRangePicker-value'
             />


            </div>
            {action === "monitor" && (//当前监控展示
              <div className='monitor_body'>
                <div style={{ width: '100%' }} >
                  <div className='monitor_title'>
                    <div className='title'>{monitor.monitoring_name}</div>
                    <div className='icons'><PlusOutlined /><FullscreenOutlined onClick={() => {
                      operateType.visual = true;
                      setSelectMonitor(monitor);
                      setOperateType(_.cloneDeep(operateType));
                    }} /> </div>
                  </div>
                  <Graph
                    title={monitor.monitoring_name}
                    monitorId={parseInt(id + "")}
                    contentMaxHeight={200}
                    toolVisible={false}
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

              </div>
            )}
            {action === "asset" && (//当前监控展示
              <div className='group_monitor_body'>

                  {monitors.map((item, index) => (
                    <div className='every_graph'>
                      <div className='monitor_title'>
                        <div className='title'>{item.monitoring_name}</div>
                        <div className='icons'><PlusOutlined /><FullscreenOutlined onClick={() => {
                          operateType.visual = true;
                          setSelectMonitor(item);
                          setOperateType(_.cloneDeep(operateType));
                        }} /> </div>
                      </div>
                      <Graph
                        title={item.monitoring_name}
                        monitorId={parseInt(item.id + "")}
                        contentMaxHeight={200}
                        toolVisible={false}
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
                  ))}

              </div>


            )}
          </Card>
        </div>
        <Modal
              visible={operateType.visual}
              title={selectMonitor.monitoring_name}
              confirmLoading={false}
              width={window.innerWidth*0.8}
              okButtonProps={{
                // danger: operateType === OperateType.RemoveBusi || operateType === OperateType.Delete,
              }}
              // okText={operateType === OperateType.RemoveBusi ? t('remove_busi.btn') : operateType === OperateType.Delete ? t('batch_delete.btn') : t('common:btn.ok')}
              
              onCancel={() => {
                operateType.visual = false;
                setOperateType(_.cloneDeep(operateType));
                form.resetFields();
              }}
            >

              <Graph                  
                  title={selectMonitor.monitoring_name}
                  monitorId={parseInt(selectMonitor.id + "")}
                  contentMaxHeight={200}
                  range={dialogRange}
                  toolVisible={true}
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
                  refreshFlag={refreshKey}
                />
            </Modal>
      </div>
    </Form>
    
  );
}
