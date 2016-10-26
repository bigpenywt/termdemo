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
                origin: '',
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
        tempRecord[e.target.name] = e.target.value
        this.setState({ record: tempRecord })
    }
    creatTerm(e) {
        e.preventDefault();
        request.post('/termdemo/Term/SaveTerm').type('form').send(this.state.record).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === '1'
                ? (() => {
                    message.success('添加成功～（可以在「校验操作」－>「待校验的单词」中查看单词）', 3);
                    let emptyRecord = {
                        term: '',
                        term_char: '',
                        definition: '',
                        origin: '',
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
                            <Col span={6}>
                                <FormItem label="条目" labelCol={{
                                    span: 6
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
                                span: 6
                            }} wrapperCol={{
                                span: 14
                            }}>
                                <Select name="term_char" value={this.state.record.term_char} onChange={this.typeForm}>
                                  <Option value="n">名词.n</Option>
                                  <Option value="adj">形容词.adj</Option>
                                </Select>
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="发音" labelCol={{
                                span: 5
                            }} wrapperCol={{
                                span: 14
                            }}>
                                <Input name="pronunciation" value={this.state.record.pronunciation} onChange={this.typeForm}/>
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem label="中文翻译" labelCol={{
                                span: 6
                            }} wrapperCol={{
                                span: 14
                            }}>
                                <Input name="translation" value={this.state.record.translation} onChange={this.typeForm}/>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>首次来源</Row>
                        <Row>
                          <Col span={6}>
                              <FormItem label="杂志名称" labelCol={{
                                  span: 6
                              }} wrapperCol={{
                                  span: 14
                              }}>
                                  <Input name="magazineName" value={this.state.record.origin} onChange={this.typeForm}/>
                              </FormItem>
                          </Col>
                          <Col span={4}>
                              <FormItem label="年份" labelCol={{
                                  span: 6
                              }} wrapperCol={{
                                  span: 14
                              }}>
                                  <Input name="year" value={this.state.record.origin} onChange={this.typeForm}/>
                              </FormItem>
                          </Col>
                          <Col span={4}>
                              <FormItem label="卷号" labelCol={{
                                  span: 6
                              }} wrapperCol={{
                                  span: 14
                              }}>
                                  <Input name="roll" value={this.state.record.origin} onChange={this.typeForm}/>
                              </FormItem>
                          </Col>
                          <Col span={4}>
                              <FormItem label="期号" labelCol={{
                                  span: 6
                              }} wrapperCol={{
                                  span: 14
                              }}>
                                  <Input name="issue" value={this.state.record.origin} onChange={this.typeForm}/>
                              </FormItem>
                          </Col>
                          <Col span={4}>
                              <FormItem label="页码" labelCol={{
                                  span: 6
                              }} wrapperCol={{
                                  span: 14
                              }}>
                                  <Input name="page" value={this.state.record.origin} onChange={this.typeForm}/>
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
                                <Input type="textarea" name="definition" value={this.state.record.definition} onChange={this.typeForm}/>
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem label="定义来源" labelCol={{
                                span: 3
                            }} wrapperCol={{
                                span: 19
                            }}>
                                <Input type="textarea" name="source" value={this.state.record.source} onChange={this.typeForm}/>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={18}>
                            <FormItem label="示例" labelCol={{
                                span: 2
                            }} wrapperCol={{
                                span: 19
                            }}>
                                <Input type="textarea" name="example" value={this.state.record.example} onChange={this.typeForm}/>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={18}>
                            <FormItem label="翻译理据" labelCol={{
                                span: 2
                            }} wrapperCol={{
                                span: 19
                            }}>
                                <Input type="textarea" name="basis" value={this.state.record.basis} onChange={this.typeForm}/>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <FormItem wrapperCol={{
                              span: 16,
                          }} style={{
                              marginTop: 24
                          }}>
                              <Button type="primary" htmlType="submit">新建单词</Button>
                          </FormItem>
                        </Row>
                    </Form>
                </Card>
            </div>
        )
    }
}
