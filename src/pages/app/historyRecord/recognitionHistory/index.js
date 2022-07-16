import React, { Component } from 'react'
import CardContainer from '../component/cardConrainer'
import {
    XTable,
    XImages,
    XSearchInput,
} from 'xcomponents'
import PropTypes from 'prop-types'
import Api from './services'
import { $_toast, $_conf, $_date } from 'services'
import { BNoData, BLoading } from 'bcomponents';

const defaultImg = require('../../../../assets/avatar.jpg');

class RecognitionHistory extends Component {
    constructor(props) {
        super(props)
        this.pages = {
            page: 1,
            size: 20
        }
        this.state = {
            name: '',
            pages: this.pages,
            copyPhotos: [],
            photos: [],
            total: 0,
            isLoading: false,
        }
        this.tableConf = [
            {
                name: '抓拍照片',
                key: 'photo',
                render: (res) => {
                    return ( <XImages.Image imgUrl={res.photo ? res.photo : defaultImg}
                        />
                    )
                }
            },
            {
                name: '识别照片',
                key: 'avatar',
                render: (res) => {
                    return ( <
                        XImages.Image imgUrl = {
                            res.subject.avatar ? res.subject.avatar : defaultImg
                        }
                        />
                    )
                }
            },
            { name: '姓名', key: 'name', render: (res) =>　res.subject.name || '-' },
            { name: '学号', key: 'job_number', render: (res) => res.subject.job_number || '-' },
            { name: '教室名称', key: 'screen', render: (res) => `${res.classroom_name}~${res.classroom_location}`},
            { name: '识别结果', key: 'eventType', render: (res) => res.event_type !== 0 ? '未识别' : '识别' },
            {
                name: '抓拍时间',
                key: 'timestamp',
                render: (res) => {
                    return $_date.init('YYYY-MM-DD HH:mm:ss', res.timestamp*1000)
                }
            },
        ];
    }
    tableConf = [
        {
            name: '抓拍照片',
            key: 'photo',
            render: (res) => {
                console.log(res);
                return (
                    <XImages.Image
                        imgUrl={res.photo}
                    />
                )
            }
        },
        {
            name: '识别照片',
            key: 'photo',
            render: (res) => {
                return ( <
                    XImages.Image imgUrl = {res.photo}
                    />
                )
            }
        },
        { name: '姓名', key: 'name', render: (res) =>　res.subject.name || '-' },
        { name: '学号', key: 'job_number', render: (res) => res.subject.job_number || '-' },
        { name: '教室名称', key: 'num' },
        { name: '识别结果', key: 'major' },
        {
            name: '抓拍时间',
            key: 'timestamptimestamp',
            render: (res) => {
                return $_date.init('YYYY-MM-DD HH:mm:ss')
            }
        },
    ]
    getEvents(pages, user_name) {
        const parmas = {
            ...pages,
            user_name
        }
        Api.getEvents(parmas)
            .then(res => {
                this.setState({
                    photos: res.data.list,
                    total: res.page.count,
                    copyPhotos: res.data.list,
                })
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            }).finally(() => {
                this.setState({
                    isLoading: false
                })
            })
    }
    handleKeyDown(name) {
        this.setState({
            name,
        })
        pages.size = size
        pages.page = 1
        this.setState({
            pages
        })
        this.getEvents(pages)
    }
    pageChange(page) {
        const pages = this.pages
        pages.page = page
        this.setState({
            pages
        })
        this.getEvents(pages)
    }
    clear() {
        this.setState({
            name: '',
        })
    }
    render() {
        return (
            <div className="RecognitionHistory">
                <div className="head">
                    <XSearchInput
                        placeholder={'搜索学生名称'}
                        value={this.state.name}
                        size="md"
                        onSearch={this.handleKeyDown.bind(this)}
                        onClear={this.clear.bind(this)}
                    />
                </div>
                <div className="container">
                    <XTable
                        tableConf={this.tableConf}
                        url={'event/events'}
                        ref="table"
                        urlParams={this.state.name ? { name: this.state.name } : {}}
                    />   
                </div>
                  
            </div>
        )
    }
}

RecognitionHistory.propTypes = {}

export default RecognitionHistory
