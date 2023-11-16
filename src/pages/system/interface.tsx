import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag, Tree, Switch, Row, Form, Checkbox, Card, FormInstance, Popconfirm } from 'antd';
import PageLayout from '@/components/pageLayout';
import { CheckCircleOutlined, DownOutlined, GroupOutlined, SearchOutlined } from '@ant-design/icons';
import { SetConfigTables, SetConfigForms,InterfaceForms } from './catalog'
import { CommonStateContext } from '@/App';
import './style.less';
import _ from 'lodash';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { title } from 'process';
import { getPwInfo,saveIpAndPw } from '@/services/interface';
import ClipboardJS from 'clipboard';

export default function () {
  const commonState = useContext(CommonStateContext);

  const [initData, setInitData] = useState({});
  const [formData, setFormData] = useState<any>({});
  const [businessForm, setBusinessForm] = useState<any>({});

  const [refArr, setRefArr] = useState({});
<<<<<<< HEAD
  const [ipchecks, setIpChecks] = useState<any>({});
  const [pwchecks, setPwChecks] = useState<any>({});
  const [inputIpVal, setInputIpVal] = useState<any>({});
  const [inputPwVal, setInputPwVal] = useState<any>({});
  const [showmiyao, setShowmiyao] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showmiyaoew, setShowmiyaoew] = useState<any>();
  const copyButtonRef = useRef(null);

  

  useEffect(() => {
    const clipboard = new ClipboardJS('#copyButton');
    clipboard.on('success', (e) => {
      console.log('内容已复制到剪贴板');
    });
  
    clipboard.on('error', (e) => {
      console.error('复制失败:', e);
    });
  
    return () => {
      clipboard.destroy();
    };

=======
  const [checks, setChecks] = useState<any>({});
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
     setChecks({...checks})
>>>>>>> 4cd47361917fa5a10c78493015fc1794082a25cf
  }, []);

  const renderFields = (text, record, field, currentConfigId) => {
    console.log("渲染数据列", text, record, field, currentConfigId);
    let value = record[field];
    return value;
  }
