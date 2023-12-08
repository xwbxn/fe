import './style.less';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Image, Space, Radio, RadioChangeEvent, Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { CommonStateContext } from '@/App';
import { CheckCircleFilled, FullscreenOutlined, PlusOutlined } from '@ant-design/icons';
import Graph from '../Graph';
import _, { concat, random, values } from 'lodash';
import { parse, isMathString } from '@/components/TimeRangePicker/utils';
import { TimeRangePickerWithRefresh, IRawTimeRange } from '@/components/TimeRangePicker';
import moment from 'moment';
enum ChartType {
  Line = 'line',
  StackArea = 'stackArea',
}
import { factories, unitTypes } from '../../assetmgt/catalog';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { getXhMonitor, getXhMonitorByAssetId } from '@/services/manage';
import { getXhAsset } from '@/services/assets';
import queryString from 'query-string';
import { getAssetsIdents, getAssetsStypes } from '@/services/assets';
import { time } from 'echarts';
import { useToggle } from 'ahooks';

export default function (props: { initialValues: object; initParams: object; mode?: string }) {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [identList, setIdentList] = useState<any>({});

  const [itemButton, setItemButton] = useState<string>(localStorage.getItem("asset_item_ctr_button")?""+localStorage.getItem("asset_item_ctr_button"):"收起");
  const [monitorStatus, setMonitorStatus] = useState<boolean>(false);
  const [states, { set }] = useToggle(true)
  const [operateType, setOperateType] = useState<any>({
    visual: false,
    title: "指标名称"
  });
  const [accessories, setAccessories] = useState<any>({
    visual: false,
    title: "其他信息名称",
    label: "",
    name: "",
    items: [],
    properties: []
  });
  const [assetTypes, setAssetTypes] = useState<any[]>([]);
  const { search } = useLocation();
  const { id } = queryString.parse(search);
  const { action } = queryString.parse(search);
  const [monitor, setMonitor] = useState<any>({});
  const [selectMonitor, setSelectMonitor] = useState<any>({});
  const [monitors, setMonitors] = useState<any[]>([]);
  const [assetInfo, setAssetInfo] = useState<any>({});
  const [assetItems, setAssetItems] = useState<any[]>([]);
  const history = useHistory();
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
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    range.start = parse(e.target.value);
    setRange(range);
    console.log('handleSizeChange', e.target.value)
    setSize(e.target.value)
    console.log('handleSizeChange', range);
    setRefreshKey(_.uniqueId('refreshKey_'));
  };

  const getMonitorUnit = (id: any) => {
    let monitorUnit = localStorage.getItem("monitorUnit-" + id);
    return monitorUnit;
  }

  const genForm = (type: string, theme: string) => {
    const assetType: any = assetTypes.find((v) => v.name === type);
    let items = {};
    if (assetType) {
      //TODO：处理分组属性      
      let extra_props = assetType.extra_props;
      let map = new Map();
      for (let property in extra_props) {
        let group = extra_props[property];
        map.set(group.sort, property);
      }
      var arrayObj = Array.from(map);
      arrayObj.sort(function (a, b) { return a[0] - (b[0]) })

      for (var [key, value] of arrayObj) {
        let group = extra_props[value];
        if (group != null && theme == value && group.props) {
          let baseItems = new Array();
          let listItems = new Array();
          group.props.map((item, index) => {
            if (item.type === 'list') {
              item.items.forEach((element) => {
                listItems.push(element);
              });
            } else {
              baseItems.push(item);
            }
          });
          items = {
            name: value,
            label: group.label,
            base: baseItems,
            list: listItems,
          };
        }
      }
    }
    return items;
  };

  useEffect(() => {
    if (action == "asset" && id != null && id.length > 0 && id != "null") {
      //资产信息      
      getAssetsStypes().then((res) => {
        const types = res.dat.map((v) => {
          return {
            value: v.name,
            label: v.name,
            ...v,
          };
        });
        loadAssetInfo(id, types);
        setAssetTypes(types);

      });
      //获取资产所有监控信息
      getXhMonitorByAssetId(id).then(({ dat }) => {
        console.log("获取资产所有监控信息", dat);
        setMonitors(dat)
      })
    }
    if (action == "monitor" && id != null && id.length > 0 && id != "null") {

      //探针信息
      getAssetsIdents().then((res) => {
        res.dat.map((v) => {
          identList[v.id] = v.ident
        });
        setIdentList({ ...identList });
      });
      //获取当前监控信息
      getXhMonitor(id).then(({ dat }) => {
        if (dat != null) {
          setMonitor(dat);
          if (dat.status > 0) {
            setMonitorStatus(true);
          }
          let config = dat["config"];
          delete dat["config"];
          if (config != null && config.length > 0) {
            let configJson = JSON.parse(config);
            dat = { ...configJson, ...dat };
          }
          //资产信息
          getAssetsStypes().then((res) => {
            const types = res.dat.map((v) => {
              return {
                value: v.name,
                label: v.name,
                ...v,
              };
            });
            loadAssetInfo(dat.asset_id, types);
            setAssetTypes(types);
          });
        }
      })
    }
  }, [action]);


  const loadAssetInfo = (id, assetTypes) => {

    getXhAsset("" + id).then(({ dat }) => {
      console.log(dat);
      if (dat.status > 0) {
        setMonitorStatus(true)
      }

      let typeGroup = new Array();
      let expands = dat.exps;
      if (assetTypes != null) {
        const assetType: any = assetTypes.find((v) => v.name === dat.type);
        if (assetType) {
          //TODO：处理分组属性              
          let extra_props = assetType.extra_props;
          let map = new Map();
          for (let property in extra_props) {
            let group = extra_props[property];
            map.set(group.sort, property);
          }
          var arrayObj = Array.from(map);
          arrayObj.sort(function (a, b) { return a[0] - (b[0]) })
          for (var [key, value] of arrayObj) {
            let group = extra_props[value];
            if (group != null && group.props) {
              typeGroup.push({
                name: value,
                label: group.label
              });
            }
          }
        }
      }
      let typeValues = {};
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
          typeValues[key] = group;
        })
        delete dat.exps;
      }
      let everyTypeValues = new Array();
      typeGroup.forEach((type) => {
        if (typeValues[type.name]) {
          everyTypeValues.push({
            type: type.name,
            label: type.label,
            items: typeValues[type.name]
          })
        }
      })
      setAssetItems(everyTypeValues);
      console.log("everyTypeValues", everyTypeValues)
      setAssetInfo(dat);
      console.log("资产信息以及配置信息", dat);
    });
  }

  const loadImages = (cn_name) => {
    console.log("Loading images...", cn_name);
    let imageName = "/image/factory/other.png";
    for (let factor in factories) {
      let image = factories[factor]
      if (image.value == cn_name) {
        imageName = "/image/factory/" + image.key + ".png";
      }
    }
    return imageName;
  }


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
              <div className='image_name' >
                {assetInfo.manufacturers ? (
                  <img src={loadImages(assetInfo.manufacturers)} ></img>
                ) : (<div className='image_not'>没有厂商信息</div>)}
              </div>
              <div className='info'>
                <div className='row'>

                  <div className='theme1'>
                    <div className='title'>资产名称：</div>
                    <Link
                      to={{
                        pathname: '/xh/monitor/add',
                        search: `type=monitor&id=${assetInfo.id}&action=asset`,
                        hash: '#the-hash',
                      }}
                    >
                      {assetInfo.name}
                    </Link>
                  </div>
                  <div className='theme1'><div className='title'>资产类型：</div>{assetInfo.type}</div>
                  <div className='theme1'><div className='title'>IP地址：</div>{assetInfo.ip}</div>
                  <div className='theme1'><div className='title'>厂商：</div>{assetInfo.manufacturers}</div>
                </div>
                <div className='row'>
                  <div className='theme1'><div className='title'>资产位置：</div>{assetInfo.position}</div>
                  <div className='theme1'><div className='title'>状态：</div>{assetInfo.status == 1 ? '正常' : "下线"}</div>
                  <div className='theme1'></div>
                  <div className='theme1'></div>
                </div>
              </div>
            </div>
            {/* {action === "monitor" && (
              <div className='monitor_info'>
                <div className='base'>
                  <Row gutter={10} className='row'>
                    <Col className='theme1'><div>监控名称：</div>{monitor.monitoring_name}</Col>
                  </Row>
                  <Row gutter={10} className='row'>
                    <Col className='theme1'><div>采集器:</div>{identList[monitor.target_id]}</Col>
                  </Row>
                  <Row gutter={10} className='row'>
                    <Col className='theme1'><div>描述:{monitor.remark}</div>{monitor.remark}</Col>
                  </Row>
                </div>
                <div className='script'>
                  <div className='title'>监控脚本：</div>
                  <div className='content1'>{monitor.monitoring_sql}</div>
                </div>

              </div>

            )} */}
            {/* {action === "asset" && ( */}
            <div className='party_info'>
              <div className='asset_item_ctr_button' onClick={e => {
                if (itemButton == "收起") {
                  localStorage.setItem("asset_item_ctr_button","展开");
                  setItemButton("展开")
                } else {
                  localStorage.setItem("asset_item_ctr_button","收起");
                  setItemButton("收起")
                }
              }}>{itemButton}</div>
              {itemButton == "收起" && (
                <div className='party_show'>
                {
                  assetItems.length > 0 && assetItems.map((element, index) => {
                    return (
                      <div className='assembly show_image' onClick={e => {
                        let formItems: any = genForm(assetInfo.type, element.type);
                        setAccessories({
                          visual: true,
                          label: formItems.label,
                          title: element.label,
                          name: formItems.name,
                          items: element.items,
                          properties: formItems.list
                        })
                      }}>
                        <div className='title'>{element.label}({element.items.length})</div>
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

                  })
                }
                </div>             
              )}

            </div>
            {/* )} */}
          </Card>
        </div>
        <div className='card-wrapper'>
          <Card {...panelBaseProps} title={'监控图表'} className='default_monitor'>
            {monitorStatus && (
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
                  onChange={value => {
                    const newValue = {
                      start: isMathString(value.start) ? parse(value.start) : moment(value.start),
                      end: isMathString(value.end) ? parse(value.end) : moment(value.end),
                    }
                    setRefreshKey(_.uniqueId('refreshKey_'));
                    setRange(newValue);
                  }}
                  value={range}
                  localKey='monitor-timeRangePicker-value'
                />

              </div>
            )}

            {action === "monitor" && (//当前监控展示
              <>
                {monitor.status > 0 ? (

                  <div className='monitor_body'>
                    <div style={{ width: '100%' }} >
                      <div className='monitor_title'>
                        <div className='title'>{monitor.monitoring_name}
                          {monitor.unit && (
                            <>(<span style={{ marginLeft: '0px', color: '#1367D8' }}>单位：{getMonitorUnit(id)}</span>)</>
                          )
                          }</div>
                        <div className='icons'><PlusOutlined /><FullscreenOutlined onClick={() => {
                          operateType.visual = true;
                          setSelectMonitor(monitor);
                          setOperateType(_.cloneDeep(operateType));
                        }} /> </div>
                      </div>
                      <Graph
                        title={monitor.monitoring_name + "(单位:" + monitor.unit + ")"}
                        monitorId={parseInt(id + "")}
                        contentMaxHeight={200}
                        toolVisible={false}
                        unit={monitor.unit}
                        label={monitor.label}
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


                ) : (
                  <div>
                    <div className="no_monitor">未启动监控</div>
                  </div>
                )}
              </>

            )}
            {action === "asset" && (//当前监控展示
              <>
                {monitorStatus ? (
                  <div className='group_monitor_body'>
                    {monitors.map((item, index) => (
                      <div className='every_graph'>
                        <div className='monitor_title'>
                          <div className='title'>{item.monitoring_name}
                            {item.unit && (
                              <> (<span style={{ marginLeft: '0px', color: '#1367D8' }}>单位:{getMonitorUnit(item.id)}</span>)</>
                            )
                            }
                          </div>
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
                          unit={item.unit}
                          range={range}
                          label={item.label}
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
                ) : (
                  <div>
                    <div className="no_monitor">设备已离线</div>
                  </div>
                )}
              </>

            )}
          </Card>
        </div>
        <Modal
          visible={operateType.visual}
          title={selectMonitor.monitoring_name + " (单位：" + getMonitorUnit(selectMonitor.id) + ")"}
          confirmLoading={false}
          width={window.innerWidth * 0.8}
          okButtonProps={{
            onClick: () => {
              operateType.visual = false;
              setOperateType(_.cloneDeep(operateType));
              form.resetFields();
            }
          }}
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
            label={selectMonitor.label}
            unit={selectMonitor.unit}
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
        <Modal
          visible={accessories.visual}
          title={accessories.title}
          confirmLoading={false}
          className='accessories_modal'
          mask={true}
          width={(400 * accessories.items.length) + 'px'}
          // okButtonProps={{
          // }}
          onCancel={() => {
            accessories.visual = false;
            setAccessories(_.cloneDeep(accessories));
          }}
        >
          <div className='accessories_body'>
            {accessories.items.map((item, pos) => {
              return <div className='accessories_every_group show_image'>
                <div className='title' style={{ fontWeight: '600' }}>{accessories.label.toUpperCase()}({pos + 1})</div>
                <div className={'image ' + accessories.name} style={{ marginLeft: '20%' }}></div>
                <div className='status' style={{ display: 'flex', margin: '0 auto' }}>状态：
                  {true ? (
                    <div>正常<CheckCircleFilled className='normal' /></div>
                  ) : (
                    <div>故障<CheckCircleFilled className='no_normal' /></div>
                  )}
                </div>
                <div className='properties'>
                  {
                    accessories.properties.map((property, index) => {
                      return <>
                        <div className='accessories' key={"_div" + index}>
                          <div className='title' title={property.label}>{property.label}:</div><div className='content' title={item[property.name]}>{item[property.name]}</div>
                        </div>

                      </>
                    })}
                </div>
              </div>

            })}
          </div>
        </Modal>
      </div>
    </Form>

  );
}
