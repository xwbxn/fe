// page list
// date : 2023-10-21 10:40
// desc :

import { Button, Input, message, Modal, Space, Table } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';

import PageLayout from '@/components/pageLayout';
import RefreshIcon from '@/components/RefreshIcon';
import { listBigscreen, deleteBigscreen } from '@/services/bigscreen';

import './index.less';
import { useLocalStorageState } from 'ahooks';
import { defaultScreen } from './Designer';

export type BigscreenType = {
  id?: number;
  title: string;
  desc: string;
  config: string;
};

const Bigscreen = () => {
  const [items, setItems] = useState([]);
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const [searchVal, setSearchVal] = useState('');
  const history = useHistory();

  // 大屏配置数据
  const [screen, setScreen] = useLocalStorageState('CURRENT_SCREEN', {
    defaultValue: defaultScreen,
  });

  useEffect(() => {
    listBigscreen().then((res) => {
      setItems(res.dat.list);
    });
  }, [searchVal, refreshKey]);

  return (
    <>
      <PageLayout title={''}>
        <div className='table-content'>
          <div className='table-header'>
            <Space>
              <RefreshIcon
                onClick={() => {
                  setRefreshKey(_.uniqueId('refreshKey_'));
                }}
              />
              <div className='table-header-search'>
                <Input className={'searchInput'} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} prefix={<SearchOutlined />} placeholder={'搜索'} />
              </div>
            </Space>
            <Space>
              <div>
                <Button
                  type='primary'
                  onClick={() => {
                    setScreen(defaultScreen);
                    history.push(`/bigscreen/designer`);
                  }}
                >
                  新建
                </Button>
              </div>
            </Space>
          </div>
          <Table
            dataSource={items}
            rowKey='id'
            columns={[
              { title: '标题', dataIndex: 'title' },
              { title: '简介', dataIndex: 'desc' },
              {
                title: '创建时间',
                dataIndex: 'created_at',
                render: (value) => {
                  return new Date(value * 1000).toLocaleString();
                },
              },
              {
                title: '操作',
                width: '120px',
                align: 'center',
                fixed: 'right',
                render: (value: string, record: any) => (
                  <Space>
                    <Link to={`bigscreen/view/${record.id}`} target='_blank'>
                      <SearchOutlined></SearchOutlined>
                    </Link>
                    <EditOutlined
                      onClick={() => {
                        history.push(`bigscreen/designer/${record.id}`);
                      }}
                    />
                    <DeleteOutlined
                      onClick={() => {
                        Modal.confirm({
                          title: '是否确认删除?',
                          onOk: () => {
                            deleteBigscreen(record.id).then(() => {
                              message.success('删除成功');
                              setRefreshKey(_.uniqueId());
                            });
                          },
                          onCancel() {},
                        });
                      }}
                    />
                  </Space>
                ),
              },
            ]}
          ></Table>
        </div>
      </PageLayout>
    </>
  );
};

export default Bigscreen;
