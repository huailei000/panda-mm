import React from 'react';
import { XIcon} from 'xcomponents';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || new Date()
        }
        this.monthArr=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
    }

    Year(date = this.state.value) {
        return date.getFullYear();
    }

    Month(date = this.state.value) {
        return date.getMonth();
    }

    yearChange(step){
        const value = new Date(this.Year() + step, this.Month());
        this.setState({
            value
        });
        // this.props.onChange(value);
    }

    monthChange(month){
        const value = new Date(this.Year(), month);
        this.setState({
            value
        });
        this.props.onChange(value);
    }

    render() {
        return (
            <div className="xls-month-picker">
                <div className="xls-month-picker-header">
                <RayrIcon type="angle-left" onClick={() => this.yearChange(-1)} />   
                {this.state.value.getFullYear()}
                <RayrIcon type="angle-right" onClick={() => this.yearChange(1)} />
                </div>
                <div className="xls-month-picker-body">
                    
                    {
                        this.monthArr.map((item,index)=>{
                            if(this.state.value.getFullYear() > new Date().getFullYear() || (this.state.value.getFullYear() === new Date().getFullYear() && index >= new Date().getMonth())){
                                return <button key={item+index} disabled className="month-item disable"><span>{item}</span></button>
                            }else{
                                return <button key={item+index} className="month-item" onClick={this.monthChange.bind(this,index)}><span className={`text ${this.state.value.getMonth() === index ? 'active' : null}`}>{item}</span></button>
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}
