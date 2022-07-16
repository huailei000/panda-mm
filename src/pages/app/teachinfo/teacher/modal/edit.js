import React, { Component, Fragment } from 'react'
import {
    XInput,
    XSelector,
    XButton,
    XModal,
    XImages,
    XUploadImgBox
} from 'xcomponents'
import { $_ajax, $_date, $_toast, $_conf } from 'services'

export default class extends Component {
    constructor(props) {
        super(props)
        this.giveUp = false
        const photos = props.data.list.photos ? JSON.parse(JSON.stringify(props.data.list.photos)): []
        this.state = {
            option: [
                {
                    label: '请选择',
                    value: ''
                },
                {
                    label: '身份证',
                    value: 1
                },
                {
                    label: '护照',
                    value: 2
                }
            ],
            sex: [
                {
                    label: '请选择',
                    value: ''
                },
                {
                    label: '男',
                    value: 1
                },
                {
                    label: '女',
                    value: 2
                }
            ],
            id: props.data.list.id,
            name: props.data.list.name || '',
            gender: props.data.list.gender,
            certificate_type: props.data.list.certificate_type,
            certificate_number: props.data.list.certificate_number,
            job_number: props.data.list.job_number || '',
            create_time: props.data.list.create_time
                ? $_date.init(
                      'YYYY-MM-DD',
                      new Date(props.data.list.create_time * 1000)
                  )
                : $_date.init('YYYY-MM-DD', new Date()),
            photos,
            photo1: '',
            photo2: '',
            photo3: '',
        }
    }

