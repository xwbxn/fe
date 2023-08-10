const zh_HK = {
  title: '訂閱規則',
  search_placeholder: '搜尋規則、標籤、接收組',
  rule_name: '規則名稱',
  sub_rule_name: '訂閱告警規則',
  tags: '訂閱標籤',
  user_groups: '告警接收組',
  tag: {
    key: {
      label: '訂閱事件標籤鍵',
      tip: '這裏的標籤是指告警事件的標籤，通過如下標籤匹配規則過濾告警事件',
    },
    func: {
      label: '運算子',
    },
    value: {
      label: '標籤值',
    },
  },
  group: {
    key: {
      label: '訂閱業務組',
      placeholder: '業務組',
    },
    func: {
      label: '運算子',
    },
    value: {
      label: '值',
    },
  },
  redefine_severity: '重新定義告警級別',
  redefine_channels: '重新定義通知媒介',
  redefine_webhooks: '重新定義回撥地址',
  user_group_ids: '訂閱告警接收組',
  for_duration: '訂閱事件持續時長超過 (秒)',
  webhooks: '新回撥地址',
  webhooks_msg: '回撥地址不能為空',
  prod: '監控型別',
  subscribe_btn: '訂閱',
  basic_configs: '基礎配置',
  severities: '訂閱事件等級',
  severities_msg: '訂閱事件等級不能為空',
};

export default zh_HK;
