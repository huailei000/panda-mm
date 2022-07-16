/**
 * name:
 * desc: 性别|年龄对比图表组件
 * date: 2018/10/31
 * author: kelvin
 */

import React from 'react';
import PropTypes from 'prop-types';
import {$_util} from 'services';
import {BLoading} from 'bcomponents';

const CompareChart = props => {
  const {dataList} = props;

  return (
    <div className="b-chart-compare-gender-age">
      {dataList.length > 0
        ? [
            <div key={`compareChartTitle`} className="chart-compare-title">
              <div className="chart-compare-title-left">
                男性用户
                {' '}
                <span>{`${$_util.formatPercent (dataList[0].value)}`}</span>
              </div>
              <div className="chart-compare-title-center">VS</div>
              <div className="chart-compare-title-right">
                <span>{`${$_util.formatPercent (dataList[1].value)}`}</span>
                {' '}
                女性用户
              </div>
            </div>,
            <div key={`compareChartContent`} className="chart-compare-content">
              <div className="chart-compare-content-left">
                <div className="left-content">
                  {dataList[0].ageList.map ((item, index) => {
                    let width = 100 - item.value * 100 + '%';
                    return (
                      <div
                        key={`leftBar_${index}`}
                        className="left-bar"
                        style={{marginLeft: width}}
                      />
                    );
                  })}
                  <div className="left-scale-line">
                    <div className="line" />
                    <div className="line" />
                    <div className="line" />
                  </div>
                </div>
                <div className="left-scale">
                  <span>100%</span>
                  <span>50%</span>
                  <span>0%</span>
                </div>
              </div>
              <div className="chart-compare-content-center">
                <div>{`<16岁`}</div>
                <div>{`16-30岁`}</div>
                <div>{`31-45岁`}</div>
                <div>{`46-60岁`}</div>
                <div>{`>60岁`}</div>
              </div>
              <div className="chart-compare-content-right">
                <div className="right-content">
                  {dataList[1].ageList.map ((item, index) => {
                    let width = item.value * 100 + '%';
                    return (
                      <div
                        key={`rightBar_${index}`}
                        className="right-bar"
                        style={{width: width}}
                      />
                    );
                  })}
                  <div className="right-scale-line">
                    <div className="line" />
                    <div className="line" />
                    <div className="line" />
                  </div>
                </div>

                <div className="right-scale">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>,
          ]
        : <div className="no-data" />}
    </div>
  );
};

CompareChart.propTypes = {
  dataList: PropTypes.array,
};

CompareChart.defaultProps = {
  dataList: [],
};

export default CompareChart;