    componentWillMount() {
        this.props.data.type !== 'create' &&
            this.props.data.list.photos.map((item, index) => {
                this.setState({
                    ['photo' + (index + 1)]: $_conf.preLoadAddr + item.url
                })
            })
    }
    confirmFn() {
        const { confirm, data } = this.props
        const { name, job_number, photo1, photo2, photo3 } = this.state
        const reg = /^[\da-zA-Z\u4E00-\u9FA5]{1,20}$/i
        const regg = /^[\da-zA-Z]{1,24}$/

        let formData = new FormData()
        this.state.name && formData.append('name', name)
        this.state.gender && formData.append('gender', this.state.gender)
        this.state.certificate_type &&
            formData.append('certificate_type', this.state.certificate_type)
        this.state.certificate_number &&
            formData.append('certificate_number', this.state.certificate_number)
        this.state.job_number &&
            formData.append('job_number', job_number)
        let photoCreate = [];
        this.state.photo1 && formData.append('photo1', this.state.photo1)
        this.state.photo2 && formData.append('photo2', this.state.photo2)
        this.state.photo3 && formData.append('photo3', this.state.photo3)

        photoCreate[0] && formData.append('photo1', photoCreate[0])
        photoCreate[1] && formData.append('photo2', photoCreate[1])
        photoCreate[2] && formData.append('photo3', photoCreate[2])
        if (data.type === 'create') {
            if ((photo1 || photo2 || photo3) == '') {
                $_toast('底库照片填入有误', 'warning')
                return
            } else if (!reg.test(name)) {
                $_toast('教师姓名填入有误', 'warning')
                return
            } else if (!regg.test(job_number)) {
                $_toast('工号填入有误', 'warning')
                return
            }
            $_ajax.postFormData('teacher/file', formData).then(res => {
                    confirm()
                }).then(res => {
                        $_toast('新增成功！')
                    },
                    res => {
                        $_toast(res.desc)
                    }
                )
        } else {
            let photosArr = []
            this.state.photos.forEach(item => {
                if (!item) return
                photosArr.push(item.id)
            })
            if (photosArr.length == '') {
                $_toast('底库照片填入有误', 'warning')
                return
            } else if (!reg.test(name)) {
                $_toast('教师姓名填入有误', 'warning')
                return
            } else if (!regg.test(job_number)) {
                $_toast('工号填入有误', 'warning')
                return
            }
            $_ajax.put(`teacher/file/${this.state.id}`, {
                    name: this.state.name,
                    gender: this.state.gender === 0 ? '' : this.state.gender,
                    certificate_type: this.state.certificate_type === 0 ? '' : this.state.certificate_type,
                    certificate_number: this.state.certificate_number,
                    job_number: this.state.job_number,
                    photo_id: photosArr.join(',')
                })
                .then(res => {
                    confirm()
                    $_toast('编辑成功！')
                })
                .catch(err => {
                    $_toast(err.desc, 'error')
                })
        }
    }
    giveUpSave() {
        // XModal.Confirm({
        //     size: 'sm',
        //     title: '提示',
        //     msg: '是否放弃本次修改',
        //     confirmText: '继续编辑',
        //     cancelText: '放弃编辑'
        // }).then(
        //     res => {
                
        //     },
        //     () => {
        //         this.setState({
        //             photos: [],
        //             photo1: '',
        //             photo2: '',
        //             photo3: ''
        //         })
        //         this.props.cancel()
        //     }
        // )
        this.setState({
            photos: [],
            photo1: '',
            photo2: '',
            photo3: ''
        })
        this.props.cancel()
    }
    imgChange(current, res) {
        if (this.props.data.type === 'create') {
            let photo1 = current === 0 ? '' : this.state.photo1;
            let photo2 = current === 1 ? '' : this.state.photo2;
            let photo3 = current === 2 ? '' : this.state.photo3;
            switch (current) {
                case 0:
                    photo1 = res;
                    break;
                case 1:
                    photo2 = res;
                    break;
                default:
                    photo3 = res;
                    break;
            }
            this.setState({
                photo1, photo2, photo3
            })
            return
        }
        const { photos } = this.state
        photos.splice(current, 1, res)
        this.setState({
            photos
        })
    }
    clearImg(data) {
        if (!data) return 
        if (this.props.data.type === 'create') {
            this.setState({
                [`photo${data}`]: ''
            })
        } else {
            const { photos } = this.state
            const i = photos.findIndex(item => item.id === data.id)
            photos.splice(i, 1, false)
            this.setState({
                photos
            })
        }
    }
    render() {
        const { confirm, cancel, data } = this.props
        return (
            <div className="teacher-edit">
                <XModal.Header {...this.props}>
                    {' '}
                    {data.type === 'create' ? '新增' : '编辑'}教师
                </XModal.Header>
                <XModal.Body>
                    <div className="edit-basic">
                        <div className="form-images">
                            <div className="name">
                                <span className="required">*</span>底库照片
                            </div>
                            <div className="value">
                                <XImages>
                                    <XUploadImgBox
                                        imgSrc={this.state.photo1}
                                        clearImg={
                                            this.props.data.type === 'create' ? this.clearImg.bind(this, 1) : this.clearImg.bind(this)
                                        }
                                        isCreate={
                                            this.props.data.type === 'create'
                                                ? true
                                                : false
                                        }
                                        data={this.state.photos[0]}
                                        subjectId={data.list.id}
                                        subjectType={1}
                                        onChange={this.imgChange.bind(this, 0)}
                                    />
                                    <XUploadImgBox
                                        imgSrc={this.state.photo2}
                                        clearImg={
                                            this.props.data.type === 'create' ? this.clearImg.bind(this, 2) : this.clearImg.bind(this)
                                        }
                                        isCreate={
                                            this.props.data.type === 'create'
                                                ? true
                                                : false
                                        }
                                        data={this.state.photos[1]}
                                        subjectId={data.list.id}
                                        subjectType={1}
                                        onChange={this.imgChange.bind(this, 1)}
                                    />
                                    <XUploadImgBox
                                        imgSrc={this.state.photo3}
                                        clearImg={
                                            this.props.data.type === 'create' ? this.clearImg.bind(this, 3) : this.clearImg.bind(this)
                                        }
                                        isCreate={
                                            this.props.data.type === 'create'
                                                ? true
                                                : false
                                        }
                                        data={this.state.photos[2]}
                                        subjectId={data.list.id}
                                        subjectType={1}
                                        onChange={this.imgChange.bind(this, 2)}
                                    />
                                </XImages>
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>教师姓名
                            </div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入教师姓名"
                                    value={this.state.name}
                                    onChange={res => {
                                        this.setState({ name: res })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>工号
                            </div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入教师工号"
                                    value={this.state.job_number}
                                    onChange={res => {
                                        this.setState({ job_number: res })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">证件类型</div>
                            <div className="value">
                                <XSelector
                                    options={this.state.option}
                                    placeholder="请选择证件类型"
                                    defaultValue={this.state.certificate_type}
                                    onChange={res => {
                                        this.setState({
                                            certificate_type: res.value
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">性别</div>
                            <div className="value">
                                <XSelector
                                    options={this.state.sex}
                                    placeholder="请选择性别"
                                    defaultValue={this.state.gender}
                                    onChange={res => {
                                        this.setState({ gender: res.value })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">证件号码</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入证件号码"
                                    value={this.state.certificate_number}
                                    onChange={res => {
                                        this.setState({
                                            certificate_number: res
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">创建时间</div>
                            <div className="value">
                                {this.state.create_time}
                            </div>
                        </div>
                    </div>
                </XModal.Body>
                <XModal.Footer>
                    <XButton type={'warning'} onClick={::this.confirmFn}>
                        完成
                    </XButton>
                    <XButton
                        type={'primary'}
                        onClick={() => {
                            cancel()
                        }}
                    >
                        取消
                    </XButton>
                </XModal.Footer>
            </div>
        )
    }
}
