/**
 * name:
 * desc: box title
 * date: 2018/11/04
 * author: fff
 */

import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {XIcon} from 'xcomponents';

const SectionTitle = props => {
  const {leftT, leftB, rightT, rightB} = props;

  return (
    <Fragment>
      {rightT.type === 'txt'
        ? <div className="b-section-title">
            <div className="section-title-total">
              <span className="title">
                <span className="icon" />
                <span>{leftT}</span>
              </span>
              {leftB
                ? <span className="num">{leftB}<span>人</span></span>
                : null}
            </div>
            {rightB
              ? <div className="section-title-time">
                  <span>{rightT.script}</span>
                  <span>{rightB}</span>
                </div>
              : null}
          </div>
        : <div className="b-section-title">
            <span className="title">
              <span className="icon" />
              <span>{leftT}</span>
            </span>
            {rightT.type === 'exp'
              ? <span
                  className="exp"
                  onClick={() => {
                    props.onClick (rightT.url);
                  }}
                >
                  <XIcon type={'exp'} className="icon-exp" />
                  {rightT.script}
                </span>
              : <span
                  className="btn"
                  onClick={() => {
                    props.onClick (rightT.route);
                  }}
                >
                  {rightT.script}
                </span>}
          </div>}
    </Fragment>
  );
};

SectionTitle.propTypes = {
  leftT: PropTypes.string,
  leftB: PropTypes.number,
  rightT: PropTypes.object,
  rightB: PropTypes.string,
};

SectionTitle.defaultProps = {
  leftT: '',
  leftB: 0,
  rightT: {
    script: '数据更新时间',
    type: 'txt',
  },
  rightB: '',
};

export default SectionTitle;
