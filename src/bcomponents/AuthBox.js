/**
 * name:
 * desc:
 * date: 2018/11/21
 * author: kelvin
 */
import React from 'react';
import {inject, observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import {XBox, XIcon} from 'xcomponents';

const NoAuthPage = () => {
  return (
    <div className="no-auth">
      <XBox>
        <XIcon type="no-data" />
        <div>抱歉，您没有此页面的权限</div>
      </XBox>
    </div>
  );
};

export default (opt = {}) => importComponent => {
  @withRouter
  @inject ('PageAuthStore')
  @observer
  class AuthComponent extends React.Component {
    constructor (props) {
      super (props);
      this.state = {
        component: null,
      };
    }

    componentDidMount () {
      if (this.props.PageAuthStore.auth.indexOf (opt.key) > -1) {
        this.setState ({
          component: importComponent,
        });
      } else {
        this.setState ({
          component: NoAuthPage,
        });
      }
    }

    render () {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  }

  return AuthComponent;
};
