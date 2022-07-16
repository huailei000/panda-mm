import React from 'react';
import {XIcon} from 'xcomponents';

export default class extends React.Component {
  constructor (props) {
    super (props);
    let curMonth = parseInt (new Date ().getMonth ()) - 1 < 10
      ? `0${parseInt (new Date ().getMonth ()) - 1}`
      : parseInt (new Date ().getMonth ()) - 1;
    let curYear = new Date ().getFullYear ();
    this.state = {
      type: props.type,
      value: props.value || new Date (),
      selectArr: [parseInt (`${curYear}${curMonth}`)],
      max: parseInt (`${curYear}${curMonth}`),
      min: parseInt (`${curYear}${curMonth}`),
    };
    this.monthArr = [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ];
  }

  Year (date = this.state.value) {
    return date.getFullYear ();
  }

  Month (date = this.state.value) {
    return date.getMonth ();
  }

  yearChange (step) {
    const value = new Date (this.Year () + step, this.Month ());
    this.setState ({
      value,
    });
    // this.props.onChange(value);
  }

  monthChange (month) {
    const value = new Date (this.Year (), month);
    this.setState ({
      value,
    });
    this.props.onChange (value);
  }

  mutMonthChange (month) {
    const value = new Date (this.Year (), month);
    let selectArr = [];
    let monthFormat = month < 10 ? `0${month}` : month;
    if (
      this.state.selectArr.length < 2 &&
      this.state.selectArr.indexOf (
        parseInt (`${this.Year ()}${monthFormat}`)
      ) === -1
    ) {
      if (
        this.state.selectArr.length === 1 &&
        Math.abs (
          parseInt (`${this.Year ()}${monthFormat}`) - this.state.selectArr[0]
        ) >= 200
      ) {
        selectArr.push (parseInt (`${this.Year ()}${monthFormat}`));
      } else {
        selectArr.push (parseInt (`${this.Year ()}${monthFormat}`));
        selectArr = this.state.selectArr.concat (selectArr);
      }
    } else {
      selectArr.push (parseInt (`${this.Year ()}${monthFormat}`));
    }
    selectArr.sort (function (a, b) {
      return a - b;
    });
    this.setState ({
      value,
      selectArr,
      max: selectArr[selectArr.length - 1],
      min: selectArr[0],
    });
    this.props.onChange (selectArr);
  }

  render () {
    return (
      <div className="b-month-picker">
        <div className="b-month-picker-header">
          <XIcon type="angle-left" onClick={() => this.yearChange (-1)} />
          {this.state.value.getFullYear ()}
          <XIcon type="angle-right" onClick={() => this.yearChange (1)} />
        </div>
        {this.state.type === 'mul-select'
          ? <div className="b-month-picker-body">
              {this.monthArr.map ((item, index) => {
                let indexFormat = index < 10 ? `0${index}` : index;
                let y_m = parseInt (
                  `${this.state.value.getFullYear ()}${indexFormat}`
                );
                if (
                  this.state.value.getFullYear () >
                    new Date ().getFullYear () ||
                  (this.state.value.getFullYear () ===
                    new Date ().getFullYear () &&
                    index >= new Date ().getMonth ())
                ) {
                  return (
                    <button
                      key={item + index}
                      disabled
                      className="month-item disable"
                    >
                      <span>{item}</span>
                    </button>
                  );
                } else {
                  return (
                    <button
                      key={item + index}
                      className="month-item"
                      onClick={this.mutMonthChange.bind (this, index)}
                    >
                      <span
                        className={`text ${(this.state.selectArr.length >= 2 && y_m <= this.state.max && y_m >= this.state.min) || (this.state.selectArr.length < 2 && y_m === this.state.max) ? 'active' : null}`}
                      >
                        {item}
                      </span>
                    </button>
                  );
                }
              })}
            </div>
          : <div className="b-month-picker-body">

              {this.monthArr.map ((item, index) => {
                if (
                  this.state.value.getFullYear () >
                    new Date ().getFullYear () ||
                  (this.state.value.getFullYear () ===
                    new Date ().getFullYear () &&
                    index >= new Date ().getMonth ())
                ) {
                  return (
                    <button
                      key={item + index}
                      disabled
                      className="month-item disable"
                    >
                      <span>{item}</span>
                    </button>
                  );
                } else {
                  return (
                    <button
                      key={item + index}
                      className="month-item"
                      onClick={this.monthChange.bind (this, index)}
                    >
                      <span
                        className={`text ${this.state.value.getMonth () === index ? 'active' : null}`}
                      >
                        {item}
                      </span>
                    </button>
                  );
                }
              })}
            </div>}
      </div>
    );
  }
}
