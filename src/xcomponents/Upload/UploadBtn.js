import React from 'react';
import { XButton, XIcon } from 'xcomponents';
import Upload from './Upload';

export default class extends React.Component {
    constructor(){
        super();
        this.state = {
            fileKeyList: []
        };
    }

    setUploadRef(ref) {
        this.setState({
            uploadRef: ref
        });
    }

    uploadBtnClick() {
        if (this.props.filekey) {
            // 有filekey属性，说明是重传
            this.state.uploadRef.triggerClick(this.props.filekey);
        } else {
            this.state.uploadRef.triggerClick(new Date().getTime());
        }
    }

    before(key, data) {
        this.props.onBefore && this.props.onBefore(key, data);
    }

    started(key, data) {
        this.props.onStarted && this.props.onStarted(key, data);
    }

    finished(key, res, data) {
        this.props.onFinished && this.props.onFinished(key, res, data);
    }

    error(key, data) {
        this.props.onError && this.props.onError(key, data);
    }

    render() {
        return (
            <div className="x-upload-btn">
                <button className="xcomponent-btn xcomponent-btn-primary xcomponent-btn-md" disabled={this.props.disbale} type={"primary"} onClick={this.uploadBtnClick.bind(this)}><XIcon type="upload"/>批量导入&nbsp; | &nbsp;</button>
                <XIcon type="file" title="下载模板" onClick={()=>{
                    this.props.onDownLoadTemp()
                }}/>
                <Upload
                    acceptType={this.props.acceptType || '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}
                    beforeupload={this.before.bind(this)}
                    uploadstarted={this.started.bind(this)}
                    uploadfinished={this.finished.bind(this)}
                    uploaderror={this.error.bind(this)}
                    onRef={this.setUploadRef.bind(this)}
                    url={this.props.ajaxUrl || '/api/v1/import/xlxs'}
                    fileType={this.props.fileType ||'excel'}
                    params={this.props.params}
                />
            </div>
        );
    }
}
