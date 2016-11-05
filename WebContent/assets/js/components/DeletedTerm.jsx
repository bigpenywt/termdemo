import 'babel-polyfill';
import React from 'react';
import request from 'superagent';
import Immutable from 'immutable';
import {
    Table,
    Card,
    Popconfirm,
    Modal,
    Button,
    Form,
    Row,
    Col,
    message
} from 'antd';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const emptyRecord = {
    term: '',
    term_char: '',
    definition: '',
    origin: {
        magazineName: '',
        year: '',
        roll: '',
        issue: '',
        page: ''
    },
    pronunciation: '',
    example: '',
    source: '',
    translation: '',
    basis: ''
}

export default class DeletedTerm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTermDetails: false,
            terms: [],
            termsTotal: 0,
            pagination: {},
            record: emptyRecord,
            loading: false,
            isFirstFetch: true,
            commitLoading: false
        }
        this.hideDetails = this.hideDetails.bind(this);
        this.fetchNewData = this.fetchNewData.bind(this);
    }
    componentDidMount() {
        request.get('/termdemo/Term/GetTermByStatus/').query({status: 4, page: 0, rows: 10}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                const pagination = {
                    total: data.total
                };
                this.setState({terms: data.records, pagination: pagination, isFirstFetch: false});
            }
        });
    }
    showDetails(record) {
        let tempTerm = Immutable.fromJS(this.state.terms[record.key - 0]);
        let origin = this.state.terms[record.key - 0].origin.split(',');
        tempTerm = tempTerm.set('origin', {
            magazineName: origin[0],
            year: origin[1] || '',
            roll: origin[2] || '',
            issue: origin[3] || '',
            page: origin[4] || ''
        });
        this.setState({showTermDetails: true, record: tempTerm.toJS()});
    }
    hideDetails() {
        this.setState({showTermDetails: false, record: emptyRecord});
    }
    fetchNewData(pagination) {
        let pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({pagination: pager, loading: true});
        request.get('/termdemo/Term/GetTermByStatus/').query({status: 4, page: pager.current, rows: pagination.pageSize}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                let pagination = this.state.pagination;
                pagination.total = data.total;
                this.setState({terms: data.records, pagination: pagination, loading: false, record: emptyRecord});
            }
        });
    }
    render() {
        if (!this.state.isFirstFetch) {
            const columns = [
                {
                    title: '单词',
                    dataIndex: 'term',
                    key: 'term'
                }, {
                    title: '中文翻译',
                    dataIndex: 'translation',
                    key: 'translation'
                }, {
                    title: '创建人',
                    dataIndex: 'creator',
                    key: 'creator'
                }, {
                    title: '校验人',
                    dataIndex: 'reviewer',
                    key: 'reviewer'
                }, {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            <a href="javascript:void(0);" onClick={this.showDetails.bind(this, record)}>查看详细</a>
                        </span>
                    )

                }
            ];
            const data = this.state.terms.map((item, i) => {
                return {key: i, term: item.term, translation: item.translation, reviewer: item.reviewer, creator: item.creator}
            });
            const modalBottonGroup = [< Button type = "ghost" size = "large" onClick = {
                    this.hideDetails
                } > 返回 < /Button>,<Button type="primary" size="large"> 恢复 </Button >]

            return (
                <div>
                    <Card title="移除发布的单词" style={{
                        width: '100%'
                    }}>
                        <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
                    </Card>
                    <Modal title="单词详情" visible={this.state.showTermDetails} onCancel={this.hideDetails} width={'80%'} footer={modalBottonGroup}>
                        <Form horizontal>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="条目" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <p>{this.state.record.term}</p>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="词性" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 6
                                    }}>
                                        <p>{this.state.record.term_char}</p>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="发音" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 18
                                    }}>
                                        <p>{'[' + this.state.record.pronunciation + ']'}</p>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="中文翻译" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 18
                                    }}>
                                        <p>{this.state.record.translation}</p>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{
                                borderTop: '1px solid #e9e9e9',
                                marginBottom: '20px'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-11px',
                                    padding: '1px 8px',
                                    color: '#777',
                                    marginLeft: '25px',
                                    background: '#fff'
                                }}>首次来源</div>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="杂志名称" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <p>{this.state.record.origin.magazineName}</p>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{
                                borderBottom: '1px solid #e9e9e9',
                                marginBottom: '20px'
                            }}>
                                <Col span={6}>
                                    <FormItem label="年份" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <p>{this.state.record.origin.year}</p>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="卷号" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <p>{this.state.record.origin.roll}</p>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="期号" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <p>{this.state.record.origin.issue}</p>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="页码" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <p>{this.state.record.origin.page}</p>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="英文定义" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 18
                                    }}>
                                        <p>{this.state.record.definition}</p>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="定义来源" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 18
                                    }}>
                                        <p>{this.state.record.source}</p>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem label="示例" labelCol={{
                                        span: 2
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <p>{this.state.record.example}</p>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem label="翻译理据" labelCol={{
                                        span: 2
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <p>{this.state.record.basis}</p>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </div >
            )
        } else
            return false

    }
}
