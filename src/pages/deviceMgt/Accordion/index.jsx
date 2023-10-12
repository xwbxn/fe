import React, { Component, useEffect, useRef, useState } from 'react';
import './index.less';
import { AppstoreAddOutlined, CheckOutlined, CloseOutlined, DownOutlined, RightOutlined,ClusterOutlined,FontColorsOutlined } from '@ant-design/icons';
import { Input, Menu, Modal, Tree, message } from 'antd';
import { getAssetsTree} from '@/services/assets/asset';
import { addAssetTree,updateAssetTree,deleteAssetTree } from '@/services/assets/asset-tree';
import queryString from 'query-string';

const status = queryString.parse(location.search).status === undefined ? 0 : parseInt("" + queryString.parse(location.search).status);
const index = queryString.parse(location.search).index === undefined ? 0 : parseInt("" + queryString.parse(location.search).index);



class Accordions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataCenterId:0,
      rooms:[],
      treeData:[],
      pageX:0,
      pageY:0,
      bindIndex:0,
      node:{},
      curValue:"",
      showMenu:false,
      openStatus:0,
      refreshFlag:this.props.refreshFlag,
      style:{
        collapsed: {
          display: 'none'
        },
        expanded: {
          display: 'block',
        },
        selected: {
          color: '#1478e3'
        },
        noSelect: {
          color: '#000000'
        }
      }
    }
  }


  componentDidMount() {
          
    if(status>0){
       this.state.openStatus = status;
       this.state.bindIndex = index;
       this.setState(this.state);
       this.changeItem(status,index);
    }


  }
  
  operateCategory = (event) => {
    this.state.curValue ="";
    if(event.key === 'delete'){
      // debugger;
      Modal.confirm({
        title: "确认要删除吗",
        onOk: async () => {
          deleteAssetTree(this.state.node["id"]).then(() =>{
            this.loadingTree(this.state.openStatus);
          })
   
        },
        onCancel() { },
      });
    }else if(event.key === 'add'){
      let params = {
        name:"新建目录",
        status:this.state.openStatus,
        parent_id:this.state.node.id
      }
      addAssetTree(params).then(() =>{
        this.loadingTree(this.state.openStatus);
     })
    }else{
      this.changeEditProperty(this.state.treeData,this.state.node.id,true)
    }
    this.state.showMenu = false;
    this.setState(this.state)
  }

  changeEditProperty = (arr,id,isEdit) => arr.map(item => {
    item.isEdit= item.id===id?isEdit:false;
    (
    {
    ...item,    
    children: item.children?this.changeEditProperty(item.children,id,isEdit):[] // 这里要判断原数据有没有子级如果没有判断会报错
  })})

  saveNode = (id,parent_id) => {    
    console.log("saveNode);",id,this.state.curValue);
    if(this.state.curValue!=null && this.state.curValue.length>0){
      let params = {
        id:id,
        name:this.state.curValue,
        parent_id:parent_id,
        status:this.state.openStatus,
      }
      updateAssetTree(params).then((res) => {
        message.success("修改成功");
        this.loadingTree(this.state.openStatus)
      })
    }else{
       message.error("修改信息无效！检查输入内容")
    }

    
   
  };

  onClose = (id) => {
    this.changeEditProperty(this.state.treeData,id,false)
  };

  menu = (
    <Menu className='sub_menu'
      onClick={event => this.operateCategory(event)}
      items={[
        {
          key: 'add',
          label: <span>新增</span>,
        },
        {
          key: 'delete',
          label: <span>删除</span>,
        },
        {
          key: 'update',
          label: <span>重命名</span>,
        },
        // {
        //   key: 'move',
        //   label: <span>下移</span>,
        // },
      ]}
    />
  );

  titleRender = (node) => {
    console.log(node,'titleRender');
    if(node.management_ip!=null && node.management_ip.length>0  &&  node.type=='asset'){
      node.name = node.management_ip;
    }else if( (node.name ==null || node.name=='') && node.type=='asset'){
      node.name = node.serial_number
    }   
    if(node.isEdit){
      return (
        <div style={{ position: 'relative', width: '100%' }}>
              <Input defaultValue={node.name}
              maxLength={25}
              style={{ width: '150px' }}
              onChange={(e) => {
                 this.state.curValue = e.target.value
                 this.setState(this.state);
              }}
              onPressEnter={(e) => {                  
                  this.saveNode(node.id,node.parent_id);
              }}
              onKeyDown={(e) => {
                if (e.code === 'Escape') {
                  this.onClose(node);
                }
              }}></Input>
              <CloseOutlined
                style={{ marginLeft: 10 }}
                onClick={() => {
                  this.onClose(node);
                }}
              />
              <CheckOutlined style={{ marginLeft: 10 }} onClick={() => this.saveNode(node.id,node.parent_id)} />
              
        </div>
      );
    }else{
      return (
        <div style={{ position: 'relative', width: '100%' }}>
            <span>
              {node.type=="asset"? (<FontColorsOutlined />):(<ClusterOutlined />)}
              {node.name}</span>
             <span style={{ position: 'absolute', right: 5 }}>           
          </span>
        </div>
      );
    }     
    
};
addEditProperty = arr => arr.map(item => ({
  ...item,
  isEdit: false,
  children: item.children?this.addEditProperty(item.children):[] // 这里要判断原数据有没有子级如果没有判断会报错
}))


