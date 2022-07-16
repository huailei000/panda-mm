import React, { Component, Fragment } from 'react';
import { XInput, XButton, XModal, XTimePicker } from 'xcomponents';
import { $_ajax, $_date } from 'services';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: props.size,
            type: props.type,
            name: props.data.name
        };
        this.nameList = {
            grade: '班级信息',
            teacher: '教师信息',
            room: '教室信息'
        };
    }

    confirmFn() {
        const { confirm, data } = this.props;
        console.log(confirm)
        confirm();
    }

    render() {
        const { confirm, cancel, data } = this.props;
        return (
            <div className="sheetmanage-tips">
                <XModal.Header {...this.props}>提示</XModal.Header>
                <XModal.Body>
                    {this.state.name ? (
                        <div className="edit-basic">
                            <div className="form-item">{this.nameList[this.state.name]}暂未设置，无法添加课程</div>
                            <div className="form-item">请前往教务信息管理中设置{this.nameList[this.state.name]}</div>
                        </div>
                    ) : (
                        <div className="edit-basic">
                            <div className="form-item">课程节次暂未设置，无法添加课程</div>
                            <div className="form-item">请前往教务信息管理中设置课程节次</div>
                        </div>
                    )}
                </XModal.Body>
                <XModal.Footer>
                    <XButton type={'primary'} onClick={::this.confirmFn}>
                        去设置
                    </XButton>
                    <XButton
                        onClick={() => {
                            cancel();
                        }}
                    >
                        暂不设置
                    </XButton>
                </XModal.Footer>
            </div>
        );
    }
}
