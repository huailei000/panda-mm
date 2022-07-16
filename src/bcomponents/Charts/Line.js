/**
 * name:
 * desc:
 * date: 2018/8/16
 * author: kelvin
 */
import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import PropTypes from 'prop-types';

export default class Line extends React.Component {
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
      title: false,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#7297ff',
        padding: [10, 16],
        formatter: '时间：{b}<br />客流量：{c}人',
        axisPointer: {
          type: 'none',
        },
      },
      legend: {},
      xAxis: {
        type: 'category',
        boundaryGap: false,
        nameLocation: 'center',
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
      series: [
        {
          name: '',
          smooth: true,
          type: 'line',
          symbolSize: 8, //拐点圆的大小
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
            },
          },
          itemStyle: {
            normal: {
              color: '#7297ff',
              borderWidth: 4,
              lineStyle: {
                color: '#7297ff',
                width: 4,
              },
            },
          },
          areaStyle: {
            normal: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new echarts.graphic.LinearGradient (0, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#fff',
                },
                {
                  offset: 1,
                  color: '#7297FF',
                },
              ]),
              opacity: 0.5,
            },
          },
          data: [],
        },
      ],
    },
  };

  constructor (props) {
    super ();
    this.defaultOpts = {
      legend: {},
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {},
      yAxis: {
        type: 'value',
      },
      series: [],
    };
    this.state = {
      option: Object.assign (this.defaultOpts, props.option),
      height: props.height,
      width: props.width,
    };
  }

  componentDidMount () {
    this.lineChart = echarts.init (this.refs.lineChartContainer);
    this.lineChart.setOption (this.state.option);
    window.addEventListener (
      'resize',
      () => {
        this.lineChart.resize ();
      },
      false
    );
  }

  componentWillReceiveProps (newProps) {
    this.setState (
      {
        option: Object.assign (this.state.option, newProps.option),
      },
      () => {
        this.lineChart.setOption (this.state.option);
      }
    );
  }

  render () {
    let style = {width: this.state.width, height: this.state.height};
    return (
      <div ref="lineChartContainer" className="rayr-chart-line" style={style} />
    );
  }
}
