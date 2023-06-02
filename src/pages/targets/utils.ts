import _ from 'lodash';

export const getDefaultColumnsConfigs = () => {
  let defaultColumnsConfigs = _.map(['tags', 'group_obj', 'unixtime', 'mem_util', 'cpu_util', 'offset', 'cpu_num', 'os', 'arch', 'remote_addr', 'note'], (item) => {
    return {
      name: item,
      visible: true,
    };
  });
  const localColumnsConfigs = localStorage.getItem('targets_columns_configs');
  if (localColumnsConfigs) {
    try {
      defaultColumnsConfigs = _.map(defaultColumnsConfigs, (item) => {
        const localItem = _.find(JSON.parse(localColumnsConfigs), (i) => i.name === item.name);
        if (localItem) {
          item.visible = localItem.visible;
        }
        return item;
      });
    } catch (e) {
      console.error(e);
    }
  }
  return defaultColumnsConfigs;
};

export const setDefaultColumnsConfigs = (columnsConfigs) => {
  localStorage.setItem('targets_columns_configs', JSON.stringify(columnsConfigs));
};
