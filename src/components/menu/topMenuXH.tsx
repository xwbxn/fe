import { CommonStateContext,initTheme } from '@/App';
import { getMenuPerm } from '@/services/common';
import Icon, { DownOutlined, ProfileOutlined, ProjectOutlined } from '@ant-design/icons';
import querystring from 'query-string';
import { Dropdown, Menu, Space,Image } from 'antd';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconFont from '../IconFont';
import { useHistory, useLocation } from 'react-router-dom';

import './topMenu.less';
import './locale';
import { Logout } from '@/services/login';
import { useLocalStorageState } from 'ahooks';
import { useLocalStorage } from 'react-use';

const getMenuList = (t) => {
  const menuList = [
    {
      key: '/home',
      icon: <IconFont type='icon-Menu_Infrastructure' />,
      label: t('首页'),
    },
    {
      key: '/xh/targets',
      icon: <IconFont type='icon-Menu_Infrastructure' />,
      label: t('资产管理'),
      children: [
        {
          key: '/xh/assetmgt',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('资产清单'),
        },
      ],
    },
    {
      key: 'dashboard',
      icon: <IconFont type='icon-Menu_Dashboard' />,
      label: t('监控管理'),
      children: [
        {
          key: '/xh/monitor',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('监控指标'),
        },
        // {
        //   key: '/dashboards-built-in',
        //   icon: <IconFont type='icon-Menu_Infrastructure' />,
        //   label: t('仪表盘'),
        // },
        {
          key: '/metric/explorer',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('即时查询'),
        },
      ],
    },
    {
      key: 'alarm',
      icon: <IconFont type='icon-Menu_AlarmManagement' />,
      label: t('告警管理'),
      children: [
        {
          key: '/alert-rules?id=-1',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('告警规则'),
        },
        {
          key: '/alert-cur-events',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('当前告警'),
        },
        {
          key: '/alert-his-events',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('历史告警'),
        },
        {
          key: '/alert-mutes',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('屏蔽规则'),
        },
        {
          key: '/help/notification-settings',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('通知设置'),
        },
        {
          key: '/help/notification-tpls',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('通知模板'),
        },
      ],
    },
    
    {
      key: 'bigscreen',
      icon: <ProjectOutlined />,
      label: t('大屏管理'),
      children: [
        {
          key: '/bigscreen',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('大屏设计'),
        },
        {
          key: '/bigscreen/api-service',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('接口管理'),
        },
      ],
    },
    {
      key: 'help',
      icon: <IconFont type='icon-Menu_SystemInformation' />,
      label: t('系统配置'),
      children: [
        {
          key: 'manage',
          icon: <IconFont type='icon-Menu_PersonnelOrganization' />,
          label: t('人员组织'),
          children: [
            {
              key: '/users',
              label: t('用户管理'),
            },
            {
              key: '/user-groups',
              label: t('团队管理'),
            },
            {
              key: '/busi-groups',
              label: t('业务组管理'),
            },
            {
              key: '/permissions',
              label: t('角色管理'),
            },
            
          ],
        },
        {
          key: '/help/version',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('系统版本'),
        },
        {
          key: '/target/version',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('客户端版本'),
        },
        {
          key: '/targets',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('探针管理'),
        },
        {
          key: 'log',
          icon: <IconFont type='icon-Menu_LogAnalysis' />,
          label: t('日志分析'),
          children: [
            {
              key: '/log/debug/switch',
              label: '日志调试启动开关',
            },
            {
              key: '/log/operlog',
              label: t('操作日志'),
            },
            {
              key: '/log/syslog',
              label: t('系统日志'),
            },
          ],
        },
        {
          key: '/help/other',
          icon: <IconFont type='icon-Menu_Infrastructure' />,
          label: t('其它设置'),
          children: [
            {
              key: '/help/source',
              label: t('数据源'),
            },
            {
              key: '/help/servers',
              label: t('告警引擎'),
            },
            {
              key: '/system/logo',
              label: t('LOGO设置'),
            },
            {
              key: '/system/parameters',
              label: '系统参数设置',
            },
            {
              key: '/system/interface',
              label: '接口访问设置',
            },
            {
              key: '/types/dictype',
              label: t('数据字典'),
            },
            {
              key: '/system/upgrade',
              label: t('系统升级'),
            },
          ],
        },
        {
          key: '/license/management',
          icon: <ProfileOutlined />,
          label: t('许可管理'),
          children: [
            {
              key: '/license/base',
              label: '许可信息',
            },
            {
              key: '/license/device',
              label: '设备License',
            },
          ],
        },
      ],
    },
  ];
  if (import.meta.env['VITE_IS_COLLECT']) {
    const targets: any = _.find(menuList, (item) => item.key === 'targets');
    if (targets) {
      targets.children?.push({
        key: '/collects',
        label: t('采集配置'),
      });
    }
  }
  return menuList;
};
interface IProps {
  url?: string;
}

