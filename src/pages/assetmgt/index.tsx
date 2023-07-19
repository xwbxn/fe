import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Button, Dropdown, Form, Input, Menu, message, Modal, Select, Space, Table, Tag, Tooltip, Tree, Switch, TreeSelect } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, DownOutlined, GroupOutlined, SearchOutlined } from '@ant-design/icons';
import {
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;

import { CommonStateContext } from '@/App';

import './locale';
import './style.less';
import _, { debounce } from 'lodash';
import Add from './Add';
import Edit from './Edit';
import { assetsType } from '@/store/assetsInterfaces';
import { bindTags, deleteAssets, getAssets, getAssetsTags, moveTargetBusi, unbindTags, updateAssetNote, getOrganizeTree, updateOrganize, deleteOrganize, addOrganize, changeAssetOrganize } from '@/services/assets';
import RefreshIcon from '@/components/RefreshIcon';
import { Link, useHistory } from 'react-router-dom';
import { getBusiGroups } from '@/services/common';
const { TreeNode } = Tree;
export { Add, Edit };

enum OperateType {
  BindTag = 'bindTag',
  UnbindTag = 'unbindTag',
  UpdateBusi = 'updateBusi',
  RemoveBusi = 'removeBusi',
  UpdateNote = 'updateNote',
  Delete = 'delete',
  ChangeOrganize = 'changeOrganize',
  None = 'none',
}

const { TextArea } = Input;
const expandedKeyArr = ["0"];
const selectOrganizeNode = { id: 0, value: '' };

interface OrgType {
  name: string
  id?: number
  parent_id: number
  children: OrgType[]
  title?: string
  isEditable: boolean
  key: number
}


const OperationModal = ({ operateType, setOperateType, assets, names, reloadList }) => {
  const { t } = useTranslation('assets');
  const { busiGroups } = useContext(CommonStateContext);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [organize, setOrganize] = useState<number>(1);
  const [assetsList, setAssetsList] = useState<string[]>(assets);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const detailProp = operateType === OperateType.UnbindTag ? tagsList : busiGroups;
  const [organizeData, setOrganizeData] = useState<OrgType>();
  // 绑定标签弹窗内容
  const bindTagDetail = () => {
    // 校验单个标签格式是否正确
    function isTagValid(tag) {
      const contentRegExp = /^[a-zA-Z_][\w]*={1}[^=]+$/;
      return {
        isCorrectFormat: contentRegExp.test(tag.toString()),
        isLengthAllowed: tag.toString().length <= 64,
      };
    }

    // 渲染标签
    function tagRender(content) {
      const { isCorrectFormat, isLengthAllowed } = isTagValid(content.value);
      return isCorrectFormat && isLengthAllowed ? (
        <Tag closable={content.closable} onClose={content.onClose}>
          {content.value}
        </Tag>
      ) : (
        <Tooltip title={isCorrectFormat ? t('bind_tag.render_tip1') : t('bind_tag.render_tip2')}>
          <Tag color='error' closable={content.closable} onClose={content.onClose} style={{ marginTop: '2px' }}>
            {content.value}
          </Tag>
        </Tooltip>
      );
    }

    // 校验所有标签格式
    function isValidFormat() {
      return {
        validator(_, value) {
          const isInvalid = value.some((tag) => {
            const { isCorrectFormat, isLengthAllowed } = isTagValid(tag);
            if (!isCorrectFormat || !isLengthAllowed) {
              return true;
            }
          });
          return isInvalid ? Promise.reject(new Error(t('bind_tag.msg2'))) : Promise.resolve();
        },
      };
    }

    return {
      operateTitle: t('bind_tag.title'),
      requestFunc: bindTags,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('common:table.tag')} name='tags' rules={[{ required: true, message: t('bind_tag.msg1') }, isValidFormat]}>
            <Select mode='tags' tokenSeparators={[' ']} open={false} placeholder={t('bind_tag.placeholder')} tagRender={tagRender} />
          </Form.Item>
        );
      },
    };
  };

  // 解绑标签弹窗内容
  const unbindTagDetail = (tagsList) => {
    return {
      operateTitle: t('unbind_tag.title'),
      requestFunc: unbindTags,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('common:table.tag')} name='tags' rules={[{ required: true, message: t('unbind_tag.msg') }]}>
            <Select mode='multiple' showArrow={true} placeholder={t('unbind_tag.placeholder')} options={tagsList.map((tag) => ({ label: tag, value: tag }))} />
          </Form.Item>
        );
      },
    };
  };

  // 移出业务组弹窗内容
  const removeBusiDetail = () => {
    return {
      operateTitle: t('remove_busi.title'),
      requestFunc: moveTargetBusi,
      isFormItem: false,
      render() {
        return <Alert message={t('remove_busi.msg')} type='error' />;
      },
    };
  };

  // 修改备注弹窗内容
  const updateNoteDetail = () => {
    return {
      operateTitle: t('update_note.title'),
      requestFunc: updateAssetNote,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('common:table.note')} name='note'>
            <Input maxLength={64} placeholder={t('update_note.placeholder')} />
          </Form.Item>
        );
      },
    };
  };
  const changeOrganizeDetail = () => {
    getOrganizeTree({}).then(({ dat }) => {
        setOrganizeData(dat)
    });
    return {
      operateTitle: t('变更资产所属组织树'),
      requestFunc: changeAssetOrganize,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('所属组织树')} name='organizeId' rules={[{ required: true, message: t('请选择组织树') }]}>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={organize}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择所属组织机构"
              allowClear
              treeData={organizeData}
            > </TreeSelect>
          </Form.Item>
        );
      },
    };
  };

  // 批量删除弹窗内容
  const deleteDetail = () => {
    return {
      operateTitle: t('batch_delete.title'),
      requestFunc: deleteAssets,
      isFormItem: false,
      render() {
        return <Alert message={t('batch_delete.msg')} type='error' />;
      },
    };
  };

  // 修改业务组弹窗内容
  const updateBusiDetail = (busiGroups) => {
    return {
      operateTitle: t('update_busi.title'),
      requestFunc: moveTargetBusi,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('update_busi.label')} name='bgid' rules={[{ required: true }]}>
            <Select
              showSearch
              style={{ width: '100%' }}
              options={filteredBusiGroups.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              optionFilterProp='label'
              filterOption={false}
              onSearch={handleSearch}
              onFocus={() => {
                getBusiGroups('').then((res) => {
                  setFilteredBusiGroups(res.dat || []);
                });
              }}
              onClear={() => {
                getBusiGroups('').then((res) => {
                  setFilteredBusiGroups(res.dat || []);
                });
              }}
            />
          </Form.Item>
        );
      },
    };
  };

  const operateDetail = {
    bindTagDetail,
    unbindTagDetail,
    updateBusiDetail,
    removeBusiDetail,
    updateNoteDetail,
    changeOrganizeDetail,
    deleteDetail,
    noneDetail: () => ({
      operateTitle: '',
      requestFunc() {
        return Promise.resolve();
      },
      isFormItem: false,
      render() { },
    }),
  };
  const { operateTitle, requestFunc, isFormItem, render } = operateDetail[`${operateType}Detail`](detailProp);
  const [filteredBusiGroups, setFilteredBusiGroups] = useState(busiGroups);
  function formatValue() {
    const inputValue = form.getFieldValue('ids');
    const formattedIds = inputValue.split(/[ ,\n]+/).filter((value) => value);
    const formattedValue = formattedIds.join('\n');
    // 自动格式化表单内容
    if (inputValue !== formattedValue) {
      form.setFieldsValue({
        ids: formattedValue,
      });
    }
    // 当对象标识变更时，更新标识数组
    if (assetsList.sort().join('\n') !== formattedIds.sort().join('\n')) {
      setAssetsList(formattedIds);
    }
  }

  // 提交表单
  function submitForm() {
    form.validateFields().then((data) => {
      setConfirmLoading(true);
      data.ids = data.ids.split('\n');
      if (OperateType.ChangeOrganize == "changeOrganize") {
        let param = {
          ids: data.ids.map(Number),
          id: data.organizeId,
        };
        changeAssetOrganize(param)
          .then(() => {
            setOperateType(OperateType.None);
            reloadList();
            form.resetFields();
            setConfirmLoading(false);
          })
          .catch(() => setConfirmLoading(false));
      } else {
        requestFunc(data)
          .then(() => {
            setOperateType(OperateType.None);
            reloadList();
            form.resetFields();
            setConfirmLoading(false);
          })
          .catch(() => setConfirmLoading(false));
      }
    });
  }

  // 初始化展示所有业务组
  useEffect(() => {
    if (!filteredBusiGroups.length) {
      setFilteredBusiGroups(busiGroups);
    }
  }, [busiGroups]);

  const fetchBusiGroup = (e) => {
    getBusiGroups(e).then((res) => {
      setFilteredBusiGroups(res.dat || []);
    });
  };
  const handleSearch = useCallback(debounce(fetchBusiGroup, 800), []);




  // 点击批量操作时，初始化默认监控对象列表
  useEffect(() => {

    if (operateType !== OperateType.None) {
      setAssetsList(assets);
      form.setFieldsValue({
        names: names.join('\n'),
      });
      form.setFieldsValue({
        ids: assets.join('\n'),
      });
    }
  }, [operateType, assets]);

  // 解绑标签时，根据输入框监控对象动态获取标签列表
  useEffect(() => {
    if (operateType === OperateType.UnbindTag && assetsList.length) {
      getAssetsTags({ ids: assetsList.join(',') }).then(({ dat }) => {
        // 删除多余的选中标签
        const curSelectedTags = form.getFieldValue('tags') || [];
        form.setFieldsValue({
          tags: curSelectedTags.filter((tag) => dat.includes(tag)),
        });

        setTagsList(dat);
      });
    }
  }, [operateType, assetsList]);

  return (
    <Modal
      visible={operateType !== 'none'}
      title={operateTitle}
      confirmLoading={confirmLoading}
      okButtonProps={{
        danger: operateType === OperateType.RemoveBusi || operateType === OperateType.Delete,
      }}
      okText={operateType === OperateType.RemoveBusi ? t('remove_busi.btn') : operateType === OperateType.Delete ? t('batch_delete.btn') : t('common:btn.ok')}
      onOk={submitForm}
      onCancel={() => {
        setOperateType(OperateType.None);
        form.resetFields();
      }}
    >
      {/* 基础展示表单项 */}
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item name='ids' rules={[{ required: true }]} hidden>
          <TextArea autoSize={{ minRows: 3, maxRows: 10 }} onBlur={formatValue} />
        </Form.Item>
        <Form.Item label={t('assets')} name='names' rules={[{ required: true }]}>
          <TextArea autoSize={{ minRows: 3, maxRows: 10 }} placeholder={t('assets_placeholder')} onBlur={formatValue} readOnly />
        </Form.Item>
        {isFormItem && render()}
      </Form>
      {!isFormItem && render()}
    </Modal>
  );
};

