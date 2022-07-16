/**
 * name:
 * desc: 圆形列阵组件
 * date: 2018/11/05
 * author: fff
 */

import React, {Fragment} from 'react';
import {observer, inject} from 'mobx-react';

@inject ('FloorStore')
@observer
export default class CirclesChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      curId: 0,
      maxSize: 106,
      minSize: 70,
    };
  }

  componentDidMount () {
    this.computeSize ();
  }

  computeSize () {
    let floorStore = this.props.FloorStore;
    let dataList = floorStore.dataList;
    let len = dataList.length;
    let minItem = dataList.reduce ((x, y) => {
      return parseInt (x.num) < y.num ? x : y;
    });
    let maxItem = dataList.reduce ((x, y) => {
      return parseInt (x.num) > y.num ? x : y;
    });
    let maxSize = this.state.maxSize;
    let minSize = parseInt (maxSize * minItem.num / maxItem.num);
    let gap = maxSize - minSize;
    // 楼层初始化
    let sumWidth = 0;
    dataList = dataList.map (item => {
      item.size =
        minSize + parseInt ((item.num - minItem.num) / item.num * gap);
      item.size = item.size > this.state.minSize
        ? item.size
        : this.state.minSize;
      item.margin = parseInt ((maxSize - item.size) / 2);
      sumWidth += item.size + 46;
      return item;
    });
    // 初始化楼层相关
    if (document.querySelector ('.circles-chart-box')) {
      floorStore.floorBoxWidth = document.querySelector (
        '.circles-chart-box'
      ).offsetWidth;
      floorStore.floorSum = sumWidth + (dataList.length - 1) * 45;
      floorStore.showSlide = floorStore.floorBoxWidth < floorStore.floorSum
        ? true
        : false;
    }
  }

  initFloor (index, data) {
    this.setState (
      {
        curId: index,
      },
      () => this.props.onChange (data)
    );
  }

  render () {
    let dataList = this.props.FloorStore.dataList;
    return (
      <div className="b-circles-chart">
        {dataList.length > 0
          ? <div
              className="circles-chart-box"
              style={{
                transform: this.props.FloorStore.style,
              }}
            >
              {dataList.map ((item, index) => {
                let curColor = index === this.state.curId ? 'active' : null;
                return (
                  <Fragment key={`${item.id}fragment`}>
                    {index > 0
                      ? <div className="line-box" key={`${item.name}line`}>
                          <div className="line-item" />
                        </div>
                      : null}
                    <div className="circles-item">
                      <div
                        className={`circles-item-btn ${curColor}`}
                        onClick={this.initFloor.bind (this, index, item)}
                        key={item.name}
                        style={{
                          width: `${item.size}px`,
                          height: `${item.size}px`,
                          marginTop: `${item.margin}px`,
                        }}
                      >
                        <div className="txt">
                          <span>{item.number}</span>
                        </div>
                      </div>
                      <div className="title">
                        {item.name}
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          : <div className="no-data">暂无数据</div>}
      </div>
    );
  }
}
