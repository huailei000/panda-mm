import React, {Fragment}from 'react';
import {$_data, $_toast, $_util} from 'services';
import {XModal} from 'xcomponents';
import './Upload.scss';
import { stringify } from 'querystring';

export default class extends React.Component {
    constructor() {
        super();
        this.fileKey = '';
        this.isTimeout = false;
        this.state = {};
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    selectFile(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        if(this.props.fileType === 'zip'){
            let fileTypes = ['zip'];
            var index= files[0]['name'].lastIndexOf('.');
            var ext = files[0]['name'].substr(index+1);
            if(fileTypes.indexOf(ext.toLowerCase()) < 0){
                XModal.Alert({ size: 'sm', title: '导入错误！', msg: <Fragment><p>导入文件格式错误</p><p>请先下载模版，按格式填写后上传文件</p></Fragment> })}
        }
        if(this.props.fileType === 'excel'){
            let fileTypes = ['xls', 'xlsx'];
            var index= files[0]['name'].lastIndexOf('.');
            var ext = files[0]['name'].substr(index+1);
            if(fileTypes.indexOf(ext.toLowerCase()) < 0){
                XModal.Alert({ size: 'sm', title: '导入错误！', msg: <Fragment><p>导入文件格式错误</p><p>请先下载模版，按格式填写后上传文件</p></Fragment> })}
        }
        this.props.beforeupload(this.fileKey, files);
        this.isTimeout = false;
        this.upload(files, this.fileKey);
        this.refs.uploadtrigger.setAttribute('type', 'text');// 解决upload不能上传同一张照片的BUG
    }

    triggerClick(key) {
        // 外部调用的方法
        this.fileKey = key;
        this.refs.uploadtrigger.setAttribute('type', 'file');// 解决upload不能上传同一张照片的BUG
        this.refs.uploadtrigger.click();
    }

    upload(files, key) {
        const {params} = this.props;
        let formData = new FormData();
        if (this.props.mul) {
            for (let k in files) {
                formData.append('file', files[k], window.encodeURI(files[k].name));
            }
        } else {
            formData.append('file', files[0], window.encodeURI(files[0].name));
        }
        //区分个别上传需要参数
        if(params && JSON.stringify(params) !== '{}'){
            for(let i in params){
                formData.append(i ,params[i])
            }
        }
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.props.url, true);
        // 设置头部
        xhr.setRequestHeader('Authorization', $_util.getCookie('access_token'));

        xhr.timeout = this.props.timeout || 25000;// 设置超时,默认为25s
        xhr.send(formData);
        // 上传中
        xhr.addEventListener('progress', (e) => {
            this.props.uploadstarted(key, files);
        }, false);
        // 上传结果
        xhr.addEventListener('load', (e) => {
            if (xhr.status === 200) {
            } else {
                this.props.uploaderror(key, files);
                xhr.abort();// 终止
            }
        }, false);
        // 上传完成
        xhr.addEventListener('loadend', (e) => {
            if (!this.isTimeout) {
                let res = JSON.parse(xhr.response);
                if (res.code === 0) {
                    $_toast(`上传成功, 成功${res.data.success} 失败${res.data.failed}`);
                    this.props.uploadfinished(key, res, files);
                } else {
                    $_toast(res.desc);
                    this.props.uploaderror(key, files);
                }
            }
        }, false);
        // 上传超时
        xhr.addEventListener('timeout', (e) => {
            $_toast('图片上传超时，请重新上传！');
            this.isTimeout = true;
            this.props.uploaderror(key, files);
            xhr.abort();// 终止
        }, false);

        // 上传失败
        xhr.addEventListener('error', (e) => {
            this.props.uploaderror(key, files);
        });
    }

    renderInput(isMul) {
        if (isMul) {
            return (
                <input multiple={"multiple"} type="file" ref="uploadtrigger" accept={this.props.acceptType || 'image/*'}
                       onChange={this.selectFile.bind(this)} className="x-upload"/>);
        } else {
            return (<input type="file" ref="uploadtrigger" accept={this.props.acceptType || 'image/*'}
                           onChange={this.selectFile.bind(this)} className="x-upload"/>);
        }
    }

    render() {
        return this.renderInput(this.props.mul);
    }
}
