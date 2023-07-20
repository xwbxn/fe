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
import React from 'react';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';
import querystring from 'query-string';
import _ from 'lodash';
import NotFound from '@/pages/notFound';
import Page403 from '@/pages/notFound/Page403';
import Login from '@/pages/login';
import Overview from '@/pages/login/overview';
import LoginCallback from '@/pages/loginCallback';
import LoginCallbackCAS from '@/pages/loginCallback/cas';
import LoginCallbackOAuth from '@/pages/loginCallback/oauth';
import AlertRules, { Add as AlertRuleAdd, Edit as AlertRuleEdit } from '@/pages/alertRules';
import AlertRulesBuiltin, { Detail as AlertRulesBuiltinDetail } from '@/pages/alertRulesBuiltin';
import Profile from '@/pages/account/profile';
import { List as Dashboard, Detail as DashboardDetail, Share as DashboardShare } from '@/pages/dashboard';
import Chart from '@/pages/chart';
import Groups from '@/pages/user/groups';
import Users from '@/pages/user/users';
import Business from '@/pages/user/business';
import { Metric as MetricExplore, Log as LogExplore } from '@/pages/explorer';
import ObjectExplore from '@/pages/monitor/object';
import Shield, { Add as AddShield, Edit as ShieldEdit } from '@/pages/warning/shield';
import Subscribe, { Add as SubscribeAdd, Edit as SubscribeEdit } from '@/pages/warning/subscribe';
import Event from '@/pages/event';
import EventDetail from '@/pages/event/detail';
import orderformDetail from '@/pages/event/orderformdetail';

import historyEvents from '@/pages/historyEvents';
import orderformEvents from '@/pages/orderformEvents';
import Targets from '@/pages/targets';

import AssetMgt, {Add as AddInfoAsset} from '@/pages/assetmgt/index';
import Assets, {Add as AddAsset, Edit as EditAsset} from '@/pages/assets';
import Demo from '@/pages/demo';
import TaskTpl from '@/pages/taskTpl';
import TaskTplAdd from '@/pages/taskTpl/add';
import TaskTplDetail from '@/pages/taskTpl/detail';
import TaskTplModify from '@/pages/taskTpl/modify';
import TaskTplClone from '@/pages/taskTpl/clone';
// import InspectionPlans from '@/pages/inspection/plans';
// import InspectionApplyList from '@/pages/inspection/applylist';
// import InspectionPlansAdd from '@/pages/inspection/form/index';
import Task from '@/pages/task';
import TaskAdd from '@/pages/task/add';
import TaskResult from '@/pages/task/result';
import TaskDetail from '@/pages/task/detail';
import Version from '@/pages/help/version';
import Servers from '@/pages/help/servers';
import Datasource, { Form as DatasourceAdd } from '@/pages/datasource';
import RecordingRule, { Add as RecordingRuleAdd, Edit as RecordingRuleEdit } from '@/pages/recordingRules';
import TraceExplorer, { Dependencies as TraceDependencies } from '@/pages/traceCpt/Explorer';
import DashboardBuiltin, { Detail as DashboardBuiltinDetail } from '@/pages/dashboardBuiltin';
import Permissions from '@/pages/permissions';
import SSOConfigs from '@/pages/help/SSOConfigs';
import NotificationTpls from '@/pages/help/NotificationTpls';
import NotificationSettings from '@/pages/help/NotificationSettings';
import MigrateDashboards from '@/pages/help/migrate';
import IBEX from '@/pages/help/NotificationSettings/IBEX';
import Grafana from '@/pages/grafana'
// @ts-ignore
import { Jobs as StrategyBrain } from 'plus:/datasource/anomaly';
// @ts-ignore
import plusLoader from 'plus:/utils/loader';
import { dynamicPackages, Entry } from '@/utils';

const Packages = dynamicPackages();
let lazyRoutes = Packages.reduce((result: any, module: Entry) => {
  return (result = result.concat(module.routes));
}, []);

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

