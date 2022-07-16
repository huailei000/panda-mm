import React from 'react';
import { toast } from 'react-toastify';
import { XIcon, XButton } from 'xcomponents';

function downloadFn() {
  console.log('msgrrr');
}

export default function (msg, type = 'info') {

  toast[type](
    <div className="reeordown-content">
      共导入x条数据，x条成功，x条失败
      <div className="reeordown-left">
        <XButton
          className="button"
          onClick={downloadFn.bind(this)}>
          下载文件
        </XButton>
        <XIcon type="times" />
      </div>
    </div>,
    {
      autoClose: false,
    }
  );
}