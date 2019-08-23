import * as React from 'react';

import { mockedItems } from './mock';
import { PieChart } from './components/PieChart/PieChart';

export class App extends React.Component {
  static readonly dimensions = {
    width: 700,
    height: 700,
    radius: 200
  };

  static readonly labelParts = [
    { type: 'remove', fontSize: 7, offset: -16 },
    { type: 'name', fontSize: 12, fontFamily: 'Arial' },
    { type: 'percentage', fontSize: 10, fontFamily: 'Arial', offset: 14 }
  ];

  public state = {
    items: [...mockedItems.map(mockedItem => ({ ...mockedItem }))]
  };

  private onChange = (items: Item[]) =>
    this.setState(prevState => ({
      ...prevState,
      items
    }));

  public render() {
    return (
      <PieChart
        dimensions={App.dimensions}
        labelParts={App.labelParts}
        items={this.state.items}
        onChange={this.onChange}
      />
    );
  }
}
