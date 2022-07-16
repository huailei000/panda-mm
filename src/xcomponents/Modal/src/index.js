import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';

import Confirm from './Confirm';
import Dialog from './Dialog';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import Alert from './Alert';

class XModal extends React.Component {

    static propTypes = {
        className: PropTypes.string
    };
    static defaultProps = {
        className: ''
    };
    static Header = Header;
    static Body = Body;
    static Footer = Footer;
    static Dialog = Dialog;
    static Confirm = Confirm;
    static Alert = Alert;

    render() {
        return (
            <div id="x-modal-container" className={classnames(this.props.className)}></div>
        );
    }
}

export default XModal;
