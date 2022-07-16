import React, { Component } from 'react'
import CardContainer from '../component/cardConrainer'
import {
    XTable,
    XPagination,
    XButton,
    XSearchInput,
    XIcon,
    XModal,
    XUploadBtn
} from 'xcomponents'
import PropTypes from 'prop-types'

class FaceRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            page: {
                pageNo: 1,
                pageSize: 20
            }
        }
    }
    handleKeyDown() {}
    SizeChange(pageSize) {
        this.setState({
            page: {
                pageNo: this.state.page.pageNo,
                pageSize
            }
        })
        // console.log(this.state.page);
    }
    pageChange(page) {
        console.log(page)
    }
    clear() {
        this.setState({
            name: ''
        })
    }
    render() {
        return (
            <div className="faceRecord">
                <div className="head">
                    <XSearchInput
                        placeholder={'搜索学生名称'}
                        value={this.state.name}
                        size="md"
                        onSearch={this.handleKeyDown.bind(this)}
                        onClear={this.clear.bind(this)}
                    />
                    <XButton type={'primary'} className="searchBtn">
                        搜索
                    </XButton>
                </div>
                <div className="container">
                    <div className="scrollCard">
                        <CardContainer className="card">
                            <div className="alt">
                                <div className="info">
                                    <span className="tit">姓名</span>
                                    <span className="infoTit">孙国荣</span>
                                </div>
                                <div className="info">
                                    <span className="tit">学号</span>
                                    <span className="infoTit">20181231130</span>
                                </div>
                                <div className="info">
                                    <span className="tit">到课</span>
                                    <span className="infoTit">到了</span>
                                </div>
                            </div>
                        </CardContainer>
                    </div>
                    <XPagination
                        count={1}
                        onSizeChange={this.SizeChange.bind(this)}
                        onPageChange={this.pageChange.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

FaceRecord.propTypes = {}

export default FaceRecord
