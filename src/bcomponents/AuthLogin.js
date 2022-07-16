import React, {Component} from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {
  $_localstorage,
  $_urlMap,
  $_conf
} from 'services';

export default () => C => {
  @inject ('UserStore')
  @observer
  class AuthComponent extends Component {
    render () {
      const {isLogin} = this.props.UserStore;
      return isLogin ? < C { ...this.props
      }
      /> : <Redirect push to={$_conf.login} /> ;
    }
  }

  return AuthComponent;
};
