const zh_CN = {
  title: '告警规则',
  search_placeholder: '搜索名称或标签',
  prod: '监控类型',
  severity: '级别',
  notify_groups: '告警接收组',
  basic_configs: '基础配置',
  name: '规则名称',
  name_severities_appendtags: '名称 & 级别 & 附加标签',
  append_tags: '附加标签',
  append_tags_msg: '标签格式不正确，请检查！',
  append_tags_msg1: '标签长度应小于等于 64 位',
  append_tags_msg2: '标签格式应为 key=value。且 key 以字母或下划线开头，由字母、数字和下划线组成。',
  append_tags_placeholder: '标签格式为 key=value ，使用回车或空格分隔',
  note: '备注',
  rule_configs: '规则配置',
  inhibit: '级别抑制',
  interval: '执行频率',
  duration: '持续时长',
  severity_label: '触发告警',
  prom_eval_interval: '执行频率 (s)',
  prom_for_duration: '持续时长 (s)',
  effective_configs: '生效配置',
  enable_status: '立即启用',
  effective_time: '生效时间',
  effective_time_start: '开始时间',
  effective_time_start_msg: '开始时间不能为空',
  effective_time_end: '结束时间',
  effective_time_end_msg: '结束时间不能为空',
  effective_time_week_msg: '请选择生效周期',
  enable_in_bg: '仅在本业务组生效',
  enable_in_bg_tip: '根据告警事件中的ident归属关系判断',
  notify_configs: '通知配置',
  notify_channels: '通知媒介',
  notify_recovered: '启用恢复通知',
  notify_recovered_tip: '告警恢复时也发送通知',
  recover_duration: '留观时长（秒）',
  recover_duration_tip: '持续 {{num}} 秒没有再次触发阈值才发送恢复通知',
  notify_repeat_step: '重复通知间隔（分钟）',
  notify_repeat_step_tip: '如果告警持续未恢复，间隔 {{num}} 分钟之后重复提醒告警接收组的成员',
  notify_max_number: '最大发送次数',
  notify_max_number_tip: '如果值为0，则不做最大发送次数的限制',
  callbacks: '回调地址',
  annotations: '附加信息',
  annotationsOptions: {
    plan_link: '预案链接',
    dashboard_link: '仪表盘链接',
    desc: '描述',
  },

  host: {
    query: {
      title: '机器筛选',
      key: {
        all_hosts: '全部机器',
        datasource_ids: '数据源',
        group_ids: '业务组',
        tags: '标签',
        hosts: '机器标识',
      },
      preview: '机器预览',
    },
    trigger: {
      title: '告警条件',
      key: {
        target_miss: '机器失联',
        pct_target_miss: '机器集群失联',
        offset: '机器时间偏移',
      },
      than: '超过',
      pct_target_miss_text: '秒，失联比例超过',
      second: '秒',
      millisecond: '毫秒',
    },
    prom_eval_interval_tip: 'promql 执行频率，每隔 {{num}} 秒查询时序库，查到的结果重新命名写回时序库',
    prom_for_duration_tip:
      '通常持续时长大于执行频率，在持续时长内按照执行频率多次执行PromQL查询，每次都触发才生成告警；如果持续时长置为0，表示只要有一次PromQL查询触发阈值，就生成告警',
  },

  metric: {
    query: {
      title: '告警条件',
    },
    prom_eval_interval_tip: 'promql 执行频率，每隔 {{num}} 秒查询时序库，查到的结果重新命名写回时序库',
    prom_for_duration_tip:
      '通常持续时长大于执行频率，在持续时长内按照执行频率多次执行PromQL查询，每次都触发才生成告警；如果持续时长置为0，表示只要有一次PromQL查询触发阈值，就生成告警',
  },

  batch: {
    not_select: '请至少选择一条记录',
    delete: '删除告警规则',
    delete_confirm: '确认删除选中的告警规则吗？',
    delete_success: '删除成功',
    import: {
      title: '导入告警规则',
      name: '告警规则',
      result: '导入结果',
      errmsg: '错误信息',
    },
    export: {
      title: '导出告警规则',
      copy: '复制 JSON 内容到剪贴板',
    },
    update: {
      title: '更新告警规则',
      name: '批量更新',
      field: '字段',
      changeto: '改为',
      enable_in_bg_tip: '根据告警事件中的ident归属关系判断',
      callback_cover: {
        mode: '模式',
        cover: '覆盖',
        callback_add: '新增',
        callback_del: '删除',
      },
      effective_time_msg: '生效时间不能为空',
      effective_time_add: '添加生效时间',
      options: {
        datasource_ids: '数据源',
        severity: '告警级别',
        prom_eval_interval: '执行频率',
        prom_for_duration: '持续时长',
        disabled: '启用',
        effective_time: '生效时间',
        enable_in_bg: '仅在本业务组生效',
        append_tags: '附加标签',
        notify_channels: '通知媒介',
        notify_groups: '告警接收组',
        notify_recovered: '启用恢复通知',
        notify_repeat_step: '重复发送频率',
        recover_duration: '留观时长',
        notify_max_number: '最大发送次数',
        callbacks: '回调地址',
        note: '备注',
        runbook_url: '预案链接',
      },
    },
  },
  brain_result_btn: '训练结果',
};
export default zh_CN;
