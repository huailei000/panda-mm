import classnames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import './index.scss';

class TabPane extends React.Component {
    static propTypes = {
        tab: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]).isRequired,
        order: PropTypes.string.isRequired,
        disable: PropTypes.bool,
        isActive: PropTypes.bool,
        className: PropTypes.string
    };

    render() {
        const {classPrefix, className, isActive, children} = this.props;

        const classes = classnames({
            [className]: className,
            [`${classPrefix}-panel`]: true,
            [`${classPrefix}-active`]: isActive
        });

        return (
            <div
                role={"tabpanel"}
                className={classes}
                {...this.props.className}
                aria-hidden={!isActive}>
                {children}
            </div>
        );
    }
}

export default TabPane;
