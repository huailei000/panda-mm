import React from 'react';
import PropTypes from 'prop-types';
import {$_date} from 'services';
import DatePicker from './DatePicker';
import { XIcon, XInput, XToggle } from 'xcomponents';
  
export default class extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.value)
        this.state = {
            dateValue: props.value || '',
        }
        this.format = props.dateFormat || 'YYYY/MM/DD';
    }

    static propTypes = {
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date),
          ]),
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        value: '',
    };

    formatDate(date){
        return $_date.init(this.format,date);
    }
   
    render() {
        return (
            <XToggle className="date-picker">
                <XToggle.Top className="date-picker-top">
                    <XInput value={this.state.dateValue && this.formatDate(this.state.dateValue)} readOnly={true} placeholder={this.props.placeholder}/>
                    <XIcon color="#7F9FFFFF" type="calendar"/>
                </XToggle.Top>
                <XToggle.Box className="date-picker-box">
                    <div className="calendar-content">
                       <DatePicker {...this.props} onChange={(res)=>{
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
