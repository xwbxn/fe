import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import { AppstoreAddOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { Menu, Tree } from 'antd';
import { getAssetsTree} from '@/services/assets/asset';
import { addAssetTree,deleteAssetTree } from '@/services/assets/asset-tree';
import queryString from 'query-string';


interface Group {
  label: string;
  value: number;
}

interface Props {
  handleClick: (values: any,status:any,index) => Promise<void>;
  assetStatus: Group[];
}

export default function Accordions(props: Props) {
  const { assetStatus } = props;
  const [bindIndex, setBindIndex] = React.useState(0);
  const [openStatus, setOpenStatus] = useState<number>(0)
  const [treeData, setTreeData] = useState<[]>();
  const [showMenu, setShowMenu] = useState(false);
  const status = queryString.parse(location.search).status === undefined ? 0 : parseInt("" + queryString.parse(location.search).status);
  const index = queryString.parse(location.search).index === undefined ? 0 : parseInt("" + queryString.parse(location.search).index);
  const [pageX, setPageX] = useState(0);
  const [pageY, setPageY] = useState(0);
  const [selectNode,setSelectNode]= useState({});
  const dropdownElement: React.RefObject<HTMLDivElement> = useRef(null);
  const menu = (
    <Menu className='sub_menu'
      onClick={event => operateCategory(event)}
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
  const operateCategory = (event) => {
    console.log(event,selectNode); 
    if(event.key === 'delete'){
      deleteAssetTree(selectNode["id"]).then(() =>{
         loadingTree(openStatus);
      })
    }else if(event.key === 'add'){
      let params = {
        name:"新建目录",
        status:openStatus,
        parent_id:selectNode["id"]
      }
      addAssetTree(params).then(() =>{
        loadingTree(openStatus);
     })
    } 
  }
  
  const renderMenu = () => {
    if (pageX && pageY) {
      return (
        <div
          tabIndex={-1}
          style={{
            display: showMenu ? 'inherit' : 'none',
            position: 'fixed',
            left: pageX + 36,
            top: pageY + 2,
          }}
          ref={dropdownElement}
          onBlur={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        >
          {menu}
        </div>
      );
    }
    return null;
  };
  const changeItem = (status,index) => {
      setBindIndex(index);
      setShowMenu(false);
      setOpenStatus(status);     
      if(status!=0){
        loadingTree(status);
        let node={
          type:"type",
          query:{DEVICE_STATUS:status}
        }
        props.handleClick(node,status,index);
      }else{
        let initParam={
          type:'list',
          query:{}
        }
        
        props.handleClick(initParam,status,index);
      }      
  };
  const initItem = (status,index) => {
    setBindIndex(index);
    setOpenStatus(status);     
    if(status!=0){
      loadingTree(status);
    }     
};
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    info.selectedNodes[0].status = openStatus;
    setShowMenu(false);
    props.handleClick(info.selectedNodes[0],openStatus,bindIndex);
  };

  const loadingTree = (currentStatus) => {
    getAssetsTree(currentStatus).then(res => {      
      setTreeData(res.dat);
    })
  };

  useEffect(() => {
     initItem(status,index);
  }, [status,index]);


  const titleRender = (node) => {
      // console.log(node);
      if(node.management_ip!=null && node.management_ip.length>0  &&  node.type=='asset'){
        node.name = node.management_ip;
      }else if( (node.name ==null || node.name=='') && node.type=='asset'){
        node.name = node.serial_number
      }         
      return (
        <div style={{ position: 'relative', width: '100%' }}>
            <span>{node.name}</span>
             <span style={{ position: 'absolute', right: 5 }}>           
          </span>
        </div>
      );
  };

  const handleRightClick = ({ event, node }: any) => {
    event.stopPropagation();
    setPageX(event.pageX);
    setPageY(event.pageY);
    setSelectNode(node);
    setShowMenu(true);
  };

  const addCatlog = (status,index)=>{
    let params = {
      status:status,
      name:"新建目录"
    }
    addAssetTree(params).then(()=>{
      changeItem(status,index)
    });
  }

  const style = {
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
  };
  return (
    <div className='bread-crumb-container'>
      {assetStatus.map(({ label,value }, i) => (
        <div className='currentDiv' key={i} onClick={() => changeItem(value,i)} style={{ position: 'relative' }}>
          <div className='header'>
            <AppstoreAddOutlined/>
            <span className='title' style={bindIndex != i ? style.noSelect : style.selected}>{label}</span>    
                                 
            {i>0 && bindIndex == i && (  
              <>
              <span onClick={e=>{
                  addCatlog(value,i);
               }} className='add_category' title='添加目录'> +</span>           
              <DownOutlined className='jiantou0'/>
              </> 
            )}
            {i>0 && bindIndex != i && (
              <RightOutlined className='jiantou1' />
            )}

          </div>
          { i>0 && (
                <div
                  className="collapse-content"
                  style={bindIndex != i ? style.collapsed : style.expanded}
                >
                  <Tree
                    showLine={true}
                    showIcon={true}
                    style={{marginTop:0}} 
                    titleRender={titleRender}
                    onRightClick={handleRightClick}
                    defaultExpandAll={true}
                    fieldNames={{ key: 'id', title: 'name' }}
                    onSelect={onSelect}
                    treeData={treeData}
                  />
                  {renderMenu()}
                </div>
           )}

        </div>
      ))}
    </div>
  );
}
