import React, { Component, useEffect, useRef, useState } from 'react';
import './index.less';
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


  changeItem = (dataCenterId,type) => {
    console.log('chang dataCenterId', dataCenterId);
    if (dataCenterId > 0 && type === 'data_center') {
    getRoomListByDatacenterId(dataCenterId).then(({ dat }) => {
      this.state.dataCenterId = dataCenterId;
      this.state.rooms = dat;
    })
    }
    this.props.handleClick({}, dataCenterId,type);
  };


  
  render() {
    console.log("rendering---",this.state.rooms);
    return (
      <div className='bread-crumb'>
        {this.props.dataCenters?.map(({ label, value }, _) => (
          <div className={"data_center_title"} key={value} >
            <div className={value != 0 ? 'header' : 'addheader'} onClick={() => this.changeItem(value,"data_center")}>
              {value > 0 && (
                <AppstoreAddOutlined style={{ marginLeft: '5px', fontSize: '21px', color: 'blue', height: "47px", lineHeight: "54px" }} />
              )}
              {value == 0 && (
                <PlusOutlined />
              )}
              <span className='title' style={value != this.state.dataCenterId ? style.noSelect : style.selected}>{label}</span>

              {value > 0 && this.state.dataCenterId == value && (
                <>
                  <DownOutlined className='jiantou0' />
                </>
              )}
              {value > 0 && this.state.dataCenterId != value && (
                <RightOutlined className='jiantou1' />
              )}

            </div>
            {this.state.dataCenterId > 0 && (
              <div
                className="collapse-content"
                style={this.state.dataCenterId != value ? style.collapsed : style.expanded}
              >
                {this.state.rooms.map((room, _) => {
                  return (
                    <div key={room.id}  className='room_title' onClick={() => this.changeItem(room.id,"room")}>
                         <InsertRowBelowOutlined className='room_icon' key={"r_"+room.id} />
                        {room.room_name}
                    </div>
                  )

                })}

              </div>
            )}

          </div>
        ))}
      </div>
    )
  }
}
export default Accordions;
