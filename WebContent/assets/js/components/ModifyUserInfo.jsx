import React from 'react';
import superagent from 'superagent';
import { Card, Input, Row, Col, Form, Button, message } from 'antd';
const FormItem = Form.Item;

export default class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.state = {
          userinfo: {},
        };
    }
    componentDidMount() {
      this.getUserInfo();
    }
    getUserInfo() {
      return new Promise((resolve, reject) => {
        superagent
          .get('/termdemo/User/GetUserInfo')
          .end((err, res) => {
            if (err) reject(new Error(err));
            if (res.body.status === 0) reject(res.body.msg);
            resolve(res.body.userinfo);
          });
      }).then((userinfo) => {
        this.setState({ userinfo });
      });
    }
    handleChange(e) {
      const userinfo = this.state.userinfo;
      userinfo[e.target.name] = e.target.value;
      this.setState({ userinfo });
    }
    handleSubmit() {
      const userinfo = this.state.userinfo;
      return new Promise((resolve, reject) => {
        superagent
          .post('/termdemo/User/ModifyUserInfo')
          .type('form')
          .send(userinfo)
          .end((err, res) => {
            if (err) reject(new Error(err));
            if (res.body.status === 0) {
              message.error(res.body.msg);
              reject(res.body.msg);
            }
            resolve();
          });
      }).then(() => {
        message.info('提交成功');
        // this.getUserInfo();
      })
    }
    render() {
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
      return (
        <div>
          <Card>
            <Form horizontal>
              <FormItem {...formItemLayout} label="注册名">
                <Input value={this.state.userinfo.username} disabled/>
              </FormItem>
              <FormItem {...formItemLayout} label="密码">
                <Input value={this.state.userinfo.password} onChange={this.handleChange.bind(this)} name="tel"/>
              </FormItem>
              <FormItem {...formItemLayout} label="姓名">
                <Input value={this.state.userinfo.name} onChange={this.handleChange.bind(this)} name="name"/>
              </FormItem>
              <FormItem {...formItemLayout} label="姓名拼音">
                <Input value={this.state.userinfo.pinyin} onChange={this.handleChange.bind(this)} name="pinyin"/>
              </FormItem>
              <FormItem {...formItemLayout} label="邮箱">
                <Input value={this.state.userinfo.email} onChange={this.handleChange.bind(this)} name="email"/>
              </FormItem>
              <FormItem {...formItemLayout} label="电话">
                <Input value={this.state.userinfo.tel} onChange={this.handleChange.bind(this)} name="tel"/>
              </FormItem>
              <FormItem>
                <Row>
                  <Col span={14} offset={6}>
                    <Button type="primary" onClick={this.handleSubmit} size="large">提交修改</Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </Card>
        </div>)
    }
}
