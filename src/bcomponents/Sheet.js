import React, {Component, Fragment} from "react";
import PropTypes from 'prop-types';
import { XIcon } from 'xcomponents';

class Row extends React.Component {

    render() {
        return (
            <div className="b-sheet-row">
                {this.props.children}
            </div>
        );
    }
}

class Normal extends React.Component {

    show() {
        this.props.state ? this.props.onChange() : null;
    }

    delete() {
        this.props.onDelete();
    }

    render() {
        return (
            <div className={`b-sheet-normal ${this.props.type === 'not' ? ' notSave' : ''} ${this.props.type === 'red' ? 'red' : ''} `}>
                <span className="b-sheet-normal-val">{this.props.val}</span>
                <span className="b-sheet-normal-site">{this.props.site}</span>
                <div className="b-sheet-normal-layer">
                    <div onClick={this.show.bind(this)}>
                        <span className="num">{this.props.num}</span>
                        <span className="teach">{this.props.teach}</span>
                    </div>
                    {
                        this.props.state ?
                            <XIcon
                                type="minus-circle"
                                className="icon-circle"
                                onClick={this.delete.bind(this)} /> :
                            null
                    }
                </div>
            </div>
        );
    }
}

class Week extends React.Component {
    static propTypes = {
        val: PropTypes.string
    };

    static defaultProps = {
        val: ''
    };

    render() {
        return (
            <div className="b-sheet-week">
                <span>{this.props.val}</span>
            </div>
        );
    }
}

class Course extends React.Component {

    render() {
        return (
            <div className="b-sheet-course">
                <span className="b-sheet-course-val">{this.props.val}</span>
                <span className="b-sheet-course-site">{this.props.time}</span>
            </div>
        );
    }
}

class Void extends React.Component {
    static defaultProps = {
        title: '暂无课程',
        type: 'default',
    }
    add() {
        this.props.onChange();
    }

    render() {
        return (
            this.props.state ?
                <div
                    className='b-sheet-void-add'
                    onClick={this.add.bind(this)}>
                    <span>添加课程</span>
                </div> :
                <div className={`b-sheet-void${this.props.type === 'not' ? ' isSave' :''}`}>
                    <span>{this.props.title}</span>
                </div>
        );
    }
}

class Empty extends React.Component {

    render() {
        return (
            <div className="b-sheet-empty">{this.props.tips ||  ''}</div>
        );
    }
}

class Line extends React.Component {

    render() {
        return (
            <div className="b-sheet-line"></div>
        );
    }
}

export default class extends React.Component {
    static Row = Row;
    static Normal = Normal;
    static Week = Week;
    static Course = Course;
    static Void = Void;
    static Empty = Empty;
    static Line = Line;

    constructor(props) {
        super();
    }

    render() { 
        return (
            <div className="b-sheet">
                {this.props.children}
            </div>
        );
    }
};