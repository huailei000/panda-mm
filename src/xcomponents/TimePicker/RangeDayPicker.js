import React from 'react';
import {$_date} from 'services';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {DateUtils} from 'react-day-picker';
import {XIcon} from 'xcomponents';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: this.props.startValue || null,
            to: this.props.endValue || null,
            isShowOverlay: false
        };
        this.format = 'YYYY/MM/DD';
    }

    handleDayClick(day) {
        this.setState({isShowOverlay:true});
        const range = DateUtils.addDayToRange(day, this.state);
        this.setState(range,()=>{
            range.to ? this.setState({isShowOverlay:false}) : null
        });
    }

    render() {
        const {maxDate, minDate} = this.props;

        const disableRange = {
            after: maxDate,
            before: minDate,
        };

        const { from, to } = this.state;
        const modifiers = { start: from, end: to };

        return (
            <div className='range-picker'>
                <DayPickerInput
                                component={props => {
                                    this.state.isShowOverlay ? props.onClick() : null;
                                    return <input readOnly={true} {...props} />
                                }}
                                onDayChange={() => {
                                    this.state.from && this.state.to ? this.props.onChange(this.state.from, this.state.to) : null
                                }}
                                format={this.format}
                                value={this.state.from && this.state.to ? $_date.init(this.format,new Date(this.state.from)) +' - ' + $_date.init(this.format, new Date(this.state.to)) : this.state.from ? $_date.init(this.format,new Date(this.state.from)) : ''}
                                placeholder={`${'请输入时间' || this.props.placeholder}`}
                                dayPickerProps={{
                                    disabledDays: disableRange,
                                    locale: 'zh-cn',
                                    months: $_date._i18n.months,
                                    weekdaysLong: $_date._i18n.weekdays,
                                    weekdaysShort: $_date._i18n.weekdaysShort,
                                    className: "range-picker",
                                    numberOfMonths: 2,
                                    modifiers,
                                    selectedDays: [from, {from, to}],
                                    onDayClick: (day) => {
                                        if (from && to) {
                                            this.state.from = null;
                                            this.state.to = null;
                                        }
                                        this.handleDayClick(day);
                                    }
                                }}
                />
                <XIcon type="calendar-a"/>
            </div>
        );
    }
}

