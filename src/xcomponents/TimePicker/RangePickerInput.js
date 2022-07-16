import React from 'react';
import PropTypes from 'prop-types';
import {$_date} from 'services';
import RangePicker from './RangePicker';
import { XIcon, XInput, XToggle } from 'xcomponents';

  
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateValue: props.value.length >0 ? props.value : '',
            isShowRangePicker: false
        }
        this.format = props.dateFormat || 'YYYY/MM/DD';
    }

    static propTypes = {
        value: PropTypes.array,
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        value: [],
        placeholder: '时间区间选择'
    };

    formatDate(date){
        return $_date.init(this.format,date);
    }
   
    render() {
        return (
            <RayrToggle className="date-picker">
                <RayrToggle.Top className="date-picker-top">
                    <RayrInput value={this.state.dateValue.length>0 ? this.formatDate(this.state.dateValue[0]) + '~'+ this.formatDate(this.state.dateValue[1]): ''} readOnly="true" placeholder={this.props.placeholder}  onClick={()=>{this.setState({isShowRangePicker:true})}}/>
                    <RayrIcon type="calendar-a"/>
                </RayrToggle.Top>
                {
                    this.state.isShowRangePicker ? (
                        <RayrToggle.Box className="date-picker-box">
                            <div className="calendar-content" onClick={(e) => { e.nativeEvent.stopImmediatePropagation()}}>
                                <RangePicker {...this.props} onChange={(res)=>{
                                    this.setState({
                                            dateValue:res,
                                            isShowRangePicker: false
                                    },()=>{
                                        this.props.onChange(this.state.dateValue)
                                    })
                                }}/> 
                            </div>
                        </RayrToggle.Box>) : null
                }
            </RayrToggle>
        );
    }
}
