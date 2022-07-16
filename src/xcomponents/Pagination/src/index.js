import React from 'react';
import PropTypes from 'prop-types';
import {XSelector, XIcon} from 'xcomponents';
import './index.scss';

let selectorConf=[
    {value: 10, label: '10条/页'},
     {value: 20, label: '20条/页'},
     {value: 30, label: '30条/页'},
     {value: 50, label: '50条/页'}
];

export default class extends React.Component {

    static propTypes = {
        count: PropTypes.number.isRequired,
        size: PropTypes.oneOf(['lg', 'md', 'sm'])
    };

    static defaultProps = {
        count: null,
        currentPage: 1,
        perPage: 10,
        size: 'md',
        isAgeSize: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            count: props.count,
            currentPage: props.currentPage,
            perPage: props.perPage,
            size: props.size,
            className: props.className,
            showPages: 5,
            arr: [],
            goPage: ''
        }
    }

    componentWillMount() {
        this.changePage(1);
    }

    componentWillReceiveProps(props) {
        let cPage = parseInt(props.currentPage);

        if (props.count != null) {
            this.setState({
                count: props.count,
                currentPage: parseInt(props.currentPage),
                perPage: props.perPage
            }, this.changePage(this.state.currentPage));
        }

    }

    changePage(item) {
        item = parseInt(item);
        this.state.arr = [];
        let length;
        let k = 0;
        let pages = Math.ceil(this.state.count / this.state.perPage);
        if (pages < this.state.showPages) {
            length = pages;
            for (let i = 0; i < length; i++) {
                this.state.arr.push(i + 1);
            }
        } else {
            length = this.state.showPages;
            if ((item - 2 >= 1) && (item + 2 <= pages)) {
                k = -2;
            } else if (item - 2 < 1) {
                k = -(item - 1);
            } else if (item + 2 > pages) {
                k = -item + pages - length + 1;
            }
            for (let i = 0; i < length; i++) {
                this.state.arr.push(item + k + i);
            }
        }
    }

    toPage(item, page) {
        if (item === 0 || (item === 1 && page === 1) || item > Math.ceil(this.state.count / this.state.perPage) || (item === Math.ceil(this.state.count / this.state.perPage) && page === Math.ceil(this.state.count / this.state.perPage)) || item === this.state.currentPage) {
            return;
        }
        this.setState({currentPage: item, goPage: page === 'go-page' ? item : ''}, () => {
            this.changePage(item);
            this.props.onPageChange(item, page);
        });

    }

    isShow(count) {
        let page = parseInt(this.state.currentPage);
        let lastpage = Math.ceil(this.state.count / this.state.perPage);
        let last_input_length = ('' + lastpage).split('').length
        let input_length = ('' + this.state.goPage).split('').length || last_input_length;
        this.changePage(page);
        if (count === 0 || count === null) {
            return null;
        } else {
            return (
                <div className={`xcomponent-page-container ${this.state.className}`}>
                    <ul className={`xcomponent-page ${this.state.size + '-xcomponent-page'}`}>
                        <li class={`first-page${page === 1 ? ' click-disable' : ''}`} onClick={() => {
                            this.toPage(1)
                        }}>
                            <XIcon type={"angle-left"}/>
                            <XIcon type={"angle-left"}/>
                        </li>
                        <li className={`${page === 1 ? 'click-disable' : ''}`} onClick={() => {
                            this.toPage(page - 1)
                        }}><span><XIcon type={"angle-left"}/>上一页</span></li>
                        {
                            this.state.arr.map((item, index) => {
                                return (
                                    <li key={index} className={`${page === item ? 'value-blue' : ''}`}
                                        key={item.toString()} onClick={() => {
                                        this.toPage(item)
                                    }}><span>{item}</span></li>
                                )
                            })
                        }
                        <li className={`${page === lastpage ? 'click-disable' : ''}`} onClick={() => {
                            this.toPage(page + 1)
                        }}><span>下一页<XIcon type={"angle-right"}/></span></li>
                        <li class={`last-page${page === lastpage ? ' click-disable' : ''}`} onClick={() => {
                            this.toPage(lastpage)
                        }}>
                            <XIcon type={"angle-right"}/>
                            <XIcon type={"angle-right"}/>
                        </li>
                    </ul>
                    <span className="total-info">共{this.state.count}条</span>
                    { this.props.isAgeSize ? <div className="pagination-selector">
                            <XSelector className="pagination-selector" options={selectorConf}
                                          defaultValue={ this.props.perPage}
                                          onChange={(item) => {
                                              this.props.onSizeChange(item.value);
                                          }}
                            />
                        </div> : null}
                </div>
            );
        }
    }

    render() {
        return (
            this.isShow(this.state.count)

        );
    }
}