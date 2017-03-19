import React from 'react';
import request from 'superagent';
import Immutable from 'immutable';

import {pronunciation, yearSelect} from '../termConfig.js';

import { Card, Table, Button, Modal, Form, Input,
  Row, Col, Select, message, Popconfirm, Switch } from 'antd';
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
    showKeyboard: false,
    pronunciation: '',
    example: '',
    source: '',
    translation: '',
    basis: ''
}

export default class HasPublishedTerm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          terms: [],
          pagination: {},
          record: emptyRecord,
          loading: false,
          submitLoading: false,
          showTermDetails: false,
          tempPronun: '',
          tempPronuns: [],
          magazineList: []
        }
        this.fetchNewData = this.fetchNewData.bind(this);
        this.typeForm = this.typeForm.bind(this);
        this.submitModify = this.submitModify.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
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
      request
        .get('/fnmt/Term/GetTermByStatus')
        .query({ status: 3, page: 0, rows: 20 })
        .end((err, res) => {
          if (err) return;
          let data = JSON.parse(res.text);
          if (data.status === '1') {
            const pagination = {
              total: data.total,
              showSizeChanger: true,
              defaultPageSize: 30
            };
            this.setState({ terms: data.records, pagination: pagination });
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
    switchOrigin(checked) {
        this.setState({useOtherOrigin: checked});
    }
    toggleKeyboard() {
        this.setState({ showKeyboard: !this.state.showKeyboard });
    }
    addPronun(e) {
      console.log(e.target.innerHTML);
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
      this.setState({ showTermDetails: false, record: emptyRecord, tempPronuns:[],tempPronun: ''});
    }
    submitModify() {
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
      this.setState({ submitLoading: true });
      request
        .post('/fnmt/Term/ModifyDoneTerm')
        .type('form')
        .send(tempRecord)
        .end((err, res) => {
          if (err) return;
          let data = JSON.parse(res.text);
          if (data.status === '1') {
            message.success('修改成功~', 3);
            this.hideDetails();
            let pagination = {
              current: 1,
              pageSize: 30
            }
            this.fetchNewData(pagination);
          } else {
            message.error(data.msg, 3);
            this.setState({ submitLoading: false });
          }
        })
    }
    deleteTerm(record) {
      request
        .post('/fnmt/Term/DeleteDoneTerm')
        .type('form')
        .send({term: record.term})
        .end((err, res) => {
          if (err) return;
          let data = JSON.parse(res.text);
          if (data.status === '1') {
            message.success('成功删除单词～', 3);
            let pagination = {
                current: 1,
                pageSize: 10
            }
            this.fetchNewData(pagination);
          } else {
            message.error(data.msg, 3);
            this.setState({commitLoading: false});
          }
      });
    }
    fetchNewData(pagination) {
      let pager = this.state.pagination;
      pager.current = pagination.current;
      this.setState({ pagination: pager, loading: true });
      request
        .get('/fnmt/Term/GetTermByStatus')
        .query({ status: 3, rows: pagination.pageSize, page: pager.current })
        .end((err, res) => {
          if (err) return;
          let data = JSON.parse(res.text);
          if (data.status === '1') {
            let pagination = this.state.pagination;
            pagination.total = data.total;
            this.setState({ terms: data.records, pagination: pagination, loading: false, record: emptyRecord });
          }
        })
    }
    render() {
      // if (this.state.terms.length) {
        const columns = [{
          title: '单词',
          dataIndex: 'term',
          key: 'term',
          render: (text, record) => <a href="javascript:void(0);" onClick={this.showDetails.bind(this, record)}>{text}</a>
        }, {
          title: '中文翻译',
          dataIndex: 'translation',
          key: 'translation'
        }, {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time'
        }, {
          title: '操作',
          key: 'action',
          render: (record) =>
            <span>
              <a href="javascript:void(0);" onClick={this.showDetails.bind(this, record)}>修改</a>
              <span className="ant-divider" />
              <Popconfirm title="确定删除这条单词？" onConfirm={this.deleteTerm.bind(this, record)} okText="确定" cancelText="取消">
                  <a href="javascript:void(0);">移除</a>
              </Popconfirm>
            </span>
        }];
        const data = this.state.terms.map((item, i) => {
            return {key: i, term: item.term, create_time: item.create_time, translation: item.translation}
        });
        const modalButtonGroup = [
          <Button type="primary" size="large" onClick={this.submitModify}>修改</Button>,
          <Button size="large" onClick={this.hideDetails.bind(this)}>取消</Button>
        ];
        return (
          <div>
            <Card title="已入库单词（单击修改）" style={{ width: '100%' }}>
              <Table columns={columns} dataSource={data} loading={this.state.loading}
                pagination={this.state.pagination} onChange={this.fetchNewData}/>
            </Card>
            <Modal title="单词详情" visible={this.state.showTermDetails} width={'75%'}
              onCancel={this.hideDetails} footer={modalButtonGroup}>
              <Form horizontal>
                <Row>
                  <Col span={12}>
                    <FormItem label="条目" labelCol={{ span: 4}} wrapperCol={{ span: 18 }}>
                      <Input disabled name="term" value={this.state.record.term}/>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="词性" labelCol={{ span: 4}} wrapperCol={{ span: 6 }}>
                      <Select name="term_char" value={this.state.record.term_char} onChange={this.selectFormItem.bind(this, 'term_char')}>
                          <Option value="n.">n.</Option>
                          <Option value="adj.">adj.</Option>
                          <Option value="v.">v.</Option>
                          <Option value="vt.">vt.</Option>
                          <Option value="vi.">vi.</Option>
                          <Option value="adv.">adv.</Option>
                          <Option value="adv.">n. / adj.</Option>
                          <Option value="adv.">n. / v.</Option>
                          <Option value="adv.">n. / v.</Option>
                          <Option value="adv.">adj. / adv.</Option>
                          <Option value="adv.">abbr.</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="发音" labelCol={{ span: 4}} wrapperCol={{ span: 18 }}>
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
                            <li onClick={this.addPronun.bind(this)}>&#604;:</li>
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
                <Row style={{ borderTop: '1px solid #e9e9e9', marginBottom: '20px' }}>
                  <div style={{ position: 'absolute', top: '-11px', padding: '1px 8px',
                      color: '#777', marginLeft: '25px', background: '#fff' }}>
                    首次来源
                  </div>
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
                    <FormItem label="英文定义" labelCol={{ span: 4}} wrapperCol={{ span: 14 }}>
                      <Input name="definition" value={this.state.record.definition} onChange={this.typeForm}/>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="定义来源" labelCol={{ span: 4}} wrapperCol={{ span: 14 }}>
                      <Input name="source" value={this.state.record.source} onChange={this.typeForm}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="示例" labelCol={{ span: 2}} wrapperCol={{ span: 16 }}>
                      <Input name="example" value={this.state.record.example} onChange={this.typeForm}/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="翻译理据" labelCol={{ span: 2}} wrapperCol={{ span: 16 }}>
                      <Input name="basis" value={this.state.record.basis} onChange={this.typeForm}/>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </div>
        );
      // }
      // return (<div>暂无记录</div>);
    }
}
