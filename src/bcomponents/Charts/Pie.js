import React, {Component} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import PropTypes from 'prop-types';

class PieCharts extends Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
  };

  // 默认值
  static defaultProps = {
    width: `100%`,
    height: `300px`,
  };

  constructor () {
    super ();
    this.option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      color: [
        '#FF81A3',
        '#FFBD7C',
        '#FFDD95',
        '#7ED79B',
        '#7DDCD4',
        '#94B0FF',
        '#9B98EF',
        '#EA91F4',
      ],
      series: [
        {
          type: 'pie',
          avoidLabelOverlap: true,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
        },
      ],
    };
  }

  componentDidMount () {
    this.myChart = echarts.init (this.refs.pieContainer);
    this.myChart.setOption (
      Object.assign (this.option, this.props.option),
      true
    );
    window.addEventListener (
      'resize',
      () => {
        this.myChart.resize ();
      },
      false
    );
  }

  componentWillReceiveProps (newProps) {
    // 判断参数是否存在
    if (newProps.option && Object.keys (newProps.option).length > 0) {
      this.option.series[0].data = newProps.option.series[0].data; // 参数复用
      this.myChart.setOption (Object.assign (this.option, newProps.option));
    }
  }

  render () {
    let style = {width: this.props.width, height: this.props.height};
    return <div ref="pieContainer" style={style} />;
  }
}

export default PieCharts;
