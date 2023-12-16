import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const styles = (theme: any) => ({
    root: {
        height: '30vh',
        overflow: 'scroll'
    }
});

class Tree extends Component<any, any> {
    classes: any;

    constructor(props: any) {
        super(props);
        this.state = {
            tree: {
                id: this.props.url
            }
        };
    }

    componentDidMount() {
        this.loadFolder(this.props.url);
    }

    loadFolder(url: string) {
        fetch(url).then(resp => resp.text().then(html => this.parseFolder(html, url)));
    }

    setCurrFolderSubTree(subTree: any, url: string) {
        const newState = Object.assign(this.state, {});
        this.findNodeDataById(newState.tree, url).children = subTree;
        this.setState(newState);
    }

    findNodeDataById(node: any, id: string) {
        if (node.id == id) {
            return node;
        }
        if (!node.children) {
            return null;
        }
        return node.children.find((_node: any) => this.findNodeDataById(_node, id));
    }

    parseFolder(html: string, url: string) {
        const items: Array<string> = html.split(/<li>(.+)<\/li>/);
        const nodes = items
            .filter(li => li.startsWith('<a href=') && li.indexOf('title=".."') < 0)
            .map(li => {
                const href: any = li.match(/href="(.+?)"/)[1];
                const title: any = li.match(/title="(.+?)"/)[1];
                let node: any = { id: href, name: title };
                if (!li.match(/<span class="size">\d+<\/span>/)) {
                    node.children = [{ id: "_" + href, name: '..' }];
                }
                return node;
            })
        this.setCurrFolderSubTree(nodes, url);
    }

    renderTree(subTree: any): any {
        return (!subTree ? null : Array.isArray(subTree) ? subTree.map((node: any) => this.renderTree(node)) :
            <TreeItem key={subTree.id} nodeId={subTree.id} label={subTree.name}>
                {this.renderTree(subTree.children)}
            </TreeItem>
        );
    }

    loadSubFolder(event: any, nodeIds: any) {
        const id: string = nodeIds[0];
        if (!id) {
            return;
        }
        const currFolder = this.findNodeDataById(this.state.tree, id);
        if (!currFolder.loaded) {
            this.loadFolder(id);
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <TreeView
                className={classes.root}
                onNodeToggle={(e, ids) => this.loadSubFolder(e, ids)}
                onNodeSelect={(e: any, value: any) => this.props.onNodeSelect(e, value)}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                {this.renderTree(this.state.tree.children)}
            </TreeView>
        );
    }
}

export default withStyles(styles)(Tree);