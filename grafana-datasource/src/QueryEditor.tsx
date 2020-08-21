import React, { PureComponent } from 'react';
import { Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './DataSource';
import { MyDataSourceOptions, MyQuery, defaultQuery } from './types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {

  private thingOptions: SelectableValue[] = [];
  private propertyOptions: SelectableValue[] = [];
  private selectedThingOption: SelectableValue;
  private selectedPropertyOption: SelectableValue;

  constructor(props: Props) {
    super(props)
  }

  onThingChange = (event: SelectableValue<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    if (this.props.datasource !== undefined) {
      this.props.datasource.things.map(t => {
        if (t.id === event.value + '') {
          onChange({ ...query, thing: t });
          query.property = {
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
          this.updateProperties();
        }
      });
    }
    
    onRunQuery();
  };

  onPropertyChange = (event: SelectableValue<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    query.thing.properties.map(p => {
      if (p.id === event.value + '') {
        onChange({ ...query, property: p });
      }
    });
    onRunQuery();
  };

  updateThings() {
    const { query } = this.props;
    this.thingOptions = [];
    if (this.props.datasource.things instanceof Array) {
      this.props.datasource.things.map(t => {
        this.thingOptions.push({ value: t.id, label: t.name, description: t.description });
        if (query.thing !== undefined && query.thing.id === t.id) {
          this.selectedThingOption = { value: t.id, label: t.name, description: t.description }
        }
      });
    }
  }

  updateProperties() {
    const { query } = this.props;
    this.propertyOptions = [];
    if (query.thing !== undefined) {
      query.thing.properties.map(p => {
        this.propertyOptions.push({ value: p.id, label: p.name, description: p.description });
        if (query.property !== undefined && query.property.id === p.id) {
          this.selectedPropertyOption = { value: p.id, label: p.name, description: p.description }
        }
      });
    }
  }

  render() {
    this.updateThings();
    this.updateProperties();
    return (
      <div className="gf-form">
        <Select prefix="Thing" value={this.selectedThingOption} options={this.thingOptions} onChange={this.onThingChange} />
        <Select prefix="Property" value={this.selectedPropertyOption} options={this.propertyOptions} onChange={this.onPropertyChange} />
      </div>
    );
  }
}
