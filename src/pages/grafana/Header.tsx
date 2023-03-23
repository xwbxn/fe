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
import React from 'react';
import { Input, Button, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import RefreshIcon from '@/components/RefreshIcon';
import { createFolder, getFolder } from '@/services/grafana';

interface IProps {
    busiId: number;
    busiGroup: string|undefined;
    selectRowKeys: any[];
    refreshList: () => void;
    searchVal: string;
    onSearchChange: (val) => void;
}

export default function Header(props: IProps) {
    const { t } = useTranslation('dashboard');
    const { refreshList, searchVal, onSearchChange, busiGroup } = props;

    const checkOrCreateFolder = async (busiGroup) => {
        let res = await getFolder(busiGroup)
        if (!res.success && res.dat.status == 404) {
            res = await createFolder({ uid: busiGroup, title: busiGroup })
            if (!res.success) {
                message.error('创建目录失败')
                return false
            }
        }
        return true
    }

    const newGrafana = async (busiGroup) => {
        if (await checkOrCreateFolder(busiGroup)) {
            window.open(`/grafana/dashboard/new?folderUid=${busiGroup}`, "_blank")
        }
    }

    const importGrafana = async (busiGroup) => {
        if (await checkOrCreateFolder(busiGroup)) {
            window.open(`/grafana/dashboard/import?folderUid=${busiGroup}`, "_blank")
        }
    }

    return (
        <>
            <div className='table-handle' style={{ padding: 0 }}>
                <Space>
                    <RefreshIcon
                        onClick={() => {
                            refreshList();
                        }}
                    />
                    <div className='table-handle-search'>
                        <Input
                            className={'searchInput'}
                            value={searchVal}
                            onChange={(e) => {
                                onSearchChange(e.target.value);
                            }}
                            prefix={<SearchOutlined />}
                            placeholder={t('search_placeholder')}
                        />
                    </div>
                </Space>
                <Space>
                    <div className='table-handle-buttons'>
                        <Button
                            type='primary'
                            onClick={() => {
                                newGrafana(busiGroup)
                            }}
                        >
                            {t('common:btn.add')}
                        </Button>

                    </div>
                    <div className='table-handle-buttons'>
                        <Button
                            type='primary'
                            onClick={() => {
                                importGrafana(busiGroup)
                            }}
                        >
                            {t('common:btn.import')}
                        </Button>
                    </div>
                </Space>
            </div>
        </>
    );
}
