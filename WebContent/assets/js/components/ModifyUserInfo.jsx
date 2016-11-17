import React from 'react';
import superagent from 'superagent';
import { Card, Input, Row, Col, Form, Button, message, Modal } from 'antd';
const FormItem = Form.Item;

export default class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.state = {
            userinfo: {},
            tempPassword: ''
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
        this.setState({ userinfo, tempPassword: userinfo.password});
      });
    }
    handleChange(e) {
      const userinfo = this.state.userinfo;
      userinfo[e.target.name] = e.target.value;
      this.setState({ userinfo });
    }
    typeSurePassword(e) {
        this.setState({tempPassword: e.target.value})
    }
    validateForm() {
        let newUser = this.state.userinfo;
        if (!newUser.username || newUser.username === '') {
            Modal.error({title: '用户登录账号不能为空！', content: '请输入用户登录系统的账号后重试～'});
            return false;
        }
        if (!newUser.password || newUser.password === '') {
            Modal.error({title: '用户登录密码不能为空！', content: '请输入用户登录系统的密码后重试～'});
            return false;
        }
        if (newUser.password !== this.state.tempPassword) {
            Modal.error({title: '两次输入的登录密码不同', content: '请重新输入用户登录系统的密码和确认密码后重试～'});
            return false;
        }
        if (!newUser.name || newUser.name === '') {
            Modal.error({title: '用户姓名不能为空！', content: '请输入用户姓名后重试～'});
            return false;
        }
        if (!newUser.pinyin || newUser.pinyin === '') {
            Modal.error({title: '用户姓名拼音不能为空！', content: '请输入用户姓名拼音后重试～'});
            return false;
        }
        if (!newUser.tel || newUser.tel === '') {
            Modal.error({title: '用户联系电话不能为空！', content: '请输入用户联系电话后重试～'});
            return false;
        }
        if (!newUser.email || newUser.email === '') {
            Modal.error({title: '用户电子邮箱不能为空！', content: '请输入用户电子邮箱后重试～'});
            return false;
        }
        return true;
    }
    handleSubmit() {
      if(this.validateForm()){
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
          setTimeout(() => {
              location.reload();
          }, 800);
        })
      }
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
                <Input type="password" value={this.state.userinfo.password} onChange={this.handleChange.bind(this)} name="tel"/>
              </FormItem>
              <FormItem {...formItemLayout} label="确认密码">
                <Input type="password" value={this.state.tempPassword} onChange={this.typeSurePassword.bind(this)} name="tel"/>
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
