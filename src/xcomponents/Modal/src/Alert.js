import React from 'react';
import {XButton} from '../../index';
import classnames from 'classnames';

import Dialog from './Dialog';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

function Alert(props) {

    const {data, confirm, cancel} = props;

    return (
        <div className="modal-confirm">
            <Header key="Header" {...props}><h4 className="confirm-title">
                    {data.title}
                </h4></Header>
            <Body key="Body">
                <div className="confirm-msg">{data.msg}</div>
            </Body>
            <Footer key="Footer">
                <XButton type={'primary'} size={data.btnSzie} onClick={() => {
                    cancel();
                }}>{data.btnText}</XButton>
            </Footer>
        </div>
    );
}

export default (opt = {}) => {

    let _opt = {
        backDrop: opt.backDrop || false, //点击背景是否关闭
        size: opt.size || 'sm', //确认框大小
        className: classnames('x-modal-confirm', opt.className),
        data: {
            title: opt.title || '系统提示', //标题
            titleIcon: opt.titleIcon || '', //标题的图标
            msg: opt.msg || '您确定要执行此操作吗？', //内容
            btnSzie: opt.btnSzie || 'md', //按钮大小
            btnText: opt.btnText || '确认', //按钮文案
            tipsIcon: opt.tipsIcon || 'question' //提示icon
        }
    };

    return Dialog(Alert, _opt)
}