loadingTree = (status) => {
    
  getAssetsTree(status).then(({dat}) => {      
  const treeData =  this.addEditProperty(dat);
    console.log("this.state.treeData",this.state.treeData);
    this.setState({...this.setState,treeData:dat})
  })
};

changeItem = (status,index) => {
  console.log(status);   
  this.state.bindIndex = index;
 
  this.state.showMenu = false;
  this.state.openStatus = status;
  this.setState(this.state);
  if(status>0){
    this.loadingTree(status);
    let initParam={
      type:"type",
      query:{DEVICE_STATUS:status}
    }
    if(this.props.isAutoInitialized){
      this.props.handleClick(initParam,status,index);
    } 
  }else{
    let initParam={
      type:'list',
      query:{}
    }   
    if(this.props.isAutoInitialized){
      this.props.handleClick(initParam,status,index);
    }     
    
  }
       
};

  handleRightClick = ({ event, node }) => {
    event.stopPropagation();
    this.state.pageX = event.pageX;
    this.state.pageY = event.pageY;
    this.state.node =(node);
    if(node.type!=="asset"){
        this.state.showMenu = true;
    }else{
        this.state.showMenu = false;
    }
    this.setState(this.state)  
  };
  onSelect = (selectedKeys, info) => {
    this.state.showMenu = false;
    this.props.handleClick(info.selectedNodes[0],this.state.openStatus,this.state.bindIndex);
  };
  
  renderMenu = () => {
    if (this.state.pageX && this.state.pageY) {
      return (
        <div
          tabIndex={-1}
          style={{
            display: this.state.showMenu ? 'inherit' : 'none',
            position: 'fixed',
            zIndex:1,
            left: this.state.pageX + 36,
            top: this.state.pageY + 2,
          }}
          // ref={dropdownElement}
          onBlur={(e) => {
            e.stopPropagation();
            this.state.showMenu = false;
            this.setState(this.state)
          }}
        >
          {this.menu}
        </div>
      );
    }
    return null;
  };
  addCatlog = (status,index)=>{
    let params = {
      status:status,
      name:"新建目录"
    }
    // debugger
    addAssetTree(params).then(()=>{
      this.loadingTree(status)
    });
  }
  render() {
    if(this.state.refreshFlag!=this.props.refreshFlag){
        let state = this.state;
        state.refreshFlag = this.props.refreshFlag;
        this.setState(state);
        this.loadingTree(this.state.openStatus);
    }
    return (
      <div className='bread-crumb-container'>
      { this.props.assetStatus?.map(({ label,value }, i) => (
        <div className='currentDiv' key={i}  style={{ position: 'relative' }}>
          <div className='header'>
            <AppstoreAddOutlined/>
            <span className='title'    onClick={() => this.changeItem(value,i)} style={this.state.bindIndex != i ? this.state.style.noSelect : this.state.style.selected}>{label}</span>    
            {i>0 && this.state.bindIndex == i && (  
              <>
              <span onClick={e=>{
                  this.addCatlog(value,i);
               }} className='add_category' title='添加目录'  > +</span>           
              <DownOutlined className='jiantou0'/>
              </> 
            )}
            {i>0 && this.state.bindIndex != i && (
              <RightOutlined className='jiantou1' />
            )}

          </div>
          { i>0 && (
                <div
                  className="collapse-content"
                  style={this.state.bindIndex != i ? this.state.style.collapsed : this.state.style.expanded}
                >
                  <Tree
                    showLine={true}
                    showIcon={true}
                    style={{marginTop:0}} 
                    titleRender={this.titleRender}
                    onRightClick={this.handleRightClick}
                    defaultExpandAll={true}
                    fieldNames={{ key: 'id', title: 'name' }}
                    onSelect={this.onSelect}
                    treeData={this.state.treeData}
                  />
                  {this.renderMenu()}
                </div>
           )}

        </div>
      ))
      }
      </div>
    )
  }
}
export default Accordions;
