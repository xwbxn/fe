import { CommonStateContext } from '@/App';
import { getMenuPerm } from '@/services/common';
import Icon, { DownOutlined } from '@ant-design/icons';
import querystring from 'query-string';
import { Dropdown, Menu, Space } from 'antd';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconFont from '../IconFont';
import { useHistory, useLocation } from 'react-router-dom';

import './topMenu.less';
import './locale';
import { Logout } from '@/services/login';

const getMenuList = (t) => {
  const menuList = [
    {
      key: 'dashboard',
      icon: <IconFont type='icon-Menu_Dashboard' />,
      label: t('仪表盘'),
      children: [
        {
          key: '/dashboards',
          label: t('监控仪表盘'),
        },
        {
          key: '/dashboards-built-in',
          label: t('内置仪表盘'),
        },
        {
          key: '/dashboard-grafana',
          label: t('grafana'),
        },
      ],
    },
    {
      key: 'alarm',
      icon: <IconFont type='icon-Menu_AlarmManagement' />,
      label: t('告警管理'),
      children: [
        {
          key: '/alert-rules',
          label: t('告警规则'),
        },
        {
          key: '/alert-rules-built-in',
          label: t('内置规则'),
        },
        {
          key: '/alert-mutes',
          label: t('屏蔽规则'),
        },
        {
          key: '/alert-subscribes',
          label: t('订阅规则'),
        },
        {
          key: '/alert-cur-events',
          label: t('活跃告警'),
        },
        {
          key: '/alert-his-events',
          label: t('历史告警'),
        },
        {
          key: '/alert-orderform-events',
          label: t('工单处理'),
        },
      ],
    },
    {
      key: 'inspection',
      icon: <IconFont type='icon-Menu_LinkAnalysis' />,
      label: t('巡检管理'),
      children: [
        {
          key: '/inspection/plans',
          label: t('巡检计划'),
        },
        {
          key: '/inspection/applylist',
          label: t('巡检审批'),
        },
      ],
    },
    {
      key: 'metric',
      icon: <IconFont type='icon-IndexManagement1' />,
      label: t('时序指标'),
      children: [
        {
          key: '/metric/explorer',
          label: t('即时查询'),
        },
        {
          key: '/object/explorer',
          label: t('快捷视图'),
        },
        {
          key: import.meta.env['VITE_IS_DS_SETTING'] ? '/plus-recording-rules' : '/recording-rules',
          label: t('记录规则'),
        },
      ],
    },
    {
      key: 'log',
      icon: <IconFont type='icon-Menu_LogAnalysis' />,
      label: t('日志分析'),
      children: [
        {
          key: '/log/explorer',
          label: t('即时查询'),
        },
      ],
    },
    {
      key: 'trace',
      icon: <IconFont type='icon-Menu_LinkAnalysis' />,
      label: t('链路追踪'),
      children: [
        {
          key: '/trace/explorer',
          label: t('即时查询'),
        },
        {
          key: '/trace/dependencies',
          label: t('拓扑分析'),
        },
      ],
    },
    {
      key: 'targets',
      icon: <IconFont type='icon-Menu_Infrastructure' />,
      label: t('基础设施'),
      children: [
        {
          key: '/targets',
          label: t('监控机器'),
        },
        {
          key: '/assets',
          label: t('资产管理'),
        },
        {
          key: '/assetmgt',
          label: t('资产管理<新>'),
        },
      ],
    },

    {
      key: 'job',
      icon: <IconFont type='icon-Menu_AlarmSelfhealing' />,
      label: t('告警自愈'),
      children: [
        {
          key: '/job-tpls',
          label: t('自愈脚本'),
        },
        {
          key: '/job-tasks',
          label: t('执行历史'),
        },
        {
          key: '/ibex-settings',
          label: t('自愈配置'),
        },
      ],
    },
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
          label: t('权限管理'),
        },
      ],
    },
    {
      key: 'help',
      icon: <IconFont type='icon-Menu_SystemInformation' />,
      label: t('系统配置'),
      children: [
        {
          key: '/help/source',
          label: t('数据源'),
        },
        {
          key: '/help/notification-settings',
          label: t('通知设置'),
        },
        {
          key: '/help/notification-tpls',
          label: t('通知模板'),
        },
        {
          key: '/help/sso',
          label: t('单点登录'),
        },
        {
          key: '/help/servers',
          label: t('告警引擎'),
        },
        {
          key: '/help/migrate',
          label: t('仪表盘迁移'),
        },
        {
          key: '/help/version',
          label: t('系统版本'),
        },
      ],
    },
  ];
  if (import.meta.env['VITE_IS_COLLECT']) {
    const targets = _.find(menuList, (item) => item.key === 'targets');
    if (targets) {
      targets.children?.push({
        key: '/collects',
        label: t('采集配置'),
      });
    }
  }
  return menuList;
};

export default function () {
  const { t, i18n } = useTranslation('menu');

  const menuList = getMenuList(t);
  const [menus, setMenus] = useState(menuList);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>();
  const location = useLocation();
  const history = useHistory();
  const { pathname } = location;
  const { profile } = useContext(CommonStateContext);

  useEffect(() => {
    setDefaultSelectedKeys([]);
    for (const item of menuList) {
      if (item && item.key.startsWith('/') && pathname.includes(item.key)) {
        setDefaultSelectedKeys([item?.key]);
        break;
      } else if (item?.children && item.children.length > 0) {
        for (const i of item.children) {
          if (i && (pathname === i.key || pathname.startsWith(i.key + '/'))) {
            setDefaultSelectedKeys([item?.key, i.key!]);
            break;
          }
        }
      }
    }
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
        setMenus(menuList);
      }
    }
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
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('curBusiId');
            history.push('/login');
          });
        }}
      >
        {t('logout')}
      </Menu.Item>
    </Menu>
  );

  return hideSideMenu() ? null : (
    <div className='top-menu'>
      <Menu mode='horizontal' onClick={handleClick} items={menus} />
      <div>
        <span
          className='language'
          onClick={() => {
            let language = i18n.language == 'en_US' ? 'zh_CN' : 'en_US';
            i18n.changeLanguage(language);
            localStorage.setItem('language', language);
          }}
        >
          {i18n.language == 'zh_CN' ? 'EN' : '中'}
        </span>
        <Dropdown overlay={topRightMenu} trigger={['click']}>
          <span className='avator'>
            <img src={profile.portrait || '/image/avatar1.png'} alt='' />
            <span className='display-name'>{profile.nickname || profile.username}</span>
            <DownOutlined />
          </span>
        </Dropdown>
      </div>
    </div>
  );
}
