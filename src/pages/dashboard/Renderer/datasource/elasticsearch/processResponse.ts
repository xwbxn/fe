import _ from 'lodash';
import { getSerieName } from '@/pages/dashboard/Renderer/datasource/utils';

function processAggregations(aggregations: any[], seriesList: any[], metric: { [index: string]: string }, hasCountFunc: boolean) {
  let aggId;
  const metricObj = _.cloneDeep(metric);
  for (aggId in aggregations) {
    const buckets = aggregations[aggId].buckets;
    if (aggId === 'date') {
      const subAggs = _.omit(buckets[0], ['key', 'key_as_string', 'doc_count']);
      if (hasCountFunc) {
        seriesList.push({
          metric: {
            ...metricObj,
            __name__: 'count',
          },
          data: [],
        });
      }
      _.forEach(subAggs, (_subAgg, subAggId) => {
        if (subAggId.indexOf('percentiles') === 0) {
          const percentilesField = subAggId.split(' ')[1];
          const percentiles = _subAgg.values;
          _.forEach(percentiles, (_percentileValue, percentileKey) => {
            seriesList.push({
              metric: {
                ...metricObj,
                __name__: `p${percentileKey} ${percentilesField}`,
              },
              data: [],
            });
          });
        } else {
          seriesList.push({
            metric: {
              ...metricObj,
              __name__: subAggId,
            },
            data: [],
          });
        }
      });
    }
    _.forEach(buckets, (bucket) => {
      const { key, doc_count } = bucket;
      const subAggs = _.omit(bucket, ['key', 'key_as_string', 'doc_count']) as any[];
      if (aggId === 'date') {
        _.forEach(subAggs, (subAgg, subAggId: string) => {
          if (subAggId.indexOf('percentiles') === 0) {
            const percentilesField = subAggId.split(' ')[1];
            const percentiles = subAgg.values;
            _.forEach(percentiles, (percentileValue, percentileKey) => {
              const series = _.find(seriesList, (s) =>
                _.isEqual(s.metric, {
                  ...metric,
                  __name__: `p${percentileKey} ${percentilesField}`,
                }),
              );
              if (series) {
                series.data.push([key / 1000, percentileValue]);
              }
            });
          } else {
            const { value } = subAgg;
            const series = _.find(seriesList, (s) =>
              _.isEqual(s.metric, {
                ...metric,
                __name__: subAggId,
              }),
            );
            if (series) {
              series.data.push([key / 1000, value]);
            }
          }
        });
        if (hasCountFunc) {
          const series = _.find(seriesList, (s) =>
            _.isEqual(s.metric, {
              ...metric,
              __name__: 'count',
            }),
          );
          if (series) {
            series.data.push([key / 1000, doc_count]);
          }
        }
      } else {
        metric[aggId] = key;
        processAggregations(subAggs, seriesList, metric, hasCountFunc);
      }
    });
  }
}

function hasCountFunc(target: { values: { func: string }[] }) {
  return _.some(target?.values, (m) => m.func === 'count');
}

export function processResponseToSeries(responses: any[], params: any[]) {
  const seriesList: any[] = [];
  _.forEach(responses, (response, idx: number) => {
    const { aggregations } = response;
    processAggregations(aggregations, seriesList, {}, hasCountFunc(params[idx]));
  });
  return _.map(seriesList, (item) => {
    return {
      ...item,
      name: getSerieName(item.metric),
    };
  });
}
