import React, {Fragment} from 'react';
import { $_date } from 'services';
import {
	XIcon,
	XInput,
	XToggle,
	XButton,
	XRangePicker
} from 'xcomponents';

function formatDate(date) {
	return date ? $_date.init('YYYY-MM-DD', date) : null;
}

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.nowDate = new Date();
		this.state = {
			isShowPicker: false,
			active: '0',
			maxDayRangeSelected: props.maxDayRangeSelected,
			dateValue: props.value && props.value.length > 0 ? props.value : [],
		};
	}

	today(){
		const dateValue = [new Date(), new Date()];
		this.setState({
			isShowPicker: false,
			dateValue,
		})
		this.emit(dateValue);
	}

	thisWeek(){
		const dateValue = [$_date.getThisFullWeek(new Date())[0], $_date.getThisFullWeek(new Date())[6]];
		this.setState({
			isShowPicker: false,
			dateValue,
		})
		this.emit(dateValue);
	}

	//当前月份的最后一天
	getThisMonthLastDay(){
		let year = this.nowDate.getFullYear(),
			month = parseInt(this.nowDate.getMonth()+1, 10),
		    d= new Date(year, month, 0);
		return d; 
	  }

	thisMonth(){
		const dateValue = [new Date(this.nowDate.getFullYear(), this.nowDate.getMonth(), 1), this.getThisMonthLastDay()];
		this.setState({
			isShowPicker: false,
			dateValue,
		});
		this.emit(dateValue)
	}
	emit(dateValue) {
		this.refs.XToggle.handleDocClick(false);
		if (this.props.onChange) {
			this.props.onChange(dateValue)
		}
	}
	thisTerm(){

	}

	clearFn(){
		this.setState({
			dateValue : []
		})
	}

	render() {
		const { dateValue, isShowPicker } = this.state;
		let displayValue = dateValue.length > 0 ? (dateValue[0].getFullYear() === dateValue[1].getFullYear() && dateValue[0].getMonth() === dateValue[1].getMonth() && dateValue[0].getDate() === dateValue[1].getDate()) ? formatDate(dateValue[0]) : formatDate(dateValue[0]) + '   至   ' + formatDate(dateValue[1]) : '';
		return (
			<XToggle ref="XToggle" className="b-timepicker">
				<XToggle.Top className="timepicker-top date-picker-top">
					<div className="top-content" onClick={()=>{this.setState({isShowPicker: true})}}>
						<XIcon type="calendar" />	
						<XInput
							className="time-picker-input"
							value={displayValue}
						/>
						{dateValue.length > 0 ? <XIcon type="times-circle" onClick={::this.clearFn}/> : null}
					</div>
				</XToggle.Top>
				<XToggle.Box className="timepicker-box">
					{
						isShowPicker ? (<Fragment>
							<div className="quick-select" onClick={(e) => { e.nativeEvent.stopImmediatePropagation()}}>
								<div className={`select-item ${dateValue.length > 0 && formatDate(dateValue[0]) === $_date.getDate(0) ? 'active' : ''}`} onClick={::this.today}>今日</div>
								<div className={`select-item ${dateValue.length > 0 && formatDate(dateValue[0]) === formatDate($_date.getThisFullWeek(new Date())[0]) && formatDate(dateValue[1]) === formatDate($_date.getThisFullWeek(new Date())[6]) ? 'active' : ''}`} onClick={::this.thisWeek}>本周</div>
								<div className={`select-item ${dateValue.length > 0 && formatDate(dateValue[0]) === formatDate(new Date(this.nowDate.getFullYear(),this.nowDate.getMonth(),1)) && formatDate(dateValue[1]) === formatDate(this.getThisMonthLastDay()) ? 'active' : ''}`} onClick={::this.thisMonth}>本月</div>
								{/* <div className={`select-item`} onClick={()=>{
									
								}}>本学期</div> */}
							</div>
							<div className="calendar-content" onClick={(e) => { e.nativeEvent.stopImmediatePropagation()}}>
								<XRangePicker value={this.state.dateValue}
										placeholder="请选择时间范围"
										onChange={(res) => {
											this.setState({
												dateValue: res,
												isShowPicker: false,
											})
											this.emit(res)
											// if (this.props.onChange) {
											// 	this.props.onChange(res)
											// }
										}}/>
							</div>
						</Fragment>) : null
					}
				</XToggle.Box>
			</XToggle>
		);
	}
}
