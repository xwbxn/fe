import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Row, Card, Form, Radio, Select, Upload } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, DoubleLeftOutlined, DownOutlined, GroupOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import { SetConfigTables, SetConfigForms } from './catalog'
import { CommonStateContext } from '@/App';
import CommonModal from '@/components/CustomForm/CommonModal';
import './style.less';
import _ from 'lodash';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default function () {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => setPreviewOpen(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
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
          className='logo_submit_form'
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="登录页标题（中文）"
            name="username"

            rules={[{ required: true, message: '请输入登录页标题（中文_)' }]}
          >
             <Input placeholder='请输入登录页标题（中文' />
          </Form.Item>

          <Form.Item
            label="登录页标题（英文）"
            name="username"

            rules={[{ required: true, message: '请输入登录页标题（英文)' }]}
          >
             <Input placeholder='请输入登录页标题（英文)' />
          </Form.Item>
        
          <Form.Item
            label="底部公司名称"
            name="username"

            rules={[{ required: true, message: '请输入底部公司名称' }]}
          >
             <Input placeholder='请输入底部公司名称' />
          </Form.Item>

          <Form.Item
            name="sys_logo"
            label="系统顶部LOGO"
            className='image_form_item'
          >
            
            <Upload
                name="LOGO"
                // listType="picture-card"
                // className="avatar-uploader"
                className='picture-card'
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
               {imageUrl ?<img src={imageUrl}  className='logo_image' alt="LOGO"  />:<div className='no_image'>LOGO</div>}
               {uploadButton}
               <span  className='upload_tip'>建议尺寸：200px*80px</span>
            </Upload>
          </Form.Item>
          <Form.Item
            name="page_logo"
            label="网页标题LOGO"
            className='image_form_item'
          >
             <Upload
                name="网页标题LOGO"
                // listType="picture-card"
                // className="avatar-uploader"
                className='picture-card'
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ?<img src={imageUrl}  className='logo_image' alt="LOGO"  />:<div className='no_image'>网页标题LOGO</div>}
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
