import defaults from 'lodash/defaults';
import { getBackendSrv } from '@grafana/runtime';
import { Thing, Property } from './types';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  url?: string;
  things: Thing[];

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url;
    this.things = []
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();
    console.log(from + ' ' + to)

    const routePath = '/data/bucket/api';

    if (this.things.length === 0) {
      await getBackendSrv()
        .datasourceRequest({
          url: this.url + routePath + '/things',
          method: 'GET',
        })
        .then((result: any) => {
          this.things = result.data;
        })
        .catch((error: Error) => {
          console.log('error fetching things:');
          console.error(error);
        });
    }

    // if (this.thing.id !== '' && this.property.id !== '') {
    //   await getBackendSrv()
    //     .datasourceRequest({
    //       url: this.url + routePath + '/things/' + this.thing.id + '/properties/'
    //       + this.property.id + '?from=' + from + '&to=' + to,
    //       method: 'GET',
    //     })
    //     .then((result: any) => {
    //       console.log("result from backend");
    //       console.log(result);
    //       this.property = result.data;
    //     })
    //     .catch((error: Error) => {
    //       console.log('error fetching property:');
    //       console.error(error);
    //     });
    // }

    const data: MutableDataFrame[] = await Promise.all(options.targets.map(async (target) => {
      // TODO query to Bucket
      let fields = []

      console.log(target)
      if (target.thing !== undefined && target.property !== undefined) {
        console.log("hello hello??")
        const result = await getBackendSrv().datasourceRequest({
          url: this.url + routePath + '/things/' + target.thing.id + '/properties/'
            + target.property.id + '?from=' + from + '&to=' + to, method: 'GET'
        })
        fields = valueToFields(result.data)
      } else {
        fields = [{
          name: 'Time',
          values: [],
          type: FieldType.time,
        }]
      }
      const frame = new MutableDataFrame({
        refId: target.refId,
        fields: fields,
      })
      console.log(frame)
      return frame;
    }))
    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    const routePath = '/data/bucket/api';

    const result = await getBackendSrv().datasourceRequest({
      url: this.url + routePath + '/things/health',
      method: 'GET',
    });

    if (result.data.status === 'OK') {
      return {
        status: 'success',
        message: 'Success',
      };
    }

    return {
      status: 'error',
      message: 'Error',
    };
  }
}

function valueToFields(property: Property) {
  const fields: Array<any> = [{
    name: 'Time',
    values: [],
    type: FieldType.time,
  }]

  for (let i = 0; i < property.type.dimensions.length; i++) {
    let dim = property.type.dimensions[i];
    fields.push({
      name: dim.name,
      values: [],
      type: FieldType.number,
    })
  }

  for (let i = 0; i < property.values.length; i++) {
    let val = property.values[i];
    for (let j = 0; j < val.length; j++) {
      fields[j].values.push(val[j])
    }
  }
  return fields
}