<<<<<<< HEAD
  const onIpChange = (e: CheckboxChangeEvent,id) => {
    //console.log('checked = ', e.target.checked);
    // setChecked(e.target.checked);
    ipchecks[id] =e.target.checked?false:true;
    setIpChecks(_.cloneDeep({...ipchecks}))
    //console.log('newipchecks = ', ipchecks);
  };
  const onPwChange = (e: CheckboxChangeEvent,id) => {
    //console.log('checked = ', e.target.checked);
    // setChecked(e.target.checked);
    pwchecks[id] =e.target.checked?false:true;
    setPwChecks(_.cloneDeep({...pwchecks}))
    //console.log('newpwchecks = ', pwchecks);
  };
  const onInputIpChange = (e: React.ChangeEvent<HTMLInputElement>,id: string) => {
    inputIpVal[id]=e.target.value;
    setInputIpVal(_.cloneDeep({...inputIpVal}));
    console.log('inputIpVal = ', inputIpVal);
  };
  const onInputPwChange = (e: React.ChangeEvent<HTMLInputElement>,id: string) => {
    inputPwVal[id]=e.target.value;
    setInputPwVal(_.cloneDeep({...inputPwVal}));
    console.log('inputPwVal = ', inputPwVal);
  };
  const handleCopy = (st) => {
    // 复制内容的逻辑
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
=======
  const onChange = (e,id) => {
    console.log('checked = ', e.target.checked);
    // setChecked(e.target.checked);
    checks[id] =e.target.checked?false:true;
    setChecks(_.cloneDeep({...checks}))
    console.log('checked = ', checks);
  };
>>>>>>> 4cd47361917fa5a10c78493015fc1794082a25cf

  const handleClick = (action: any, id: any) => {
      console.log('handleClick',action,id);
  }


  return (
    <PageLayout icon={<GroupOutlined />} title={'接口访问设置'}>
      <div className='body-list' >
        {InterfaceForms.map((modelFF, index) => {
          refArr[modelFF.id] = createRef<FormInstance>();
<<<<<<< HEAD
          //pwchecks[modelFF.id] = false;
=======
          checks[modelFF.id] = true;
>>>>>>> 4cd47361917fa5a10c78493015fc1794082a25cf
          return (
            <Card
              hoverable
              title={modelFF.title}
              key={'card-hoverable'+index}
              className='interface_set'
            >
              <Form
                name={modelFF.id}
                labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                className='interface_submit_form'
                layout="inline"
                initialValues={{}}
                ref={refArr[modelFF.id]}
                onFinish={e => {
                  // handleClick(e, modelFF.id);
                }}
                // autoComplete="off"
              >
<<<<<<< HEAD
                {/* <Form.Item name="ipv" key={'ipv-'+index}>
                  <Checkbox value={1}>IP验证</Checkbox>                 
                </Form.Item>

                <Form.Item label="访问IP白名单" name="white_ips" key={'white_ips-'+index} >
                  <Input placeholder='填写IP地址，逗号隔开' 
                  disabled={true} ></Input>
                </Form.Item> */}

                <Form.Item name={"ipv"} key={'ipv-'+index}>
                  
                  <Checkbox onChange={e=>{
                    onIpChange(e,modelFF.id)
                  }} value={1} >IP验证</Checkbox>                 
                </Form.Item>
                <Form.Item label="访问IP白名单" name="white_ips" key={'white_ips-'+index} >
                  <Input placeholder='填写IP地址,逗号隔开' disabled={ipchecks[modelFF.id]?true:false}
                  
                  value={inputIpVal}
                  //onChange={(e) => setInputIpVal(e.target.value)}
                  onChange={e=>{onInputIpChange(e,modelFF.id)}}
                  ></Input>
=======
                

                <Form.Item name={'Q'+modelFF.id} key={'ipv-'+index}>
                  <Checkbox onChange={e=>{
                    onChange(e,modelFF.id)
                  }} >IP验证</Checkbox>                 
                </Form.Item>
                <Form.Item  label="访问IP白名单" name="white_ips" key={'white_ips-'+index} >
                  <Input disabled={checks[modelFF.id]}  ></Input>
>>>>>>> 4cd47361917fa5a10c78493015fc1794082a25cf
                </Form.Item>

                <Form.Item name="pdv"  key={'pdv-'+index}>
                  <Checkbox onChange={e=>{
                    onPwChange(e,modelFF.id)
                  }}  value={1}>密码验证</Checkbox>
                </Form.Item>
                <Form.Item label="密码" name="pwd" key={'pwd-'+index}>
                  <Input.Password placeholder='填写密码' disabled={pwchecks[modelFF.id]?true:false}
                  value={inputPwVal}
                  onChange={e=>{onInputPwChange(e,modelFF.id)}}
                  ></Input.Password>
                </Form.Item>
                <Form.Item className='submit_buttons'>
                  <Space >
                    <Button className='view_passwd' onClick={() => {
                      if(inputPwVal[modelFF.id]==null||inputPwVal[modelFF.id]==''){
                        alert("请输入密码");
                      }
                      else{
                        console.log("inputPwVal[modelFF.id]");
                        console.log(inputPwVal[modelFF.id]);
                        
                        getPwInfo(inputPwVal[modelFF.id]).then((res) => {
                             console.log(inputPwVal[modelFF.id]);
                             console.log(res.dat.remark);
                             setShowmiyaoew(res.dat.remark);
                          })
                        setIsModalVisible(true);
                      } 
                  }}>
                      查看秘钥
                    </Button>
                    {isModalVisible && (
                    <Modal
                      title="密钥"
                      visible={isModalVisible}
                      onCancel={() => setIsModalVisible(false)}
                      footer={[
                        // <button  key="copy" onClick={() => handleCopy(showmiyaoew)}>
                        //   复制
                        // </button>,
                        <button id="copyButton" key="copy" ref={copyButtonRef} data-clipboard-text={showmiyaoew}>
                            复制
                          </button>,
                        <button key="cancel" onClick={() => setIsModalVisible(false)}>
                          取消
                        </button>,
                      ]}
                    >
                      {showmiyaoew}
                    </Modal>
      )}
                    <Button htmlType="submit" className='save_button' onClick={() => {
                    save(inputIpVal[modelFF.id],inputPwVal[modelFF.id])
                  }}>
                      保存
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

          )

        })}


      </div>
    </PageLayout>
  );
}

<<<<<<< HEAD


function save(inputIpVal: any, inputPwVal: any) {
  saveIpAndPw(inputIpVal,inputPwVal);
}

=======
>>>>>>> 4cd47361917fa5a10c78493015fc1794082a25cf
