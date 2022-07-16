/**
 * name:
 * desc: 基于Echart封装的柱状图
 * date: 2018/8/15
 * author: kelvin
 */

import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import PropTypes from 'prop-types';

export default class Bar extends React.Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    option: PropTypes.object,
  };

  // 默认值
  static defaultProps = {
    width: `100%`,
    height: `300px`,
    option: {
      title: {},
      color: '#1890FF',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
      },
      legend: {
        show: true,
        selectedMode: false,
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#F3F7FB',
          },
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#F3F7FB', //左边线的颜色
            width: '4', //坐标线的宽度
          },
        },
        axisLabel: {
          textStyle: {
            color: '#b3cddd', //坐标值得具体的颜色
          },
        },
        nameLocation: 'center',
        data: [],
      },
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F3F7FB',
            },
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#F3F7FB', //左边线的颜色
              width: '4', //坐标线的宽度
            },
          },
          axisLabel: {
            textStyle: {
              color: '#fff', //坐标值得具体的颜色
            },
          },
        },
      ],
      series: [],
    },
  };

  constructor (props) {
    super ();
    this.defaultOpts = {
      title: {},
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        show: false,
      },
      xAxis: {},
      yAxis: {},
      series: [],
    };
    this.state = {
      option: Object.assign (this.defaultOpts, props.option),
      height: props.height,
      width: props.width,
    };
  }

  itemClick (item) {
    this.props.onChange (item);
  }

  componentDidMount () {
    let _this = this;
    this.barChart = echarts.init (this.refs.barChartContainer);
    this.barChart.setOption (this.state.option);
    window.addEventListener (
      'resize',
      () => {
        this.barChart.resize ();
      },
      false
    );
    if (this.props.onChange) {
      this.barChart.on ('click', params => {
        _this.itemClick (params);
      });
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState (
      {
        option: Object.assign (this.state.option, newProps.option),
      },
      () => {
        this.barChart.setOption (this.state.option);
      }
    );
  }

  render () {
    let style = {height: `${this.state.height}`, width: `${this.state.width}`};
    return (
      <div ref="barChartContainer" className="rayr-chart-bar" style={style} />
    );
  }
}
