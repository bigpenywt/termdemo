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
    Input,
    Row,
    Col,
    message,
    Switch
} from 'antd';
const FormItem = Form.Item;
const emptyRecord = {
    term: '',
    term_char: '',
    definition: '',
    origin: {
        magazineName: '',
        year: '',
        roll: '',
        issue: '',
        page: '',
        other: ''
    },
    useOtherOrigin: false,
    pronunciation: '',
    example: '',
    source: '',
    translation: '',
    basis: ''
}

export default class ToBeReviewTerm extends React.Component {
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
            showRejectModal: false,
            commitLoading: false
        }
        this.hideDetails = this.hideDetails.bind(this);
        this.fetchNewData = this.fetchNewData.bind(this);
        this.typeForm = this.typeForm.bind(this);
        this.rejectCalibrate = this.rejectCalibrate.bind(this);
        this.showRejectModal = this.showRejectModal.bind(this);
        this.hideRejectModal = this.hideRejectModal.bind(this);
    }
    componentDidMount() {
        request.get('/fnmt/Term/GetRejectedTerm/').query({page: 0, rows: 10}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                const pagination = {
                    total: data.total,
                    showSizeChanger: true
                };
                this.setState({terms: data.records, pagination: pagination, isFirstFetch: false});
            }
        });
    }
    typeForm(e) {
        let tempRecord = this.state.record;
        e.target.getAttribute('data-parent') === 'origin'
            ? tempRecord.origin[e.target.name] = e.target.value
            : tempRecord[e.target.name] = e.target.value
        this.setState({record: tempRecord});
    }
    showDetails(record) {
        let tempTerm = Immutable.fromJS(this.state.terms[record.key - 0]);
        let origin = this.state.terms[record.key - 0].origin.split('%$!**');
        origin.length > 1
            ? tempTerm = tempTerm.set('origin', {
                magazineName: origin[0],
                year: origin[1] || '',
                roll: origin[2] || '',
                issue: origin[3] || '',
                page: origin[4] || ''
            })
            : tempTerm = tempTerm.set('origin', {other: origin[0]});
        this.setState({showTermDetails: true, record: tempTerm.toJS(), useOtherOrigin: origin.length === 1});
    }
    hideDetails() {
        this.setState({showTermDetails: false, record: emptyRecord});
    }
    showRejectModal() {
        this.setState({showRejectModal: true});
    }
    hideRejectModal() {
        let tempRecord = this.state.record;
        tempRecord.rejectReason = '',
        this.setState({showRejectModal: false, record: tempRecord});
    }
    rejectCalibrate() {
        let term = this.state.record.term;
        let data = {
            term: term,
            reason: this.state.record.rejectReason
        }
        this.setState({commitLoading: true});
        request.post('/fnmt/Term/RejectTerm').type('form').send(data).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === '1'
                ? (() => {
                    message.success('修改成功～', 3);
                    this.hideDetails();
                    let pagination = {
                        current: 1,
                        pageSize: 10
                    }
                    this.fetchNewData(pagination);
                })()
                : (() => {
                    message.error(data.msg, 3);
                    this.setState({commitLoading: false});
                })()
        });
        this.setState({showRejectModal: false});
    }
    fetchNewData(pagination) {
        let pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({pagination: pager, loading: true});
        request.get('/fnmt/Term/GetRejectedTerm').query({page: pager.current, rows: pagination.pageSize}).end((err, res) => {
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
                    title: '创建人',
                    dataIndex: 'creator',
                    key: 'creator'
                }, {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time'
                }, {
                    title: '驳回原因',
                    dataIndex: 'reject_reason',
                    key: 'reject_reason'
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
                return {key: i, term: item.term, creator: item.creator, reject_reason: item.reject_reason, create_time: item.create_time}
            });
            const modalBottonGroup = [< Button type = "primary" size = "large" onClick = {
                    this.showRejectModal
                } > 重新编写驳回原因 < /Button >,<Button type="ghost" size="large" onClick={this.hideDetails}> 返回 </Button >];
            const rejectButtonGroup = [< Button type = "primary" size = "large" onClick = {
                    this.rejectCalibrate
                } > 确认修改 < /Button>,<Button type="primary" size="large" onClick={this.hideRejectModal}> 取消 </Button >];
            return (
                <div>
                    <Card title="被驳回的单词" style={{
                        width: '100%'
                    }}>
                        <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
                    </Card>
                    <Modal title="驳回原因" visible={this.state.showRejectModal} onCancel={this.hideRejectModal} width={'45%'} footer={rejectButtonGroup}>
                        <Input name="rejectReason" type="textarea" placeholder="请输入驳回原因以方便词条创建者修改～ " onChange={this.typeForm} value={this.state.record.rejectReason}/>
                    </Modal>
                    <Modal title="单词详情" visible={this.state.showTermDetails} onCancel={this.hideDetails} width={'80%'} footer={modalBottonGroup}>
                        <Form horizontal style={{
                            width: '85%',
                            'borderRight': 'solid 1px #d9d9d9',
                            paddingRight: '1%'
                        }}>
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
                            {this.state.useOtherOrigin
                                ? <Row style={{
                                        borderBottom: '1px solid #e9e9e9',
                                        marginBottom: '20px'
                                    }}>
                                        <Col span={24}>
                                            <FormItem label="其他" labelCol={{
                                                span: 2
                                            }} wrapperCol={{
                                                span: 16
                                            }}>
                                                <p>{this.state.record.origin.other}</p>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                : <Row>
                                    <Col span={12}>
                                        <FormItem label="杂志名称" labelCol={{
                                            span: 4
                                        }} wrapperCol={{
                                            span: 14
                                        }}>
                                            <p>{this.state.record.origin.magazineName}</p>
                                        </FormItem>
                                    </Col>
                                </Row>}
                            {this.state.useOtherOrigin
                                ? false
                                : <Row style={{
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
                                </Row>}
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
                        <div style={{
                            width: '15%',
                            display: 'inline-block',
                            position: 'absolute',
                            right: '0',
                            top: '66px'
                        }}>
                            <h4>驳回原因：</h4>
                            <p>{this.state.record.reject_reason}</p>
                        </div>
                    </Modal>
                </div >
            )
        } else
            return false

    }
}
