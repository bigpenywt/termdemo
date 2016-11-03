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
    message,
    Select
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

export default class CreatTerm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: {
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
        },
        this.typeForm = this.typeForm.bind(this);
        this.creatTerm = this.creatTerm.bind(this);
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
    creatTerm(e) {
        e.preventDefault();
        let tempRecord = this.state.record;
        let origin = '';
        for (let key of Object.keys(tempRecord.origin)) {
            origin = origin + ',' + tempRecord.origin[key];
        }
        tempRecord.origin = origin.replace(',', '');
        request.post('/termdemo/Term/SaveTerm').type('form').send(tempRecord).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === '1'
                ? (() => {
                    message.success('添加成功～（可以在「校验操作」－>「待校验的单词」中查看单词）', 3);
                    let emptyRecord = {
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
                    this.setState({record: emptyRecord});
                })()
                : message.error(data.msg, 3);
        });
    }
    render() {
        return (
            <div>
                <Card title="填写新词属性" style={{
                    width: '100%'
                }}>
                    <Form horizontal onSubmit={this.creatTerm}>
                        <Row>
                            <Col span={12}>
                                <FormItem label="条目" labelCol={{
                                    span: 4
                                }} wrapperCol={{
                                    span: 14
                                }}>
                                    <Input name="term" value={this.state.record.term} onChange={this.typeForm}/>
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
                                        <Option value="n">n.</Option>
                                        <Option value="adj">adj.</Option>
                                        <Option value="v">v.</Option>
                                        <Option value="vt">vt.</Option>
                                        <Option value="vi">vi.</Option>
                                        <Option value="adv">adv.</Option>
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
                        <Row>
                            <Col span={24}>
                                <FormItem wrapperCol={{
                                    span: 24
                                }}>
                                    <Button style={{
                                        float: 'right'
                                    }} type="primary" htmlType="submit">新建单词</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        )
    }
}
