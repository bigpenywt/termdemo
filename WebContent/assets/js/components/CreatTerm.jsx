import React from 'react';
import { Card, Form, Input, Row, Col, Button, Table } from 'antd';
const FormItem = Form.Item;

export default class CreatTerm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          record: {},
        }
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
    render() {
        return (
            <div>
              <Card title="填写属性" style={{ width: '100%' }}>
                <Form horizontal>
                  <Row>
                    <Col span={8}>
                      <FormItem label="term"
                          labelCol={{ span: 10 }}
                          wrapperCol={{ span: 14 }}>
                        <Input name="term" value={} onChange={}/>
                      </FormItem>
                      <FormItem label="character"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        <Input name="character" value={} onChange={}/>
                      </FormItem>
                      <FormItem label="definition"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        <Input type="textarea" name="definition" value={} onChange={}/>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="origin"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        <Input name="origin" value={} onChange={}/>
                      </FormItem>
                      <FormItem label="pronounciation"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        <Input name="pronounciation" value={} onChange={}/>
                      </FormItem>
                      <FormItem label="example"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        <Input type="textarea" name="example" value={} onChange={}/>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="source"
                        labelCol={{ span: 10}}
                        wrapperCol={{ span: 14 }}>
                        <Input name="source" value={} onChange={}/>
                      </FormItem>
                      <FormItem label="status"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        <Input name="status" value={} onChange={}/>
                      </FormItem>
                      <FormItem label="translation"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        <Input type="textarea" name="translation" value={} onChange={}/>
                      </FormItem>
                    </Col>
                  </Row>
                  {this.renderRecordInfo()}
                </Form>
              </Card>
              <Card title="词条记录">
                <Table>

                </Table>
              </Card>
            </div>
        )
    }
}
