import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Row, Card, Form, Radio, Select, Upload } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { GroupOutlined} from '@ant-design/icons';
const { confirm } = Modal;
import { CommonStateContext } from '@/App';
import './style.less';
import _, { now, random, uniqueId } from 'lodash';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import {saveLog,getLogInfo } from '@/services/log_set';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};




export default function () {
  const { t } = useTranslation('assets');
  let imageURL ="http://192.168.20.19:17000/api/n9e/"
  const commonState = useContext(CommonStateContext);
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => setPreviewOpen(false);
  const [form] = Form.useForm();

  useEffect(() => {
      
    getLogInfo().then(({dat})=>{
      console.log("查询结果",dat)
      form.setFieldsValue(dat)
      if(dat.logo_top!=null && dat.logo_top.length>0){
        setTopLogoImageUrl(imageURL+dat.logo_top);
      }
      if(dat.logo_title!=null && dat.logo_title.length>0){
        setTitleLogoImageUrl(imageURL+dat.logo_title);
      }
    })
  }, []);


  const [logoName, setLogoName] = useState<string>();
  const [loading, setLoading] = useState(false);
  // const [imageUrl, setImageUrl] = useState<string>();
  // 在useState中添加两个新的状态变量
  const [topLogoImageUrl, setTopLogoImageUrl] = useState<string | undefined>();
  const [titleLogoImageUrl, setTitleLogoImageUrl] = useState<string | undefined>();



  const onFinish = async (values: any) => {
    try {
      saveLog(values).then(res=>{
        message.success('表单成功提交');
      })      
  
    } catch (error) {
      // 处理任何意外错误
      console.error('提交表单时发生错误:', error);
      message.error('提交表单时发生错误');
    }
  };
  
  


  const beforeUpload = (file: RcFile,name:any) => {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传图片');
      return
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2M');
      return
    }
    setLogoName(name);
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    console.log("handleChangehandleChangehandleChangehandleChange");
    
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      let file :any= info.file.originFileObj;
      let suffix = file["name"].split(".")[file["name"].split(".").length-1];
      
      getBase64(file as RcFile, (url) => {
        setLoading(false);
        
        if (logoName === "logo_top") {
          setTopLogoImageUrl("http://192.168.20.19:17000/api/n9e/"+info.file.response.dat+"?"+Math.random());
          form.setFieldsValue({
            logo_top: info.file.response.dat,
          });
        }
        if (logoName === "logo_title") {
          setTitleLogoImageUrl("http://192.168.20.19:17000/api/n9e/"+info.file.response.dat+"?"+Math.random());
          form.setFieldsValue({
            logo_title: info.file.response.dat,
          });
        }
      });
    }
      // 发送文件到后端
      const formData = new FormData();
      formData.append('file', info.file.originFileObj as RcFile);


  }



  const props: UploadProps = {
    name: 'file',
    action: '/api/n9e/user-config/picture?logoName=' + logoName,
    headers: {
      authorization: `Bearer ${sessionStorage.getItem('access_token') || ''}`,
    },
    
  };
  const uploadButton = (
    <div>
      <Button className='upload_button'>选择图片</Button>
    </div>
  );



  return (
    <PageLayout icon={<GroupOutlined />} title={'LOGO设置'}>

      <Card
        hoverable
        title='基本信息'
        className='notice_set'
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          className='logo_submit_form'
          initialValues={{ remember: true }}
          onFinish={onFinish} // 添加 onFinish 属性
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item hidden name="logo_top"><Input /></Form.Item>
          <Form.Item hidden name="logo_title"><Input /></Form.Item>
          <Form.Item
            label="登录页标题（中文）"
            name="login_title"

            rules={[{ required: true, message: '请输入登录页标题（中文_)' }]}
          >
            <Input placeholder='请输入登录页标题（中文' />
          </Form.Item>

          <Form.Item
            name="sys_logo"
            label="系统顶部LOGO"
            className='image_form_item'
          >

            <Upload  {...props}
              name="picture"
              // listType="picture-card"
              // className="avatar-uploader"
              className='picture-card'
              showUploadList={false}
              beforeUpload= {(info)=>{beforeUpload(info,"logo_top")}}
              onChange={(info) => {
                handleChange(info)
              }}

            >

              {/* {imageUrl ?<img src={imageUrl}  className='logo_image' alt="LOGO"  />:<div className='no_image'>LOGO</div>} */}
              {topLogoImageUrl ? <img src={topLogoImageUrl} className='logo_image' alt="LOGO" /> : <div className='no_image'>LOGO</div>}
              {uploadButton}
              <span className='upload_tip'>建议尺寸：200px*80px</span>
            </Upload>
          </Form.Item>
          <Form.Item
            label="网页标题LOGO"
            className='image_form_item'
          >
            <Upload   {...props}
              name="picture"
              // listType="picture-card"
              // className="avatar-uploader"
              className='picture-card'
              showUploadList={false}
              beforeUpload= {(info)=>{beforeUpload(info,"logo_title")}}
              onChange={(info) => {
                handleChange(info)
              }}
            >
              {/* {imageUrl ?<img src={imageUrl}  className='logo_image' alt="LOGO"  />:<div className='no_image'>网页标题LOGO</div>} */}
              {titleLogoImageUrl ? <img src={titleLogoImageUrl} className='logo_image' alt="LOGO" /> : <div className='no_image'>网页标题LOGO</div>}
              {uploadButton}
              <span className='upload_tip'>建议尺寸：80px*80px</span>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 16 }} className='submit_button'>
            <Space >

              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button >
                还原
              </Button>
            </Space>
          </Form.Item>
        </Form>

      </Card>


    </PageLayout>
  );
}
