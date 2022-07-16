import React, { Component } from 'react';
import { XButton, XSelector, XDatePickerInput, XModal} from 'xcomponents';
import {$_date, $_toast } from 'services';
import PropTypes from 'prop-types';
import Api from './services';
import GrounpBtn from './component/grounpBtn';
import IconTab from './iconTab';
import echarts from 'echarts';
import HistoryAnalysis from './modal/historyAnalysis';
import { withRouter } from "react-router-dom";
import { BNoData } from 'bcomponents';

const radius = '75%';
const defaultColor = '#CBD0DE';
const split_by = 'seconds';
const split_num = 60;
class BehaviorAnalysis extends Component {
  constructor(props) {
    super(props)
    let sesstionData = {};
    this.reloadDiv = false;
    this.current = 0;
    let date = $_date.init('YYYY-MM-DD', new Date());
    if (sessionStorage.getItem('params')) {
      sesstionData = JSON.parse(sessionStorage.getItem('params'));
      date = $_date.init('YYYY-MM-DD', sesstionData.end_time);
      this.reloadDiv = true;
    }
    if (sessionStorage.getItem('current')) {
      this.current = sessionStorage.getItem('current') * 1;
    }
    this.params = {
      page: 1,
      size: 1000000,
    };
    this.opt = {}; // 检索条件缓存
    this.classDis = null;// 课堂专注
    this.classBiaoQin = null; // 表情
    this.classAnalyisi = null; // 行为
    this.radarDom = null;
    this.barLeft = null;
    this.barRight = null;
    this.emotion = null;
    this.behavior = null;
    this.randaEmotionLeft = [81, 84, 87, 85];
    this.randaEmotionRight = [86, 88, 83];
    this.analyisis = [{
      label: '站立',
      value: 22,
    }, {
      label: '举手',
      value: 23,
    }, {
      label: '书写',
      value: 26,
    }, {
      label: '阅读',
      value: 25,
    }, {
      label: '趴桌子',
      value: 21,
    }, {
      label: '玩手机',
      value: 24,
    }];
    this.radar = [{
        label: '惊讶',
        value: 86,
      },
      {
        label: '高兴',
        value: 81,
      },
      {
        label: '困惑',
        value: 84
      },
      {
        label: '愤怒',
        value: 87
      },
      {
        label: '难过',
        value: 83,
      },
      {
        label: '害怕',
        value: 85
      },
      {
        label: '厌恶',
        value: 88
      },
    ];
    this.emotionCurrent = 0;
    this.behaviorCurrent = 0;
    this.expression = [
      {
        name: '高兴',
        src: require('../../../assets/behaviorAnalysis/happy.png'),
        value: 81,
      },
      {
        name: '困惑',
        src: require('../../../assets/behaviorAnalysis/puzzled.png'),
        value: 84,
      },
      {
        name: '愤怒',
        src: require('../../../assets/behaviorAnalysis/angry.png'),
        value: 87,
      },
      {
        name: '难过',
        src: require('../../../assets/behaviorAnalysis/tear.png'),
        value: 83,
      },
      {
        name: '惊讶',
        src: require('../../../assets/behaviorAnalysis/surprised.png'),
        value: 86,
      },
      {
        name: '厌恶',
        src: require('../../../assets/behaviorAnalysis/hate.png'),
        value: 88,
      },
      {
        name: '害怕',
        src: require('../../../assets/behaviorAnalysis/scared.png'),
        value: 85,
      },
    ];
    this.randaEmotionLeft = this.randaEmotionLeft.map(id => this.expression.find(item => item.value === id));
    this.randaEmotionRight = this.randaEmotionRight.map(id => this.expression.find(item => item.value === id));
    // console.log(this.randaEmotion);
    this.state = {
      classSelect: [],
      classSelectValue: sesstionData.cls_id ? sesstionData.cls_id : '',
      lessonindexSelect: [],
      lessonindexSelectValue: '',
      timetableSelect: [],
      timetableSelectValue: sesstionData.lessonindex_id ? sesstionData.lessonindex_id : '',
      options: ['趋势图', '雷达图'],
      date,
      iLine: !this.current,
      current: this.current,
      randaEmotionLeft: this.randaEmotionLeft,
      randaEmotionRight: this.randaEmotionRight,
      classInfo: {}, // 班级信息
      getBehaviorAnalysisLineData: null
    };
  };
  option = {
    grid: {
      right: 20,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: function (params) {
        if(isNaN(parseInt(params[0].value))){
          return params[0].name;
        }
        return params[0].name +'<br><div class="chart-tooltip"></div>' + params[0].value;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisTick: {
        show: false
      },
      axisLine: {
        // show: false
        lineStyle: {
          color: '#CBD0DE',
        }
      },
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#CBD0DE',
          opacity: 0.5,
        }
      }
    },
    series: [{
      data: [],
      type: 'line',
      smooth: true,
      // symbolSize: 0,
      itemStyle: {
        normal: {
          color: '#7F9FFF',
        }
      },
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#7F9FFF' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#BDE6FD' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      }
    }]
  };
  optionBar = {
    grid: {
      left: 80,
      // top: 10,
      right: 0,
    },
    xAxis: {
      type: 'value',
      // scale: true,
      show: false,
      position: 'top',
      splitNumber: 1,
      boundaryGap: false,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        // margin: 122,
        textStyle: {
          color: '#aaa'
        }
      }
    },
    yAxis: {
      type: 'category',
      nameGap: 0,
      offset: 50,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: '#66666',
          fontSize: 14,
          padding: [0, 10, 0, 0],
          align: 'left',
        }
      },
      data: ['站立', '举手', '书写']
    },
    series: [{
      name: 'barSer',
      type: 'bar',
      roam: false,
      visualMap: false,
      zlevel: 1,
      barMaxWidth: 20,
      itemStyle: {
        barBorderRadius: [10],
        color: {
          type: 'linear',
          x: 1,
          y: 1,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#BDE6FD' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#7F9FFF' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      },
      label: {
        normal: {
          show: true,
          color: '#7F9FFF',
          position: 'right',
          formatter: '{c}次',
        },
      },
      data: [100, 120, 90],
    }]
  };
  optionRadar = {
    angleAxis: {
      type: 'category',
      z: 10,
      axisLine: {
        // show: false,
        lineStyle: {
          color: '#7F9FFF',
          width: 2,
        }
      }
    },
    tooltip:{
      type: 'axis',
      confine: true,
    },
    radiusAxis: {
      max: 0,
      axisLabel: {
        color: defaultColor,
        align: 'left',
        verticalAlign: 'top',
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: defaultColor
        }
      },
      splitLine: {
        lineStyle: {
          color: defaultColor
        }
      },
      z: 9,
    },
    polar: {
      radius: radius,
    },
    radar: {
      shape: 'circle',
      radius: radius,
      axisLine: {
        color: defaultColor,
      },
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      name: {
        color: '#666666',
        fontSize: 14,
      },
      indicator: [],
    },
    series: [{
        type: 'bar',
        data: [0],
        coordinateSystem: 'polar',
        radius: radius,
        itemStyle: {
          show: false,
          opacity: 0,
        },
      },
      {
        name: '雷达图',
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 1,
                color: 'rgba(189, 230, 253, 0.5)' // 0% 处的颜色
              }, {
                offset: 0,
                color: 'rgba(127, 159, 255, 1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          },

        },
        lineStyle: {
          opacity: 0,
        },
        data: [{
          value: [],
          label: {
            show: false
          },
        }]
      }
    ],
  };
  componentWillMount() {
    this.getClasses(this.params);
  };
  // componentDidMount() {
  //   const options = JSON.parse(JSON.stringify(this.option));
  //   this.classDis = echarts.init(this.refs.classDis);
  //   // options.xAxis.data = x;
  //   // options.series[0].data = seriesData;
  //   this.classDis.setOption(options);
  // }
  // 班级
  getClasses(parmas) {
    Api.getClasses(parmas).then((res) => {
      if (res.data.list.length === 0) return;
      let cls_id = this.state.classSelectValue;
      const classSelect = res.data.list.map((item, index) => {
        item.label = item.name;
        item.value = item.id;
        if (index === 0 && !this.reloadDiv) {
          this.setState({
            classSelectValue: item.id,
          })
          cls_id = item.id;
        }
        return item;
      })
      this.setState({
        classSelect,
      });
      const params = {
        detail: true,
        cls_id,
        time: this.state.date,
      }
      this.getLessontables(params, true);
    }).catch((err) => {
      console.log(err);
      $_toast(err.desc, 'error');
    });
  }
  // 课表
  getLessontables(parmas, isSearch) {
    Api.getLessontables(parmas)
      .then(res => {
        if (res.data.list.length === 0) {
          // $_toast('此班级列表没有对应的课程请前往表管理进行创建或者选择其他班级进行搜索', 'info');
          this.setState({
            timetableSelect: [],
            timetableSelectValue: '',
          });
          return;
        };
        const fliterData = res.data.list.sort((a, b) => a.lesson_index.num - b.lesson_index.num);
        let lessonindexSelect = []
        const timetableSelect = fliterData.map((item, index) => {
          const o = {}
          const {
            course,
            lesson_index,
            term
          } = item;
          const l = {course,lesson_index,term};
          o.label = `${this.fliterTime(lesson_index.start_hour)}:${this.fliterTime(lesson_index.start_min)}-${this.fliterTime(lesson_index.end_hour)}:${this.fliterTime(lesson_index.end_min)} ${course.name || ''}`
          o.value = item.lesson_index.id;
          if (index === 0 && !this.reloadDiv) {
            this.setState({
              timetableSelectValue: o.value,
            });
          }
          lessonindexSelect.push(l)
          this.reloadDiv = false;
          return o;
        });
        this.setState({
          timetableSelect,
          lessonindexSelect
        });
        if (!isSearch) return;
        const {
          date,
          classSelectValue,
          timetableSelectValue
        } = this.state;
        const params = {
          cls_id: classSelectValue,
          lessonindex_id: timetableSelectValue || timetableSelect[0].value,
          end_time: date,
          start_time: date,
          split_by,
          split_num,
        }
        // this.search(params);        this.search(params);
        this.getBehaviorAnalysis(params);
      })
      .catch(err => {
        console.log(err);
        $_toast(err.desc, 'error')
      })
  }
  // 获取图标数据
  getBehaviorAnalysis(params) {
    this.classesInfo();
    Api.getLine(params).then((res) => {
      this.setState({
        getBehaviorAnalysisLineData: res.data,
      }, () => {
        this.attention(this.state.getBehaviorAnalysisLineData.attention_list);
        if (this.state.iLine) {
          this.getBehaviorAnalysisLine();
        } else {
          this.getBehaviorAnalysisRadan();
        }
      })
    }).catch((err) => {
      // console.log(err)
      this.setState({
        getBehaviorAnalysisLineData: null,
      })
      $_toast(err.desc);
    }).finally(() => {
      sessionStorage.setItem('params', JSON.stringify(params));
      sessionStorage.setItem('current', this.current);
      this.opt = params;
    })
  }
  search() {
    const {
      date,
      classSelectValue,
      timetableSelectValue
    } = this.state;
    if (classSelectValue === '') {
      $_toast('请选择查询班级', 'info');
      return;
    } else if (timetableSelectValue === '') {
      $_toast('请选择查询课节', 'info');
      return;
    }
    const params = {
      end_time: date,
      start_time: date,
      cls_id: classSelectValue,
      lessonindex_id: timetableSelectValue,
      split_by,
      split_num,
    }
    this.getBehaviorAnalysis(params);
  }
  // Class信息
  classesInfo() {
    // attention_list 课堂专注度
    const cls = this.state.classSelect.find(cls => cls.id === this.state.classSelectValue);
    const lessonInfo = this.state.lessonindexSelect.find(les => les.lesson_index.id === this.state.timetableSelectValue);
    const classInfo = {
      className: cls.name || '-',
      tearchName: cls.teacher[0].name || '-',
      time: this.state.date || '-',
      num: cls.num,
      courseName: lessonInfo? lessonInfo.course.name : '-',
      term: lessonInfo? `${lessonInfo.term.term_year} ${lessonInfo.term.term}`: '-',
      tearchPhone: cls.teacher.phone,
    }
    this.setState({
      classInfo,
    })
  }
  // 获取折线走势
  getBehaviorAnalysisLine() {
    // behavior_list 课堂行为数据 emotion_list 课堂表情数据
    const data = this.state.getBehaviorAnalysisLineData;
    const { behavior_list, emotion_list} = data;
    this.emotion = emotion_list;
    this.behavior = behavior_list;
    this.emotionFliter(81);
    this.behaviorFilter(22);
  }
  getBehaviorAnalysisRadan() {
    const data = this.state.getBehaviorAnalysisLineData;
    const { behavior_list, emotion_list, behavior_desc} = data;
    const emotionStatic = {} // 行为总数统计
    const randaEmotionLeft = this.state.randaEmotionLeft.map(item => {
      let num = 0;
      emotion_list[item.value].forEach(data => {
        num += data.num;
      })
      emotionStatic[item.value] = num;
      item.num = num;
      return item;
    });
    const randaEmotionRight = this.state.randaEmotionRight.map(item => {
      let num = 0;
      emotion_list[item.value].forEach(data => {
        num += data.num;
      })
      item.num = num;
      emotionStatic[item.value] = num;
      return item;
    });
    this.setState({
      randaEmotionLeft,
      randaEmotionRight,
    });
    this.radarFliter(emotionStatic); //雷达
    this.barRadar(behavior_list, behavior_desc); // 柱状图
  }
  // 雷达图
  radarFliter(data) {
    let indicator = [];
    let radarValue = [];
    let max = 0;
    this.radar.forEach((item) => {
      indicator.push({
        name: item.label,
      });
      radarValue.push(data[item.value]);
    })
    max = (Math.max.apply(null, radarValue) * 1.2).toFixed(0);
    indicator = indicator.map((item) => {
      item.max = max;
      return item;
    });
    const options = JSON.parse(JSON.stringify(this.optionRadar));
    this.radarDom = echarts.init(this.refs.radar);
    // options.series[0].data = [max];
    options.series[1].data[0].value = radarValue;
    options.radar.indicator = indicator;
    options.radiusAxis.max = max;
    this.radarDom.setOption(options);
  }
  // 柱状图
  barRadar(behavior_list, behavior_desc) {
    const behaviorData = [22, 23, 26, 25, 21, 24].map((id) => {
      let num = 0;
      const name = behavior_desc[id];
      behavior_list[id].forEach(item => {
        num += item.num;
      });
      return {
        name,
        num,
      }
    });
    const optionLeft = this.bar(behaviorData.splice(0, 3));
    const optionRight = this.bar(behaviorData);
    this.barLeft = echarts.init(this.refs.barLeft);
    this.barRight = echarts.init(this.refs.barRight);
    this.barRight.setOption(optionRight);
    this.barLeft.setOption(optionLeft);
  };
  bar(data) {
    const y = [];
    const seriesData = [];
    data.forEach((item) => {
      y.push(item.name);
      seriesData.push(item.num);
    });
    const options = JSON.parse(JSON.stringify(this.optionBar));
    options.yAxis.data = y;
    options.series[0].data = seriesData;
    return options;
  }
  // 课堂专注度
  attention(data) {
    const x = [];
    const seriesData = [];
    data.forEach((item) => {
      x.push(item.value);
      seriesData.push(item.num);
    });
    const options = this.option;
    this.classDis = echarts.init(this.refs.classDis);
    options.xAxis.data = x;
    options.series[0].data = seriesData;
    options.yAxis.max = Math.ceil(Math.max(...seriesData)*1.2);
    options.yAxis.interval = Math.ceil(Math.max(...seriesData)*1.2/5);
    this.classDis.setOption(options);
  }
  //课堂表情数据
  emotionFliter(key, dispose) {
    if (dispose) this.classBiaoQin.dispose();
    const arr = this.emotion[key] || [];
    const x = [];
    const seriesData = [];
    arr.forEach((item) => {
      x.push(item.value);
      seriesData.push(item.num);
    });
    const options = this.option;
    this.classBiaoQin = echarts.init(this.refs.classBiaoQin);
    options.xAxis.data = x;
    options.yAxis.max = Math.ceil(Math.max(...seriesData)*1.2);
    options.yAxis.interval = Math.ceil(Math.max(...seriesData)*1.2/5);
    options.series[0].data = seriesData;
    this.classBiaoQin.setOption(options);
    this.classBiaoQin.on('click', (params) => {
      const index = this.emotionCurrent;
      const value = this.expression[index].value;
      this.historyAnalysis(value, 0);
    })
  }
  //课堂行为数据
  behaviorFilter(key, dispose) {
    if (dispose) this.classAnalysis.dispose();
    const arr = this.behavior[key] || [];
    const x = [];
    const seriesData = [];
    arr.forEach((item) => {
      x.push(item.value);
      seriesData.push({
        value: item.num,
        item: item,
      });
    });
    const options = this.option;
    this.classAnalysis = echarts.init(this.refs.classAnalysis);
    const yMax = Math.max(...seriesData.map(item=>item.value));
    options.xAxis.data = x;
    options.yAxis.max = Math.ceil(yMax*1.2);
    options.yAxis.interval = Math.ceil(yMax*1.2/5);
    options.series[0].data = seriesData;
    this.classAnalysis.setOption(options);
    this.classAnalysis.on('click', (params) => {
      const index = this.behaviorCurrent;
      const value = this.analyisis[index].value;
      this.historyAnalysis(value, 1);
    })
  }
  /**
   * 补零
   */
  fliterTime(num) {
    const n = Number(num)
    return n < 10 ? `0${n}` : n
  }
  // 折线图和雷达图
  isLine(current) {
    const iLine = !current;
    this.current = current;
    this.setState({
      iLine,
    });
    sessionStorage.setItem('current', current);
    if (!this.state.getBehaviorAnalysisLineData) return;
    setTimeout(() => {
      if (iLine) {
        this.getBehaviorAnalysisLine();
      } else {
        this.getBehaviorAnalysisRadan();
      }
    }, 20);
  }
  classesChange(res) {
    this.setState({
      classSelectValue: res.id,
      timetableSelectValue: '',
      timetableSelect: [],
    });
    this.getLessontables({
      cls_id: res.id,
      detail: true,
      time: this.state.date,
    }, false)
  }
  // Dialog
  historyAnalysis(value, type) {
    // this.props.history.push("/panda/behaviorAnalysis?a=1");
    if (!this.state.getBehaviorAnalysisLineData || value == 0) return;
     XModal.Dialog(HistoryAnalysis, {
      size: 'sg',
      data: {
        value,
        type,
        params: this.opt,
        classInfo: this.state.classInfo
      }
     }).then(() => {},() => {})
  }
  //  时间组件发生变化
  changeTime(res) {
    const { classSelectValue } = this.state;
    const time = $_date.init(
      'YYYY-MM-DD',
      res
    )
    this.setState({
      date: time
    })
    this.getLessontables({
      cls_id: classSelectValue,
      detail: true,
      time,
    }, false)
  }
  emotionChange(current, data) {
    if (!this.state.getBehaviorAnalysisLineData) return;
    this.emotionFliter(data.value, true);
    this.emotionCurrent = current;
  }
  behaviorChange(current, data) {
    if (!this.state.getBehaviorAnalysisLineData) return;
    this.behaviorFilter(data.value, true);
    this.behaviorCurrent = current;
  }
  // 清除缓存
  componentWillUnmount() {
    sessionStorage.setItem('params', '');
    sessionStorage.setItem('current', '');
  }
  render() {
    const { classInfo, getBehaviorAnalysisLineData } = this.state;
    return (
      <div className="behaviorAnalysis">
        {/* 行为统计分析 */}
        <div className="behaviorAnalysis-header">
          <div className="select">
            <GrounpBtn options={this.state.options} onChange={this.isLine.bind(this)} current={this.state.current}></GrounpBtn>
          </div>
          <div className="select">
            <XSelector
              options={this.state.classSelect}
              defaultValue={this.state.classSelectValue}
              onChange={this.classesChange.bind(this)}/>
          </div>
          <div className="select time">
              <XDatePickerInput
                value={new Date(this.state.date)}
                dateFormat={'YYYY-MM-DD'}
                placeholder="起始时间"
                onChange={this.changeTime.bind(this)}
            />
          </div>
          <div className="select">
            <XSelector
              options={this.state.timetableSelect}
              defaultValue={this.state.timetableSelectValue}
              onChange={res => {
                this.setState({
                  timetableSelectValue: res.value,
                })
              }}/>
          </div>
          <XButton type="primary" onClick={this.search.bind(this, null)}>搜索</XButton>
        </div>
        <div className="behaviorAnalysis-container">
          <div className="behaviorAnalysis-classInfo">
            <div className="top">
              <h3 className="classesName">{ classInfo.className || '班级名称'}</h3>
              <div className="information">
                <span className="tit">班主任</span>
                <span className="content">{ classInfo.tearchName || '-' }</span>
              </div>
              <div className="information marg">
                <span className="tit">班级人数</span>
                <span className="content">{ classInfo.num || '-' }</span>
              </div>
              <div className="information">
                <span className="tit">查询学期</span>
                <span className="content">{ classInfo.term || '-' }</span>
              </div>
              <div className="information">
                <span className="tit">查询周期</span>
                <span className="content">{ classInfo.time || '-' }</span>
              </div>
              <div className="information">
                <span className="tit">时段课程</span>
                <span className="content">{ classInfo.courseName || '-' }</span>
              </div>
            </div>
            <div className="bottom">
              <div className="canvas-container">
                  <div className="title">
                    <h3>课堂专注度</h3>
                  </div>
                  {!getBehaviorAnalysisLineData
                    ?null
                    :<div className="canvas-body" ref="classDis">
                    </div>
                  }
                </div>
            </div>
          </div>
          <div className="behaviorAnalysis-canvas">
          {
            this.state.iLine
              ? <div className="classAll">
                  <div className="classAll-top">
                    <div className="canvas-container">
                      <div className="title Biaoqing">
                        <h3>课堂表情数据</h3>
                        <IconTab data={this.expression} onChange={this.emotionChange.bind(this)}></IconTab>
                      </div>
                      {!getBehaviorAnalysisLineData
                        ? null
                        : <div className="canvas-body" ref="classBiaoQin">
                        </div>
                      }
                    </div>
                  </div>
                  <div className="classAll-bottom">
                    <div className="canvas-container">
                      <div className="title">
                        <h3>课堂行为数据</h3>
                        <IconTab data={this.analyisis} onChange={this.behaviorChange.bind(this)} name="label"></IconTab>
                      </div>
                      {!getBehaviorAnalysisLineData
                        ? null
                        : <div className="canvas-body" ref="classAnalysis">
                          </div>
                      }
                    </div>
                  </div>
                </div>
              : <div className="classShow">
                  <div className="radar">
                    <div className="left">
                      <div className="canvas-container">
                        <div className="title">
                          <h3>课堂表情数据</h3>
                          {/* <IconTab data={this.analyisis} onChange={this.behaviorChange.bind(this)} name="label"></IconTab> */}
                        </div>
                        {!getBehaviorAnalysisLineData
                          ? null
                          : <div className="canvas-body" ref="radar">
                            </div>
                        }
                      </div>
                    </div>
                    <div className="right">
                    <div className="right-left">
                      {
                        this.state.randaEmotionLeft.map((item) => {
                          return (
                            <div className="brow" key={item.value}>
                              <div className="brow-info">
                                <p>{ item.name }</p>
                                <p className="number">
                                  <span onClick={this.historyAnalysis.bind(this, item.value, 0)}>{ getBehaviorAnalysisLineData ? item.num : 0 }</span>
                                  &nbsp;次
                                </p>
                              </div>
                              <img src={item.src} alt=""/>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className="right-right">
                      { this.state.randaEmotionRight.map((item) => {
                          return (
                            <div className="brow" key={item.value}>
                              <div className="brow-info">
                                <p>{ item.name }</p>
                                <p className="number">
                                  <span onClick={this.historyAnalysis.bind(this, item.value, 0)}>{ getBehaviorAnalysisLineData ? item.num : 0 }</span>
                                  &nbsp;次
                                </p>
                              </div>
                              <img src={item.src} alt=""/>
                            </div>
                          )
                        })
                      }
                    </div>
                    </div>
                  </div>
                  <div className="bar">
                    <div className="left">
                      <div className="canvas-container">
                        <div className="title">
                          <h3>课堂行为数据</h3>
                        </div>
                        {!getBehaviorAnalysisLineData
                          ?null
                          : <div className="canvas-body" ref="barLeft">
                            </div>
                        }
                      </div>
                    </div>
                    <div className="right">
                      <div className="canvas-container">
                        <div className="title">
                          {/* <h3>课堂行为数据</h3> */}
                          &nbsp;
                        </div>
                        {!getBehaviorAnalysisLineData
                          ?null
                          : <div className="canvas-body"  ref="barRight">
                            </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
          }
          </div>
        </div>
      </div>
    );
  }
}

BehaviorAnalysis.propTypes = {

};

export default withRouter(BehaviorAnalysis);
