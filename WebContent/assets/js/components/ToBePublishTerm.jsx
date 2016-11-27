import React from 'react';
import request from 'superagent';
import Immutable from 'immutable';
import { Table, Card, Modal, Button, Form, Select, Input, Row, Col, message, Popconfirm } from 'antd';

import {pronunciation} from '../termConfig.js';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
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

export default class ToBePublishTerm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.publish = this.publish.bind(this);
        this.unpublish = this.unpublish.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
        this.showRejectModal = this.showRejectModal.bind(this);
        this.hideRejectModal = this.hideRejectModal.bind(this);
        this.state = {
          terms: [],
          termsTotal: 0,
          record: emptyRecord,
          pagination: {},
          loading: false,
          commitLoading: false,
          showRejectModal: false,
          tempPronun: '',
          tempPronuns: []
        }
    }
    componentDidMount() {
      request
        .get('/termdemo/Term/GetTermByStatus')
        .query({ status: 1, page: 0, rows: 10})
        .end((err, res) => {
          let data = JSON.parse(res.text);
          const pagination = { total: data.total, showSizeChanger: true };
          this.setState({ terms: data.records, pagination: pagination });
        });
    }
    handleChange(e) {
      let tempRecord = this.state.record;
      tempRecord.rejectReason = e.target.value;
      this.setState({ record: tempRecord });
    }
    showDetails(record) {
      let tempTerm = Immutable.fromJS(this.state.terms[record.key - 0]);
      let origin = this.state.terms[record.key - 0].origin.split('%$!**');
      tempTerm = tempTerm.set('origin', {
        magazineName: origin[0],
        year: origin[1] || '',
        roll: origin[2] || '',
        issue: origin[3] || '',
        page: origin[4] || '',
      });
      this.setState({ showTermDetails: true, record: tempTerm.toJS() });
    }
    hideDetails() {
      this.setState({ showTermDetails: false, record: emptyRecord, tempPronuns:[], tempPronun:''});
    }
    showRejectModal() {
      this.setState({ showRejectModal: true });
    }
    hideRejectModal() {
      this.setState({ showRejectModal: false });
    }
    fetchNewData(pagination) {
      let pager = this.state.pagination;
      pager.current = pagination.current;
      this.setState({ pagination: pager, loading: true });
      request
        .get('/termdemo/Term/GetTermByStatus')
        .query({ status: 1, rows: pagination.pageSize, page: pager.current })
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
    publish() {
      let term = this.state.record.term;
      request
        .post('/termdemo/Term/PublishTerm')
        .query({ term })
        .end((err, res) => {
          if (err) return;
          let data = JSON.parse(res.text);
          if (data.status === '0') {
            message.error(data.msg, 3);
          }
          message.success('提交成功，发布该词~');
          this.hideDetails();
          let pagination = {
            current: 1,
            pageSize: 10
          }
          this.fetchNewData(pagination);
        });
    }
    unpublish() {
      request
        .post('/termdemo/Term/RejectTerm')
        .type('form')
        .send({ term: this.state.record.term, reason: this.state.record.rejectReason })
        .end((err, res) => {
          if (err) return;
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
                  this.setState({ commitLoading: false });
              })()
        })
        this.setState({ showRejectModal: false });
    }
    render() {
      // if (this.state.terms.length) {
        const columns = [{
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
        },{
            title: '校验人',
            dataIndex: 'reviewer',
            key: 'reviewer'
        }, {
          title: '操作',
          key: 'action',
          render: (record) => <a href="javascript:void(0);" onClick={this.showDetails.bind(this, record)}>审核</a>
        }];
        const data = this.state.terms.map((item, i) => {
            return {key: i, term: item.term, create_time: item.create_time, creator: item.creator, reviewer:item.reviewer}
        });
        const modalButtonGroup = [
          <Button type="primary" size="large" onClick={this.publish}>发布</Button>,
          <Button size="large" onClick={this.showRejectModal}>驳回</Button>,
          <Button size="large" onClick={this.hideDetails}>取消</Button>
        ];
        return (
          <div>
            <Card title="待发布的单词（点击单词名进行审核操作）" style={{ width: '100%' }}>
              <Table columns={columns} dataSource={data} loading={this.state.loading}
                pagination={this.state.pagination} onChange={this.fetchNewData} />
            </Card>
            <Modal title="单词详情" visible={this.state.showTermDetails} width={'75%'}
              onCancel={this.hideDetails} footer={modalButtonGroup}>
              <Form horizontal>
                <Row>
                  <Col span={12}>
                    <FormItem label="条目" labelCol={{ span: 4}} wrapperCol={{ span: 18 }}>
                      <Input name="term" value={this.state.record.term} disabled/>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="词性" labelCol={{ span: 4}} wrapperCol={{ span: 6 }}>
                      <Input name="term_char" value={this.state.record.term_char} disabled/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="发音" labelCol={{ span: 4}} wrapperCol={{ span: 18 }}>
                      <Col span={14}>
                          <p>{'[' + this.state.record.pronunciation + ']'}  </p>
                      </Col>
                      <Input disabled type="hidden" name="pronunciation" value={this.state.record.pronunciation}/>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem label="中文翻译" labelCol={{
                          span: 4
                      }} wrapperCol={{
                          span: 18
                      }}>
                          <Input disabled name="translation" value={this.state.record.translation} onChange={this.typeForm}/>
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
                    <FormItem label="杂志名称" labelCol={{ span: 4}} wrapperCol={{ span: 14 }}>
                      <Input data-parent="origin" name="magazineName" value={this.state.record.origin.magazineName} disabled/>
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e9e9e9', marginBottom: '20px' }}>
                  <Col span={6}>
                    <FormItem label="年份" labelCol={{ span: 8}} wrapperCol={{ span: 16 }}>
                      <Input data-parent="origin" name="year" value={this.state.record.origin.year} disabled/>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="卷号" labelCol={{ span: 8}} wrapperCol={{ span: 16 }}>
                      <Input data-parent="origin" name="roll" value={this.state.record.origin.roll} disabled/>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="期号" labelCol={{ span: 8}} wrapperCol={{ span: 16 }}>
                      <Input data-parent="origin" name="issue" value={this.state.record.origin.issue} disabled/>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="页码" labelCol={{ span: 8}} wrapperCol={{ span: 16 }}>
                      <Input data-parent="origin" name="page" value={this.state.record.origin.page} disabled/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="英文定义" labelCol={{ span: 4}} wrapperCol={{ span: 14 }}>
                      <Input name="definition" value={this.state.record.definition} disabled/>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="定义来源" labelCol={{ span: 4}} wrapperCol={{ span: 14 }}>
                      <Input name="source" value={this.state.record.source} disabled/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="示例" labelCol={{ span: 2}} wrapperCol={{ span: 16 }}>
                      <Input name="example" value={this.state.record.example} disabled/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="翻译理据" labelCol={{ span: 2}} wrapperCol={{ span: 16 }}>
                      <Input name="basis" value={this.state.record.basis} disabled/>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal title="驳回原因" visible={this.state.showRejectModal} onCancel={this.hideRejectModal} width={'45%'}
              footer={[ <Button size="large" onClick={this.unpublish}>确认驳回</Button>,
                        <Button type="primary" size="large" onClick={this.hideRejectModal}>取消</Button>]}>
                <Input type="textarea" name="rejectReason" placeholder="请输入驳回原因" onChange={this.handleChange} value={this.state.record.rejectReason} />
            </Modal>
          </div>);
      // }
      // return (<div>暂无记录</div>);
    }
}
