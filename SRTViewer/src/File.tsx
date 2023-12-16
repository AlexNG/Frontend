import React, { Component } from 'react';
import TextStorage from './TextStorage';

class File extends Component<any, any> {
    ts: TextStorage = new TextStorage();

    constructor(props: any) {
        super(props);
        this.state = {
            srt: ''
        };
    }

    componentDidUpdate(prevProps : any) {
        if (this.props.currFile !== prevProps.currFile) {
            fetch(this.props.currFile).then(resp => resp.text().then(text => this.parseSrt(text)));
        }
    }

    parseSrt(text: string) {
        this.setState({ srt: text });
    }

    mark() {
        this.ts.
    }

    render() {
        return (<pre onDoubleClick={() => this.mark()} style={{ overflow: "scroll" }}>{this.state.srt}</pre>);
    }
}

export default File;