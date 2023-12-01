import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Row, Card, Checkbox, Form, Select, Radio } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, SyncOutlined, GroupOutlined, SearchOutlined, DoubleLeftOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import { SetConfigTables, SetConfigForms } from './catalog'
import { CommonStateContext } from '@/App';
import CommonModal from '@/components/CustomForm/CommonModal';
import './style.less';
import _ from 'lodash';
import { assetsType } from '@/store/assetsInterfaces';
import { deleteAssets, getAssets, getOrganizationTree, updateOrganization, deleteOrganization, addOrganization } from '@/services/assets';
import RefreshIcon from '@/components/RefreshIcon';
import { Link, useHistory } from 'react-router-dom';


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
  const [query, setQuery] = useState<string>('');
  const [props, setProps] = useState<any>({});
  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});

 

  useEffect(() => {
  }, [query]);

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

  const handleClick = (action: string, record?: any) => {

    let configId = "organization_set";
    let businessZip = SetConfigForms[configId];
    businessZip.Modal.title = "-" + businessZip.Modal.title;
    businessZip.renderFields = (text, record, field) => {
      return renderFields(text, record, field, configId);
    };
    businessForm["businessId"] = configId;
    businessForm["isOpen"] = true;
    if (action == "create") {
      businessForm["operate"] = "添加";
      businessForm["operateId"] = null;
      setFormData(null)
    } else {
      businessForm["operate"] = "修改";
      businessForm["operateId"] = record.id;
      if (record.parent_id == 0) {
        delete record.parent_id;
      }
      setFormData(record)
    }
    setBusinessForm(_.cloneDeep(businessForm))
    businessZip.Modal.cancel = () => {
      businessForm.isOpen = false;
      setBusinessForm(_.cloneDeep(businessForm))
    };
    businessZip.Modal.submit = async (values) => {
      // formSubmi(values, businessForm)
    };
    businessZip.initData = initData;
    setProps((businessZip));
    console.log("初始化页面加载信息", businessZip);

  }
  const onSearchQuery = (e) => {
    let val = e.target.value;
    setQuery(val);
  };
  const deleteNode = (node) => {
    deleteOrganization(node.id).then(() => {
    });
  };


  return (
    <PageLayout icon={<GroupOutlined />} title={'许可证管理'}>
      <div className='log_debug_switch' >
        <Card
          hoverable
          title='更新许可证书：'
          className='notice_set'
        >
          <Form
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
              className='ip_container'
            >
                <Input disabled={true}  />
              </Form.Item >
              <Form.Item label="License文件1"
              rules={[{ required: true, message: '请选择 License文件' }]}
              >
                <Input type="file" ></Input>
              </Form.Item>

              <Form.Item label="License文件2"
              rules={[{ required: true, message: '请选择 License文件' }]}>
                <Input type="file" ></Input>
              </Form.Item>
              
             
            <Form.Item wrapperCol={{ offset: 12, span: 16 }} className='submit_button'>
              <Space >
                <Button type='primary' style={{margin:'5px'}}>
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
