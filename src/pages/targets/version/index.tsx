import { message, Upload } from 'antd';
import React from 'react';

import PageLayout from '@/components/pageLayout';
import { InboxOutlined } from '@ant-design/icons';

import type { UploadProps } from 'antd';
const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: false,
  action: '/api/n9e/target/version',
  headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export default function () {
  return (
    <PageLayout title='探针版本上传'>
      <div style={{ height: 150, overflow: 'visible' }}>
        <div style={{ padding: 20, marginBottom: 20 }}>
          探针上传需要按规范文件名上传,文件名需要包括版本号,操作系统,架构,并通过gzip压缩后上传.<br></br> 如:categraf-1.0.0-linux-amd64.gz
        </div>
        <Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>点击或拖放文件到这个区域上传</p>
        </Dragger>
      </div>
    </PageLayout>
  );
}
