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
    Select,
    message
} from 'antd';

import {pronunciation, yearSelect} from '../termConfig.js';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
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
            commitLoading: false,
            tempPronun: '',
            tempPronuns: []
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
        tempRecord[key] === undefined
            ? tempRecord.origin[key] = e
            : tempRecord[key] = e
        this.setState({record: tempRecord});
    }
    choosePronun(value) {
        this.setState({tempPronun: value});
    }
    addPronun(e) {
        e.preventDefault();
        if (this.state.tempPronun) {
            let tempPronuns = this.state.tempPronuns;
            tempPronuns.push(this.state.tempPronun);
            let tempRecord = this.state.record;
            tempRecord.pronunciation = tempPronuns.join('');
            this.setState({tempPronuns: tempPronuns, record: tempRecord});
        }
    }
    removePronun(e) {
        e.preventDefault();
        let tempPronuns = this.state.tempPronuns;
        tempPronuns.pop();
        let tempRecord = this.state.record;
        tempRecord.pronunciation = tempPronuns.join('');
        this.setState({tempPronuns: tempPronuns, record: tempRecord});
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
        this.setState({showTermDetails: false, record: emptyRecord, tempPronuns: [],tempPronun: ''});
    }
    commitModify() {
        let tempRecord = this.state.record;
        let origin = '';
        for (let key of Object.keys(tempRecord.origin)) {
            origin = origin + ',' + tempRecord.origin[key];
        }
        tempRecord.origin = origin.replace(',', '');
        this.setState({commitLoading: true});
        request.post('/termdemo/Term/ModifyTerm').type('form').send(tempRecord).end((err, res) => {
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
                                        <Input name="term" value={this.state.record.term} onChange={this.typeForm} onChange={this.typeForm}/>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="词性" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 6
                                    }}>
                                        <Select name="term_char" value={this.state.record.term_char} onChange={this.selectFormItem.bind(this, 'term_char')}>
                                            <Option value="n.">n.</Option>
                                            <Option value="adj.">adj.</Option>
                                            <Option value="v.">v.</Option>
                                            <Option value="vt.">vt.</Option>
                                            <Option value="vi.">vi.</Option>
                                            <Option value="adv.">adv.</Option>
                                        </Select>
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
                                        <Col span={14}>
                                            <p>{this.state.record.pronunciation
                                                    ? '[' + this.state.record.pronunciation + ']'
                                                    : '请在右侧下拉框选择单个音标逐次添加'}
                                            </p>
                                        </Col>
                                        <Col span={4}>
                                            <Select onChange={this.choosePronun.bind(this)}>
                                                {pronunciation.map((item) => {
                                                    return (
                                                        <Option key={item} value={item}>{item}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </Col>
                                        <Col span={6}>
                                            <ButtonGroup style={{
                                                marginLeft: '4px',
                                                marginTop: '2px'
                                            }}>
                                                <Button type="primary" size="large" icon="plus-square-o" onClick={this.addPronun.bind(this)}></Button>
                                                <Button type="primary" size="large" icon="minus-square-o" onClick={this.removePronun.bind(this)}></Button>
                                            </ButtonGroup>
                                        </Col>
                                        <Input type="hidden" name="pronunciation" value={this.state.record.pronunciation}/>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="中文翻译" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 18
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
                                    <Select name="year" value={this.state.record.origin.year} onChange={this.selectFormItem.bind(this, 'year')}>
                                        {yearSelect.map((year) => {
                                            return (
                                                <Option key={year} value={year}>{year}</Option>
                                            )
                                        })}
                                    </Select>
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
