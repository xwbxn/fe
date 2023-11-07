import React, { Component, useEffect, useRef, useState } from 'react';
import './style.less';

import { AppstoreAddOutlined, CheckOutlined, CloseOutlined, DownOutlined, InsertRowBelowOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Input, Menu, Modal, Tree, message } from 'antd';
import { getAssetsTree } from '@/services/assets/asset';
import { getDataCenterList } from '@/services/assets/data-center';
import { getRoomListByDatacenterId } from '@/services/assets/computer-room';


const style = {
  collapsed: {
    display: 'none'
  },
  expanded: {
    display: 'block',
    position: "relative",
  },
  selected: {
    color: '#1478e3',
    // background: '#e9ebef'
  },
  noSelect: {
    color: '#1478e3'
  }
};

class Accordions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataCenterId:0,
      rooms:[]
    }
  }


  componentDidMount() {


  }

  titleRender = (node) => {   
    // console.log("node",node);
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <span className={node.id==0?"tree_root":"tree_node"}>{node.title}</span>
      </div>
    );
};
  changeItem = (key,node) => {    
    this.props.handleClick(key, node,"tree");
  };


  
  render() {
    let treeData =[{
        id :0,
        title:'全部资产',
        children: this.props.treeData
    }];
    console.log(treeData);
    return (
      <div className='bread-crumb_accordion'>
          <div className={"data_center_title"} >
             <div>
              <Tree
                  onSelect={(key, e) => {
                      this.changeItem(key,e.node)
                  }}
                  showIcon
                  // defaultExpandAll
                  className='left_tree'
                  titleRender={this.titleRender}
                  treeData={treeData}
                  showLine={true}
                  // selectedKeys={selectedKeys}
                  // expandedKeys={expandedKeys}
                  fieldNames={{ key: 'id' }}
                  // onExpand={(keys) =>{

                  // }}
               ></Tree>
              </div>
              <div
                className="collapse-content"
              >
               <div className='addheader' onClick={e=>{
                     this.props.handleClick(-1, null,"add");
               }} ><PlusOutlined />新增二级组织</div>  

              </div>

          </div>
      </div>
    )
  }
}
export default Accordions;
