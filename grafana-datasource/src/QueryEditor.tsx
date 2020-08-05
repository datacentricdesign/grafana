import React, { PureComponent } from 'react';
import { Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './DataSource';
import { MyDataSourceOptions, MyQuery } from './types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  private thingOptions: SelectableValue[] = [];
  private propertyOptions: SelectableValue[] = [];

  onThingChange = (event: SelectableValue<HTMLInputElement>) => {
    const { onRunQuery } = this.props;
    console.log('thing change props');
    console.log(this.props);
    if (this.props.datasource !== undefined) {
      this.props.datasource.things.map(t => {
        if (t.id === event.value + '') {
          this.props.datasource.thing = t;
          this.updateProperties();
        }
      });
    }
    
    onRunQuery();
  };

  onPropertyChange = (event: SelectableValue<HTMLInputElement>) => {
    const { onRunQuery } = this.props;
    console.log('property change props');
    console.log(this.props);
    this.props.datasource.thing.properties.map(p => {
      if (p.id === event.value + '') {
        this.props.datasource.property = p;
      }
    });
    onRunQuery();
  };

  updateThings() {
    this.thingOptions = [];
    if (this.props.datasource.things instanceof Array) {
      console.log('updateThing');
      console.log(this.props.datasource.things);
      this.props.datasource.things.map(t => {
        this.thingOptions.push({ value: t.id, label: t.name });
      });
    }
  }

  updateProperties() {
    this.propertyOptions = [];
    if (this.props.datasource.thing.name !== '') {
      this.props.datasource.thing.properties.map(t => {
        this.propertyOptions.push({ value: t.id, label: t.name });
      });
    }
  }

  render() {
    this.updateThings();
    this.updateProperties();
    return (
      <div className="gf-form">
        <Select prefix="Thing" options={this.thingOptions} onChange={this.onThingChange} />
        <Select prefix="Property" options={this.propertyOptions} onChange={this.onPropertyChange} />
      </div>
    );
  }
}
