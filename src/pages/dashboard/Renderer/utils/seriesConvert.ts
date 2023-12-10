import _ from 'lodash';
import moment from 'moment';

export function convertTimeseriesToG2Data(series) {
  const data: any[] = [];
  series.map((serie) => {
    const name = serie.name;
    serie.data.map((v) => {
      data.push({
        ...serie.metric,
        name: name,
        time: moment.unix(v[0]).format('YYYY-MM-DD HH:mm:ss'),
        value: _.toNumber(v[1]),
      });
    });
  });
  return data;
}