export default function () {//{ selectMenu?:any }
  const { t, i18n } = useTranslation('menu');

  const menuList = getMenuList(t);
  const [menus, setMenus] = useState(menuList);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>();

  const [mainMenuKey, setMainMenuKey] = useState<string[]>([]);
  const [mainMenuItems, setMainMenuItems] = useState<any>({});
  const location = useLocation();
  const history = useHistory();
  const { pathname } = location;
  const { profile } = useContext(CommonStateContext);
  const [home] = useLocalStorageState('HOME_URL');

  const [theme, setTheme] = useLocalStorage<any>("platform_theme",initTheme);

  useEffect(() => {
    setDefaultSelectedKeys([]);
  }, [pathname]);

  useEffect(() => {
    if (profile?.roles?.length > 0) {
      if (profile?.roles.indexOf('Admin') === -1) {
        getMenuPerm().then((res) => {
          const { dat } = res;
          // 过滤掉没有权限的菜单
          const newMenus: any = _.filter(
            _.map(menuList, (menu) => {
              return {
                ...menu,
                children: _.filter(menu.children, (item) => item && dat.includes(item.key)),
              };
            }),
            (item) => {
              return item.children && item.children.length > 0;
            },
          );
          setMenus(newMenus);
        });
      } else {
        // let mainMenus = menuList.map((item,index) => {
        //   mainMenuItems[item.key] = item.children?item.children:[];
        //   delete item.children;
        //   return item
        // })
        // setMenus(mainMenus);
        // setMainMenuItems({...mainMenuItems});
        // if(window.localStorage.getItem('mainMenuKey')){
        //   let mainKey = window.localStorage.getItem('mainMenuKey') as string;
        //   setMainMenuKey([mainKey]);
        //   for(let item of mainMenus){
        //       if(item.key==mainKey){
        //         handleClick(item);
        //       }
        //   }
          

        // }
        setMenus(menuList);
      }
    }
    i18n.changeLanguage("zh_CN");
    localStorage.setItem('language', "zh_CN");
  }, [profile?.roles, i18n.language]);

  const hideSideMenu = () => {
    if (
      location.pathname === '/login' ||
      location.pathname.startsWith('/chart/') ||
      location.pathname.startsWith('/dashboards/share/') ||
      location.pathname === '/callback' ||
      location.pathname.indexOf('/polaris/screen') === 0
    ) {
      return true;
    }
    // 大盘全屏模式下也需要隐藏左侧菜单
    if (location.pathname.indexOf('/dashboard') === 0) {
      const query = querystring.parse(location.search);
      if (query?.viewMode === 'fullscreen') {
        return true;
      }
      return false;
    }
    return false;
  };

  const handleClick = (item) => {

    if((item.key as string) === "home") {
      window.location.href = '/prod-api/'
    }
    if ((item.key as string).startsWith('/')) {
      history.push(item.key as string);
    }
  };

  const topRightMenu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          history.push('/account/profile/info');
        }}
      >
        {t('profile')}
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          Logout().then(() => {
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            sessionStorage.removeItem('curBusiId');
            history.push('/login');
          });
        }}
      >
        {t('logout')}
      </Menu.Item>
    </Menu>
  );

  return hideSideMenu() ? null : (
    <div className='top-menu1'>
      <div className='logoImg'>
        <Image src={theme.logo} className='xh_logo_image_size' preview={false}></Image>        
        {theme?.title}</div>
      <Menu mode='horizontal' className='layer_1_menu' selectedKeys={mainMenuKey} onClick={handleClick} items={menus} />
      <div className='top_right'>
       <span
          className='language'
          onClick={() => {
            let language = i18n.language == 'en_US' ? 'zh_CN' : 'en_US';
            i18n.changeLanguage(language);
            localStorage.setItem('language', language);
          }}
        >
          <Icon type="bell" />
        </span>
        <Dropdown overlay={topRightMenu} trigger={['click']} className='my_portrait' >
          <span className='avator'>
            <img src={profile.portrait?profile.portrait:'/image/avatar1.png'} alt='' />
            <span className='display-name'>{profile.nickname || profile.username}</span>
            <DownOutlined />
          </span>
        </Dropdown>
      </div>
    </div>
  );
}
