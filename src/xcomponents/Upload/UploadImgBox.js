import React from 'react';
import {XIcon } from 'xcomponents';
import {$_ajax, $_toast, $_conf} from 'services';
import Upload from './Upload';

export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fileKeyList: [],
            imgSrc: props.imgSrc || ''
        };
    }

    selectFile(e) {
        const {isCreate,data} = this.props;
        // console.log(e, isCreate);
        let formData = new FormData();
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        isCreate ? this.setState({imgSrc:window.URL.createObjectURL(files[0])}) : '';
        isCreate ? this.props.onChange(files[0]) : this.upload(files[0]);
    }

    uploadfinished() {

    }

    upload(file){
        const {subjectId, subjectType, data, isCreate} = this.props;
        let formData = new FormData();
        file && formData.append('photo',file);
        data && formData.append('old_photo_id',data['id']);
        formData.append('subject_id',subjectId);
        formData.append('subject_type',subjectType);
        $_ajax.putFormData(`subject/photo`,formData).then((res)=>{
            this.setState({imgSrc: $_conf.preLoadAddr + res.data.url});
            this.props.onChange(res.data);
        }).catch((err) => {
            $_toast(err.desc, 'error');
        });
    }

    render() {
        const {isCreate,data} = this.props;
        return (
            <div className="x-upload-img">
                {isCreate ? 
                    <div className={`x-upload-img-box ${this.state.imgSrc ? 'is-img' : ''}`} onClick={()=>{this.refs.uploadtrigger.click()}}>
                        添加照片
                    </div>:
                    <div className={`x-upload-img-box ${this.state.imgSrc ? 'is-img' : ''}`} onClick={()=>{this.refs.uploadtrigger.click()}}>
                        添加照片
                    </div>
                }
                <div className={`x-upload-img-box ${this.state.imgSrc ? '' : 'no-img'}`}>
                    {/* <span
                        className="image-layer"
                        onClick={() => { this.refs.uploadtrigger.click() }}>
                        重新上传
                    </span> */}
                    <XIcon
                        type="minus-circle"
                        className="icon-circle"
                        onClick={() => {
                        this.setState({
                            imgSrc: '',
                            fileKeyList: [],
                        })
                        if (this.props.clearImg) {
                            this.props.clearImg(this.props.data);
                        }
                    }}/>
                    <img src={this.state.imgSrc} />
                </div>
                
                <input type="file" ref="uploadtrigger" accept={this.props.fileType || 'image/*'}
                       onChange={this.selectFile.bind(this)} className="x-upload"/>
            </div>
        );
    }
}
