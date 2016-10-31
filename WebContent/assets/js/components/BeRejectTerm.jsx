import 'babel-polyfill';
import React from 'react';
import request from 'superagent';
import Immutable from 'immutable';
import {
    Table,
    Icon,
    Card,
    Popconfirm,
    Modal,
    Button,
    Form,
    Input,
    Row,
    Col,
    Select,
    Spin,
    message
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
        page: ''
    },
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
            commitLoading: false
        }
        this.hideDetails = this.hideDetails.bind(this);
        this.fetchNewData = this.fetchNewData.bind(this);
        this.typeForm = this.typeForm.bind(this);
        this.commitModify = this.commitModify.bind(this);
    }
    componentDidMount() {
        request.get('/termdemo/Term/GetCreateTerm/').query({status: 2, page: 0, rows: 10}).end((err, res) => {
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
    selectFormItem(key, e) {
        let tempRecord = this.state.record;
        tempRecord[key] = e;
        this.setState({record: tempRecord});
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
    commitModify() {
        let tempRecord = this.state.record;
        let origin = '';
        for (let key of Object.keys(tempRecord.origin)) {
            origin = origin + ',' + tempRecord.origin[key];
        }
        tempRecord.origin = origin.replace(',', '');
        this.setState({commitLoading: true});
        request.post('/termdemo/Term/ModifyTerm ').type('form').send(tempRecord).end((err, res) => {
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
    }
    fetchNewData(pagination) {
        let pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({pagination: pager, loading: true});
        request.get('/termdemo/Term/GetCreateTerm/').query({status: 2, page: pager.current, rows: pagination.pageSize}).end((err, res) => {
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
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time'
                }, {
                    title: '驳回人',
                    dataIndex: 'reject_user',
                    key: 'reject_user'
                }, {
                    title: '驳回原因',
                    dataIndex: 'reject_reason',
                    key: 'reject_reason'
                }, {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            <a href="javascript:void(0);" onClick={this.showDetails.bind(this, record)}>重新编辑</a>
                        </span>
                    )

                }
            ];
            const data = this.state.terms.map((item, i) => {
                return {key: i, term: item.term, create_time: item.create_time, reject_user: item.reject_user, reject_reason: item.reject_reason}
            });
            const modalBottonGroup = [< Button type = "ghost" size = "large" onClick = {
                    this.hideDetails
                } > 返回 < /Button>,<Button type="primary" size="large" onClick={this.commitModify}> 提交修改 </Button >]

            return (
                <div>
                    <Card title="被驳回的单词" style={{
                        width: '100%'
                    }}>
                        <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
                    </Card>
                    <Modal title="单词详情" visible={this.state.showTermDetails} onCancel={this.hideDetails} width={'75%'} footer={modalBottonGroup}>
                        <Form horizontal style={{
                            width: '80%',
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
                                        <Input disabled name="term" value={this.state.record.term} onChange={this.typeForm}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="词性" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <Select name="term_char" value={this.state.record.term_char} onChange={this.selectFormItem.bind(this, 'term_char')}>
                                            <Option value="n">名词.n</Option>
                                            <Option value="adj">形容词.adj</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="发音" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <Input name="pronunciation" value={this.state.record.pronunciation} onChange={this.typeForm}/>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="中文翻译" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <Input name="translation" value={this.state.record.translation} onChange={this.typeForm}/>
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
                                        <Input data-parent="origin" name="magazineName" value={this.state.record.origin.magazineName} onChange={this.typeForm}/>
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
                                        <Input data-parent="origin" name="year" value={this.state.record.origin.year} onChange={this.typeForm}/>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="卷号" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <Input data-parent="origin" name="roll" value={this.state.record.origin.roll} onChange={this.typeForm}/>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="期号" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <Input data-parent="origin" name="issue" value={this.state.record.origin.issue} onChange={this.typeForm}/>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="页码" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 16
                                    }}>
                                        <Input data-parent="origin" name="page" value={this.state.record.origin.page} onChange={this.typeForm}/>
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
                                        <Input type="textarea" name="definition" value={this.state.record.definition} onChange={this.typeForm}/>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="定义来源" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 18
                                    }}>
                                        <Input type="textarea" name="source" value={this.state.record.source} onChange={this.typeForm}/>
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
                                        <Input type="textarea" name="example" value={this.state.record.example} onChange={this.typeForm}/>
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
                                        <Input type="textarea" name="basis" value={this.state.record.basis} onChange={this.typeForm}/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <div style={{
                            width: '18%',
                            display: 'inline-block',
                            position: 'absolute',
                            right: '0',
                            top: '66px'
                        }}>
                            <h5>驳回原因：</h5>
                            <p>{this.state.record.reject_reason}</p>
                        </div>
                    </Modal>
                </div >
            )
        } else
            return false

    }
}
