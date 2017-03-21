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
    message,
    Switch
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
        page: '',
        other: ''
    },
    useOtherOrigin: false,
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
                ? '/fnmt/Term/GetCreateTerm/'
                : '/fnmt/Term/GettbReviewTerm',
            commitUrl: this.props.author === 'me'
                ? '/fnmt/Term/ModifyTerm'
                : '',
            showKeyboard: false,
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
        this.switchOrigin = this.switchOrigin.bind(this);
    }
    componentDidMount() {
        request.get('/fnmt/Magazine/ListAll').end((err, res) => {
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
        let origin = this.state.terms[record.key - 0].origin.split('%$!**');
        origin.length > 1
            ? tempTerm = tempTerm.set('origin', {
                magazineName: origin[0],
                year: origin[1] || '',
                roll: origin[2] || '',
                issue: origin[3] || '',
                page: origin[4] || ''
            })
            : tempTerm = tempTerm.set('origin', {other: origin[0]});
        this.setState({showTermDetails: true, modifyTerm: true, record: tempTerm.toJS(),useOtherOrigin: origin.length === 1});
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
        request.post('/fnmt/Term/DeleteTerm').type('form').send({term: record.term}).end((err, res) => {
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
        let origin = this.state.terms[record.key - 0].origin.split('%$!**');
        origin.length > 1
            ? tempTerm = tempTerm.set('origin', {
                magazineName: origin[0],
                year: origin[1] || '',
                roll: origin[2] || '',
                issue: origin[3] || '',
                page: origin[4] || ''
            })
            : tempTerm = tempTerm.set('origin', {other: origin[0]});
        this.setState({showTermDetails: true, record: tempTerm.toJS(), useOtherOrigin: origin.length === 1});
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
    switchOrigin(checked) {
        this.setState({useOtherOrigin: checked});
    }
    toggleKeyboard() {
      this.setState({ showKeyboard: !this.state.showKeyboard });
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
    commitModify() {
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
        request.post('/fnmt/Term/ReviewTerm').type('form').send({term: term}).end((err, res) => {
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
        request.post('/fnmt/Term/RejectTerm').type('form').send(data).end((err, res) => {
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
            const originBlock = (() => {
              if(this.state.modifyTerm) {
                    if (this.state.useOtherOrigin)
                        return (
                          <div>
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
                          <Row style={{
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
                            </div>
                        );
                    else {
                        return (
                          <div>
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
                          <Row>
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
                        </div>
                        );
                    }
                  }
                    else {
                      if (this.state.useOtherOrigin)
                        return (
                          <Row style={{
                                  borderBottom: '1px solid #e9e9e9',
                                  marginBottom: '20px'
                              }}>
                                  <Col span={24}>
                                      <FormItem label="其他" labelCol={{
                                          span: 2
                                      }} wrapperCol={{
                                          span: 16
                                      }}>
                                      <p>{this.state.record.origin.other}</p>
                                      </FormItem>
                                  </Col>
                              </Row>
                        )
                    else {
                        return (
                          <div>
                          <Row>
                              <Col span={12}>
                                <FormItem label="杂志名称" labelCol={{
                                  span: 4
                              }} wrapperCol={{
                                  span: 14
                              }}>
                                  <p>{this.state.record.origin.magazineName}</p>
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
                                  <p>{this.state.record.origin.year}</p>
                              </FormItem>
                          </Col>
                          <Col span={6}>
                              <FormItem label="卷号" labelCol={{
                                  span: 8
                              }} wrapperCol={{
                                  span: 16
                              }}>
                                 <p>{this.state.record.origin.roll}</p>
                              </FormItem>
                          </Col>
                          <Col span={6}>
                              <FormItem label="期号" labelCol={{
                                  span: 8
                              }} wrapperCol={{
                                  span: 16
                              }}>
                                <p>{this.state.record.origin.issue}</p>
                              </FormItem>
                          </Col>
                          <Col span={6}>
                              <FormItem label="页码" labelCol={{
                                  span: 8
                              }} wrapperCol={{
                                  span: 16
                              }}>
                                   <p>{this.state.record.origin.page}</p>
                              </FormItem>
                              </Col>
                          </Row>
                        </div>
                        )
                    }
                  }
            })();
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
                                                <Option value="n. / adj.">n. / adj.</Option>
                                                <Option value="n. / v.">n. / v.</Option>
                                                <Option value="adj. / adv.">adj. / adv.</Option>
                                                <Option value="abbr.">abbr.</Option>
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
                                            <Col span={18}>
                                                <p>{this.state.record.pronunciation
                                                        ? '[' + this.state.record.pronunciation + ']'
                                                        : '请在右侧下拉框选择单个音标逐次添加'}
                                                </p>
                                            </Col>
                                            <Col span={6}>
                                                <ButtonGroup style={{
                                                    marginLeft: '4px',
                                                    marginTop: '2px', float: 'right'
                                                }}>
                                                    <Button type="primary" size="large" icon="calculator" onClick={this.toggleKeyboard.bind(this)}></Button>
                                                    <Button type="primary" size="large" icon="minus-square-o" onClick={this.removePronun.bind(this)}></Button>
                                                </ButtonGroup>
                                            </Col>
                                            { this.state.showKeyboard ?
                                            <div className="sofe-keyboard" style={{ marginTop: '36px' }} onBlur={this.toggleKeyboard.bind(this)}>
                                              <div className="IPAZone IPA">
                                              <ul>
                                               <li style={{ height: '4em' }}>辅音</li>
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
                                                <li style={{ width: '4em' }}>短元音</li>
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
                                                  <li style={{ width: '4em' }}>长元音</li>
                                              		<li onClick={this.addPronun.bind(this)}>i:</li>
                                              		<li onClick={this.addPronun.bind(this)}>&#593;:</li>
                                              		<li onClick={this.addPronun.bind(this)}>&#650;:</li>
                                              		<li onClick={this.addPronun.bind(this)}>&#596;:</li>
                                                  <li onClick={this.addPronun.bind(this)}>u:</li>
                                                  <li style={{ float: 'right', borderTop: '1px solid #eee' }} onClick={this.addPronun.bind(this)}>)</li>
                                                  <li style={{ float: 'right', borderTop: '1px solid #eee' }} onClick={this.addPronun.bind(this)}>(</li>
                                                  <li style={{ float: 'right' }} onClick={this.addPronun.bind(this)}>&#712;</li>
                                                  <li style={{ float: 'right', borderLeft: '1px solid #eee' }} onClick={this.addPronun.bind(this)}>&#716;</li>
                                              	</ul>
                                              <div className="clear"></div>
                                              <ul >
                                                 <li style={{ width: '4em' }}>双元音</li>
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
                                            </div> : null }
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
                        {originBlock}
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
