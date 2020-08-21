import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface Thing {
  id: string;
  name: string;
  description: string;
  properties: Property[];
}

export interface Property {
  id: string;
  name: string;
  description: string;
  type: PropertyType;
  values: Array<Array<string | number>>;
}

export interface PropertyType {
  id: string;
  name: string;
  description: string;
  dimensions: Dimension[]
}

export interface Dimension {
  id: string;
  name: string;
  description: string;
}

export interface Field {
  
}

export interface MyQuery extends DataQuery {
  things: Thing[];
  thing: Thing;
  property: Property
}

export const defaultQuery: Partial<MyQuery> = {
  things: [],
  thing: {
      id: '',
      name: '',
      description: '',
      properties: [],
    },
  property: {
      id: '',
      name: '',
      description: '',
      type: {
        id: '',
        name: '',
        description: '',
        dimensions: []
      },
      values: [[]],
    }
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
