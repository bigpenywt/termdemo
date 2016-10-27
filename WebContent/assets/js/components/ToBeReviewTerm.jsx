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
    Select
} from 'antd';
const FormItem = Form.Item;

export default class ToBeReviewTerm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTermDetails: false,
            terms: [],
            termsTotal: 0,
            pagination: {},
            record: {},
            loading: false,
            modifyTerm: false
        }
        this.hideDetails = this.hideDetails.bind(this);
        this.fetchNewData = this.fetchNewData.bind(this);
        this.reEditTerm = this.reEditTerm.bind(this);
    }
    componentDidMount() {
        request.get('/termdemo/Term/GetCreateTerm/').query({status: 0, page: 0, rows: 10}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                const pagination = {
                    total: data.total,
                    showSizeChanger: true
                };
                this.setState({terms: data.records, pagination: pagination});
            }
        });
    }
    reEditTerm() {
        this.setState({modifyTerm: true});
    }
    deleteTerm(index) {
        console.log(index);
    }
    showDetails(record) {
        this.setState({
            showTermDetails: true,
            record: this.state.terms[record.key - 0]
        });
    }
    hideDetails() {
        this.setState({showTermDetails: false});
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
                this.setState({terms: data.records, pagination: pagination, loading: false});
            }
        });
    }
    render() {
        if (this.state.terms.length > 0) {
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
                            <a href="javascript:void(0);" onClick={this.reEditTerm.bind(this, record.key)}>重新编辑</a>
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
            return (
                <div>
                    <Card title="待校验的单词（点击单词名可查看单词详细信息）" style={{
                        width: '100%'
                    }}>
                        <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
                    </Card>
                    <Modal title="单词详情" visible={this.state.showTermDetails} onCancel={this.hideDetails} width={'75%'} footer={[< Button type = "ghost" size = "large" onClick = {
                            this.hideDetails
                        } > 返回 < /Button>, <Button type="primary" size="large" onClick={this.reEditTerm}> 重新编辑 </Button >]}>
                        <Form horizontal disabled onSubmit={this.creatTerm}>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="条目" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>{this.state.modifyTerm
                                            ? <Input name="term" value={this.state.record.term}/>
                                            : <Input disabled name="term" value={this.state.record.term}/>}
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
                                            ? <Select name="term_char" value={this.state.record.term_char}>
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
                                            ? <Input name="pronunciation" value={this.state.record.pronunciation}/>
                                            : <Input disabled name="pronunciation" value={this.state.record.pronunciation}/>}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="中文翻译" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>{this.state.modifyTerm
                                            ? <Input name="translation" value={this.state.record.translation}/>
                                            : <Input disabled name="translation" value={this.state.record.translation}/>}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>首次来源</Row>
                            {/* <Row>
                                <Col span={6}>
                                    <FormItem label="杂志名称" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <Input data-parent="origin" name="magazineName" value={this.state.record.origin.magazineName}/>
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="年份" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <Input data-parent="origin" name="year" value={this.state.record.origin.year}/>
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="卷号" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <Input data-parent="origin" name="roll" value={this.state.record.origin.roll}/>
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="期号" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <Input data-parent="origin" name="issue" value={this.state.record.origin.issue}/>
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="页码" labelCol={{
                                        span: 6
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <Input data-parent="origin" name="page" value={this.state.record.origin.page}/>
                                    </FormItem>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col span={12}>
                                    <FormItem label="英文定义" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 19
                                    }}>
                                        {this.state.modifyTerm
                                            ? <Input type="textarea" name="definition" value={this.state.record.definition}/>
                                            : <Input disabled type="textarea" name="definition" value={this.state.record.definition}/>}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="定义来源" labelCol={{
                                        span: 3
                                    }} wrapperCol={{
                                        span: 19
                                    }}>{this.state.modifyTerm
                                            ? <Input type="textarea" name="source" value={this.state.record.source}/>
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
                                            ? <Input type="textarea" name="example" value={this.state.record.example}/>
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
                                            ? <Input type="textarea" name="basis" value={this.state.record.basis}/>
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
