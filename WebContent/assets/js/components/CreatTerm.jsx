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
    Select,
    Switch
} from 'antd';

import '../../../public/css/page/app/soft_keyboard.css'
import {yearSelect} from '../termConfig.js';

const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

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
                    page: '',
                    other: ''
                },
                pronunciation: '',
                example: '',
                source: '',
                translation: '',
                basis: ''
            },
            useOtherOrigin: false,
            tempPronun: '',
            tempPronuns: [],
            showKeyboard: false,
            magazineList: [],
            isFirstFetch: true
        },
        this.typeForm = this.typeForm.bind(this);
        this.creatTerm = this.creatTerm.bind(this);
        this.switchOrigin = this.switchOrigin.bind(this);
    }
    componentDidMount() {
        request.get('/fnmt/Magazine/ListAll').end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                this.setState({magazineList: data.magazines, isFirstFetch: false});
            } else
                this.setState({magazineList: [], isFirstFetch: false});
            }
        )
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
    switchOrigin(checked) {
        this.setState({useOtherOrigin: checked});
    }
    toggleKeyboard() {
        this.setState({
            showKeyboard: !this.state.showKeyboard
        });
    }
    addPronun(e) {
        e.preventDefault();
        let tempPronuns = this.state.tempPronuns;
        tempPronuns.push(e.target.innerHTML);
        let tempRecord = this.state.record;
        tempRecord.pronunciation = tempPronuns.join('');
        this.setState({tempPronuns: tempPronuns, record: tempRecord});
    }
    removePronun(e) {
        e.preventDefault();
        let tempPronuns = this.state.tempPronuns;
        tempPronuns.pop();
        let tempRecord = this.state.record;
        tempRecord.pronunciation = tempPronuns.join('');
        this.setState({tempPronuns: tempPronuns, record: tempRecord});
    }
    creatTerm(e) {
        e.preventDefault();
        let tempRecord = this.state.record;
        let origin = '';
        if (this.state.useOtherOrigin)
            tempRecord.origin = tempRecord.origin.other;
        else {
            delete tempRecord.origin.other
            for (let key of Object.keys(tempRecord.origin)) {
                origin = origin + '%$!**' + tempRecord.origin[key];
            }
            tempRecord.origin = origin.replace('%$!**', '');
        }
        request.post('/fnmt/Term/SaveTerm').type('form').send(tempRecord).end((err, res) => {
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
                    this.setState({record: emptyRecord, tempPronuns: [], tempPronun: ''});
                })()
                : message.error(data.msg, 3);
        });
    }
    render() {
        if (!this.state.isFirstFetch)
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
                                        span: 18
                                    }}>
                                        <Input name="term" value={this.state.record.term} onChange={this.typeForm}/>
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
                                        <Col span={18}>
                                            <p>{this.state.record.pronunciation
                                                    ? '[' + this.state.record.pronunciation + ']'
                                                    : '请在右侧下拉框选择单个音标逐次添加'}
                                            </p>
                                        </Col>
                                        <Col span={6}>
                                            <ButtonGroup style={{
                                                marginLeft: '4px',
                                                marginTop: '2px',
                                                float: 'right'
                                            }}>
                                                <Button type="primary" size="large" icon="calculator" onClick={this.toggleKeyboard.bind(this)}></Button>
                                                <Button type="primary" size="large" icon="minus-square-o" onClick={this.removePronun.bind(this)}></Button>
                                            </ButtonGroup>
                                        </Col>
                                        {this.state.showKeyboard
                                            ? <div className="sofe-keyboard" style={{
                                                    marginTop: '36px'
                                                }} onBlur={this.toggleKeyboard.bind(this)}>
                                                    <div className="IPAZone IPA">
                                                        <ul>
                                                            <li style={{
                                                                height: '4em'
                                                            }}>辅音</li>
                                                            <li onClick={this.addPronun.bind(this)}>p</li>
                                                            <li onClick={this.addPronun.bind(this)}>b</li>
                                                            <li onClick={this.addPronun.bind(this)}>t</li>
                                                            <li onClick={this.addPronun.bind(this)}>d</li>
                                                            <li onClick={this.addPronun.bind(this)}>k</li>
                                                            <li onClick={this.addPronun.bind(this)}>g</li>
                                                            <li onClick={this.addPronun.bind(this)}>f</li>
                                                            <li onClick={this.addPronun.bind(this)}>v</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#952;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#240;</li>
                                                            <li onClick={this.addPronun.bind(this)}>s</li>
                                                            <li onClick={this.addPronun.bind(this)}>z</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#643;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#658;</li>
                                                            <li onClick={this.addPronun.bind(this)}>h</li>
                                                            <li onClick={this.addPronun.bind(this)}>t&#643;</li>
                                                            <li onClick={this.addPronun.bind(this)}>d&#658;</li>
                                                            <li onClick={this.addPronun.bind(this)}>m</li>
                                                            <li onClick={this.addPronun.bind(this)}>n</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#331;</li>
                                                            <li onClick={this.addPronun.bind(this)}>l</li>
                                                            <li onClick={this.addPronun.bind(this)}>r</li>
                                                            <li onClick={this.addPronun.bind(this)}>j</li>
                                                            <li onClick={this.addPronun.bind(this)}>w</li>
                                                        </ul>
                                                        <div className="clear"></div>
                                                        <ul >
                                                            <li style={{
                                                                width: '4em'
                                                            }}>短元音</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#618;</li>
                                                            <li onClick={this.addPronun.bind(this)}>e</li>
                                                            <li onClick={this.addPronun.bind(this)}>&aelig;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#594;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#652;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#650;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#601;</li>
                                                            <li onClick={this.addPronun.bind(this)}>i</li>
                                                            <li onClick={this.addPronun.bind(this)}>u</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#603;</li>
                                                        </ul>
                                                        <div className="clear"></div>
                                                        <ul >
                                                            <li style={{
                                                                width: '4em'
                                                            }}>长元音</li>
                                                            <li onClick={this.addPronun.bind(this)}>i:</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#593;:</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#604;:</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#596;:</li>
                                                            <li onClick={this.addPronun.bind(this)}>u:</li>
                                                            <li style={{
                                                                float: 'right',
                                                                borderTop: '1px solid #eee'
                                                            }} onClick={this.addPronun.bind(this)}>)</li>
                                                            <li style={{
                                                                float: 'right',
                                                                borderTop: '1px solid #eee'
                                                            }} onClick={this.addPronun.bind(this)}>(</li>
                                                            <li style={{
                                                                float: 'right'
                                                            }} onClick={this.addPronun.bind(this)}>&#712;</li>
                                                            <li style={{
                                                                float: 'right',
                                                                borderLeft: '1px solid #eee'
                                                            }} onClick={this.addPronun.bind(this)}>&#716;</li>
                                                        </ul>
                                                        <div className="clear"></div>
                                                        <ul >
                                                            <li style={{
                                                                width: '4em'
                                                            }}>双元音</li>
                                                            <li onClick={this.addPronun.bind(this)}>e&#618;</li>
                                                            <li onClick={this.addPronun.bind(this)}>a&#618;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#594;&#618;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#601;&#650;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#593;&#650;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#618;&#601;</li>
                                                            <li onClick={this.addPronun.bind(this)}>e&#601;</li>
                                                            <li onClick={this.addPronun.bind(this)}>&#650;&#601;</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            : null}
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
                                    <FormItem label="是否使用其他来源" labelCol={{
                                        span: 8
                                    }} wrapperCol={{
                                        span: 14
                                    }}>
                                        <Switch defaultChecked={this.state.useOtherOrigin} onChange={this.switchOrigin}/>
                                    </FormItem>
                                </Col>
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
                                                <Input type="textarea" data-parent="origin" name="other" value={this.state.record.origin.other} onChange={this.typeForm}/>
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
                                            <Select name="magazineName" value={this.state.record.origin.magazineName} onChange={this.selectFormItem.bind(this, 'magazineName')}>
                                                {this.state.magazineList.map((magazine) => {
                                                    return (
                                                        <Option key={magazine.name} value={magazine.name}>{magazine.name}</Option>
                                                    )
                                                })}
                                            </Select>
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
                                </Row>}
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
        return false;
    }
}
