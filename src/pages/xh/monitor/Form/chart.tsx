import './style.less';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Image, Space, Radio, RadioChangeEvent } from 'antd';
import { useTranslation } from 'react-i18next';
import { CommonStateContext } from '@/App';
import { CheckCircleFilled, FullscreenOutlined, PlusOutlined } from '@ant-design/icons';
import Graph from '../Graph';
import _ from 'lodash';
import { parse,isMathString } from '@/components/TimeRangePicker/utils';
import moment from 'moment';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
enum ChartType {
  Line = 'line',
  StackArea = 'stackArea',
}
import { useLocation } from 'react-router-dom';
import { getXhMonitor} from '@/services/manage';
import { getXhAsset } from '@/services/assets';
import queryString from 'query-string';
import {getAssetsIdents,getAssetsMonitor } from '@/services/assets';

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
  const { search } = useLocation();
  const { id } = queryString.parse(search);
  const [monitor, setMonitor] = useState<any>({});
  const [assetInfo,setAssetInfo] = useState<any>({});
  const [assetItems,setAssetItems] = useState<any[]>([]);

  const [params, setParams] = useState<{ label: string; name: string; editable?: boolean; password?: boolean; items?: [] }[]>([]);
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [range, setRange] = useState<any>({
    start: parse('now-1h'),//"2023-11-02 01:00:00",
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
    getAssetsIdents().then((res) => {
      const items = res.dat.map((v) => {
        return {
          value: v.id,
          label: v.ident,
        };
      });
      setIdentList(items);
    });
    if(id!=null && id.length>0 && id!="null"){
      getXhMonitor(id).then(({dat})=>{
        if(dat!=null){
          setMonitor(dat);
          console.log("监控数据",dat);
          let config = dat["config"];
          delete dat["config"];
          if(config!=null && config.length>0){
            let configJson = JSON.parse(config);
            dat = {...configJson,...dat};
          }
          loadAssetInfo(dat.asset_id);
        }
      })
    }

  }, []);


  const loadAssetInfo =(id) => {
    if (id != null) {
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
                type:key,
                items:group                 
              }
            );
            
          })
          delete dat.exps;
        }
        setAssetItems(items)   
        setAssetInfo(dat); 
        console.log("资产数据",dat);
      });
    }
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
              <div className='images'>
                <Image
                  width={120}
                  height={60}
                  src="error"
                />
              </div>
              <div className='info'>
                <Row gutter={10} className='row'>
                  <Col>资产名称：{assetInfo.name}</Col>
                  <Col>资产类型：{assetInfo.type}</Col>
                  <Col>IP地址：{assetInfo.ip}</Col>
                  <Col>厂商：{assetInfo.manufacturers}</Col>
                </Row>
                <Row gutter={10} className='row'>
                  <Col>资产位置：{assetInfo.position}</Col>
                  <Col>监控配置：</Col>
                  <Col>状态：{assetInfo.status==1?'正常':"下线"}</Col>
                  <Col></Col>
                </Row>
              </div>


            </div>
            <div className='monitor_info'>
              <div className='base'>
                <Row gutter={10} className='row'>
                  <Col>监控名称：{monitor.monitoring_name}</Col>
                </Row>
                <Row gutter={10} className='row'>
                  <Col>采集器:{monitor.target_id}</Col>
                </Row>
                <Row gutter={10} className='row'>
                  <Col>描述:{monitor.remark}<CheckCircleFilled /></Col>
                </Row>
              </div>
              <div className='script'>
                <div className='title'>监控脚本：</div>
                <div className='content'>{monitor.monitoring_sql}</div>
              </div>

            </div>
            <div className='party_info'>

               {assetItems.length > 0 &&  assetItems.map((element,index) => {
                  return (
                    <div className='assembly show_image'>
                    <div className='title'>{element.type.toUpperCase()}({element.items.length})</div>
                    <div className= {'image '+element.type}></div>
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

            </div>
            <div className='body_'>
              <div  style={{width:'100%'}} >
                 <div className='monitor_title1'>
                      <div className='icons'><PlusOutlined /><FullscreenOutlined  onClick={() => {
                           operateType.visual = true;
                           setOperateType(_.cloneDeep(operateType));
                       }}/> </div>
                </div>
                <Graph
                  title={monitor.monitoring_name}
                  monitorId={parseInt(id+"")}  
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
              
            </div>

          </Card>
        </div>
      </div>
    </Form>
  );
}
