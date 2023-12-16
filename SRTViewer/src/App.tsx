import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tree from './Tree';
import File from './File';

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currFile: null
    };
  }

  loadFile(event: any, value: any) {
    this.setState({ currFile: value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" style={{ display: "none" }}>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
        <Tree url="SRT/" onNodeSelect={(e: any, value: any) => this.loadFile(e, value)} />
        <File currFile={this.state.currFile} />
      </div>
    );
  }
}

export default App;
