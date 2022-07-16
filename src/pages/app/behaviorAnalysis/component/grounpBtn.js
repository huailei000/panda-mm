import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GrounpBtn extends Component {
  static defaultProps = {
    options: [],
    current: 0,
  }
  constructor(props) {
    super(props);
    const current = props.current;
    this.state = {
      current,
    }
  }
  changes(current, data) {
    this.setState({
      current,
    });
    // if (typeof data === 'string') {
    //   this.props.onChange(current, data);
    //   return;
    // }
    if (!this.props.onChange) return;
    this.props.onChange(current, data);
  }
  render() {
    return (
      <div className="grounpBtn">
        {this.props.options.map((item, index) => {
          let name = '';
          if (item !== null && typeof item === 'object') {
            name = item.name;
          } else if(typeof item === 'string') {
            name = item;
          }
          return (<button key={index} className={`btn${this.state.current === index ? ' active' : ''}`} onClick={this.changes.bind(this, index, item)}>{ name }</button>)
        })}
      </div>
    );
  }
}

GrounpBtn.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
};

export default GrounpBtn;