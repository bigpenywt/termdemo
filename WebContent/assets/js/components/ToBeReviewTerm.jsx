import 'babel-polyfill';
import React from 'react';
import request from 'superagent';
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
            modifyTerm: false,
            isFirstFetch: true,
            commitLoading: false,
            commitUrl: this.props.route.author === 'me'
                ? '/termdemo/Term/ModifyTerm'
                : ''
        }
        this.hideDetails = this.hideDetails.bind(this);
        this.fetchNewData = this.fetchNewData.bind(this);
        this.reEditTerm = this.reEditTerm.bind(this);
        this.typeForm = this.typeForm.bind(this);
        this.commitModify = this.commitModify.bind(this);
    }
    componentDidMount() {
        request.get('/termdemo/Term/GetCreateTerm/').query({status: 0, page: 0, rows: 10}).end((err, res) => {
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
        let tempTerm = this.state.terms[record.key - 0];
        tempTerm.key = record.key;
        let origin = tempTerm.origin.split(',');
        tempTerm.origin = {
            magazineName: origin[0],
            year: origin[1] || '',
            roll: origin[2] || '',
            issue: origin[3] || '',
            page: origin[4] || ''
        }
        this.setState({showTermDetails: true, modifyTerm: true, record: tempTerm});
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
    deleteTerm(index) {
        console.log(index);
    }
    showDetails(record) {
        let tempTerm = this.state.terms[record.key - 0];
        tempTerm.key = record.key;
        let origin = tempTerm.origin.split(',');
        tempTerm.origin = {
            magazineName: origin[0],
            year: origin[1] || '',
            roll: origin[2] || '',
            issue: origin[3] || '',
            page: origin[4] || ''
        }
        this.setState({showTermDetails: true, record: tempTerm});
    }
    hideDetails() {
        this.setState({showTermDetails: false, modifyTerm: false, record: emptyRecord});
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
                    this.fetchNewData();
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
        request.get('/termdemo/Term/GetCreateTerm/').query({status: 0, page: pager.current, rows: pagination.pageSize}).end((err, res) => {
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
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time'
                }, {
                    title: '英文定义',
                    dataIndex: 'definition',
                    key: 'definition'
                }, {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            <a href="javascript:void(0);" onClick={this.reEditItemTerm.bind(this, record)}>重新编辑</a>
                            <span className="ant-divider"/>
                            <Popconfirm title="确定删除这条单词？" onConfirm={this.deleteTerm.bind(this, record.key)} okText="确定" cancelText="取消">
                                <a href="javascript:void(0);">删除</a>
                            </Popconfirm>
                        </span>
                    )
                }
            ];
            const data = this.state.terms.map((item, i) => {
                return {key: i, term: item.term, create_time: item.create_time, definition: item.definition}
            });
            const modalBottonGroup = [< Button type = "ghost" size = "large" onClick = {
                    this.hideDetails
                } > 返回 < /Button>,this.state.modifyTerm?<Button type="primary" size="large" onClick={this.commitModify}> 提交修改 </Button >: <Button type="primary" size="large" onClick={this.reEditTerm}>
                    重新编辑
                </Button >]
            return (
                <div>
                    <Card title="待校验的单词（点击单词名可查看单词详细信息）" style={{
                        width: '100%'
                    }}>
                        <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
                    </Card>
                    <Modal title="单词详情" visible={this.state.showTermDetails} onCancel={this.hideDetails} width={'75%'} footer={modalBottonGroup}>
                        <Form horizontal>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="条目" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <Input disabled name="term" value={this.state.record.term}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="词性" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        {this.state.modifyTerm
                                            ? <Select name="term_char" value={this.state.record.term_char} onChange={this.selectFormItem.bind(this, 'term_char')}>
                                                    <Option value="n">名词.n</Option>
                                                    <Option value="adj">形容词.adj</Option>
                                                </Select>
                                            : <Select disabled name="term_char" value={this.state.record.term_char}>
                                                <Option value="n">名词.n</Option>
                                                <Option value="adj">形容词.adj</Option>
                                            </Select>}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="发音" labelCol={{
                                        span: 5
                                    }} wrapperCol={{
                                        span: 14
                                    }}>{this.state.modifyTerm
                                            ? <Input name="pronunciation" onChange={this.typeForm} value={this.state.record.pronunciation}/>
                                            : <Input disabled name="pronunciation" value={this.state.record.pronunciation}/>}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="中文翻译" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>{this.state.modifyTerm
                                            ? <Input name="translation" onChange={this.typeForm} value={this.state.record.translation}/>
                                            : <Input disabled name="translation" value={this.state.record.translation}/>}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>首次来源：</Row>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="杂志名称" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>{this.state.modifyTerm
                                            ? <Input data-parent="origin" name="magazineName" onChange={this.typeForm} value={this.state.record.origin.magazineName}/>
                                            : <Input disabled data-parent="origin" name="magazineName" onChange={this.typeForm} value={this.state.record.origin.magazineName}/>}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="年份" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        {this.state.modifyTerm
                                            ? <Input data-parent="origin" name="year" onChange={this.typeForm} value={this.state.record.origin.year}/>
                                            : <Input disabled data-parent="origin" name="year" onChange={this.typeForm} value={this.state.record.origin.year}/>}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="卷号" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        {this.state.modifyTerm
                                            ? <Input data-parent="origin" name="roll" onChange={this.typeForm} value={this.state.record.origin.roll}/>
                                            : <Input disabled data-parent="origin" name="roll" onChange={this.typeForm} value={this.state.record.origin.roll}/>}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="期号" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        {this.state.modifyTerm
                                            ? <Input data-parent="origin" name="issue" onChange={this.typeForm} value={this.state.record.origin.issue}/>
                                            : <Input disabled data-parent="origin" name="issue" onChange={this.typeForm} value={this.state.record.origin.issue}/>}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="页码" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        {this.state.modifyTerm
                                            ? <Input data-parent="origin" name="page" onChange={this.typeForm} value={this.state.record.origin.page}/>
                                            : <Input disabled data-parent="origin" name="page" onChange={this.typeForm} value={this.state.record.origin.page}/>}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="英文定义" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 19
                                    }}>
                                        {this.state.modifyTerm
                                            ? <Input type="textarea" name="definition" onChange={this.typeForm} value={this.state.record.definition}/>
                                            : <Input disabled type="textarea" name="definition" value={this.state.record.definition}/>}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="定义来源" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 19
                                    }}>{this.state.modifyTerm
                                            ? <Input type="textarea" name="source" onChange={this.typeForm} value={this.state.record.source}/>
                                            : <Input disabled type="textarea" name="source" value={this.state.record.source}/>}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18}>
                                    <FormItem label="示例" labelCol={{
                                        span: 2
                                    }} wrapperCol={{
                                        span: 19
                                    }}>{this.state.modifyTerm
                                            ? <Input type="textarea" name="example" onChange={this.typeForm} value={this.state.record.example}/>
                                            : <Input disabled type="textarea" name="example" value={this.state.record.example}/>}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18}>
                                    <FormItem label="翻译理据" labelCol={{
                                        span: 2
                                    }} wrapperCol={{
                                        span: 19
                                    }}>{this.state.modifyTerm
                                            ? <Input type="textarea" name="basis" onChange={this.typeForm} value={this.state.record.basis}/>
                                            : <Input disabled type="textarea" name="basis" value={this.state.record.basis}/>}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </div>
            )
        } else
            return false

    }
}
