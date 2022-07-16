import './index.scss'
import React from 'react';

export default function ({className, title, children, noPadding, type}) {
    let _class = noPadding ? `${className || ''}` : `xcomponent-box-content ${className || ''}`,
        colorTypeClass = type ? ' xcomponent-box-' + type : '';

    return (
        <div className={`xcomponent-box${colorTypeClass}`}>
            {
                title &&
                <div className="xcomponent-box-title">
                    <h4>{title}</h4>
                </div>
            }
            <div className={_class}>
                {children}
            </div>
        </div>
    );
}