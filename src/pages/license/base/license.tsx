import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Row, Card, Checkbox, Form, Select, Radio, Upload } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import Icon, { CheckCircleOutlined, SyncOutlined, GroupOutlined, SearchOutlined, DoubleLeftOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import { SetConfigTables, SetConfigForms } from './catalog'
import { CommonStateContext } from '@/App';
import CommonModal from '@/components/CustomForm/CommonModal';
import './style.less';
import _ from 'lodash';
import { assetsType } from '@/store/assetsInterfaces';
import { deleteAssets, getAssets, getOrganizationTree, updateOrganization, deleteOrganization, addOrganization } from '@/services/assets';
import RefreshIcon from '@/components/RefreshIcon';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getCertificate, uploadLicense } from '@/services/license';


interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

export default function () {
  const commonState = useContext(CommonStateContext);
  const [treeData, setTreeData] = useState<any[]>();
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const history = useHistory();
  const [detail, setDetail] = useState(localStorage.getItem("license_select_detail")?JSON.parse(""+localStorage.getItem("license_select_detail")):null);
  const [props, setProps] = useState<any>({});
  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});
  const params = useParams<any>();
  const [fileNameCrt, setFileNameCrt] = useState<string>();
  const [fileNameKey, setFileNameKey] = useState<string>();
  const [fileListCrt, setFileListCrt] = useState<any>([]);
  const [fileListKey, setFileListKey] = useState<any>([]);
  const [form] = Form.useForm();
  const style ={
    style1:{
       width: "400px",
    }
  }
  // <h1>{params.id}</h1>
  const propsCrt = {
    showUploadList: false,
    onRemove: file => {
      setFileListCrt([])
    },
    beforeUpload: file => {
      // console.log(file)
      let { name } = file;
      var fileExtension = name.substring(name.lastIndexOf('.') + 1);//截取文件后缀名
      setFileNameCrt(name);
      let newList = new Array();
      newList.push(file)
      fileListCrt.concat(...newList);
      setFileListCrt(newList)
      return false;
    },
    fileListCrt,
  };
  const propsKey = {
    showUploadList: false,
    onRemove: file => {
      setFileListKey([])
    },
    beforeUpload: file => {
      // console.log(file)
      let { name } = file;
      var fileExtension = name.substring(name.lastIndexOf('.') + 1);//截取文件后缀名
      setFileNameKey(name);
      let newList = new Array();
      newList.push(file)
      fileListKey.concat(...newList);
      setFileListKey(newList)
      return false;
    },
    fileListKey,
  };
  useEffect(() => {
    console.log("detail",detail)
    if(detail==null){
      history.push("/")
    }else{      
      form.setFieldsValue({serial_number:detail.serial_number})
    }
  }, []);

  const renderFields = (text, record, field, currentConfigId) => {
    console.log("渲染数据列", text, record, field, currentConfigId);
    let value = record[field];
    return value;
  }

  const formSubmit = (param, businessForm) => {
    if (businessForm["operate"] == "添加") {
      addOrganization(param).then(() => {
        message.success("添加成功");
        businessForm.isOpen = false;
        setBusinessForm(_.cloneDeep(businessForm))
      });
    } else if (businessForm["operate"] == "修改") {
      param.id = parseInt(businessForm["operateId"]);
      if (param.id == param.parent_id) {
        message.error("上级组织机构不能选择当前要修改的组织机构")
        return;
      }
      updateOrganization(param).then(() => {
        message.success("修改成功");
        businessForm.isOpen = false;
        setBusinessForm(_.cloneDeep(businessForm))
      });
    }

  }
  const upload=()=>{
      let formData = new FormData();
      formData.append("id", params.id);
      formData.append("crt", fileListCrt[0]);
      formData.append("key", fileListKey[0]);
      let url = "/api/n9e/xh/license/update";
      console.log("更新证书",url);
      uploadLicense(url, formData).then((res) => {
        message.success('更新证书成功');
        setFileNameCrt("")
        setFileNameKey("")
        history.push(`/license/base`);
      })
  }
  // const handleClick = (action: string, record?: any) => {

  //   let configId = "organization_set";
  //   let businessZip = SetConfigForms[configId];
  //   businessZip.Modal.title = "-" + businessZip.Modal.title;
  //   businessZip.renderFields = (text, record, field) => {
  //     return renderFields(text, record, field, configId);
  //   };
  //   businessForm["businessId"] = configId;
  //   businessForm["isOpen"] = true;
  //   if (action == "create") {
  //     businessForm["operate"] = "添加";
  //     businessForm["operateId"] = null;
  //     setFormData(null)
  //   } else {
  //     businessForm["operate"] = "修改";
  //     businessForm["operateId"] = record.id;
  //     if (record.parent_id == 0) {
  //       delete record.parent_id;
  //     }
  //     setFormData(record)
  //   }
  //   setBusinessForm(_.cloneDeep(businessForm))
  //   businessZip.Modal.cancel = () => {
  //     businessForm.isOpen = false;
  //     setBusinessForm(_.cloneDeep(businessForm))
  //   };
  //   businessZip.Modal.submit = async (values) => {
  //     // formSubmi(values, businessForm)
  //   };
  //   businessZip.initData = initData;
  //   setProps((businessZip));
  //   console.log("初始化页面加载信息", businessZip);

  // }
  // const onSearchQuery = (e) => {
  //   let val = e.target.value;
  //   setQuery(val);
  // };
  // const deleteNode = (node) => {
  //   deleteOrganization(node.id).then(() => {
  //   });
  // };
  // const beforeUpload = (file: RcFile,name:any) => {

  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   if (!isJpgOrPng) {
  //     message.error('You can only upload JPG/PNG file!');
  //     return
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error('Image must smaller than 2MB!');
  //     return
  //   }
  //   setLogoName(name);
  //   return isJpgOrPng && isLt2M;
  // };
  // const handleChange = (info: UploadChangeParam<UploadFile>) => {
  //   console.log("handleChangehandleChangehandleChangehandleChange");
    
  //   if (info.file.status === 'uploading') {
  //     setLoading(true);
  //     return;
  //   }

  //   if (info.file.status === 'done') {
  //     let file :any= info.file.originFileObj;
  //     let suffix = file["name"].split(".")[file["name"].split(".").length-1];
      
  //     getBase64(file as RcFile, (url) => {
  //       setLoading(false);
        
  //       if (logoName === "logo_top") {
  //         setTopLogoImageUrl("http://192.168.20.19:17000/api/n9e/"+info.file.response.dat+"?"+Math.random());
  //         form.setFieldsValue({
  //           logo_top: info.file.response.dat,
  //         });
  //       }
  //       if (logoName === "logo_title") {
  //         setTitleLogoImageUrl("http://192.168.20.19:17000/api/n9e/"+info.file.response.dat+"?"+Math.random());
  //         form.setFieldsValue({
  //           logo_title: info.file.response.dat,
  //         });
  //       }
  //     });
  //   }
  //     // 发送文件到后端
  //     const formData = new FormData();
  //     formData.append('file', info.file.originFileObj as RcFile);


  // }



  return (
    <PageLayout icon={<GroupOutlined />} title={'许可证管理'}>
      <div className='log_debug_switch' >
        <Card
          hoverable
          title='更新许可证书：'
          className='notice_set'
        >
          <Form
          form={form}
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 890 }}
            initialValues={{ remember: true }}
            className='log_switch_form'
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
          
            <Form.Item 
              label="序列号"
              name='serial_number' 
            >
               <Input disabled={true} style={style.style1}  />
              </Form.Item >
           
            <Form.Item label="证书文件" name="crt" rules={[{ required: true }]}>
              <Input value={fileNameCrt} style={style.style1}></Input>
              <Upload {...propsCrt}>
                <Button type="primary">
                  <Icon type="upload" />浏览
                </Button>
              </Upload> 
              {/* <Upload  {...pprops}  
              showUploadList={false}
              beforeUpload= {(info)=>{beforeUpload(info,"crt")}}
              onChange={(info) => {
                handleChange(info)
              }}

            ><Button type="primary">
            <Icon type="upload" />浏览
          </Button></Upload>         */}
          </Form.Item>


          <Form.Item label="密钥文件" name="key" rules={[{ required: true }]}>
              <Input value={fileNameKey} style={style.style1}></Input>
              <Upload {...propsKey}>
                <Button type="primary">
                  <Icon type="upload" />浏览
                </Button>
              </Upload> 
              {/* <Upload  {...pprops}  
              showUploadList={false}
              beforeUpload= {(info)=>{beforeUpload(info,"key")}}
              onChange={(info) => {
                handleChange(info)
              }}

            ><Button type="primary">
            <Icon type="upload" />浏览
          </Button></Upload>           */}
          </Form.Item>

              
             
            <Form.Item wrapperCol={{ offset: 12, span: 16 }} className='submit_button'>
              <Space >
                <Button type='primary' style={{margin:'5px'}} onClick={(e) => {
            upload();
          }} >
                  上传
                </Button>
                <Button style={{margin:'5px'}} onClick={() => {
                    history.push(`/license/base`);
                  }}>
                  取消
                </Button>
               
              </Space>
            </Form.Item>
          </Form>

        </Card>
       
        


        <CommonModal
          Modal={props.Modal}
          Form={props.Form}
          initial={initData}
          defaultValue={formData}
          operate={businessForm.operate}
          isOpen={businessForm.isOpen} >
        </CommonModal>
      </div>
    </PageLayout>
  );
}
