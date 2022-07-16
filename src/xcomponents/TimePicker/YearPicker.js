import React from 'react';
import { XIcon} from 'xcomponents';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || new Date()
        }
        this.YearArr=[2016,2017,2018];
    }

    YearChange(year){
        this.setState({
            value : new Date(year,this.state.value.getMonth())
        })
        this.props.onChange(this.YearArr[year]);
    }

    render() {
        return (
            <div className="xls-month-picker year-picker">
                <div className="xls-month-picker-header">
                <XIcon type="angle-left" />   
                {this.YearArr[0]} - {this.YearArr[this.YearArr.length-1]}
                <XIcon type="angle-right" />
                </div>
                <div className="xls-month-picker-body">
                    
                    {
                        this.YearArr.map((item,index)=>{
                            return <button key={item+index} className="month-item" onClick={this.YearChange.bind(this,index)}><span className={`text ${this.state.value.getFullYear() === item ? 'active' : null}`}>{item}</span></button>
                        })
                    }
                </div>
            </div>
        )
    }
}
