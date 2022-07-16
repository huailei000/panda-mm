import React, { Component, Fragment } from 'react'
import { XTable, XDatePickerInput } from 'xcomponents'

export default class extends Component {
    state = {
        date1: '',
        date2: [new Date()]
    }

    tableConf = [
        { name: '姓名', key: 'name' },
        { name: '时间', key: 'time', isOrder: true },
        { name: '地点', key: 'address' },
        { name: '操作', key: '', render: () => <a>编辑</a> }
    ]

    onPageChange() {}

    render() {
        return (
            <Fragment>
                <XTable
                    tableConf={this.tableConf}
                    onPageChange={this.onPageChange.bind(this)}
                    dataList={[
                        {
                            name: '111',
                            time: '2018-10-29',
                            address: '融科资讯中心A座'
                        },
                        {
                            name: '222',
                            time: '2018-10-29',
                            address: '融科资讯中心A座'
                        }
                    ]}
                    totalRecord={10}
                    urlParams={{}}
                    sequenceMap={{ time: '' }}
                />
                <XDatePickerInput
                    value={this.state.date1}
                    placeholder="测试时间"
                    onChange={res => {}}
                />
            </Fragment>
        )
    }
}
