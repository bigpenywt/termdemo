import React from 'react';
import {Form, Input, Row, Col, Select} from 'antd';
const FormItem = Form.Item;

export default class ToBeReviewTermForm extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Form horizontal disabled>
                <Row>
                    <Col span={6}>
                        <FormItem label="条目" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 14
                        }}>{this.props.modifyTerm
                                ? <Input name="term" value={this.props.record.term}/>
                                : <Input disabled name="term" value={this.props.record.term}/>}
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
                            {this.props.modifyTerm
                                ? <Select name="term_char" value={this.props.record.term_char}>
                                        <Option value="n">名词.n</Option>
                                        <Option value="adj">形容词.adj</Option>
                                    </Select>
                                : <Select disabled name="term_char" value={this.props.record.term_char}>
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
                        }}>{this.props.modifyTerm
                                ? <Input name="pronunciation" value={this.props.record.pronunciation}/>
                                : <Input disabled name="pronunciation" value={this.props.record.pronunciation}/>}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem label="中文翻译" labelCol={{
                            span: 6
                        }} wrapperCol={{
                            span: 14
                        }}>{this.props.modifyTerm
                                ? <Input name="translation" value={this.props.record.translation}/>
                                : <Input disabled name="translation" value={this.props.record.translation}/>}
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
                    <Input data-parent="origin" name="magazineName" value={this.props.record.origin.magazineName}/>
                </FormItem>
            </Col>
            <Col span={4}>
                <FormItem label="年份" labelCol={{
                    span: 6
                }} wrapperCol={{
                    span: 14
                }}>
                    <Input data-parent="origin" name="year" value={this.props.record.origin.year}/>
                </FormItem>
            </Col>
            <Col span={4}>
                <FormItem label="卷号" labelCol={{
                    span: 6
                }} wrapperCol={{
                    span: 14
                }}>
                    <Input data-parent="origin" name="roll" value={this.props.record.origin.roll}/>
                </FormItem>
            </Col>
            <Col span={4}>
                <FormItem label="期号" labelCol={{
                    span: 6
                }} wrapperCol={{
                    span: 14
                }}>
                    <Input data-parent="origin" name="issue" value={this.props.record.origin.issue}/>
                </FormItem>
            </Col>
            <Col span={4}>
                <FormItem label="页码" labelCol={{
                    span: 6
                }} wrapperCol={{
                    span: 14
                }}>
                    <Input data-parent="origin" name="page" value={this.props.record.origin.page}/>
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
                            {this.props.modifyTerm
                                ? <Input type="textarea" name="definition" value={this.props.record.definition}/>
                                : <Input disabled type="textarea" name="definition" value={this.props.record.definition}/>}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="定义来源" labelCol={{
                            span: 3
                        }} wrapperCol={{
                            span: 19
                        }}>{this.props.modifyTerm
                                ? <Input type="textarea" name="source" value={this.props.record.source}/>
                                : <Input disabled type="textarea" name="source" value={this.props.record.source}/>}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                        <FormItem label="示例" labelCol={{
                            span: 2
                        }} wrapperCol={{
                            span: 19
                        }}>{this.props.modifyTerm
                                ? <Input type="textarea" name="example" value={this.props.record.example}/>
                                : <Input disabled type="textarea" name="example" value={this.props.record.example}/>}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                        <FormItem label="翻译理据" labelCol={{
                            span: 2
                        }} wrapperCol={{
                            span: 19
                        }}>{this.props.modifyTerm
                                ? <Input type="textarea" name="basis" value={this.props.record.basis}/>
                                : <Input disabled type="textarea" name="basis" value={this.props.record.basis}/>}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

ToBeReviewTermForm.propTypes = {
    record: React.PropTypes.object.isRequired,
    modifyTerm: React.PropTypes.bool
}

ToBeReviewTermForm.defaultProps = {
    modifyTerm: false
}
