/**
 * name:
 * desc:
 * date: 2018/11/12
 * author: kelvin
 */
import React from 'react';
import {XToggle, XIcon, XInput, XModal} from 'xcomponents';
import {$_ajax, $_toast} from 'services';

export default class extends React.Component {
    constructor(props) {
        super();
        this.state = {
            defaultValue: props.defaultValue,
            mapOptions: new Map(),
            isActive: false,
            selectIndex: -1,
            industryName: '',
        };
    }

    componentDidMount() {
        this.processData(this.props);
    }

    componentWillReceiveProps(newProps) {
        // 外部参数改变,就再重新更新数据，重新渲染
        if (
            this.props.options !== newProps.options ||
            this.props.defaultValue !== newProps.defaultValue
        ) {
            this.processData(newProps);
        }
    }

    processData(props) {
        // 预处理数据
        let originOpts = props.options || [];
        let optionsMap = new Map();
        // let selected = props.selected;
        let defaultValue = props.defaultValue !== undefined
            ? props.defaultValue
            : -1;
        let selectIndex = -1;

        originOpts.map((item, index) => {
            optionsMap.set(index, item);
            if (defaultValue == item.value) {
                // 暂时用非全等
                selectIndex = index;
            }
        });

        this.setState({
            mapOptions: optionsMap,
            selectIndex: selectIndex,
        });
    }

    itemClick(item, index, e) {
        if (e.target.nodeName === 'I') {
            e.nativeEvent.stopImmediatePropagation();
        } else {
            this.setState(
                {
                    selectIndex: index,
                },
                () => this.props.onChange(item)
            );
        }
    }

    inputClick(e) {
        e.nativeEvent.stopImmediatePropagation();
    }

    inputChange(value) {
        this.setState({
            industryName: value,
        });
    }

    handleKeyDown(e) {
        if (e.keyCode === 13) {
            // 限制只允许创建最多8个业态
            if (this.state.industryName === '') {
                $_toast('输入业态名称不能为空');
                return;
            }
            if (this.state.mapOptions.size >= 8) {
                $_toast('业态数量最多不能超过8个!');
            } else {
                let industryName = this.state.industryName;
                if (industryName !== '') {
                    $_ajax
                        .post('bcbase/v1/industry/addIndustry', {
                            mallId: this.props.mallId,
                            showName: industryName,
                        })
                        .then(
                            res => {
                                this.props.onOptionsChange();
                                this.setState({
                                    industryName: '',
                                });
                            },
                            res => {
                                $_toast(res.msg);
                            }
                        );
                }
            }
        }
    }

    deleteIndustry(id, e) {
        e.nativeEvent.stopImmediatePropagation;
        XModal.Confirm({size: 'sm'}).then(
            () => {
                $_ajax
                    .post('bcbase/v1/industry/delIndustry', {
                        mallId: this.props.mallId,
                        id: id,
                    })
                    .then(
                        res => {
                            this.props.onOptionsChange();
                        },
                        res => {
                            $_toast(res.msg);
                        }
                    );
            },
            res => {
                console.log(res);
            }
        );
    }

    render() {
        let mainTransform = {fontSize: 'normal'};
        let selected = this.state.mapOptions.get(this.state.selectIndex);
        return (
            <XToggle className="input-selector-wrapper">
                <XToggle.Top>
                    <div key={'radio_first'} ref={'dropHeader'} className="drop-header">
                        <input
                            type="text"
                            value={selected ? selected.label : ''}
                            placeholder={this.props.placeholder || '请选择'}
                            readOnly={true}
                        />
                        <XIcon type="angle-right" className="up-icon dropdown-select-icon"></XIcon>
                    </div>
                </XToggle.Top>
                <XToggle.Box className={`drop-main-selector`}>
                    <div
                        key={'radio_two'}
                        ref={'dropMain'}
                        className={`drop-main`}
                        style={mainTransform}
                    >
                        <ul className="drop-list">
                            {[...this.state.mapOptions].map((item, index) => {
                                let itemCls = index == this.state.selectIndex ? 'selected' : '';
                                return (
                                    <li
                                        key={`radio_${index}`}
                                        className={`${itemCls}`}
                                        onClick={this.itemClick.bind(this, item[1], index)}
                                        index={index}
                                        value={item[1].value}
                                    >
                    <span className="label">
                      {item[1].label}
                    </span>
                                        <XIcon
                                            type={'close-a'}
                                            className="delete-icon"
                                            onClick={this.deleteIndustry.bind(this, item[1].value)}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="input-box">
                            <XInput
                                placeholder={'请输入自定义业态'}
                                value={this.state.industryName}
                                onClick={this.inputClick.bind(this)}
                                onChange={this.inputChange.bind(this)}
                                onKeyDown={this.handleKeyDown.bind(this)}
                            />
                        </div>
                    </div>
                </XToggle.Box>
            </XToggle>
        );
    }
}