export default function () {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [list, setList] = useState<any[]>([]);
  const [curBusiId, setCurBusiId] = useState<number>(commonState.curBusiId);
  const [organizeId, setOrganizeId] = useState<number>(commonState.organizeId);
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [selectedAssetsName, setSelectedAssetsName] = useState<string[]>([]);
  const history = useHistory();
  const [searchVal, setSearchVal] = useState('');
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const [data, setData] = useState<[]>();
  const [treeData, setTreeData] = useState<OrgType[]>([]);
  const [modifyType, setModifyType] = useState<boolean>(false);
  
  const [curValue, setcurValue] = useState<string>("")

  const loadingTree = () => {
    getOrganizeTree({}).then(({ dat }) => {
      setTreeData(dat)
    });
  };

  useEffect(() => {
    getAssets(curBusiId, searchVal, -1).then((res) => {
      setList(res.dat);
    });
  }, [searchVal, refreshKey, curBusiId]);

  useEffect(() => {
    loadingTree();
  }, [])

  const [expandedKeys, setExpandedKeys] = useState(expandedKeyArr);

  const onExpand = (expandedKeys) => {
    //记录折叠的key值
    setExpandedKeys(expandedKeys);
  };

  const onTypeChange = (checked: boolean) => {
    setModifyType(checked);
  }
  const renderTreeNodes = (data) => {
    if (data == null) {
      return
    }
    let nodeArr = data.map((item) => {
      if (item.isEditable) {
        item.title = (
          <div>
            <input defaultValue={item.name || ''} name={item.key} onChange={(e) => { setcurValue(e.target.value) }} />

            <CloseOutlined
              style={{ marginLeft: 10 }}
              onClick={() => { onClose(item) }}
            />

            <CheckOutlined
              style={{ marginLeft: 10 }}
              onClick={() => onSave(item)}
            />
          </div>
        );
      } else {
        item.title = (
          <div style={{ position: "relative", width: "100%" }}>
            <span>{item.name}</span>
            <span style={{ position: "absolute", right: 5 }}>
              {(modifyType && item.parent_id >= 0) ? (
                <EditOutlined
                  style={{ marginLeft: 10 }}
                  onClick={() => onEdit(item)}
                />
              ) : null}

              {(modifyType && item.id > 0) ? (
                <PlusOutlined
                  style={{ marginLeft: 10 }}
                  onClick={() => onAdd(item)}
                />
              ) : null}
              {(modifyType) ? (
                <MinusOutlined
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    confirm({
                      title: '确认要删除吗',
                      onOk: () => {
                        onDelete(item)
                      },
                      onCancel: () => { },
                    })
                  }
                  }
                />
              ) : null}
            </span>
          </div>
        );
      }

      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} style={{ width: "100%" }}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} />;
    });

    return nodeArr;
  };

  const onAdd = (item) => {
    let num = Math.floor((Math.random() * 100000) + 1);
    // debugger
    if (item.key === 0) {
      let param: OrgType = {
        name: "未定义",
        parent_id: 0,
        isEditable: false,
        key: -1 * num,//nanoid(),
        children: []
      };
      treeData.push(param);
    } else {
      addNode(item);
    }
    //useState里数据务必为immutable （不可赋值的对象），所以必须加上slice()返回一个新的数组对象
    // setData(data.slice());
    setTreeData(treeData.slice())
    if (expandedKeys.indexOf(item.key) === -1) {
      expandedKeyArr.push(item.key);
    }
    setExpandedKeys(expandedKeyArr.slice());
  };

  const addNode = (item) => {
    let num = Math.floor((Math.random() * 100000) + 1);
    if (!item.children) {
      item.children = [];
    }
    item.children.push({
      name: "未定义",
      parent_id: item.key,
      key: -1 * num,//nanoid(),
    });
    return;
  };

  const onEdit = (key) => {
    editNode(key);
  };

  const editNode = (item) => {
    item.isEditable = true;
    item.value = item.defaultValue; // 当某节点处于编辑状态，并改变数据，点击编辑其他节点时，此节点变成不可编辑状态，value 需要回退到 defaultvalue
    setTreeData(treeData.slice())
  };


  const onSave = (item) => {
    saveNode(item);
  };

  // const selectNode = (key, data) =>{
  //   const index  =  0;
  //   data.forEach((item) => {
  //     if (item.key === key && key > 0) {
  //           return 
  //     }
  //     if (item.children) {
  //         selectNode(key, item.children);
  //     }
  //   });

  // }

  


  const saveNode = (item) => {
    if (item.key >= 0) {
      let param = {
        id: parseInt(item.key),
        name: curValue
      }
      updateOrganize(item.key, param).then((res) => {
        loadingTree()
      });
    } else {
      let param = {
        parent_id: item.parent_id,
        name: curValue
      }
      addOrganize(param).then((res) => {
        loadingTree();
      });
    }
    item.isEditable = false;
  }

  const onClose = (item) => {
    item.isEditable = false;
    setTreeData(treeData.slice())
  };

  const onDelete = (item) => {
     if (item.key >= 0) {
        deleteOrganize(item.key).then((res) => {
           loadingTree()
      });
     }
      deleteNode(item.key,treeData);
      setTreeData(treeData.slice())
  };


  const deleteNode = (key, data) =>{
      data.forEach((item, index) => {
        if (item.key === key) {      
          data.splice(index, 1);
	        // setTreeData(data.slice()) // TODO递归删除
          return;
        } else {
          if (item.children) {
            deleteNode(key, item.children);
          }
        }
      });
  }

  const onSelect = (e:number) => {
    selectNode(parseInt(e[0]));
  }

  const selectNode = (key:number) => {
    if(key!=undefined && key>0){
      getAssets(curBusiId, searchVal, key).then((res) => {
        setList(res.dat);
      });
    }
    
  };


  return (
    <PageLayout icon={<GroupOutlined />} title={t('title')}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: "400px", display: "list-item" }}>
          <span className='organize_title_cls'>组织树列表</span>
          <div style={{ position: 'relative', alignItems: 'revert', display: 'flex', float: 'right',marginRight:'10px',marginTop:'5px'}}>

            <div style={{ display: (modifyType) ? 'block' : 'none' }}>
              <PlusOutlined
                style={{ marginLeft: 10, marginRight: 10 }}
                onClick={() => onAdd({key:0})}
              />
            </div>

            <div style={{ margin: '0 10prx ' }}><Switch checkedChildren="开启管理" defaultChecked={modifyType} unCheckedChildren="关闭管理" onChange={onTypeChange} /></div>
          </div>
          <Tree onSelect={onSelect} >
            {renderTreeNodes(treeData)}
          </Tree>
        </div>
        {/* {<TreeGroup data={organizeData} ></TreeGroup>} */}

        <div className='table-content'>
          <div className='table-header'>
            <Space>
              <RefreshIcon
                onClick={() => {
                  setRefreshKey(_.uniqueId('refreshKey_'));
                }}
              />
              <div className='table-handle-search'>
                <Input
                  className={'searchInput'}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  prefix={<SearchOutlined />}
                  placeholder={t('search_placeholder')}
                />
              </div>
            </Space>
            <Space>
              <div>
                <Button
                  type='primary'
                  onClick={() => {
                    // debugger
                    if (selectOrganizeNode.id > 0) {
                      commonState.setOrganizeId(selectOrganizeNode.id);
                      history.push(`/assetmgt/add/${curBusiId}/${selectOrganizeNode.id}`);
                    } else {
                      message.open({
                        type: 'error',
                        content: '请选择组织资产!',
                        duration: 2,
                      });
                    }
                  }}
                >
                  {t('common:btn.add')}
                </Button>
              </div>
              <div>
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu
                      style={{ width: '100px' }}
                      onClick={({ key }) => {
                        setOperateType(key as OperateType);
                      }}
                    >
                      <Menu.Item key={OperateType.BindTag}>{t('bind_tag.title')}</Menu.Item>
                      <Menu.Item key={OperateType.UnbindTag}>{t('unbind_tag.title')}</Menu.Item>
                      <Menu.Item key={OperateType.UpdateBusi}>{t('update_busi.title')}</Menu.Item>
                      <Menu.Item key={OperateType.RemoveBusi}>{t('remove_busi.title')}</Menu.Item>
                      <Menu.Item key={OperateType.UpdateNote}>{t('update_note.title')}</Menu.Item>
                      <Menu.Item key={OperateType.Delete}>{t('batch_delete.title')}</Menu.Item>
                      <Menu.Item key={OperateType.ChangeOrganize}>{t('变更组织树')}</Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    {t('common:btn.batch_operations')} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </Space>
          </div>
          <div className='assets-list'>
            <Table
              dataSource={list}
              rowSelection={{
                onChange: (_, rows) => {
                  setSelectedAssets(rows ? rows.map(({ id }) => id) : []);
                  setSelectedAssetsName(rows ? rows.map(({ name }) => name) : []);
                },
              }}
              columns={[
                {
                  title: t('name'),
                  dataIndex: 'name',
                  render(value, record, index) {
                    return <Link to={{ pathname: `/assets/${record.id}` }}>{value}</Link>;
                  },
                },
                {
                  title: t('type'),
                  dataIndex: 'type',
                },
                {
                  title: t('label'),
                  dataIndex: 'label',
                },
                {
                  title: t('tags'),
                  dataIndex: 'tags',
                  render(tagArr) {
                    const content =
                      tagArr &&
                      tagArr.map((item) => (
                        <Tag color='purple' key={item}>
                          {item}
                        </Tag>
                      ));
                    return tagArr && content;
                  },
                },
                {
                  title: t('memo'),
                  dataIndex: 'memo',
                },
                {
                  title: t('status'),
                  dataIndex: 'status',
                  render(value) {
                    return value === 1 ? (
                      <Space>
                        <CheckCircleOutlined style={{ color: 'green' }} />
                        已生效
                      </Space>
                    ) : (
                      <Space>
                        <CheckCircleOutlined style={{ color: 'grey' }} />
                        未生效
                      </Space>
                    );
                  },
                },
                {
                  title: t('common:table.operations'),
                  width: '180px',
                  render: (text: string, record: assetsType) => (
                    <div className='table-operator-area'>
                      <div
                        className='table-operator-area-warning'
                        onClick={async () => {
                          Modal.confirm({
                            title: t('common:confirm.delete'),
                            onOk: async () => {
                              await deleteAssets({ ids: [record.id.toString()] });
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
            ></Table>
            <OperationModal
              operateType={operateType}
              setOperateType={setOperateType}
              assets={selectedAssets}
              names={selectedAssetsName}
              reloadList={() => {
                setRefreshKey(_.uniqueId('refreshKey_'));
              }}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

