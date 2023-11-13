import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Row, Card, Checkbox, Form, Select, Radio } from 'antd';
import PageLayout from '@/components/pageLayout';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, SyncOutlined, GroupOutlined, SearchOutlined, DoubleLeftOutlined } from '@ant-design/icons';
const { confirm } = Modal;
import { SetConfigTables, SetConfigForms } from './catalog'
import { CommonStateContext } from '@/App';
import CommonModal from '@/components/CustomForm/CommonModal';
import './locale';
import './style.less';
import _ from 'lodash';
import { assetsType } from '@/store/assetsInterfaces';
import { deleteAssets, getAssets, getOrganizationTree, updateOrganization, deleteOrganization, addOrganization } from '@/services/assets';
import RefreshIcon from '@/components/RefreshIcon';
import { Link, useHistory } from 'react-router-dom';
const {TextArea} = Input

interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

export default function () {
  const { t } = useTranslation('assets');
  const commonState = useContext(CommonStateContext);
  const [treeData, setTreeData] = useState<any[]>();
  const [refreshKey, setRefreshKey] = useState(_.uniqueId('refreshKey_'));
  const history = useHistory();
  const [query, setQuery] = useState<string>('');
  const [props, setProps] = useState<any>({});
  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});

  const loadingTree = () => {
    getOrganizationTree({}).then(({ dat }) => {
      setTreeData(dat);
      initData["parent_id"] = dat;
      setInitData({ ...initData })
    });
  };

  useEffect(() => {
    loadingTree();
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
        loadingTree();
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
        loadingTree();
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
      formSubmit(values, businessForm)
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
      loadingTree();
    });
  };


  return (
    <PageLayout icon={<GroupOutlined />} title={'许可信息'}>
      <div className='assets-list' style={{ height: '30px', lineHeight: '39px' }}>
        <Row className='event-table-search'>
          <div className='event-table-search-left' style={{ marginLeft: '10px' }}>
            客户名称：西安政务网
          </div>
          <div className='event-table-search-right'>
            <div className='user-manage-operate'>
              <Button type='primary' onClick={() => handleClick('create')} >
                一键导出
              </Button>
            </div>
          </div>
        </Row>
        <Table
          dataSource={treeData}
          rowSelection={{

          }}
          pagination={false}
          columns={[
            {
              title: '采集器名称',
              dataIndex: 'name',
              render(value, record, index) {
                return value;
              },
            },
            {
              title: '主版本号',
              dataIndex: 'city',
            },
            {
              title: '采集器版本',
              dataIndex: 'address',
            },
            {
              title: t('有效模块'),
              dataIndex: 'manger',
            },
            {
              title: '有效期',
              dataIndex: 'phone',
            },
            {
              title: '许可节点数',
              dataIndex: 'description',
            },
            {
              title: '已用许可节点',
              dataIndex: 'description',
            },
            {
              title: '操作',
              width: '180px',
              align: 'center',
              render: (text: string, record: assetsType) => (
                <div className='table-operator-area'>
                  <Button size='small' className='oper-name' type='link' icon={<SyncOutlined />} onClick={() => {
                    handleClick("update", record);
                  }}>
                    更新证书
                  </Button>

                </div>
              ),
            },
          ]}
          rowKey='id'
          size='small'
        ></Table>

        <Card
          hoverable
          title='License 通知设置'
          className='notice_set'
          extra={<a href="#"><DoubleLeftOutlined style={{ transform: 'rotate(270deg)' }} /> 更多 </a>} style={{ width: 300 }}
        >
          <Form
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 890 }}
            initialValues={{ remember: true }}
            className='license_submit_form'
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="License 到期提醒时间"
              name="username"
              
              rules={[{ required: true, message: '请选择 License 到期提醒时间' }]}
            >
              <Select options={[{
                 value:7,label:'7天'
                }]}>
              </Select>
            </Form.Item>

            <Form.Item
              label="剩余节点提醒"
            >
              <div className='hint_message'>
              数量少于
              <Form.Item
                   name="password"
                   rules={[{ required: true, message: '输入剩余节点提醒' }]}
             >
                 <Input placeholder='输入数值' />
                 </Form.Item>              
              开始提醒
              </div>
            </Form.Item>

            <Form.Item
              name="提醒频率"
              label="提醒频率"
              valuePropName="checked"
            >
              <Radio.Group>
                <Radio value={1}>只发送一次</Radio>
                <Radio value={10000}>每天发送一次</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="通知的邮箱地址"
              label="通知的邮箱地址"
            >
              <TextArea placeholder='多个邮件用英文分号隔开'> </TextArea>
            </Form.Item>
            <Form.Item
              name="微信号"
              label="微信号"
              valuePropName="checked"
            >
              <TextArea placeholder='多个微信号用英文分号隔开(对接的微信才能发送通知)'>Remember me</TextArea>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 12, span: 16 }} className='submit_button'>
              <Space >
                <Button >
                  编辑
                </Button>
                <Button type="primary" htmlType="submit">
                  保存
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
