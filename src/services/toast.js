import {toast} from 'react-toastify';
import React from 'react';
import {XIcon} from 'xcomponents';
// import 'react-toastify/dist/ReactToastify.css';

let timer = null;
let iTimer = false;

export default function (msg, type = 'info', time = 2000) {
    if (iTimer) return;
    iTimer = true;
    timer = setTimeout(() => {
        iTimer = false;
        clearTimeout(timer);
    }, time * 1 + 100);
    toast[type](
        <div className={`toast-content-${type}`}><XIcon type="alarm"/>{msg}</div>
    , {
        autoClose: time * 1,
    });
}