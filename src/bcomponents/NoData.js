/**
 * name:
 * desc:
 * date: 2018/11/24
 * author: fff
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NodataImg from '../assets/no-data.png';

class NoData extends Component {
  static defaultProps = {
    msg: '暂无数据'
  }
  render() {
    const {type, msg} = this.props;
    return (
      <div className={`no-data ${type}-no-data`}>
        <img src={NodataImg} alt="" />
        <div className="no-data-msg">{ msg }</div>
      </div>
    );
  }
}

NoData.propTypes = {
  msg: PropTypes.string
};

export default NoData;

