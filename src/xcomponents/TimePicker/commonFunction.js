import React, {Component} from "react";
import { XIcon} from 'xcomponents';

export default{
    Navbar : ({
        nextMonth,
        previousMonth,
        onPreviousClick,
        onNextClick,
        className,
        localeUtils,
        onPreYear,
        onNextYear,
        date
      })=>{
        return [
            <XIcon key="pre-year" type="angle-double-left" onClick={(e) => {onPreYear();e.nativeEvent.stopImmediatePropagation();}} />,
            <XIcon key="left" type="angle-left" onClick={(e) => {onPreviousClick();e.nativeEvent.stopImmediatePropagation();}} />,
            <XIcon key="right" type="angle-right" onClick={(e) => {onNextClick();e.nativeEvent.stopImmediatePropagation();}} />,
            <XIcon key="next-year" type="angle-double-right" onClick={(e) => {onNextYear();e.nativeEvent.stopImmediatePropagation();}} />
        ];
    },
    YearMonthForm: ({ date, localeUtils ,onClick}) =>{

        const handleClick = function handleClick(val,e){
            onClick(val);
        }
      
        return (
            <div className="DayPicker-Caption">
                <div>
                    <span> {date.getFullYear()}年 </span>
                    <span>{date.getMonth()+1}月</span>
                </div>
            </div>
        );
      }
}

