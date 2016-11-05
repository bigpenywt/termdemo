import React from 'react';
import {PieChart} from 'react-d3-components';
import request from 'superagent';
import {Card, Form, Input, Row, Col} from 'antd';

const FormItem = Form.Item;

import '../../../public/css/page/app/welcome.css'

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFirstFetch: true,
            termInfo: {
                tbModify: 0,
                deleted: 0,
                tbPublish: 0,
                tbReview: 0,
                done: 0,
                status: "1"
            }
        }
    }
    componentDidMount() {
        request.get('/termdemo/Term/GetTotal').end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                this.setState({termInfo: data, isFirstFetch: false});
            }
        });
    }
    render() {
        if (this.state.isFirstFetch)
            return false
        else {
            const pieChatdata = {
                values: [
                    {
                        x: '待校验的单词',
                        y: this.state.termInfo.tbReview
                    }, {
                        x: '驳回的单词',
                        y: this.state.termInfo.tbModify
                    }, {
                        x: '待发布的单词',
                        y: this.state.termInfo.tbPublish
                    }, {
                        x: '已发布的单词',
                        y: this.state.termInfo.done
                    }, {
                        x: '移除已发布的单词',
                        y: this.state.termInfo.deleted
                    }
                ]
            }
            return (
                <Card title="当前词库状态" style={{
                    width: '100%'
                }}>
                    <div style={{
                        width: '550px'
                    }}>
                        <PieChart data={pieChatdata} width={600} height={400} sort={null}/>
                    </div>
                    <div className="infoForm">
                        <Form horizontal>
                            <Row>
                                <Col span={24}>
                                    <FormItem label="待校验" labelCol={{
                                        span: 16
                                    }} wrapperCol={{
                                        span: 8
                                    }}>
                                        <p>{this.state.termInfo.tbReview}条</p>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="驳回" labelCol={{
                                        span: 16
                                    }} wrapperCol={{
                                        span: 6
                                    }}>
                                        <p>{this.state.termInfo.tbModify}条</p>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="待发布" labelCol={{
                                        span: 16
                                    }} wrapperCol={{
                                        span: 8
                                    }}>
                                        <p>{this.state.termInfo.tbPublish}条</p>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="已发布" labelCol={{
                                        span: 16
                                    }} wrapperCol={{
                                        span: 8
                                    }}>
                                        <p>{this.state.termInfo.done}条</p>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="移除「已发布」" labelCol={{
                                        span: 16
                                    }} wrapperCol={{
                                        span: 8
                                    }}>
                                        <p>{this.state.termInfo.deleted}条</p>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
            )
        }

    }
}
