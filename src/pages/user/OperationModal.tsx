import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Button,Checkbox, Col, DatePicker, Form, Input, Modal, Radio, Row, Select, Table, Tag, Tooltip, Tree, TreeSelect, Upload, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { exportAssetTemplet, exportTemplet, importAssetSetData,importtAssets, batchUpdateByProperties,insertDeviceOnline } from '@/services/assets/asset';
import { OperateType } from './operate_type';
import Icon from '@ant-design/icons';
import moment from 'moment';
import { getUsers } from '@/services/account';
import { getOrganizationTree,getOrganizationsByIds } from '@/services/assets';
import { updateProperty } from '@/services/manage';

import { TreeNode } from 'antd/lib/tree-select';
import { CommonStateContext } from '@/App';



//请求的参数 【页面宽度，操作，操作类型，初始化数据，刷新页面动作，主题】
export const OperationModal = ({ width,operateType, setOperateType, initData, reloadList,theme }) => {
  const { t } = useTranslation('assets');
  const [form] = Form.useForm();
  const { busiGroups } = useContext(CommonStateContext);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const detailProp = operateType === OperateType.UnbindTag ? tagsList : busiGroups;
  const [fileName, setFileName] = useState<string>();
  const [buttonTitle, setButtonTitle] = useState<string>("确认");
  const [optionMap, setOptionMap] = useState({});  
  const [renderDataMap, setRenderDataMap] = useState({});  
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  // let selectOptionData = new Map()

  const style ={
    style1:{
       width: "150px",
    }
  }

  useEffect(() => {
    console.log("initData",initData)
      
    // }else if (operateType === OperateType.AssetBatchImport) {
    //   let title = "数据导入";
    //   setButtonTitle(title)
    // } else if (operateType === OperateType.CreatedCode) {
    //   setButtonTitle("批量下载")
    // } else if (operateType === OperateType.ChangeResponsible) {
    //   getUsers().then(({ dat }) => {
    //     var userList = new Array()
    //     dat.forEach((item) => {
    //       userList.push({
    //         value: item.nickname,
    //         label: item.nickname
    //       })
    //     })
    //     optionMap["system_users"] = userList;
    //     setOptionMap({ ...optionMap })
    //   });
    // } else
    if (operateType === OperateType.ChangeOrganize) {
      getOrganizationTree({}).then(({ dat }) => {
        optionMap["organs"] = dat;
        setOptionMap({ ...optionMap })
      });
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

  // //批量导入设备页面
  // const assetBatchImportDetail = () => {
  //   return {
  //     isFormItem: true,
  //     operateTitle: t('数据导入'),
  //     render() {
  //       return (

  //         <Form.Item label="选择文件" name="file" rules={[{ required: true }]}>
  //           <div key={Math.random()} style={{ display: 'inline-flex', gap: '8px' }}>
  //             <Input value={fileName} style={style.style1}></Input>
  //             <Upload {...props}>
  //               <Button type="primary">
  //                 <Icon type="upload" />浏览
  //               </Button>
  //             </Upload>
  //             <Button className='down_load_button'
  //               onClick={async event => {
  //                 console.log(theme, "updating    update...");
  //                 let url = "/api/n9e/asset-basic/templet";
  //                 let params = {};
  //                 let exportTitle = "资产";
  //                 exportTemplet(url, params).then((res) => {
  //                   const url = window.URL.createObjectURL(new Blob([res],
  //                     // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式                          
  //                     { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  //                   const link = document.createElement('a');
  //                   link.href = url;
  //                   const fileName = exportTitle + "导入模板_" + moment().format('MMDDHHmmss') + ".xls" //decodeURI(res.headers['filename']);
  //                   link.setAttribute('download', fileName);
  //                   document.body.appendChild(link);
  //                   link.click();
  //                 });
  //               }}
  //               style={{ border: '0px solid #fff', fontSize: '14px', color: "#40A2EC" }}>下载模板</Button>

  //           </div>
  //         </Form.Item>
  //       );
  //     },
  //   };

  // }
  // //批量导入设备页面
  // const assetSetBatchImportDetail = () => {
  //   return {
  //     isFormItem: true,
  //     operateTitle: t('数据导入'),
  //     render() {
  //       return (

  //         <Form.Item label="选择文件" name="file" rules={[{ required: true }]}>
  //           <div key={Math.random()} style={{ display: 'inline-flex', gap: '8px' }}>
  //             <Input value={fileName}  style={style.style1}></Input>
  //             <Upload {...props}>
  //               <Button type="primary">
  //                 <Icon type="upload" />浏览
  //               </Button>
  //             </Upload>
  //             <Button className='down_load_button'
  //               onClick={async event => {
  //                 console.log(theme, "updating    update...");
  //                 let url = "/api/n9e/asset-basic/templet";
  //                 let params = {};
  //                 let exportTitle = "资产";
  //                 if (theme.businessId == "device_model_set") {
  //                   url = "/api/n9e/device-model/templet";
  //                   exportTitle = "设备型号"
  //                 } else if (theme.businessId == "producer_set") {
  //                   url = "/api/n9e/device-producer/templet";
  //                   exportTitle = theme.title;
  //                   params["type"] = theme.key;
  //                 } else if (theme.businessId == "device-cabinet") {
  //                   url = "/api/n9e/device-cabinet/templet";
  //                   exportTitle = theme.title;
  //                 }
  //                 exportTemplet(url, params).then((res) => {
  //                   const url = window.URL.createObjectURL(new Blob([res],
  //                     // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式                          
  //                     { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  //                   const link = document.createElement('a');
  //                   link.href = url;
  //                   const fileName = exportTitle + "导入模板_" + moment().format('MMDDHHmmss') + ".xls" //decodeURI(res.headers['filename']);
  //                   link.setAttribute('download', fileName);
  //                   document.body.appendChild(link);
  //                   link.click();
  //                 });
  //               }}
  //               style={{ border: '0px solid #fff', fontSize: '14px', color: "#40A2EC" }}>下载模板</Button>

  //           </div>
  //         </Form.Item>
  //       );
  //     },
  //   };

  // }

 
  //修改所属组织
  const changeOrganizeDetail = () => {
    
    let ids = new Array<string>();
    initData.forEach((item)=>{
      ids.push(item.affiliated_organization);
    });
    // console.log("changeOrganizeDetail");
    

    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '显示名',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '所属组织',
        dataIndex: 'organization_id',
        key: 'organization_id',
        render(val) {
          return renderDataMap["organ_"+val];
        }
      }
    ];
    return {
      operateTitle: t('需要修改所属组织信息的人员信息'),
      isFormItem: true,
      render() {
        return (
          <>
            <Form.Item>
              <Table style={{ width: '100%' }} pagination={false} rowKey={"id"} dataSource={initData} columns={columns} />
            </Form.Item>
            <Form.Item label="所属机构" name={'organization'} labelCol={{ span: 2 }}>
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
 

  const operateDetail = {  
    // addScrapDetail, 
    // assetBatchImportDetail,
    // assetSetBatchImportDetail,
    changeOrganizeDetail,
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
    // if (operateType === OperateType.AssetBatchImport) {
    //   let formData = new FormData();
    //   formData.append("file", fileList[0]);
    //   importtAssets(formData).then((res) => {
    //     message.success('批量导入成功');
    //     reloadList(null,operateType);
    //     setFileName("")
    //   })
    //   return
    // }else 
    if (operateType === OperateType.ChangeOrganize) {
      let formItemValues = form.getFieldsValue();
      let ids = (initData ? initData.map(({ id }) => id) : []);
      updateProperty("organization",formItemValues["organization"],ids).then((res) => {
          message.success('修改成功');
          setOperateType(OperateType.None);
          reloadList(null,operateType);
      });
    }
    // else if(operateType === OperateType.AssetSetBatchImport){
      
    //   let formData = new FormData();
    //   formData.append("file", fileList[0]);
    //   let url = "/api/n9e/device-model/import-xls";      
    //   if (theme.businessId == "device_model_set") {
    //     url = "/api/n9e/device-model/import-xls";
    //   } else if (theme.businessId == "producer_set") {
    //     url = "api/n9e/device-producer/import-xls";   
    //     formData.append("type",theme.key);    
    //   } else if (theme.businessId == "device-cabinet") {
    //       url = "/api/n9e/device-cabinet/import-xls";
    //   }
    //   console.log("批量导入",url);
    //   importAssetSetData(url, formData).then((res) => {
    //     message.success('批量导入成功');
    //     setFileName("")
    //     reloadList(null,operateType);
    //   })   
    
    // }

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
