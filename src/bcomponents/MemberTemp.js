import React from 'react';
import { XIcon} from 'xcomponents';

export default (props)=> {
    const {name,number,type,disabled,icon,imgSrc} = props;
    return (
        <div onClick={()=>{!disabled && props.onClick()}} className={`member-template ${type === 'all' ? 'blue' : ''} ${disabled ? 'disabled' : ''}`}>
            <div className="left-info">
                <img src={imgSrc}/>
            </div>
            <div className="right-info">
                <p title={name}>{name}</p>
                <p title={number}>{number}</p>
            </div>
            <div className="operate">
                <XIcon type={`${icon}`} />
            </div>
        </div>
    );
}
