import './index.scss';
import React from 'react';
import {inject, observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import {$_ajax, $_cookie, $_map, $_conf} from 'services';
import {XIcon, XToggle, XModal} from 'xcomponents';

@withRouter
@inject ('UserStore')
@observer
export default class extends React.Component {
  signOutFn () {
    $_cookie.delete ('access_token');
    window.location.href = $_conf.login;
  }

  render () {
    return (
      <header className="main-header">
        <div className="navbar">
          <div className="title">{this.props.UserStore.curTitle}</div>
          <span>版本 V 1901171715&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <div className="tool-list">
            <div className="user-info">
              <div className="photo">
                <XIcon type="adjust" />
              </div>
              <div className="name">{this.props.UserStore.user.username}</div>
            </div>
            <div className="logout" onClick={::this.signOutFn}>
              退出
            </div>
          </div>
        </div>
      </header>
    );
  }
}
