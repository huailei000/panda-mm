import React from 'react';
import {XModal, XButton, XInput} from 'xcomponents';
import {$_ajax, $_util, $_toast, $_localstorage} from 'services';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPwd: '',
            newPwd: '',
            confirmPwd: '',
            warning: ''
        };
    }
    saveFn(){
        if(!this.state.initialPwd){
            this.setState({warning: '原始密码不能为空！'});
            return;
          };
          if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/).test(this.state.newPwd)){
            this.setState({warning: '新密码格式不正确（长度8-16位,包含大写字母、小写字母和数字）！'});
            return;
          };
          if(!this.state.confirmPwd){
            this.setState({warning: '确认新密码不能为空！'});
            return;
          };
          if(this.state.confirmPwd !== this.state.newPwd){
            this.setState({warning: '两次输入密码不一致！'});
            return;
          };
        $_ajax.post('bcuser/v1/user/updateUserPwd', {
            initialPwd: $_util.salt(this.state.initialPwd),
            newPwd: $_util.salt(this.state.newPwd),
            confirmPwd: $_util.salt(this.state.confirmPwd)
        }).then((res) => {
            $_toast('修改成功');
            setTimeout(()=>{
                $_localstorage.delete('token');
                window.location.href = '/';
            },500)
            
        }, (res) => {
            this.setState({warning: res.msg})
        });
    }

    render() {
        const {username,password} = this.state;
        return (
            <div className="modify-pwd">
                <XModal.Header {...this.props} className={`${this.props.data.modify ? '' : 'mod-pwd-close-btn'}`}>
                    修改密码
                </XModal.Header>
                <XModal.Body>
                        <span className='mod-title'><span className="must-inputStar">*</span>原始密码：</span>
                        <XInput type="password" className="mod-pwd-input" placeholder="原始密码" value={this.state.initialPwd} onChange={(val)=>{
                            this.setState({
                                initialPwd: val,
                                warning: ''
                            })
                        }}/>
                        <span className='mod-title'><span className="must-inputStar">*</span>新密码：</span>
                        <XInput type="password" className="mod-pwd-input" maxLength='16' placeholder="新密码" value={this.state.newPwd} onChange={(val)=>{
                            this.setState({
                            newPwd: val,
                            warning: ''
                            })
                        }}/>
                        <span className='mod-title'><span className="must-inputStar">*</span>确认新密码：</span>
                        <XInput type="password" className="mod-pwd-input" maxLength='16' placeholder="确认新密码" value={this.state.confirmPwd} onChange={(val)=>{
                            this.setState({
                            confirmPwd: val,
                            warning: ''
                            })
                        }}/>
                        <div className="updateWarningArea">
                        {this.state.warning}
                        </div>
                </XModal.Body>
                <XModal.Footer>
                    <XButton type="primary" size="sm" onClick={::this.saveFn}>确定</XButton>
                </XModal.Footer>
            </div>
        );
    }
}

