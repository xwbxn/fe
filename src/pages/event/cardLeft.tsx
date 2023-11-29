import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Form, Modal, Switch, message, Tree } from 'antd';
import { EditOutlined, DeleteOutlined, PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { getAggrAlerts, AddAggrAlerts, updateAggrAlerts, deleteAggrAlerts } from '@/services/warning';
import { CommonStateContext } from '@/App';
import './index.less';
import { forEach } from 'lodash';
interface Props {
  onRefreshRule: (groupId: string) => void;
}

export interface CardAlertType {
  id: number;
  name: string;
  rule: string;
  cate: number;
  create_at: number;
  create_by: number;
  update_at: number;
}

export default function CardLeft(props: Props) {
  const { onRefreshRule } = props;
  const { t } = useTranslation('AlertCurEvents');
  const [form] = Form.useForm();
  const [alertList, setAlertList] = useState<CardAlertType[]>();
  const [visible, setVisible] = useState(false);
  const [editForm, setEditForm] = useState<CardAlertType>();
  const localSelectId = localStorage.getItem('selectedAlertRule');
  const [activeId, setActiveId] = useState<number>(localSelectId ? Number(localSelectId) : 0);
  const { profile,busiGroups } = useContext(CommonStateContext);
  const [treeData, setTreeData] = React.useState<any[]>();
  const localGroupSelectId = localStorage.getItem('selectedAlertGroup');
  const [groupId, setGroupId] = useState<number>(localGroupSelectId ? Number(localGroupSelectId) : 0);
  useEffect(() => {
    
    setTreeData(busiGroups);
    let isGroupExist = false;
    let currentGroup =groupId;
    busiGroups.forEach(item=>{
        if(item.id === currentGroup){
          isGroupExist = true;
        }
    })     
    if(!isGroupExist && busiGroups.length>0){
       currentGroup = busiGroups[0].id;
       setGroupId(currentGroup);
       localStorage.setItem('selectedAlertGroup', ""+busiGroups[0].id);
    }
    onRefreshRule(""+currentGroup);

  }, []);

  useEffect(() => {
    if (activeId && alertList && alertList.length > 0) {
      const currentAlert = alertList?.find((item) => item.id === activeId) as CardAlertType;
      if (currentAlert) {
        onRefreshRule(currentAlert.rule);
      } else {
        saveActiveId(alertList[0].id);
      }
    }
  }, [activeId]);

  function saveActiveId(id: number) {
    if (!id) return;
    setActiveId(id);
    localStorage.setItem('selectedAlertRule', String(id));
  }

  const getList = (selectTheFirst = false) => {
    return getAggrAlerts().then((res) => {
      const sortedList = res.dat.sort((a: CardAlertType, b: CardAlertType) => a.cate - b.cate);
      setAlertList(sortedList);
      selectTheFirst && sortedList.length > 0 && !sortedList.find((item) => item.id === activeId) && saveActiveId(sortedList[0].id);
      return sortedList;
    });
  };

  const handleOk = async () => {
    await form.validateFields();
    const func = editForm ? updateAggrAlerts : AddAggrAlerts;
    const values = form.getFieldsValue();
    const cur = await func({
      ...values,
      cate: values.cate ? 0 : 1,
    });
    setVisible(false);
    await getList();
    saveActiveId(editForm ? editForm.id : cur.dat.id);
    editForm && onRefreshRule(values.rule + '');
  };

  const handleCancel = () => {
    setVisible(false);
    setEditForm(undefined);
  };

  const onSelect = (selectedKeys, info) => {
    let id =selectedKeys;
    // console.log(id[0],info)
    setGroupId(id[0]);
    localStorage.setItem('selectedAlertGroup', id[0]);
    onRefreshRule(id[0] + '')
  };

  return (
    <div className='left-area' style={{ width: 240, background: '#fff', marginRight: 10 }}>
      <div className='event-page-title'>
        <span>业务组</span>
      </div>

      <div style={{ width: '220px', display: 'table', height: '100%',marginTop:'10px' }}>
        {treeData && (
          <Tree
            showLine={true}
            showIcon={true}
            style={{ marginTop: 0 }}
            treeData={treeData}
            defaultExpandAll={true}
            selectedKeys={[groupId]}
            autoExpandParent={true}
            checkStrictly
            fieldNames={{ key: 'id', title: 'name' }}
            onSelect={onSelect}
          />
        )}
      </div>
      

      <Modal title={editForm ? t('common:btn.edit') : t('common:btn.add')} visible={visible} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
        <Form
          form={form}
          layout='vertical'
          preserve={false}
          initialValues={{
            cate: false,
          }}
        >
          <Form.Item label={t('aggregate_rule_name')} name='name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>
          <Form.Item label={t('aggregate_rule')} name='rule' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {profile.admin && (
            <Form.Item label={t('isPublic')} name='cate' rules={[{ required: true }]} valuePropName='checked'>
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
