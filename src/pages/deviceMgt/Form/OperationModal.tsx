import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Button,Checkbox, Col, DatePicker, Form, Input, Modal, Radio, Row, Select, Table, Tag, Tooltip, Tree, TreeSelect, Upload, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { CommonStateContext } from '@/App';
import { getDictValueEnum } from '@/services/system/dict';
import { exportAssetTemplet, exportTemplet, importAssetSetData,importtAssets, batchUpdateByProperties,insertDeviceOnline } from '@/services/assets/asset';
import { OperateType } from './operate_type';
import Icon from '@ant-design/icons';
import Qrcode from 'qrcode.react';
import moment from 'moment';
import JSZip from 'jszip';
import { saveAs } from "file-saver";
import { getRoomList } from '@/services/assets/computer-room';
import { getUsers } from '@/services/account';
import { getOrganizationTree,getOrganizationsByIds } from '@/services/assets';
import { updateAssetCategoryInAsset ,getAssetTreeBelongId} from '@/services/assets/asset-tree';

import { getAssetsTree } from '@/services/assets/asset';
import { TreeNode } from 'antd/lib/tree-select';
const CheckboxGroup = Checkbox.Group;
import { getCabinetList } from '@/services/assets/device-cabinet';



//请求的参数 【页面宽度，操作，操作类型，初始化数据，刷新页面动作，主题】
export const OperationModal = ({ width,operateType, setOperateType, initData, reloadList,theme }) => {
  const [typeId, setTypeId] = useState<string>()
  const { t } = useTranslation('assets');
  const { busiGroups } = useContext(CommonStateContext);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any>([]);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const detailProp = operateType === OperateType.UnbindTag ? tagsList : busiGroups;
  const [fileName, setFileName] = useState<string>();
  const [buttonTitle, setButtonTitle] = useState<string>("确认");
  const [optionMap, setOptionMap] = useState({});  
  const [offlineOptions, setOfflineOptions] = useState<any[]>();
  const [treeData, setTreeData] = useState([]);
  const [offlineTreeData, setOfflineTreeData] = useState([]);
  const [transferId, setTransferId] = useState<number[]>([]);
  const [renderDataMap, setRenderDataMap] = useState({});  
  const [selectOptionData,setSelectOptionData] = useState({})
  const [selectedKeys,setSelectedKeys] = useState<any[]>();
  const [info, setInfo] = useState(null);
  let updateData = new Map()

  // let selectOptionData = new Map()

  const style ={
    style1:{
       width: "150px",
    }
  }

  const props = {
    showUploadList: false,
    onRemove: file => {
      setFileList([])
    },
    beforeUpload: file => {
      // console.log(file)
      let { name } = file;
      var fileExtension = name.substring(name.lastIndexOf('.') + 1);//截取文件后缀名
      setFileName(name);
      let newList = new Array();
      newList.push(file)
      fileList.concat(...newList);
      setFileList(newList)
      return false;
    },
    fileList,
  };
  useEffect(() => {
    console.log("initData",initData)
    if(operateType === OperateType.SelectUseStorage){
      
    }else if (operateType === OperateType.AssetBatchImport) {
      let title = "数据导入";
      setButtonTitle(title)
    } else if (operateType === OperateType.CreatedCode) {
      setButtonTitle("批量下载")
    } else if (operateType === OperateType.ChangeResponsible) {
      getUsers().then(({ dat }) => {
        var userList = new Array()
        dat.forEach((item) => {
          userList.push({
            value: item.nickname,
            label: item.nickname
          })
        })
        optionMap["system_users"] = userList;
        setOptionMap({ ...optionMap })
      });
    } else if (operateType === OperateType.ChangeOrganize) {
      getOrganizationTree({}).then(({ dat }) => {
        optionMap["organs"] = dat;
        setOptionMap({ ...optionMap })
      });

    } else if (operateType === OperateType.ChangeRoom) {
      getRoomList({}).then(({ dat }) => {
        var roomList = new Array()
        dat.list.forEach((item) => {
          roomList.push({
            value: item.id,
            label: item.room_name,
          });
        })
        optionMap["rooms"] = roomList;
        setOptionMap({ ...optionMap })
      });
    } else if (operateType === OperateType.ChangeCatalog) {
      getAssetsTree(1).then(res => {
        setTreeData(res.dat);

      })
    }else if (operateType === OperateType.Online) {
      getRoomList({}).then(({ dat }) => {
        var roomList = new Array()
        dat.list.forEach((item) => {
          roomList.push({
            value: item.id,
            label: item.room_name,
          });
        })
        optionMap["rooms"] = roomList;
        setOptionMap({ ...optionMap })
        getAssetsTree(2).then(res => {      
          setTreeData(res.dat);
        })
      });
      initData.forEach((item,index)=>{
        getCabinetList(item.equipment_room).then(({ dat }) => {
          let cabinetList = new Array()
          dat.forEach((item) => {
            cabinetList.push({
              value: item.id,
              label: item.cabinet_code
            });
          })
          selectOptionData["cabinet_"+index] = cabinetList;
          setSelectOptionData({...selectOptionData});      
        });
      });
    } else if (operateType === OperateType.Offline) {
      console.log("OperateType.Offline")
      getDictValueEnum('offline_release_status').then((data:[]) => {        
           setOfflineOptions(data);
      });
     
      
      getAssetsTree(3).then(res => {  
        console.log("查询下线的树   ")   
        setOfflineTreeData(res.dat);
      })
      
      
      
    } else {
      setButtonTitle("确认")
    }


  }, [operateType])


  const renderTree = (data) => {
    console.log('树形菜单数据源', data);
    return data.map(item => {
      if (!item.children && item.type != "asset") {
        return (
          <TreeNode title={item.name} key={item.id} value={''} />
        )
      } else {
        return (
          <TreeNode title={item.name} key={item.id} value={''}>
            {renderTree(item.children)}
          </TreeNode>
        )
      }
    })

  };


  const catalogNodeRender = (node) => {
    // console.log(node)
    if (node.type != "asset") {
      return (
        <div>
          <Radio
            style={{ width: '200px' }}
            name={"nodeName"}
            value={node.id}
          >{node.name}</Radio>
        </div>
      );
    } else {
      return (
        <div> {node.name}</div>
      )
    }
  };

  //选择树节点
  const onSelect = (selectedKeys: React.Key[], info:any) => {
    console.log("selectedKeys",selectedKeys);
    if(info.node.type=="asset"){
      setInfo(info.node);
    }else{
      setInfo(null);
    }
    
};
////////////////////////////////
  const addScrapDetail = () => {



  }
//选择存储页面
  const selectUseStorageDetail = () => {
    return {
      operateTitle: '选择存储',
      isFormItem: true,
      render() {
        return (
          <Form.Item rules={[{ required: true, message: '请选择'}]}>
            <Tree
              showLine={true}
              showIcon={true}
              style={{marginTop:0}} 
              defaultExpandAll={false}
              fieldNames={{ key: 'id', title: 'name' }}
              onSelect={onSelect}
              treeData={initData}
            />
          </Form.Item>
        );
      },
    };
  };

  //生成二维码操作页面
  const createdCodeDetail = () => {
    return {
      isFormItem: true,
      render() {
        return (
          <div style={{display:'flex'}}>
            {initData.map((item)=>{              
              return (
                <div style={{display:"inline-grid"}} key={"asset_"+item.id}> 
                <Qrcode
                 renderAs="canvas"                 
                 style={{marginRight:"16px"}}
                 className="qrcode"
                //  name={item.device_name+"_"+item.id}
                 value={JSON.stringify(item)}
                ></Qrcode>
                <span style={{width:"100%",textAlign:'center'}}>{item.device_name}</span>
                </div>
                
              )
            })}
           
          </div>
        )
      }
    }
  }
  //批量导入网络配置页面
  const netConfigImportDetail = () => {
    return {
      isFormItem: true,
      operateTitle: t('数据导入'),
      render() {
        return (

          <Form.Item label="选择文件" name="file" rules={[{ required: true }]}>
            <div key={Math.random()} style={{ display: 'inline-flex', gap: '8px' }}>
              <Input value={fileName}></Input>
              <Upload {...props}>
                <Button type="primary">
                  <Icon type="upload" />浏览
                </Button>
              </Upload>
              <Button className='down_load_button'
                onClick={async event => {
                  console.log(theme, "updating    update...");
                  let url = "/api/n9e/asset-expansion/netconfig/templet";
                  let params = {};
                  let exportTitle = "网络配置";
                  exportTemplet(url, params).then((res) => {
                    const url = window.URL.createObjectURL(new Blob([res],
                      // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式                          
                      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                    const link = document.createElement('a');
                    link.href = url;
                    const fileName = exportTitle + "导入模板_" + moment().format('MMDDHHmmss') + ".xls" //decodeURI(res.headers['filename']);
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                  });
                }}
                style={{ border: '0px solid #fff', fontSize: '14px', color: "#40A2EC" }}>下载模板</Button>

            </div>
          </Form.Item>
        );
      },
    };

  }
  //批量导入设备页面
  const assetBatchImportDetail = () => {
    return {
      isFormItem: true,
      operateTitle: t('数据导入'),
      render() {
        return (

          <Form.Item label="选择文件" name="file" rules={[{ required: true }]}>
            <div key={Math.random()} style={{ display: 'inline-flex', gap: '8px' }}>
              <Input value={fileName} style={style.style1}></Input>
              <Upload {...props}>
                <Button type="primary">
                  <Icon type="upload" />浏览
                </Button>
              </Upload>
              <Button className='down_load_button'
                onClick={async event => {
                  console.log(theme, "updating    update...");
                  let url = "/api/n9e/asset-basic/templet";
                  let params = {};
                  let exportTitle = "资产";
                  exportTemplet(url, params).then((res) => {
                    const url = window.URL.createObjectURL(new Blob([res],
                      // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式                          
                      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                    const link = document.createElement('a');
                    link.href = url;
                    const fileName = exportTitle + "导入模板_" + moment().format('MMDDHHmmss') + ".xls" //decodeURI(res.headers['filename']);
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                  });
                }}
                style={{ border: '0px solid #fff', fontSize: '14px', color: "#40A2EC" }}>下载模板</Button>

            </div>
          </Form.Item>
        );
      },
    };

  }
  //批量导入设备页面
  const assetSetBatchImportDetail = () => {
    return {
      isFormItem: true,
      operateTitle: t('数据导入'),
      render() {
        return (

          <Form.Item label="选择文件" name="file" rules={[{ required: true }]}>
            <div key={Math.random()} style={{ display: 'inline-flex', gap: '8px' }}>
              <Input value={fileName}  style={style.style1}></Input>
              <Upload {...props}>
                <Button type="primary">
                  <Icon type="upload" />浏览
                </Button>
              </Upload>
              <Button className='down_load_button'
                onClick={async event => {
                  console.log(theme, "updating    update...");
                  let url = "/api/n9e/asset-basic/templet";
                  let params = {};
                  let exportTitle = "资产";
                  if (theme.businessId == "device_model_set") {
                    url = "/api/n9e/device-model/templet";
                    exportTitle = "设备型号"
                  } else if (theme.businessId == "producer_set") {
                    url = "/api/n9e/device-producer/templet";
                    exportTitle = theme.title;
                    params["type"] = theme.key;
                  } else if (theme.businessId == "device-cabinet") {
                    url = "/api/n9e/device-cabinet/templet";
                    exportTitle = theme.title;
                  }
                  exportTemplet(url, params).then((res) => {
                    const url = window.URL.createObjectURL(new Blob([res],
                      // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式                          
                      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                    const link = document.createElement('a');
                    link.href = url;
                    const fileName = exportTitle + "导入模板_" + moment().format('MMDDHHmmss') + ".xls" //decodeURI(res.headers['filename']);
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                  });
                }}
                style={{ border: '0px solid #fff', fontSize: '14px', color: "#40A2EC" }}>下载模板</Button>

            </div>
          </Form.Item>
        );
      },
    };

  }
  //修改责任人页面
  const changeResponsibleDetail = () => {
    console.log('changeResponsibleDetail', initData)
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'device_name',
        key: 'device_name',
      },
      {
        title: '序列号',
        dataIndex: 'serial_number',
        key: 'serial_number',
      },
      {
        title: '管理IP',
        dataIndex: 'management_ip',
        key: 'management_ip',
      },
      {
        title: '责任人1',
        dataIndex: 'device_manager_one',
        key: 'device_manager_one',
      },
      {
        title: '业务责任人1',
        dataIndex: 'business_manager_one',
        key: 'business_manager_one',
      },
    ];
    return {
      operateTitle: t('需要修改责任人信息的设备'),
      isFormItem: true,
      render() {
        return (
          <>
            <Form.Item key={"T-List"}>
              <Table style={{ width: '100%' }} key="T-device_manager" pagination={false} rowKey={"id"} dataSource={initData} columns={columns} />
            </Form.Item>
            <Row key={"Row-1"}>
              <Col span={12}>
                <Form.Item key={"K-device_manager_one"} label="责任人1" name={'device_manager_one'} label-width="110px">
                  <Select options={optionMap["system_users"]}></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item key={"K-device_manager_two"} label="责任人2" name={'device_manager_two'} label-width="110px">
                  <Select options={optionMap["system_users"]}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row key={"Row-2"}>
              <Col span={12}>
                <Form.Item key={"K-business_manager_one"} label="业务责任人1" name={'business_manager_one'} label-width="110px">
                  <Select options={optionMap["system_users"]}></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item key={"K-business_manager_two"} label="业务责任人2" name={'business_manager_two'} label-width="110px">
                  <Select options={optionMap["system_users"]}></Select>
                </Form.Item>
              </Col>
            </Row>
          </>


        );
      },
    };


  }
  //选择设备类型页面
  const selectDeviceTypeDetail = () => {
    return {
      operateTitle: t('选择设备类型'),
      isFormItem: true,
      render() {
        return (
          <Form.Item rules={[{ required: true, message: t('请选择') }]} >
            <Select
              placeholder="选择设备类型"
              optionFilterProp="children"
              onChange={onChange}
              options={initData}
            />

          </Form.Item>
        );
      },
    };
  };
  //修改所属组织
  const changeOrganizeDetail = () => {
    
    let ids = new Array<string>();
    initData.forEach((item)=>{
      ids.push(item.affiliated_organization);
    });
    console.log("changeOrganizeDetail");
    getOrganizationsByIds(ids).then(({dat}) => {
         dat.forEach(item => {
          renderDataMap["organ_"+item.id] = item.name;
         });
         setRenderDataMap({...renderDataMap});
    })

    const columns = [
      {
        title: '设备名称',
        dataIndex: 'device_name',
        key: 'device_name',
      },
      {
        title: '序列号',
        dataIndex: 'serial_number',
        key: 'serial_number',
      },
      {
        title: '管理IP',
        dataIndex: 'management_ip',
        key: 'management_ip',
      },
      {
        title: '所属组织',
        dataIndex: 'affiliated_organization',
        key: 'affiliated_organization',
        render(val) {
          return renderDataMap["organ_"+val];
        }
      }
    ];
    return {
      operateTitle: t('需要修改所属组织信息的设备'),
      isFormItem: true,
      render() {
        return (
          <>
            <Form.Item>
              <Table style={{ width: '100%' }} pagination={false} rowKey={"id"} dataSource={initData} columns={columns} />
            </Form.Item>
            <Form.Item label="所属机构" name={'affiliated_organization'} labelCol={{ span: 2 }}>
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder={`请输入所属机构`}
                allowClear
                treeDataSimpleMode
                filterTreeNode
                treeData={optionMap["organs"]}
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                treeDefaultExpandAll={true}
              ></TreeSelect>
            </Form.Item>

          </>


        );
      },
    };


  }
  //修改所在机房
  const changeRoomDetail = () => {
    
     
    let ids = new Array<string>();
    initData?.forEach((item)=>{
      ids.push(item.equipment_room);
    });
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'device_name',
        key: 'device_name',
      },
      {
        title: '序列号',
        dataIndex: 'serial_number',
        key: 'serial_number',
      },
      {
        title: '管理IP',
        dataIndex: 'management_ip',
        key: 'management_ip',
      },
      {
        title: '所在机房位置',
        dataIndex: 'equipment_room',
        key: 'equipment_room',
        render(val) {
          let name = val;
          optionMap["rooms"]?.forEach(option => {
            if(option.value==val){
              name = option.label;
            } 
          });
          return name;
        }
      }
    ];
    return {
      operateTitle: t('需要修改所在机房的设备'),
      isFormItem: true,
      render() {
        return (
          <>
            <Form.Item>
              <Table style={{ width: '100%' }} key="T-device_manager" pagination={false} rowKey={"id"} dataSource={initData} columns={columns} />
            </Form.Item>
            <Form.Item label="机房" name={'equipment_room'} labelCol={{ span: 2 }}>
              <Select options={optionMap["rooms"]}></Select>
            </Form.Item>

          </>


        );
      },
    };


  }
  
  //设备上线
  const onlineDetail = () => {
    updateData = new Map();    
    
    console.log("onlineDetail",optionMap["rooms"])
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'device_name',
        key: 'device_name',
      },
      {
        title: '序列号',
        dataIndex: 'serial_number',
        key: 'serial_number',
      },
      {
        title: '厂商',
        dataIndex: 'serial_number',
        key: 'serial_number',
      },
      {
        title: 'IP',
        dataIndex: 'management_ip',
        key: 'management_ip',
        render: (val,record,index) => {
          return <Input name='management_ip' style={{width:"100px"}} defaultValue={val}
                onChange={(e) => {
                    let row = record;
                    if(updateData.has("rows"+index)) {
                      row = updateData.get("rows"+index)
                    }
                    if (row) {
                      row.management_ip=e.target.value;
                    }                    
                    updateData.set("rows"+index,row);
                }}
          />
        }
      },
      {
          title: '分配所在位置',
          render: (val,record,index) => {
            return <div style={{display:'inline-flex'}}>
               <Select defaultValue={record.equipment_room}
                optionFilterProp="children"
                placeholder="请选择机房"
                onChange={(e) => {
                     let row:any =record;
                     if(updateData.has("rows"+index)) {
                        row = updateData.get("rows"+index)
                     }
                     if (row) {
                        row.equipment_room=e;
                     }                    
                     updateData.set("rows"+index,row);
                     getCabinetList(e).then(({ dat }) => { 
                        let cabinetList = new Array()
                        dat.forEach((item) => {
                          cabinetList.push({
                            value: item.id,
                            label: item.cabinet_code
                          });
                        })
                        selectOptionData["cabinet_"+index] = cabinetList;
                        setSelectOptionData({...selectOptionData});                      
                    });
                }}
                options={optionMap["rooms"]}
               />

              <Select defaultValue={record.cabinet_location}
                optionFilterProp="children"
                placeholder="请选择机柜"
                onChange={(e) => {
                  let row:any = record;
                    if(updateData.has("rows"+index)) {
                      row = updateData.get("rows"+index)
                    }
                    if (row) {
                      row.cabinet_location=e;
                    }                    
                    updateData.set("rows"+index,row);
                }}
                options={selectOptionData["cabinet_"+index]}
              />             
              
              <Input name='u_number' style={{width:"80px"}} defaultValue={record.u_number}
                onChange={(e) => {
                let row:any = record;
                if(updateData.has("rows"+index)) {
                  row = updateData.get("rows"+index)
                }
                if (row) {
                  row.u_number= parseInt(e.target.value);
                }                    
                updateData.set("rows"+index,row);
              }}
              /><div style={{lineHeight:'30px'}}>U</div>
             <Select
                optionFilterProp="children"
                placeholder="请选择并列"
                onChange={(e) => {
                   let row:any  = record;
                    if(updateData.has("rows"+index)) {
                      row = updateData.get("rows"+index)
                    }
                    if (row) {
                      row.equipment_room=e;
                    }                    
                    updateData.set("rows"+index,row);
                }}
                options={[{value:1,label:1},{value:2,label:2},{value:3,label:3}]}
              />  
            
            </div>
          }
      },
      {
        title: '分配业务',
        render: (val,record,index) => {
          return <Select
              optionFilterProp="children"
              placeholder="选择分配业务"
              options={[]}
          />
        }
      },
      {
        title: '选择上线目录',
        render: (val,record,index) => {
           return ( 
            <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder={`请选择上线目录`}
                allowClear
                treeDataSimpleMode
                onSelect={e=>{
                  let row:any = record;
                  if(updateData.has("rows"+index)) {
                      row = updateData.get("rows"+index)
                  }
                  if (row) {
                    row.directory=e;
                  }                    
                  updateData.set("rows"+index,row);
                }}
                filterTreeNode
                treeData={treeData}
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                treeDefaultExpandAll={true}
              ></TreeSelect>
          )
        }
      }
    ];
    return {
      operateTitle: t('需要修改要上线的设备'),
      isFormItem: true,
      render() {
        return (
          <>
            <Form.Item>
              <Table style={{ width: '100%' }} pagination={false} rowKey={"id"} dataSource={initData} columns={columns} />
            </Form.Item>
            <Form.Item label="上线说明" name={'description'} labelCol={{ span: 2 }}>
               <Input.TextArea></Input.TextArea>
            </Form.Item>

          </>


        );
      },
    };


  }
  const titleRender = (node) => {
    // console.log(node);
    if(node.management_ip!=null && node.management_ip.length>0  &&  node.type=='asset'){
      node.name = node.management_ip;
    }else if( (node.name ==null || node.name=='') && node.type=='asset'){
      node.name = node.serial_number
    }         
    return (
      <div style={{ position: 'relative', width: '100%' }}>
          <span>{node.name}</span>
           <span style={{ position: 'absolute', right: 5 }}>           
        </span>
      </div>
    );
};
  //设备下线
  const offlineDetail = () => {
    console.log('offlineDetail------------------------')
    return {
      operateTitle: t('编辑要下线的设备信息'),
      isFormItem: true,
      render() {
        
        return (
          <>
            <Row key={"Row-2"}>
              <Col span={24}>
                <Form.Item key={"k2_tree"} name={'asset_id'} label-width="110px">
                  <Tree
                    checkable
                    showLine
                    fieldNames={{ title: 'name', key: 'id', children: 'children' }}
                    treeData={initData["init_tree_data"]}
                    titleRender={titleRender}
                    defaultCheckedKeys={initData["init_catalog_id"]}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item key={"K-one1"} name='description' label="下线说明" label-width="110px"  >
                   <TextArea style={{marginLeft:'-100px'}}></TextArea>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item key={"K-two2"} rules={[{ required: true, message: `选择下线日期` }]} name='device_time' label="下线日期" label-width="110px">
                   <DatePicker />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item key={"K-three3"} name='line_directory' rules={[{ required: true, message: `选择下线目录` }]} label="选择下线目录" label-width="110px">
                 <TreeSelect
                    key={"parent_id"}
                    style={{ width: '100%' }}
                    placeholder="请选择下线目录"
                    onChange={onTreeNodeChange}
                    treeDefaultExpandAll
                    fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                    treeData={offlineTreeData}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item key={"K-four4"} name='resource_free' label="释放资源" rules={[{ required: true, message: `选择释放资源` }]}  label-width="110px">
                    <CheckboxGroup style={{marginLeft:'-100px'}} options={offlineOptions}  />  
                </Form.Item>
              </Col>
            </Row>

          </>


        );
      },
    };


  }
  //设备迁移
  const changeCatalogDetail = () => {
    return {
      operateTitle: t('选择要迁移的设备'),
      isFormItem: true,
      render() {
        return (
          <>
            <Row key={"Row-2"}>
              <Col span={12}>
                <Form.Item key={"k2_tree"} name={'asset_id'} label-width="110px">
                  <Tree
                    checkable
                    onCheck={(checked, info) => {
                      let ids = new Array()
                      if (info.checkedNodes.length > 0) {
                        info.checkedNodes.forEach(item => {
                          if (item["type"] === "asset") {
                            ids.push(item["id"]);
                          }
                        })
                        setTransferId(ids)
                      } else {
                        setTransferId([]);
                      }
                    }}
                    showLine
                    fieldNames={{ title: 'name', key: 'id', children: 'children' }}
                    treeData={treeData}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item key={"K-two"} name='parent_id' label-width="110px">
                  <Radio.Group>
                    <Tree
                      showLine
                      showIcon={false}
                      filterTreeNode={(e: any) => {
                        if (e.type == "asset") {
                          return true;
                        }
                        return true;
                      }}
                      onSelect={e => {

                      }}
                      titleRender={catalogNodeRender}
                      fieldNames={{ title: 'name', key: 'id', children: 'children' }}
                      treeData={treeData}
                    />
                  </Radio.Group>
                  {/* <Tree>
                  {renderTree(treeData)}
                 </Tree> */}

                </Form.Item>
              </Col>
            </Row>

          </>


        );
      },
    };


  }
  const onChange = (value: string) => {
     setTypeId(value)
  };
  const onTreeNodeChange = (value: string) => {
    setTypeId(value)
 };

  const operateDetail = {
    selectDeviceTypeDetail,
    selectUseStorageDetail,   
    addScrapDetail, 
    assetBatchImportDetail,
    netConfigImportDetail,
    assetSetBatchImportDetail,
    createdCodeDetail,
    changeResponsibleDetail,
    changeOrganizeDetail,
    changeRoomDetail,
    changeCatalogDetail,
    onlineDetail,
    offlineDetail,
    noneDetail: () => ({
      operateTitle: '',
      requestFunc() {
        return Promise.resolve();
      },
      isFormItem: true,
      render() { },
    }),
  };
  // debugger;
  const { operateTitle, requestFunc, isFormItem, render } = operateDetail[`${operateType}Detail`](detailProp);



  // 提交表单
  const submitForm = (values: any) => {
    console.log("提交表单",values);

    if (operateType === OperateType.AssetBatchImport) {
      let formData = new FormData();
      formData.append("file", fileList[0]);
      importtAssets(formData).then((res) => {
        message.success('批量导入成功');
        reloadList(null,operateType);
        setFileName("")
      })
      return
    }else if(operateType === OperateType.NetConfigImport){
      let formData = new FormData();
      formData.append("file", fileList[0]);
      let url = "/api/n9e/asset-expansion/netconfig/import-xls";
      importAssetSetData(url, formData).then((res) => {
        message.success('批量导入成功');
        reloadList(null,operateType);
        setFileName("")
      })    
    } else if (operateType === OperateType.CreatedCode) {
      const canvans:any = document.querySelectorAll(".qrcode");
      if (!canvans.length) {
        return alert("没有导出的二维码信息!");
      }
      const zip = new JSZip();
      // const zipDir = zip.folder('qrcode'); // 也能够生成子文件夹
      for (const canvan of canvans) {
        const item = {
          data: canvan.toDataURL().substring(22), // substring(22) 是去掉base64头部
          name: canvan.getAttribute("name"),
        };
        // 放到jszip对象里
        zip.file(item.name+ ".png", item.data, {
          base64: true,
        });
      }
      console.log("zip",zip.length)
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "资产设备二维码文件.zip");
      });
    } else if (operateType === OperateType.ChangeResponsible || operateType === OperateType.ChangeOrganize || operateType === OperateType.ChangeRoom) {
      let ids = (initData ? initData.map(({ id }) => id) : []);
      let params = {
        "assetIds": ids,
      }
      batchUpdateByProperties({ ...form.getFieldsValue(), ...params }).then((res) => {
        message.success('修改成功');
        setOperateType(OperateType.None);
        reloadList(null,operateType);
      });
    } else if (operateType === OperateType.ChangeCatalog) {
      let params = form.getFieldsValue();
      params["asset_id"] = transferId;
      console.log("item", params)
      updateAssetCategoryInAsset(params.parent_id, transferId).then((res) => {
        message.success('修改成功');
        setOperateType(OperateType.None);
        reloadList(null,operateType);
      });
    } else if(operateType === OperateType.Online){
       let formValue = form.getFieldsValue();
       console.log("formValue",formValue);
       console.log('updateOperateType',updateData)
       let params ={};
       params["device_status"] =2;
       let asset = new Array();
       for(let [key,value] of updateData){
        asset.push(value);
       }
       params["asset"] =asset;
       params["description"] = formValue["description"];
       insertDeviceOnline(params).then((res)=>{
        message.success('修改成功');
        setOperateType(OperateType.None);
        reloadList(null,operateType);
       })
    } else if(operateType === OperateType.Offline){
        let formValue = form.getFieldsValue();
        console.log("formValue",formValue);   
        let ids = new Array();
        initData["selected_asset_id"].forEach(id => ids.push({id:id}));        
        let params ={};
        params["device_status"] =3;       
        params["asset"] = ids;
        params["device_time"] = moment(moment(formValue["device_time"]).format('YYYY-MM-DD')).valueOf()/1000;  
        params["description"] = formValue["description"];        
        params["line_directory"] = formValue["line_directory"];        
        params["resource_free"] = formValue["resource_free"];
        console.log(params);
        insertDeviceOnline(params).then((res)=>{
         message.success('修改成功');
         setOperateType(OperateType.None);
         reloadList(null,operateType);
        })
    } else if(operateType === OperateType.SelectUseStorage){
      if(info!=null) {
        reloadList(info,operateType)
        setOperateType(OperateType.None);
      }else{
        message.error("请选择有效数据")
      };
    }else if(operateType === OperateType.AssetSetBatchImport){
      
      let formData = new FormData();
      formData.append("file", fileList[0]);
      let url = "/api/n9e/device-model/import-xls";      
      if (theme.businessId == "device_model_set") {
        url = "/api/n9e/device-model/import-xls";
      } else if (theme.businessId == "producer_set") {
        url = "api/n9e/device-producer/import-xls";   
        formData.append("type",theme.key);    
      } else if (theme.businessId == "device-cabinet") {
          url = "/api/n9e/device-cabinet/import-xls";
      }
      console.log("批量导入",url);
      importAssetSetData(url, formData).then((res) => {
        message.success('批量导入成功');
        setFileName("")
        reloadList(null,operateType);
      })   
    
    }else {
      if (typeId != null && typeId) {
        setConfirmLoading(true);
        setOperateType(OperateType.None);
        window.location.href = "/devicemgt/add/" + typeId + "?edit=1";
      };
    }

  }



  return (
    <Modal
      visible={operateType !== 'none'}
      title={operateTitle}
      destroyOnClose={true}
      width={width}
      confirmLoading={confirmLoading}
      okButtonProps={{
      }}
      okText={buttonTitle}
      onOk={submitForm}
      onCancel={() => {
        setOperateType(OperateType.None);
        form.resetFields();
      }}
    >
     
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign='left' >
        {isFormItem && render()}
      </Form>
        {!isFormItem && render()}
    </Modal>
  );
};
