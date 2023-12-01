import { ITarget } from '@/pages/dashboard/types';
import { executeApiService } from '@/services/api_service';
import { RequestMethod } from '@/store/common';
import request from '@/utils/request';

interface IOptions {
  id?: string; // apiServiceId
  targets: ITarget[];
}

export default async function apiServicequery(options: IOptions) {
  console.log('options', options);

  const series: any = [];
  if (options.targets) {
    for (const target of options.targets) {
      const res = await request.get(target.expr, {
        method: RequestMethod.Get,
      });
      series.push(...res.dat.series[0].data);
    }
  }

  return Promise.resolve(series);
}
