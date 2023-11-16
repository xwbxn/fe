import React, { useEffect, useMemo, useState } from 'react';
import './index.less';
import { AppstoreAddOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { queryAboutTable } from '@/services/assets/asset';

import { SetConfigCatelog } from './catalog'
import { getDictValueEnum } from '@/services/system/dict';
import _ from 'lodash';
import { DataNode } from 'antd/es/tree';



interface Group {
  label: string;
  value: number;
}

interface Props {
  handleClick: (values: any) => Promise<void>;
}
export default React.memo((props:Props) => {
  const [bindIndex, setBindIndex] = React.useState(0);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectItem, setSelectItem] = useState<any>(SetConfigCatelog[0]);
  const [selectedKeys, setSelectedKeys]=useState<number[]>();

  const changeItem = (item, index,isDefault) => {
    setBindIndex(index);
    if(selectItem!=null && selectItem.id==item.id && isDefault){
      setSelectItem(null)
      setTreeData([]);
      return ;
    }
    setSelectItem(item);    
    if (item?.source == 'dict') {
      treeData.splice(0, treeData.length);
      getDictValueEnum(item.value).then((result:any[]) => {
        let selectIds = new Array<any>();
        if(result!=null && result.length>0){
          result.map((values) => {
            if(index == 0) {
              selectIds.push(values.value);
            }
            treeData.push({
              key: "" + values.value,
              title: values.label,
            })
          })
          setTreeData(_.cloneDeep(treeData));
          setSelectedKeys(selectIds);
          props.handleClick({
            businessId:item.id,
            type:item.type,
            key:treeData[0].key,
            title:treeData[0].title
          })
        }
        
      })

    } else if (item?.source == 'table') {
      treeData.splice(0, treeData.length);
      queryAboutTable(item.refer, item.fields).then(({ dat }) => {
        console.log(dat);
      let selectIds = new Array<number>();
        dat.forEach((values,index) => {
          if(index == 0) {
            selectIds.push(values.id);
          }
          treeData.push({
            key: "" + values.id,
            title: values.name,
          })
        })
        setTreeData(_.cloneDeep(treeData));
        setSelectedKeys(selectIds);
        props.handleClick({
          businessId:item.id,
          type:item.type,
          key:treeData[0].key,
          title:treeData[0].title
        })
      })
    } else {
      console.log(item.id,"type");
      props.handleClick({
        businessId:item.id,
        type:item.type,
        key:item.id,
        title:item.title
      })
      setTreeData([]);
    }
  };
  useEffect(() => {
     changeItem(selectItem,0,false);   
    
  }, []);
  
  const treeDatas = useMemo(() => {
    return treeData;
  }, [treeData]);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
     console.log(info.node.key)
     let selecxtId = new Array();
     selecxtId.push(selectedKeys)
     setSelectedKeys(selecxtId)
    // debugger;
    setSelectedKeys(new Array()[selectItem.id])
    console.log("Selected",selectedKeys)
     props.handleClick({
      businessId:selectItem.id,
      type:selectItem.type,
      key:info.node.key,
      title:info.node.title
    })
  };




  const style = {
    collapsed: {
      display: 'none'
    },
    expanded: {
      display: 'block',
      cursor: 'pointer',
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
      {SetConfigCatelog.map((item, i) => (
        <div className='currentDiv' key={i} style={{ position: 'relative', cursor: 'pointer' }}>
          <div className='header' onClick={() => changeItem(item, i,true)} >
            <AppstoreAddOutlined />
            <span className='title' style={bindIndex != i ? style.noSelect : style.selected}>{item.label}</span>

            {i >= 0 && bindIndex == i && item.source != 'self' && (
              <DownOutlined className='jiantou0' />
            )}
            {i >= 0 && bindIndex != i && item.source != 'self' && (
              <RightOutlined className='jiantou1' />
            )}

          </div>
          {treeDatas != null && treeDatas.length > 0 && (
            <div className="collapse-content"
              style={bindIndex != i ? style.collapsed : style.expanded}
            >
              <Tree
                showLine={true}
                showIcon={false}
                style={{ marginTop: 0 }}
                defaultExpandAll={true}
                onSelect={onSelect}
                treeData={treeDatas}
                // selectedKeys={selectedKeys}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
})