export default function Content() {
  const location = useLocation();
  // 仪表盘在全屏和暗黑主题下需要定义个 dark 样式名
  let themeClassName = '';
  if (location.pathname.indexOf('/dashboard') === 0) {
    const query = querystring.parse(location.search);
    if (query?.viewMode === 'fullscreen' && query?.themeMode === 'dark') {
      themeClassName = 'theme-dark';
    }
  }

  return (
    <div className={`content ${themeClassName}`}>
      <Switch>
        <Route path='/demo' component={Demo} />
        <Route path='/overview' component={Overview} />
        <Route path='/login' component={Login} exact />
        <Route path='/callback' component={LoginCallback} exact />
        <Route path='/callback/cas' component={LoginCallbackCAS} exact />
        <Route path='/callback/oauth' component={LoginCallbackOAuth} exact />
        <Route path='/metric/explorer' component={MetricExplore} exact />
        <Route path='/log/explorer' component={LogExplore} exact />
        <Route path='/object/explorer' component={ObjectExplore} exact />
        <Route path='/busi-groups' component={Business} />
        <Route path='/users' component={Users} />
        <Route path='/user-groups' component={Groups} />
        <Route path='/account/profile/:tab' component={Profile} />

        <Route path='/dashboard/:id' exact component={DashboardDetail} />
        <Route path='/dashboards/:id' exact component={DashboardDetail} />
        <Route path='/dashboards/share/:id' component={DashboardShare} />
        <Route path='/dashboards' component={Dashboard} />
        <Route path='/dashboards-built-in' exact component={DashboardBuiltin} />
        <Route path='/dashboards-built-in/detail' exact component={DashboardBuiltinDetail} />
        <Route path='/chart/:ids' component={Chart} />

        <Route exact path='/alert-rules/add/:bgid' component={AlertRuleAdd} />
        <Route exact path='/alert-rules/edit/:id' component={AlertRuleEdit} />
        <Route exact path='/alert-rules' component={AlertRules} />
        <Route exact path='/alert-rules-built-in' component={AlertRulesBuiltin} />
        <Route exact path='/alert-rules-built-in/detail' component={AlertRulesBuiltinDetail} />
        <Route exact path='/alert-rules/brain/:id' component={StrategyBrain} />
        <Route exact path='/alert-mutes' component={Shield} />
        <Route exact path='/alert-mutes/add/:from?' component={AddShield} />
        <Route exact path='/alert-mutes/edit/:id' component={ShieldEdit} />
        <Route exact path='/alert-subscribes' component={Subscribe} />
        <Route exact path='/alert-subscribes/add' component={SubscribeAdd} />
        <Route exact path='/alert-subscribes/edit/:id' component={SubscribeEdit} />

        <Route exact path='/recording-rules/:id?' component={RecordingRule} />
        <Route exact path='/recording-rules/add/:group_id' component={RecordingRuleAdd} />
        <Route exact path='/recording-rules/edit/:id' component={RecordingRuleEdit} />

        <Route exact path='/alert-cur-events' component={Event} />
        <Route exact path='/alert-his-events' component={historyEvents} />
        <Route exact path='/alert-orderform-events' component={orderformEvents} />
        <Route exact path='/alert-orderform-events/:eventId' component={orderformDetail} />
        <Route exact path='/alert-cur-events/:eventId' component={EventDetail} />
        <Route exact path='/alert-his-events/:eventId' component={EventDetail} />
        <Route exact path='/targets' component={Targets} />

        <Route exact path='/assetmgt' component={AssetMgt} />
        <Route exact path='/assetmgt/add/:orgid' component={AddInfoAsset} />

        <Route exact path='/assets' component={Assets} />
        <Route exact path='/assets/add/:bgid' component={AddAsset} />        
        <Route exact path='/assets/:id' component={EditAsset} />
        <Route exact path='/job-tpls' component={TaskTpl} />
        <Route exact path='/job-tpls/add' component={TaskTplAdd} />
        <Route exact path='/job-tpls/add/task' component={TaskAdd} />
        <Route exact path='/job-tpls/:id/detail' component={TaskTplDetail} />
        <Route exact path='/job-tpls/:id/modify' component={TaskTplModify} />
        <Route exact path='/job-tpls/:id/clone' component={TaskTplClone} />
        <Route exact path='/job-tasks' component={Task} />
        <Route exact path='/job-tasks/add' component={TaskAdd} />
        <Route exact path='/job-tasks/:id/result' component={TaskResult} />
        <Route exact path='/job-tasks/:id/detail' component={TaskDetail} />
        <Route exact path='/ibex-settings' component={IBEX} />

        <Route exact path='/help/version' component={Version} />
        <Route exact path='/help/servers' component={Servers} />
        <Route exact path='/help/source' component={Datasource} />
        <Route exact path='/help/source/:action/:type' component={DatasourceAdd} />
        <Route exact path='/help/source/:action/:type/:id' component={DatasourceAdd} />
        <Route exact path='/help/sso' component={SSOConfigs} />
        <Route exact path='/help/notification-tpls' component={NotificationTpls} />
        <Route exact path='/help/notification-settings' component={NotificationSettings} />
        <Route exact path='/help/migrate' component={MigrateDashboards} />

        <Route exact path='/trace/explorer' component={TraceExplorer} />
        <Route exact path='/trace/dependencies' component={TraceDependencies} />
        {/* <Route exact path='/inspection/plans' component={InspectionPlans} />
        <Route exact path='/inspection/applylist' component={InspectionApplyList} />
        <Route exact path='/inspection/plans/add' component={InspectionPlansAdd} /> */}
        <Route exact path='/permissions' component={Permissions} />

        <Route exact path='/dashboard-grafana' component={Grafana} />

        {lazyRoutes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
        {_.map(plusLoader.routes, (route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
        <Route path='/' exact>
          <Redirect to='/metric/explorer' />
        </Route>
        <Route path='/403' component={Page403} />
        <Route path='/404' component={NotFound} />
        <Route path='*' component={NotFound} />
      </Switch>
    </div>
  );
}
