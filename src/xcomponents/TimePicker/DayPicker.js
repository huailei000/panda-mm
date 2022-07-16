import React from 'react';
import {$_date} from 'services';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {DateUtils} from 'react-day-picker';
import {XIcon} from 'xcomponents';

function YearMonthForm({date, localeUtils, onChange,minYear, maxYear}) {
    const currentYear = new Date().getFullYear();
    const fromMonth = new Date(new Date(minYear).getFullYear() || currentYear, 0);
    const toMonth = new Date(new Date(maxYear).getFullYear() || currentYear + 10, 11);

    const months = localeUtils.getMonths();

    const years = [];
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChange = function handleChange(e) {
        const {year, month} = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    return (
        <form className="DayPicker-Caption">
            <select key="month" name="month" onChange={handleChange} value={date.getMonth()}>
                {$_date._i18n.months.map((month, i) => {
                    return (<option key={month} value={i}>
                        {month}
                    </option>)
                })}
            </select>
            <select key="year" name="year" onChange={handleChange} value={date.getFullYear()}>
                {years.map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </form>
    );
}


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
        this.state = {
            month: this.props.value ? new Date(this.props.value) : '',
            from: undefined,
            to: undefined,
            date: this.props.value ? new Date(this.props.value) : ''
        };
        this.format = 'YYYY/MM/DD';
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            month: newProps.value ? new Date(newProps.value) : '',
            date: newProps.value ? new Date(newProps.value) : ''
        });
    }

    handleDayClick(day) {
        const range = DateUtils.addDayToRange(day, this.state);
        this.setState(range);
    }

    handleYearMonthChange(month) {
        this.setState({month});
    }


    render() {
        const {maxDate, minDate} = this.props;

        const range = {
            after: new Date(maxDate),
            before: new Date(minDate)
        };
        return (
            <div className="x-day-picker">
                <DayPickerInput 
                    component={props => <input readOnly={true} {...props} />}
                    key={DayPickerInput} onDayChange={day => {this.props.onChange(day.getTime());this.setState({date:day})}}
                    format={this.format}
                    value={this.state.date ? $_date.init(this.format,this.state.date) : ''}
                    placeholder={`${this.props.placeholder || $_date.init(this.format,new Date())}`}
                    dayPickerProps={{
                        disabledDays:range,
                        locale:'zh-cn',
                        months:$_date._i18n.months,
                        weekdaysLong:$_date._i18n.weekdays,
                        weekdaysShort:$_date._i18n.weekdaysShort,
                        firstDayOfWeek:1,
                        month:this.state.month ? this.state.month : new Date(),
                        fromMonth:this.state.date ? this.state.date : new Date(),
                        toMonth:this.state.date ? this.state.date : new Date(),
                        selectedDays: this.state.date,
                        captionElement:({ date, localeUtils }) => (
                            <YearMonthForm
                            date={date}
                            localeUtils={localeUtils}
                            onChange={this.handleYearMonthChange}
                            nowDate={new Date(this.state.date)}
                            minYear={range.before}
                            maxYear={range.after}
                            />
                        ),
                        enableOutsideDaysClick: true
                    }
                    }
                />
                <XIcon type="calendar-a"/>
            </div>
        );
    }
}

