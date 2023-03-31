/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/**
 * 大盘列表页面
 */
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Modal, message } from 'antd';
import { FundViewOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Dashboard as DashboardType } from '@/store/grafanaInterface';
import { getFolder, getDashboards, deleteDashboard } from '@/services/grafana';
import PageLayout from '@/components/pageLayout';
import BlankBusinessPlaceholder from '@/components/BlankBusinessPlaceholder';
import { CommonStateContext } from '@/App';
import { BusinessGroup } from '@/pages/targets';
import usePagination from '@/components/usePagination';
import Header from './Header';
import './style.less';

export default function index(props) {
    const { t } = useTranslation('dashboard');
    const commonState = useContext(CommonStateContext);
    const { curBusiId: busiId } = commonState;
    const [busiGroup, setBusiGroup] = useState<string>();
    const [list, setList] = useState<any[]>([]);
    const [selectRowKeys, setSelectRowKeys] = useState<number[]>([]);
    const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
    const [searchVal, setsearchVal] = useState<string>('');
    const pagination = usePagination({ PAGESIZE_KEY: 'dashboard-pagesize' });

    useEffect(() => {
        const group = commonState.busiGroups.find(v => v.id === busiId)
        if(group) {
            setBusiGroup(group.label_value)
        }
    }, [])

    useEffect(() => {
        if (busiGroup) {
            getFolder(busiGroup).then(res => {
                if (res.success) {
                    return getDashboards(res.dat.id)
                } else {
                    setList([])
                }
            }).then((res) => {
                setList(res.dat)
            })
        }
    }, [busiGroup, refreshKey]);

    const data = _.filter(list, (item) => {
        if (searchVal) {
            return _.includes(item.title.toLowerCase(), searchVal.toLowerCase()) || item.tags.join().toLowerCase().includes(searchVal.toLowerCase());
        }
        return true;
    });

    return (
        <PageLayout title={'Grafana'} icon={<FundViewOutlined />}>
            <div style={{ display: 'flex' }}>
                <BusinessGroup
                    curBusiId={busiId}
                    setCurBusiId={(id, item) => {
                        setBusiGroup(item.label_value);
                    }}
                />
                {busiId ? (
                    <div className='dashboards-v2'>
                        <Header
                            busiId={busiId}
                            busiGroup={busiGroup}
                            selectRowKeys={selectRowKeys}
                            refreshList={() => {
                                setRefreshKey(_.uniqueId('refreshKey_'));
                            }}
                            searchVal={searchVal}
                            onSearchChange={setsearchVal}
                        />
                        <Table
                            dataSource={data}
                            columns={[
                                {
                                    title: t('name'),
                                    dataIndex: 'name',
                                    className: 'name-column',
                                    render: (text: string, record: DashboardType) => {
                                        return (
                                            <Link target="_blank" to={`${record.url}`}>{text}</Link>
                                        );
                                    },
                                },
                                {
                                    title: t('tags'),
                                    dataIndex: 'tags',
                                    className: 'tags-column',
                                    render: (text: string) => (
                                        <>
                                            {_.map(_.split(text, ' '), (tag, index) => {
                                                return tag ? (
                                                    <Tag
                                                        color='purple'
                                                        key={index}
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            const queryItem = searchVal.length > 0 ? searchVal.split(' ') : [];
                                                            if (queryItem.includes(tag)) return;
                                                            setsearchVal((searchVal) => {
                                                                if (searchVal) {
                                                                    return searchVal + ' ' + tag;
                                                                }
                                                                return tag;
                                                            });
                                                        }}
                                                    >
                                                        {tag}
                                                    </Tag>
                                                ) : null;
                                            })}
                                        </>
                                    ),
                                },
                                {
                                    title: t('common:table.operations'),
                                    width: '180px',
                                    render: (text: string, record: DashboardType) => (
                                        <div className='table-operator-area'>
                                            <div
                                                className='table-operator-area-warning'
                                                onClick={async () => {
                                                    Modal.confirm({
                                                        title: t('common:confirm.delete'),
                                                        onOk: async () => {
                                                            await deleteDashboard(record.uid);
                                                            message.success(t('common:success.delete'));
                                                            setRefreshKey(_.uniqueId('refreshKey_'));
                                                        },

                                                        onCancel() { },
                                                    });
                                                }}
                                            >
                                                {t('common:btn.delete')}
                                            </div>
                                        </div>
                                    ),
                                },
                            ]}
                            rowKey='id'
                            size='small'
                            rowSelection={{
                                selectedRowKeys: selectRowKeys,
                                onChange: (selectedRowKeys: number[]) => {
                                    setSelectRowKeys(selectedRowKeys);
                                },
                            }}
                            pagination={pagination}
                        />
                    </div>
                ) : (
                    <BlankBusinessPlaceholder text='Grafana' />
                )}
            </div>
        </PageLayout>
    );
}
