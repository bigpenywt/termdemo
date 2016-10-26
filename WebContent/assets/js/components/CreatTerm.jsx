import React from 'react';
import request from 'superagent';
import {
    Card,
    Form,
    Input,
    Row,
    Col,
    Button,
    Table,
    message
} from 'antd';
const FormItem = Form.Item;

export default class CreatTerm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: {
                term: '',
                term_char: '',
                definition: '',
                origin: '',
                pronunciation: '',
                example: '',
                source: '',
                // status: 0,
                translation: '',
                basis: ''
            }
        },
        this.typeForm = this.typeForm.bind(this);
        this.creatTerm = this.creatTerm.bind(this);
    }
    renderRecordInfo() {
        return (
            <Row>
                <Col span={6}>
                    驳回人
                </Col>
                <Col span={6}>审核时间</Col>
                <Col span={6}>创建时间</Col>
                <Col span={6}>驳回原因</Col>
            </Row>
        )
    }
    typeForm(e) {
        let tempRecord = this.state.record;
        tempRecord[e.target.name] = e.target.value
        this.setState({record: tempRecord})
    }
    creatTerm(e) {
        e.preventDefault();
        request.post('/termdemo/Term/SaveTerm').type('form').send(this.state.record).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === 1
                ? message.success(data.msg, 3)
                : message.error(data.msg, 3);
        });
    }
    render() {
        return (
            <div>
                <Card title="填写属性" style={{
                    width: '100%'
                }}>
                    <Form horizontal onSubmit={this.creatTerm}>
                        <Row>
                            <Col span={8}>
                                <FormItem label="term" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input name="term" value={this.state.record.term} onChange={this.typeForm}/>
                                </FormItem>
                                <FormItem label="character" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input name="term_char" value={this.state.record.term_char} onChange={this.typeForm}/>
                                </FormItem>
                                <FormItem label="definition" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input type="textarea" name="definition" value={this.state.record.definition} onChange={this.typeForm}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="origin" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input name="origin" value={this.state.record.origin} onChange={this.typeForm}/>
                                </FormItem>
                                <FormItem label="pronunciation" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input name="pronunciation" value={this.state.record.pronunciation} onChange={this.typeForm}/>
                                </FormItem>
                                <FormItem label="example" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input type="textarea" name="example" value={this.state.record.example} onChange={this.typeForm}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="source" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input name="source" value={this.state.record.source} onChange={this.typeForm}/>
                                </FormItem>
                                {/* <FormItem label="status" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input name="status" value={this.state.record.status} onChange={this.typeForm}/>
                                </FormItem> */}
                                <FormItem label="translation" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input type="textarea" name="translation" value={this.state.record.translation} onChange={this.typeForm}/>
                                </FormItem>
                                <FormItem label="basis" labelCol={{
                                    span: 10
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input type="textarea" name="basis" value={this.state.record.basis} onChange={this.typeForm}/>
                                </FormItem>
                                <FormItem wrapperCol={{
                                    span: 16,
                                    offset: 6
                                }} style={{
                                    marginTop: 24
                                }}>
                                    <Button type="primary" htmlType="submit">新建单词</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        {this.renderRecordInfo()}
                    </Form>
                </Card>
                <Card title="词条记录">
                    {/* <Table></Table> */}
                </Card>
            </div>
        )
    }
}
