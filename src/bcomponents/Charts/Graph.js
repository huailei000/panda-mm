/**
 * name:
 * desc: 关系图-图表
 * date: 2018/11/5
 * author: kelvin
 */

import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import PropTypes from 'prop-types';

export default class Graph extends React.Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    options: PropTypes.object,
  };

  static defaultProps = {
    width: '100%',
    height: '600px',
    options: {
      title: '',
      series: [
        {
          type: 'graph',
          layout: 'circular',
          nodes: [],
          edges: [],
          focusNodeAdjacency: true,
          lineStyle: {
            normal: {
              width: 0.5,
              curveness: 0.5,
              opacity: 1,
            },
          },
        },
      ],
    },
  };

  constructor (props) {
    super ();
    this.state = {
      options: props.options,
      width: props.width,
      height: props.height,
    };
    this.graphChart = null;
  }

  componentDidMount () {
    this.graphChart = echarts.init (this.refs.graphContainer);
    this.graphChart.setOption (this.props.options);
    window.addEventListener (
      'resize',
      () => {
        this.graphChart.resize ();
      },
      false
    );

    this.graphChart.on ('click', params => {
      if (params.dataType === 'node') {
        this.props.onItemClick (params.data);
      }
    });
  }

  componentWillReceiveProps (newProps) {
    this.setState (
      {
        options: Object.assign (this.state.options, newProps.options),
      },
      () => {
        let opts = this.state.options;
        this.graphChart.setOption (opts);
      }
    );
  }

  render () {
    let style = {width: `${this.state.width}`, height: `${this.state.height}`};
    return <div ref="graphContainer" className="b-graph" style={style} />;
  }
}
