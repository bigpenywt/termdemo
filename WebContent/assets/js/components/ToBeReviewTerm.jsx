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
const Option = Select.Option;
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
            modifyTerm: false,
            isFirstFetch: true,
            commitLoading: false,
            showRejectModal: false,
            operateByMe: this.props.author === 'me',
            getUrl: this.props.author === 'me'
                ? '/termdemo/Term/GetCreateTerm/'
                : '/termdemo/Term/GettbReviewTerm',
            commitUrl: this.props.author === 'me'
                ? '/termdemo/Term/ModifyTerm'
                : '',
            tempPronun: '',
            tempPronuns: [],
            magazineList: []
        }
        this.hideDetails = this.hideDetails.bind(this);
        this.fetchNewData = this.fetchNewData.bind(this);
        this.reEditTerm = this.reEditTerm.bind(this);
        this.typeForm = this.typeForm.bind(this);
        this.commitModify = this.commitModify.bind(this);
        this.passCalibrate = this.passCalibrate.bind(this);
        this.rejectCalibrate = this.rejectCalibrate.bind(this);
        this.showRejectModal = this.showRejectModal.bind(this);
        this.hideRejectModal = this.hideRejectModal.bind(this);
    }
    componentDidMount() {
        request.get('/termdemo/Magazine/ListAll').end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                this.setState({magazineList: data.magazines});
            } else
                this.setState({magazineList: []});
            }
        )
        request.get(this.state.getUrl).query({status: 0, page: 0, rows: 10}).end((err, res) => {
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
    reEditTerm() {
        this.setState({modifyTerm: true});
    }
    reEditItemTerm(record) {
        let tempTerm = Immutable.fromJS(this.state.terms[record.key - 0]);
        let origin = this.state.terms[record.key - 0].origin.split(',');
        tempTerm = tempTerm.set('origin', {
            magazineName: origin[0],
            year: origin[1] || '',
            roll: origin[2] || '',
            issue: origin[3] || '',
            page: origin[4] || ''
        });
        this.setState({showTermDetails: true, modifyTerm: true, record: tempTerm.toJS()});
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
    deleteTerm(record) {
        request.post('/termdemo/Term/DeleteTerm').type('form').send({term: record.term}).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === '1'
                ? (() => {
                    message.success('成功删除单词～', 3);
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
        this.setState({showTermDetails: false, modifyTerm: false, record: emptyRecord, tempPronuns: [], tempPronun: ''});
    }
    showRejectModal() {
        this.setState({showRejectModal: true});
    }
    hideRejectModal() {
        let tempRecord = this.state.record;
        tempRecord.rejectReason = '',
        this.setState({showRejectModal: false, record: tempRecord});
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
    commitModify() {
        let tempRecord = this.state.record;
        let origin = '';
        for (let key of Object.keys(tempRecord.origin)) {
            origin = origin + ',' + tempRecord.origin[key];
        }
        tempRecord.origin = origin.replace(',', '');
        this.setState({commitLoading: true});
        request.post(this.state.commitUrl).type('form').send(tempRecord).end((err, res) => {
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
    passCalibrate() {
        let term = this.state.record.term;
        this.setState({commitLoading: true});
        request.post('/termdemo/Term/ReviewTerm').type('form').send({term: term}).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === '1'
                ? (() => {
                    message.success('提交成功，该词已通过校验～', 3);
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
    rejectCalibrate() {
        let term = this.state.record.term;
        let data = {
            term: term,
            reason: this.state.record.rejectReason
        }
        this.setState({commitLoading: true});
        request.post('/termdemo/Term/RejectTerm').type('form').send(data).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === '1'
                ? (() => {
                    message.success('提交成功，可在已驳回的单词中查看～', 3);
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
        request.get(this.state.getUrl).query({status: 0, page: pager.current, rows: pagination.pageSize}).end((err, res) => {
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
                    key: 'term',
                    render: (text, record) => <a href="javascript:void(0);" onClick={this.showDetails.bind(this, record)}>{text}</a>
                }, {
                    title: '创建人',
                    dataIndex: 'creator',
                    key: 'creator'
                }, {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time'
                }, {
                    title: '操作',
                    key: 'action',
                    render: (record) => {
                        return this.state.operateByMe
                            ? (
                                <span>
                                    <a href="javascript:void(0);" onClick={this.reEditItemTerm.bind(this, record)}>重新编辑</a>
                                    <span className="ant-divider"/>
                                    <Popconfirm title="确定删除这条单词？" onConfirm={this.deleteTerm.bind(this, record)} okText="确定" cancelText="取消">
                                        <a href="javascript:void(0);">删除</a>
                                    </Popconfirm>
                                </span>
                            )
                            : (
                                <span>
                                    <a href="javascript:void(0);" onClick={this.showDetails.bind(this, record)}>校验</a>
                                </span>
                            )
                    }
                }
            ];
            const data = this.state.terms.map((item, i) => {
                return {key: i, term: item.term, create_time: item.create_time, creator: item.creator}
            });
            const modalButtonGroup = this.state.operateByMe
                ? [< Button type = "ghost" size = "large" onClick = {
                        this.hideDetails
                    } > 返回 < /Button>,this.state.modifyTerm?<Button type="primary" size="large" onClick={this.commitModify}> 提交修改 </Button >: <Button type="primary" size="large" onClick={this.reEditTerm}>
                        重新编辑
                    </Button >]
                : [ < Button type = "primary" size = "large" onClick = {
                        this.passCalibrate
                    } > 校验通过 < /Button>,<Button type="primary" size="large" onClick={this.showRejectModal}> 驳回 </Button >, < Button type = "ghost" size = "large" onClick = {
                        this.hideDetails
                    } > 取消 < /Button >]
            return (
                <div>
                    <Card title={this.state.operateByMe?"待校验的单词（点击单词名可查看单词详细信息）":"待校验的单词（点击单词名也可进行校验操作）"} style={{
                        width: '100%'
                    }}>
                        <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/ > </Card> < Modal title = "单词详情" visible = {
                        this.state.showTermDetails
                    }
                    onCancel = {
                        this.hideDetails
                    }
                    width = {
                        '75%'
                    }
                    footer = {
                        modalButtonGroup
                    } > <Form horizontal>
                        <Row>
                            <Col span={12}>
                                <FormItem label="条目" labelCol={{
                                    span: 4
                                }} wrapperCol={{
                                    span: 18
                                }}>{this.state.modifyTerm
                                        ? <Input name="term" value={this.state.record.term} onChange={this.typeForm}/>
                                        : <p>{this.state.record.term}</p>}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="词性" labelCol={{
                                    span: 4
                                }} wrapperCol={{
                                    span: 6
                                }}>
                                    {this.state.modifyTerm
                                        ? <Select name="term_char" value={this.state.record.term_char} onChange={this.selectFormItem.bind(this, 'term_char')}>
                                                <Option value="n.">n.</Option>
                                                <Option value="adj.">adj.</Option>
                                                <Option value="v.">v.</Option>
                                                <Option value="vt.">vt.</Option>
                                                <Option value="vi.">vi.</Option>
                                                <Option value="adv.">adv.</Option>
                                            </Select>
                                        : <p>
                                            {this.state.record.term_char}
                                        </p>}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            {this.state.modifyTerm
                                ? <Col span={12}>
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
                                : <Col span={12}>
                                    <FormItem label="发音" labelCol={{
                                        span: 4
                                    }} wrapperCol={{
                                        span: 18
                                    }}>
                                        <p>{'[' + this.state.record.pronunciation + ']'}</p>
                                    </FormItem>
                                </Col>}
                            <Col span={12}>
                                <FormItem label="中文翻译" labelCol={{
                                    span: 4
                                }} wrapperCol={{
                                    span: 18
                                }}>{this.state.modifyTerm
                                        ? <Input name="translation" onChange={this.typeForm} value={this.state.record.translation}/>
                                        : <p>{this.state.record.translation}</p>}
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
                                }}>{this.state.modifyTerm
                                        ? <Select name="magazineName" value={this.state.record.origin.magazineName} onChange={this.selectFormItem.bind(this, 'magazineName')}>
                                                {this.state.magazineList.map((magazine) => {
                                                    return (
                                                        <Option key={magazine.name} value={magazine.name}>{magazine.name}</Option>
                                                    )
                                                })}
                                            </Select>
                                        : <p>{this.state.record.origin.magazineName}</p>}
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
                                    {this.state.modifyTerm
                                        ? <Select name="year" value={this.state.record.origin.year} onChange={this.selectFormItem.bind(this, 'year')}>
                                                {yearSelect.map((year) => {
                                                    return (
                                                        <Option key={year} value={year}>{year}</Option>
                                                    )
                                                })}
                                            </Select>
                                        : <p>{this.state.record.origin.year}</p>}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="卷号" labelCol={{
                                    span: 8
                                }} wrapperCol={{
                                    span: 16
                                }}>
                                    {this.state.modifyTerm
                                        ? <Input data-parent="origin" name="roll" onChange={this.typeForm} value={this.state.record.origin.roll}/>
                                        : <p>{this.state.record.origin.roll}</p>}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="期号" labelCol={{
                                    span: 8
                                }} wrapperCol={{
                                    span: 16
                                }}>
                                    {this.state.modifyTerm
                                        ? <Input data-parent="origin" name="issue" onChange={this.typeForm} value={this.state.record.origin.issue}/>
                                        : <p>{this.state.record.origin.issue}</p>}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="页码" labelCol={{
                                    span: 8
                                }} wrapperCol={{
                                    span: 16
                                }}>
                                    {this.state.modifyTerm
                                        ? <Input data-parent="origin" name="page" onChange={this.typeForm} value={this.state.record.origin.page}/>
                                        : <p>{this.state.record.origin.page}</p>}
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
                                    {this.state.modifyTerm
                                        ? <Input type="textarea" name="definition" onChange={this.typeForm} value={this.state.record.definition}/>
                                        : <p>{this.state.record.definition}</p>}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="定义来源" labelCol={{
                                    span: 4
                                }} wrapperCol={{
                                    span: 18
                                }}>{this.state.modifyTerm
                                        ? <Input type="textarea" name="source" onChange={this.typeForm} value={this.state.record.source}/>
                                        : <p>{this.state.record.source}</p>}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem label="示例" labelCol={{
                                    span: 2
                                }} wrapperCol={{
                                    span: 16
                                }}>{this.state.modifyTerm
                                        ? <Input type="textarea" name="example" onChange={this.typeForm} value={this.state.record.example}/>
                                        : <p>{this.state.record.example}</p>}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem label="翻译理据" labelCol={{
                                    span: 2
                                }} wrapperCol={{
                                    span: 16
                                }}>{this.state.modifyTerm
                                        ? <Input type="textarea" name="basis" onChange={this.typeForm} value={this.state.record.basis}/>
                                        : <p>{this.state.record.basis}</p>}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form> < /Modal>
                    <Modal title="驳回原因" visible={this.state.showRejectModal} onCancel={this.hideRejectModal} width={'45%'} footer={[< Button type = "primary" size = "large" onClick = {
                            this.rejectCalibrate
                        } > 确认驳回 < /Button>,<Button type="primary" size="large" onClick={this.hideRejectModal}> 取消 </Button >]}>
                        <Input name="rejectReason" type="textarea" placeholder="请输入驳回原因以方便词条创建者修改～" onChange={this.typeForm} value={this.state.record.rejectReason}/ > </Modal> < /div>
            )
        } else
            return false

    }
}

ToBeReviewTerm.propTypes={
  author:React.PropTypes.string.isRequired
}
