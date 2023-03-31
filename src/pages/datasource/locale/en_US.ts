const en_US = {
  title: 'Data sources',
  list_title: 'List',
  name: 'Data source name',
  id: 'Data source ID',
  description: 'Description',
  type: 'Type',
  enable: 'enable',
  disable: 'disable',
  confirm: {
    enable: 'Are you sure you want to enable this data source?',
    disable: 'Are you sure you want to disable this data source?',
  },
  success: {
    enable: 'Enable successfully',
    disable: 'Disable successfully',
  },
  rename_title: 'Rename',
  type_btn_add: 'Add',
  form: {
    other: 'Other',
    name: 'Name',
    name_msg: 'Please enter letters,numbers,underscores, must start with a letter',
    name_msg2: 'At least 3 characters',
    timeout: 'Timeout(ms)',
    auth: 'Auth',
    username: 'User',
    password: 'Password',
    skip_ssl_verify: 'Skip TLS verify',
    yes: 'Yes',
    no: 'No',
    headers: 'Custom HTTP headers',
    description: 'Description',
    cluster: 'Cluster',
    cluster_confirm:
      'Your data source is not associated with an alerting engine cluster. It will not be able to be used for alerting. Do you want to associate an alerting engine cluster?',
    cluster_confirm_ok: 'No association',
    cluster_confirm_cancel: 'Associate',
    es: {
      version: 'Version',
      max_shard: 'Max concurrent Shard Requests',
      min_interval: 'Min time interval(s)',
      min_interval_tip:
        'The lower bound for automatic grouping based on time intervals. It is recommended to set it to the write frequency. For example, if data is written every minute, it should be set as 1m',
    },
    jaeger: {
      version: 'Version',
    },
  },
};
export default en_US;
