// 5392 for 2019-Feb - not displayed?...

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Enumerable from './linq.js';

import * as data from './data.js';
import StatisticsType from './statisticsType.ts';

class Clip extends React.Component {
  render() {
    const path = `//localhost:80/anigif/${this.props.item.clipNumber}.gif`;
    return (
      <div>
        <img src={path} alt={this.props.item.clipNumber} />
        <span>{this.props.item.clipNumber}</span>
        /
        <span>{this.props.item.value}</span>
      </div>
    );
  }
}

class YgVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.setStats(StatisticsType.TotalSum, true);
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor={`${this.ref}_rbTotalSum`}>Total Sum</label><input type="radio" name="statisticsType" value={StatisticsType.TotalSum} checked={this.state.statType == StatisticsType.TotalSum} onChange={this.handleOptionChange}></input>
          &nbsp;&nbsp;&nbsp;
          <label htmlFor={`${this.ref}_rbSalesCount`}>Sales Count</label><input type="radio" name="statisticsType" value={StatisticsType.SalesCount} checked={this.state.statType == StatisticsType.SalesCount} onChange={this.handleOptionChange}></input>
        </div>
        <div>
          {this.state.saleStats.map(item =>
            <Clip key={item.clipNumber} item={item} />
          )}
        </div>
      </div>
    );
  }

  handleOptionChange = changeEvent => {
    this.setStats(changeEvent.target.value);
  };

  setStats(statType, dontSetState) {
    const areSalesAggregated = !Array.isArray(this.props.sales);
    const saleStats = areSalesAggregated
    	? Enumerable.from(this.props.sales).groupBy("$.clipNumber", "$.price",
    	      function (key, group) { return { clipNumber: key, value: statType == StatisticsType.TotalSum ? group.sum() : group.count() };}
    	    )
		: Enumerable.from(this.props.sales.entries().map(pair => { return { clipNumber: pair[0], value: pair[1][statType == StatisticsType.TotalSum ? "price" : "count"] } }));
    const state = {
      statType,
      areSalesAggregated,
      saleStats: saleStats.orderByDescending("$.value").toArray()
    };
    if (!dontSetState) {
      this.setState(state);
    }
    return state;
  }
}

// ========================================

ReactDOM.render(
  <React.StrictMode>
    <YgVisualizer ref={React.createRef()} sales={data.sales}/>,
  </React.StrictMode>,
    document.getElementById('root')
);
