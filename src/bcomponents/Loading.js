/**
 * name:
 * desc:
 * date: 2018/11/22
 * author: kelvin
 */
import React from 'react';

export default props => {
  const {type} = props;
  return (
    <div className={`${type}-loading b-com-loading`}>
      <div className="loading-box">
        <span className="dot dot-1" />
        <span className="dot dot-2" />
        <span className="dot dot-3" />
        <span className="dot dot-4" />
      </div>
    </div>
  );
};
