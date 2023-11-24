/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useEffect, useState, createContext, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';

import TopMenu from './topMenuXH'; //西航版本
import { Header, Footer } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import { Layout, Menu } from 'antd';
import Content from '@/routers';
function layoutXH() {

  const history = useHistory();
  const [leftMenuItems, setLeftMenuItems] = useState<any>();
  const [leftMenuKey, setLeftMenuKey] = useState<any>("");
  const [mainMenu, setMainMenu] = useState<any>({});
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem('leftMenuItems')) {
        let leftMenus = window.localStorage.getItem('leftMenuItems') as string;
        setLeftMenuKey([leftMenus]);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleClick = (item) => {
    if ((item.key as string) === 'home') {
      // window.location.href = '/prod-api/';
      history.push('/prod-api/')
    }
    if ((item.key as string).startsWith('/')) {
      // window.location.href = item.key;
      history.push(item.key)
      window.localStorage.setItem("mainMenuKey", mainMenu.key);
      window.localStorage.setItem("leftMenuItems", item.key);
    }
  };

  return (
    <Layout>
      <Header className='yth_app_header'>
        <TopMenu
          selectMenu={(mainMenu: any, items) => {
            setMainMenu(mainMenu);
            setLeftMenuItems(items)
          }}
        ></TopMenu>
      </Header>
      <Layout hasSider>
        <Sider collapsible trigger={null} collapsed={collapsed}>
          <Menu
            mode="inline"
            defaultSelectedKeys={leftMenuKey}
            defaultOpenKeys={['sub1']}
            onClick={handleClick}
            style={{ height: '100%', borderRight: 0 }}
            items={leftMenuItems}
          /></Sider>
        <Content />
      </Layout>
      {/* <Footer>Footer</Footer> */}
    </Layout>

  );
}

export default layoutXH;
