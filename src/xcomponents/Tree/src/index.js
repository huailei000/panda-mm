import React from 'react';
import $_util from './util';
import classnames from 'classnames';

import XIcon from '../../Icon/src';

import './index.scss';

const treeList = [];

export default class extends React.Component {
    constructor(props) {
        super();
        this.state = {
            treeList: props.data || treeList,
            selectedId: props.selectedId || '',
            expandList: props.expandList || []
        };
    }

    // static getDerivedStateFromProps(props, state) {
    //     if (props.data.length != state.treeList.length || props.selectedId !== state.selectedId) {
    //         // 更新state
    //         console.log('更新state', props, state);
    //
    //         return {
    //             treeList: props.data,
    //             selectedId: props.selectedId
    //         };
    //     } else {
    //         // 不更新state
    //         return null;
    //     }
    //
    // }

    componentWillReceiveProps(nextProps) {
        this.setState({
            treeList: nextProps.data,
            selectedId: nextProps.selectedId
        });
    }

    handleTreeRootClick(item) {
        let id = item.key;
        let treeList = this.state.treeList;
        treeList.map((node) => {
            if (node.id === id) {
                node.isExpand = !node.isExpand;
            }
        });

        let selectedId = this.state.selectedId;
        if (!item.children || item.children.length <= 0) {
            // 叶子节点
            selectedId = item.key;
        }

        this.setState({
            treeList: treeList,
            selectedId: selectedId
        }, () => {
            this.props.onNodeClick(item);
        });
    }

    renderIcon(type) {
        // type:4=店铺,3=区域,2=楼层,1=入口(此处不会出现这个类型),0=商场
        let icon = '';
        switch (type) {
            case '4':
                icon = <XIcon type="shop_node"/>;
                break;
            case '3':
                icon = <XIcon type="zone_node"/>;
                break;
            case '2':
                icon = <XIcon type="floor_node"/>
                break;
            default:
                icon = '';
                break;
        }
        return icon;
    }

    renderTree(treeNodes) {
        return (
            <ul className="tree-root">
                {
                    treeNodes.map((item, index) => {
                        let type = item.key.split('-')[0];
                        let liCls = type !== '4' ? 'noleaf-node' : 'leaf-node';
                        liCls = item.key === this.state.selectedId ? liCls + ' selected' : liCls;
                        if (item.key.split('-')[0] === '0') {
                            item.data.isExpand = true;
                        }

                        if (this.state.expandList.indexOf(item.key) !== -1) {
                            // 表示是需要展开的节点

                        }

                        let expendCls = item.data.isExpand ? 'expend' : '';
                        return (
                            <li className={`${liCls} ${expendCls}`} key={`treeItem_${index}`}>
                                <div
                                    className={item.children ? 'noleaf-title' : 'leaf-title'}
                                    onClick={this.handleTreeRootClick.bind(this, item)}>
                                    <div className="node-content">
                                        {
                                            this.renderIcon(type)
                                        }
                                        {item.key.split('-')[0] === '4' ? `${item.title}(${item.data.value})` : item.title}
                                    </div>
                                </div>
                                {
                                    item.children && item.data.isExpand ? this.renderTree(item.children) : null
                                }
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    render() {
        const treeData = $_util.treeConvert(this.state.treeList);
        return (
            <div className="x-tree">
                {
                    this.renderTree(treeData)
                }
            </div>
        );
    }
}
