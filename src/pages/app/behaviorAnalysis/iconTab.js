import React, { Component } from 'react';
import PropTypes from 'prop-types';

class IconTab extends Component {
  static defaultProps = {
    data: [],
    current: 0,
    name: 'name',
  }
  constructor(props) {
    super(props);
    const current = props.current;
    this.state = {
      current,
    };
  };
  onChange(current, data) {
    if (current === this.state.current) return;
    this.setState({
      current,
    });
    if (!this.props.onChange) return;
    this.props.onChange(current, data);
  }
  render() {
    return (
      <div className="icontab">
        {this.props.data.map((item, index) => {
          let title = '';
          let icon = '';
          if (typeof item !== 'string') {
            let { src } = item;
            title = item[this.props.name] || '';
            icon = src;
          }
          if (typeof item === 'string') {
            title = item;
          }
          return (
            <div
              key={index}
              className={`iconBody${ index === this.state.current ? ' active' : '' }`}
              onClick={this.onChange.bind(this,index, item)}>
              { icon ? <img src={icon}/> : null}
              <span>{ title }</span>
            </div>
          );
        })}
      </div>
    );
  }
}

IconTab.propTypes = {
  data: PropTypes.array
};

export default IconTab;