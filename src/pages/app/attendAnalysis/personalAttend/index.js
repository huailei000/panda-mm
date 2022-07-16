import React, { Component, Fragment } from 'react';
import { XTable, XPagination, XInput, XButton, XSearchInput, XIcon, XModal, XImages, XUploadBtn } from 'xcomponents';
import { BTimePickerInput } from 'bcomponents';
import { $_ajax, $_date, $_toast, $_conf } from 'services';
import SeeModal from './modal/see';

const date = 4 * 60 * 60 * 24 * 1000

export default class extends Component {
    state = {
        name: '',
        date: [
            $_date.getThisFullWeek(new Date())[0],
            $_date.getThisFullWeek(new Date())[6]
        ],
        dataList: [],
        count: '',
        page: 1,
        size: 10
    }

    tableConf = [
        {
            name: '底库图片',
            key: 'photos',
            width: '300px',
            render: res => (
                <Fragment>
                    {
                        res.student.photos && res.student.photos.length > 0 ?
                            (
                                res.student.photos.map((item, index) => {
                                    return (
                                        <XImages.Image
                                            key={index}
                                            imgUrl={item.url}
                                        />
                                    )
                                })
                            ) : (
                                <XImages.Void />
                            )
                    }
                </Fragment>
            )
        },
        {
            name: '学生姓名',
            key: 'subject_name',
            render: res => {
                return <p>{res.student.name}</p>
            }
        },
        {
            name: '学号',
            key: 'subject_job_number',
            render: res => {
                return <p>{res.student.job_number}</p>
            }
        },
        { name: '出勤率', key: "attendance_ratio",
        render: (res) => {
            return (
                <p>{(res.attendance.attendance_ratio* 100).toFixed(1) }%</p> 
            )
        }
        },
        {
            name: '到课次数',
            key: 'attendance_count',
            render: res => {
                return <p>{res.attendance.attendance_count}</p>
            }
        },
        {
            name: '缺勤次数',
            key: 'nonattendance_count',
            render: res => {
                return <p>{res.attendance.nonattendance_count}</p>
            }
        },
        {
            name: '操作',
            key: 'operation',
            render: res => (
                <Fragment>
                    {
                        res.student.photos && res.student.photos.length > 0 ?
                        <XIcon type="eye" onClick={this.seeFn.bind(this, res)} />
                        : null
                    }
                </Fragment>
            )
        }
    ];
    seeFn(type, item) {
        XModal.Dialog(SeeModal, {
            size: 'sg',
            data: {
                type: type,
                list: item
            }
        }).then(() => {
            this.props.history.$reload()
        })
    }
    handleKeyDown(res) {
        this.setState({
            name: res
        })
    }
    clear() {
        this.setState({
            name: ''
        })
    }
    onFinished() {
        this.props.history.$reload()
    }
    onPageChange() {

    }
    dateChange(res) {
        // const date = [$_date('YYYY-MM-DD', res[0]), $_date('YYYY-MM-DD', res[1])]
        this.setState({
            date: res
        });
    }
    render() {
        const startTime =
                this.state.date.length > 0
                    ? $_date.init('YYYY-MM-DD', this.state.date[0])
                    : '',
            endTime =
                this.state.date.length > 0
                    ? $_date.init('YYYY-MM-DD', this.state.date[1])
                    : '';
        console.log(startTime);
        return (
            <div className="personalAttend">
                <div className="personalAttend-header">
                    <div className="info">
                        学生信息{' '}
                    </div>
                    <div className="operate-info">
                        <div className="item-1">
                            <XSearchInput
                                placeholder={'搜索 学生姓名'}
                                value={this.state.name}
                                size="md"
                                onSearch={this.handleKeyDown.bind(this)}
                                onClear={this.clear.bind(this)}
                            />
                        </div>
                        <div className="item">
                            <BTimePickerInput
                                value={this.state.date}
                                onChange={this.dateChange.bind(this)}
                            />
                        </div>
                    </div>
                </div>
                <XTable
                    tableConf={this.tableConf}
                    onPageChange={this.onPageChange.bind(this)}
                    url={'attendance/students'}
                    ref="table"
                    urlParams={{
                        name: this.state.name,
                        start_time: startTime,
                        end_time: endTime
                    }}
                    needTip={true}
                />
            </div>
        )
    }
}
