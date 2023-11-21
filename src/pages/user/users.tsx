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
import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import _, { set } from 'lodash';
import { Button, Input, message, Row, Modal, Table, Tree, Dropdown, Menu, Select, Col, Space } from 'antd';
import { DeleteOutlined, DownOutlined, EditOutlined, PlusSquareOutlined, PoweroffOutlined, SearchOutlined, UndoOutlined, UserOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { useAntdTable } from 'ahooks';
import PageLayout from '@/components/pageLayout';
import UserInfoModal from './component/createModal';
import { getUserInfoList, deleteUser, updateProperty, deleteTeam, getTeamInfoList, deleteUsers, getRoles } from '@/services/manage';
import { User, Team, UserType, ActionType, TeamInfo } from '@/store/manageInterface';
import { CommonStateContext } from '@/App';
import usePagination from '@/components/usePagination';
import { OperationModal } from './OperationModal';
import './index.less';
import { OperateType } from './operate_type';
import './locale';
// import { getOrganizationTree,getOrganizationsByIds } from '@/services/assets';
const { confirm } = Modal;


const Resource: React.FC = () => {
  const { t } = useTranslation('user');
  const commonState = useContext(CommonStateContext);
  const [visible, setVisible] = useState<boolean>(false);
  const [teamId, setTeamId] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([0]);
  const [action, setAction] = useState<ActionType>();
  const [userId, setUserId] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [status, setStatus] = useState<number>();
  const [role, setRole] = useState<string>();
  const { profile } = useContext(CommonStateContext);
  const pagination = usePagination({ PAGESIZE_KEY: 'users' });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedRows, setSelectedRows] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [teamInfo, setTeamInfo] = useState<Team>();
  const [actionType, setActionType] = useState<string>("");


  const [treeData, setTreeData] = useState<any[]>([
    { id: 0, name: '全部', parent_id: 0, children: [] },
  ]);
  const statusOptions = [
    { label: "禁用", value: 0 }, { label: "启用", value: 1 }
  ];
  const menu = {
    items: [
      {
        label: '导入',
        key: 'import'
      },
      {
        label: '禁用',
        key: 'stop'
      },
      {
        label: '启用',
        key: 'start'
      },
      {
        label: '删除',
        key: 'delete'
      },
      // {
      //   label: '更换组织',
      //   key: 'changeOrganize'
      // },
    ]
  };
  const titleRender = (node) => {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <span>{node.name}</span>
      </div>
    );
  };

  const loadingTree = () => {
    getTeamInfoList({ query: '' }).then(({ dat }) => {
      treeData[0].children = dat || [];
      setTreeData(treeData.slice());
    });
  };

  useEffect(() => {
    setExpandedKeys([0]);
    setSelectedKeys([0]);
    loadingTree();
    getRoles().then((res) =>{
       let rows  = new Array<any>();
       res.forEach(element => {
        rows.push({
          value:element.name,
          label:element.name,
        }); 
       });
       setRoleList(rows);
    })
  }, []);

  const userColumn: ColumnsType<User> = [
    {
      title: t('account:profile.username'),
      dataIndex: 'username',
      ellipsis: true,
    },
    {
      title: t('account:profile.nickname'),
      dataIndex: 'nickname',
      ellipsis: true,
      render: (text: string, record) => record.nickname || '-',
    },
    {
      title: t('account:profile.email'),
      dataIndex: 'email',
      render: (text: string, record) => record.email || '-',
    },
    {
      title: t('account:profile.phone'),
      dataIndex: 'phone',
      render: (text: string, record) => record.phone || '-',
    },
    {
      title: '所属用户组',
      dataIndex: 'group_name',
      render: (val, record) => {
        return val ? val.join(",") : ''//renderDataMap["organ_"+val];
      },
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      render: (val, record) => {
        if (val === 0) {
          return "禁用"
        } else if (val === 1) {
          return "启用"
        } else {
          return "N/A"
        }
      }
    },
  ];
  const userColumns: ColumnsType<User> = [
    ...userColumn,
    {
      title: t('account:profile.role'),
      dataIndex: 'roles',
      render: (text: []) => text?.join(', '),
    },
    {
      title: t('common:table.create_at'),
      width: '240px',
      dataIndex: 'create_at',
      render: (text) => {
        return moment.unix(text).format('YYYY-MM-DD HH:mm:ss');
      },
      sorter: (a, b) => a.create_at - b.create_at,
    },
    {
      title: t('common:table.operations'),
      width: '160px',
      align: 'center',
      render: (text: string, record) => (
        <>
          <PoweroffOutlined className='oper-name'
            title={record.status === 0 ? ('已启动') : ('未启动')}
            style={{ color: record.status === 0 ? ('green') : ('gray') }}
            onClick={e => {

            }} />
          <EditOutlined className='oper-name' onClick={() => handleClick(ActionType.EditUser, record.id, "member")}>

          </EditOutlined>
          <UndoOutlined className='oper-name' onClick={() => handleClick(ActionType.Reset, record.id, "member")}>
            {t('account:password.reset')}
          </UndoOutlined>
          <a className='oper-name'
            onClick={() => {
              confirm({
                title: t('common:confirm.delete'),
                onOk: () => {
                  deleteUser(record.id).then((_) => {
                    message.success(t('common:success.delete'));
                    handleClose(true);
                  });
                },
                onCancel: () => { },
              });
            }}
          >
            <DeleteOutlined />
          </a>
        </>
      ),
    },
  ];

  if (!profile.roles?.includes('Admin')) {
    userColumns.pop(); //普通用户不展示操作列
  }

  const handleClick = (type: ActionType, id: any, operate: string) => {
    setAction(type);
    setActionType(operate);
    setTeamId(id > 0 ? id : undefined)
    setVisible(true);
  };

  const handleOperateClick = (key: string) => {
    console.log("handleOperateClick", key);
    if (key === "import") {
      setOperateType(OperateType.BatchImport as OperateType)
    } else if (key == "add") {
      handleClick(ActionType.CreateUser, "", "member")
    } else {
      if (selectedRowKeys.length <= 0) {
        message.warning("请选择要批量人员信息")
        return
      } else {
        if (key == "changeOrganize") {
          setOperateType(key as OperateType);
        } else if (key == "delete") {
          Modal.confirm({
            title: "确认要批量删除用户？",
            onOk: async () => {
              deleteUsers(selectedRowKeys).then((res) => {
                message.success('删除成功');
                setRefreshFlag(_.uniqueId('refreshFlag_'));
                onSelectNone();
              });
            },
            onCancel() { },
          });

        } else if (key == "start") {
          Modal.confirm({
            title: "确认要启用当前用户使用？",
            onOk: async () => {
              updateProperty("status", 1, selectedRowKeys).then((res) => {
                message.success('修改成功');
                setOperateType(OperateType.None);
                setRefreshFlag(_.uniqueId('refreshFlag_'));
                onSelectNone();
              });
            },
            onCancel() { },
          });

        } else if (key == "stop") {
          Modal.confirm({
            title: "确认要禁止当前用户使用？",
            onOk: async () => {
              updateProperty("status", 0, selectedRowKeys).then((res) => {
                message.success('修改成功');
                setOperateType(OperateType.None);
                setRefreshFlag(_.uniqueId('refreshFlag_'));
                onSelectNone();
              });
            },
            onCancel() { },
          });

        }


      }
    }

  };

  // 弹窗关闭回调
  const handleClose = (status) => {
    setVisible(false);
    setRefreshFlag(_.uniqueId('refresh_flag'));
  };

  const onSearchQuery = (e) => {
    let val = e.target.value;
    setQuery(val);
  };
  const onStatusChange = (e) => {
    let val = e;
    setStatus(val != null ? val : null);
    setRefreshFlag(_.uniqueId('refresh_flag'));
  };
  const onRowChange = (e) => {
    let val = e;
    setRole(val != null ? val : null);
    setRefreshFlag(_.uniqueId('refresh_flag'));
  };


  const onSelectChange = (selectedRowKeys, rows) => {
    console.log("onSelectChange", selectedRowKeys)
    console.log("rows", rows)
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(rows)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [refreshFlag, setRefreshFlag] = useState<string>(_.uniqueId('refresh_flag'));
  const getTableData = ({ current, pageSize }): Promise<any> => {
    let params = {
      page: current,
      limit: pageSize,
    };
    if (teamId > 0) {
      params["user_group_id"] = teamId;
    }
    if (status != null) {
      params["status"] = status;
    }
    if (role != null) {
      params["role"] = role;
    }
    return getUserInfoList({
      ...params,
      query,
    }).then((res) => {
      // let orgIds  =Array.from(new Set(res.dat.list.map(obj => obj.organization_id)))
      // getOrganizationsByIds(orgIds).then(({dat}) => {
      //    dat.forEach(item => {
      //     renderDataMap["organ_"+item.id] = item.name;
      //    });
      //    setRenderDataMap({...renderDataMap});
      // })
      return {
        total: res.dat.total,
        list: res.dat.list,
      };
    });
  };
  const { tableProps } = useAntdTable(getTableData, {
    defaultPageSize: pagination.pageSize,
    refreshDeps: [query, refreshFlag],
  });

  const onSelectNone = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  return (
    <PageLayout title={t('user.title')} icon={<UserOutlined />}>

      <div style={{ display: 'flex', width: '100%' }} className='user_management'>
        <div style={{ width: '300px', display: 'list-item' }}>
          <div className='sub-title'>
            用户组列表
            <Button
              size='small'
              type='link'
              onClick={() => {
                handleClick(ActionType.CreateTeam, 0, "team");
              }}
            >
              <PlusSquareOutlined />
            </Button>
          </div>
          <Tree
            onSelect={(keys, e) => {
              console.log(e)
              setTeamId(e.node.id);
              if (e.node.id > 0) {
                setTeamInfo(e.node)
              } else {
                setTeamInfo(undefined)
              }
              setSelectedKeys([e.node.id]);
              setRefreshFlag(_.uniqueId('refresh_flag'));
            }}
            className='left_tree'
            titleRender={titleRender}
            treeData={treeData}
            showLine
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            defaultExpandAll={true}
            fieldNames={{ key: 'id' }}
            onExpand={(keys) => setExpandedKeys(keys)}
          ></Tree>
        </div>
        <div className='user-manage-content'>
          <div className='user-content'>
            {teamInfo && teamInfo.name && (

              <Row className='team-info'>
                <Col
                  span='24'
                  style={{
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'inline',
                  }}
                >
                  {teamInfo && teamInfo.name}
                  <EditOutlined
                    style={{
                      marginLeft: '8px',
                      fontSize: '14px',
                    }}
                    onClick={() => handleClick(ActionType.EditTeam, teamId, "team")}
                  ></EditOutlined>
                  <DeleteOutlined
                    style={{
                      marginLeft: '8px',
                      fontSize: '14px',
                    }}
                    onClick={() => {
                      confirm({
                        title: t('common:confirm.delete'),
                        onOk: () => {
                          deleteTeam("" + teamId).then((_) => {
                            message.success(t('common:success.delete'));
                            // handleClose(true);
                            loadingTree();
                            setTeamId(0)
                            setTeamInfo(undefined)
                          });
                        },
                        onCancel: () => { },
                      });
                    }}
                  />
                </Col>
                <Col
                  style={{
                    marginTop: '8px',
                    color: '#666',
                  }}
                >
                  <Space>
                    <span>
                      {t('common:table.note')}：{teamInfo?.note ? teamInfo.note : '-'}
                    </span>
                    <span>
                      {t('common:table.update_by')}：{teamInfo?.update_by ? teamInfo.update_by : '-'}
                    </span>
                    <span>
                      {t('common:table.update_at')}：{teamInfo?.update_at ? moment.unix(teamInfo.update_at).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </span>
                  </Space>
                </Col>
              </Row>

            )}



            <Row className='event-table-search'>
              <div className='event-table-search-left'>
                <Input className={'searchInput_1'} suffix={<SearchOutlined />} onPressEnter={onSearchQuery} placeholder={t('输入用户名/角色/名称/邮箱/电话/手机等内容')} />
                <Select
                  style={{ width: '125px', marginLeft: '10px' }}
                  placeholder="请选择用户状态"
                  allowClear={true}
                  onChange={onStatusChange}
                  options={statusOptions}
                />
                <Select
                  style={{ width: '125px', marginLeft: '10px' }}
                  placeholder="请选择所属角色"
                  allowClear={true}
                  options={roleList}
                  onChange={onRowChange}>
                 
                </Select>
              </div>

              <div className='event-table-search-rightbutton'>
                <Button className='btn' type="primary" onClick={() => { handleOperateClick("add") }}>新增
                </Button>

              </div>
              <div className='event-table-search-right'>
                {profile.roles?.includes('Admin') && (
                  <div className='user-manage-operate'>
                    <Dropdown
                      trigger={['click']}
                      overlay={
                        <Menu onClick={({ key }) => {
                          handleOperateClick(key)
                        }} items={menu.items} />

                      }>
                      <Select style={{ width: '125px', marginLeft: '10px' }}
                        placeholder="操作"
                        allowClear={true}
                        onChange={onStatusChange}
                        options={statusOptions}></Select>

                    </Dropdown>
                  </div>
                )}
              </div>
            </Row>
            <Table
              size='small'
              rowKey='id'
              className='user_table_list'
              columns={userColumns}
              rowSelection={rowSelection}
              {...tableProps}
              pagination={{
                ...tableProps.pagination,
                ...pagination,
              }}
            />
          </div>
          <UserInfoModal
            visible={visible}
            action={action as ActionType}
            width={650}
            userType={(actionType == 'team') ? UserType.Team : UserType.User}
            onClose={handleClose}
            onSearch={event => {
              if (action == '创建团队') {
                loadingTree();
              }
            }}
            userId={"" + userId}
            teamId={teamId > 0 ? "" + teamId : undefined}
          />
          <OperationModal
            operateType={operateType}
            width={650}
            theme={''}
            setOperateType={setOperateType}
            initData={selectedRows}
            reloadList={async (value: any, operateType: string) => {
              // if(operateType=='changeCatalog'){
              // }
              setRefreshFlag(_.uniqueId('refreshFlag_'));
              onSelectNone();
            }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Resource;