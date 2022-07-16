import React, { Component, Fragment } from 'react';
import { XInput, XButton, XModal, XTimePicker } from 'xcomponents';
import { $_ajax, $_date } from 'services';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: props.size,
            type: props.type,
            arr: props.data.arr
        };
    }

    confirmFn() {
        const { confirm, data } = this.props;
        confirm();
    }

    render() {
        const { confirm, cancel, data } = this.props;
        return (
            <div className="sheetmanage-tips">
                <XModal.Header {...this.props}>提示</XModal.Header>
                <XModal.Body>
                    <div className="edit-basic">
                        {
                            this.state.arr.map((item, index) => {
                                return <div key={index} className="form-item">{item}</div>
                            })
                        }
                    </div>
                </XModal.Body>
                <XModal.Footer>
                    <XButton type={'primary'} onClick={::this.confirmFn}>
                        确定
                    </XButton>
                    <XButton
                        onClick={() => {
                            cancel();
                        }}
                    >
                        取消
                    </XButton>
                </XModal.Footer>
            </div>
        );
    }
}
