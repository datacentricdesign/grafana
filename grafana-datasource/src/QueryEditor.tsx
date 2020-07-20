import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue, DataSourceInstanceSettings } from '@grafana/data';
import { DataSource } from './DataSource';
import { MyDataSourceOptions, MyQuery, Thing } from './types';
import { getBackendSrv } from '@grafana/runtime';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {

  private thingOptions: Array<SelectableValue> = [];
  private propertyOptions: Array<SelectableValue> = [];

  // onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { onChange, query } = this.props;
  //   onChange({ ...query, queryText: event.target.value });
  // };

  // onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { onChange, query, onRunQuery } = this.props;
  //   onChange({ ...query/*, constant: parseFloat(event.target.value)*/ });
  //   // executes the query
  //   onRunQuery();
  // };

  onThingChange = (event: SelectableValue<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    console.log(this.props)
    this.props.datasource.things.map(t => {
      if (t.id === event.value + "") {
        this.props.datasource.thing = t
        this.updateProperties()
      }
    })
    onRunQuery();
  }

  onPropertyChange = (event: SelectableValue<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    this.props.datasource.thing.properties.map(p => {
      if (p.id === event.value + "") {
        this.props.datasource.property = p
      }
    })
    onRunQuery();
  }

  updateThings() {
    this.thingOptions = []
    if (this.props.datasource.things!==undefined) {
      this.props.datasource.things.map(t => {
        this.thingOptions.push({ value: t.id, label: t.name })
      })
    }
  }

  updateProperties() {
    this.propertyOptions = []
    if (this.props.datasource.thing.name!=='') {
      this.props.datasource.thing.properties.map(t => {
        this.propertyOptions.push({ value: t.id, label: t.name })
      })
    }
  }

  render() {
    this.updateThings()
    this.updateProperties()
    return (
      <div className="gf-form">
        <Select
          prefix="Thing"
          options={this.thingOptions}
          onChange={this.onThingChange}
        />
        <Select
          prefix="Property"
          options={this.propertyOptions}
          onChange={this.onPropertyChange}
        />
      </div>
    );
  }
}
