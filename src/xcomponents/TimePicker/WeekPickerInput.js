import React from 'react';
import {$_date} from 'services';
import WeekPicker from './WeekPicker';
import { XIcon, XInput, XToggle } from 'xcomponents';

  
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateValue: props.value.length >0 ? props.value : '',
        }
        this.format = props.dateFormat || 'YYYY/MM/DD';
    }

    formatDate(date){
        return $_date.init(this.format,date);
    }
   
    render() {
        return (
            <XToggle className="date-picker">
                <XToggle.Top className="date-picker-top">
                    <XInput value={this.state.dateValue.length>0 ? this.formatDate(this.state.dateValue[0]) + '~'+ this.formatDate(this.state.dateValue[1]): ''} readOnly="true" placeholder={this.props.placeholder || '周选择'}/>
                    <XIcon type="calendar-a"/>
                </XToggle.Top>
                <XToggle.Box className="date-picker-box">
                    <div className="calendar-content" onClick={(e) => { e.nativeEvent.stopImmediatePropagation()}}>
                       <WeekPicker {...this.props} onChange={(res)=>{
                           this.setState({
                                dateValue:res
                           },()=>{
                               this.props.onChange(this.state.dateValue)
                           })
                       }}/> 
                    </div>
                </XToggle.Box>
            </XToggle>
        );
    }
}
