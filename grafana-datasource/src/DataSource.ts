import defaults from 'lodash/defaults';
import { getBackendSrv } from '@grafana/runtime';
import { Thing, Property } from './types'

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
  things: Thing[]
  thing: Thing
  property: Property

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url;
    this.things = []
    this.thing = {
      id: '',
      name: '',
      properties: []
    }
    this.property = {
      id: '',
      name: '',
      type: {
        id: '',
        name: '',
        description: ''
      },
      values: [[]]
    }
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const routePath = '/bucket';

    if (this.things.length === 0) {
      await getBackendSrv()
      .datasourceRequest({
        url: this.url + routePath + '/things',
        method: 'GET',
      }).then(result => {
        this.things = result.data
      }).catch(error => {
        console.log("error fetching things:")
        console.error(error)
      })
    }

    if (this.thing.id !== '' && this.property.id !== '') {
      await getBackendSrv()
        .datasourceRequest({
          url: this.url + routePath + '/things/' + this.thing.id + '/properties/' + this.property.id + '?from=0',
          method: 'GET',
        }).then(result => {
          console.log(result)
          this.things = result.data
        }).catch(error => {
          console.log("error fetching property:")
          console.error(error)
        })
    }

    // Return a constant for each query.
    const data = options.targets.map(target => {
      // TODO query to Bucket
      target = defaults(target, {
        things: this.things,
        thing: this.thing
      });
      // TODO format result
      return new MutableDataFrame({
        refId: target.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [/*query.constant, query.constant*/], type: FieldType.number },
        ],
      });
    });

    console.log(data)
    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    const routePath = '/bucket';

    const result = await getBackendSrv()
      .datasourceRequest({
        url: this.url + routePath + '/things/health',
        method: 'GET',
      })

    console.log(result.data)

    if (result.data.status === "OK") {
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
