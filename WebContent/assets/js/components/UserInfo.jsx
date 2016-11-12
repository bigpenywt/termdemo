import React from 'react';
import request from 'superagent';
import {
    Table,
    Card,
    Form,
    Input,
    Row,
    Col,
    Popconfirm,
    Button,
    Modal,
    Checkbox,
    message
} from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
export default class UserInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            pagination: {},
            showUserInfo : {},
            confirmPassword : '',
            showUserDetails : false,
            isAddUser : false,
            loading : false
        }
        this.fetchNewData = this.fetchNewData.bind(this);
        this.editUser = this.editUser.bind(this);
        this.hideUserDetails = this.hideUserDetails.bind(this);
        this.selectRole = this.selectRole.bind(this);
        this.typeForm = this.typeForm.bind(this);
        this.showCreatBox = this.showCreatBox.bind(this);
        this.addUser = this.addUser.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }
    componentDidMount() {
        this.setState({loading: true});
        request.get('/termdemo/User/ListAll').query({page: 0, rows: 10}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                const pagination = {
                    total: data.total,
                    showSizeChanger: true
                };
                this.setState({userList: data.records, pagination: pagination, loading: false});
            }
        });
    }
    showCreatBox() {
        this.setState({isAddUser: true, showUserDetails: true, showUserInfo: {}, confirmPassword: ''});
    }
    showUserDetails(user) {
        let showUserInfo = this.state.userList[user.key];
        showUserInfo.roleList = user.userrole.split(' | ');
        this.setState({isAddUser: false, showUserDetails: true, showUserInfo: showUserInfo});
    }
    hideUserDetails() {
        this.setState({showUserDetails: false, showUserInfo: {}, confirmPassword: ''});
    }
    selectRole(roleList){
      let tempUserInfo = this.state.showUserInfo;
      tempUserInfo.roleList = roleList;
      this.setState({showUserInfo: tempUserInfo});
    }
    typeForm(e) {
      let tempUserInfo = this.state.showUserInfo;
      if (e.target.name === 'confirmPassword')
          this.setState({confirmPassword: e.target.value});
      else {
          tempUserInfo[e.target.name] = e.target.value;
          this.setState({showUserInfo: tempUserInfo});
      }
    }
    editUser() {}
    deleteUser(user) {
      request.post('/termdemo//User/Delete').type('form').send({username: user.username}).end((err, res) => {
          let data = JSON.parse(res.text);
          data.status === '1'
              ? (() => {
                  message.success('删除成功～', 3);
                  let pagination = {
                      current: 1,
                      pageSize: 10
                  }
                  this.fetchNewData(pagination);
              })()
              : (() => {
                  message.error(data.msg, 3);
              })()
      });
    }
    validateForm() {
        let newUser = this.state.showUserInfo;
        if (!newUser.username || newUser.username === '') {
            Modal.error({title: '用户登录账号不能为空！', content: '请输入用户登录系统的账号后重试～'});
            return false;
        }
        if (!newUser.password || newUser.password === '') {
            Modal.error({title: '用户登录密码不能为空！', content: '请输入用户登录系统的密码后重试～'});
            return false;
        }
        if (newUser.password !== this.state.confirmPassword) {
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
    addUser() {
      if(this.validateForm()){
      let newUser = this.state.showUserInfo;
      newUser.userrole = newUser.roleList
          ? (() => {
              let userrole = '';
              userrole += newUser.roleList.includes('创建单词')
                  ? '1'
                  : '0';
              userrole += newUser.roleList.includes('校验单词')
                  ? '1'
                  : '0';
              userrole += newUser.roleList.includes('发布单词')
                  ? '1'
                  : '0';
              userrole += '0';
              return userrole;
          })()
          : '0000';
        request.post('/termdemo/User/AddUser').type('form').send(newUser).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === '1'
                ? (() => {
                    message.success('添加成功～', 3);
                    let pagination = {
                        current: 1,
                        pageSize: 10
                    }
                    this.fetchNewData(pagination);
                    this.hideUserDetails();
                })()
                : (() => {
                    message.error(data.msg, 3);
                })()
        });
      }
      return;
    }
    fetchNewData(pagination) {
        let pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({pagination: pager, loading: true});
        request.get('/termdemo/User/ListAll').query({page: pager.current, rows: pagination.pageSize}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                let pagination = this.state.pagination;
                pagination.total = data.total;
                this.setState({userList: data.records, pagination: pagination, loading: false});
            }
        });
    }
    render() {
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: '账号',
                dataIndex: 'username',
                key: 'username'
            }, {
                title: '拥有权限',
                dataIndex: 'userrole',
                key: 'userrole'
            }, {
                title: '操作',
                key: 'action',
                render: (user) => (
                    <span>
                      <a href="javascript:void(0);" onClick={this.showUserDetails.bind(this, user)}>编辑用户信息</a>
                      <span className="ant-divider"/>
                      <Popconfirm title="确定删除这名用户？" onConfirm={this.deleteUser.bind(this, user)} okText="确定" cancelText="取消">
                        <a href="javascript:void(0);">删除</a>
                      </Popconfirm>
                    </span>
                )

            }
        ];
        const data = this.state.userList.map((user, i) => {
            return {
                key: i, name: user.name, username: user.username, userrole: (() => {
                    let roleCode = user.userrole.split('');
                    let roleStr = [];
                    roleCode[0] - 0
                        ? roleStr.push('创建单词')
                        : false;
                    roleCode[1] - 0
                        ? roleStr.push('校验单词')
                        : false;
                    roleCode[2] - 0
                        ? roleStr.push('发布单词')
                        : false;
                    return roleStr.join(' | ');
                })()
            }
        });
        const bottonGroup = this.state.isAddUser
            ? [<Button key="submit" type="primary" size="large" onClick={this.addUser}>确认添加</Button>,
              <Button key="back" type="ghost" size="large" loading={this.state.loading} onClick={this.hideUserDetails}>取消</Button >]
            : [<Button key="submit" type="primary" size="large" onClick={this.editUser}>确认修改</Button>,
              <Button key="back" type="ghost" size="large" loading={this.state.loading} onClick={this.hideUserDetails}>取消</Button >];
        return (
            <div>
              <Card title="被驳回的单词" extra={<Button type="primary" onClick={this.showCreatBox}>添加新用户</Button>} style={{
                width: '100%'
              }}>
                <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
              </Card>
              <Modal visible={this.state.showUserDetails} title="用户信息" width={'70%'} onCancel={this.hideUserDetails} footer={bottonGroup}>
                <Form horizontal>
                  <Row>
                    <Col span={24}>
                      <FormItem label="用户登陆账号" labelCol={{
                        span: 4
                      }} wrapperCol={{
                        span: 10
                      }} extra="用户用于登陆系统的账号">
                        <Input name="username" placeholder="请输入用户登陆账号" value={this.state.showUserInfo.username} onChange={this.typeForm}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem label="用户登录密码" labelCol={{
                        span: 4
                      }} wrapperCol={{
                        span: 10
                      }}  extra="用户用来登陆系统的密码，若不输入则默认为 123456">
                        <Input name="password" type="password" placeholder="请输入用户登录密码" value={this.state.showUserInfo.password} onChange={this.typeForm}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem label="登录密码确认" labelCol={{
                        span: 4
                      }} wrapperCol={{
                        span: 10
                      }} extra="再次输入密码，保证两次输入的密码一致">
                        <Input name="confirmPassword" type="password" placeholder="请再次输入用户密码" value={this.state.confirmPassword} onChange={this.typeForm}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="姓名" labelCol={{
                        span: 8
                      }} wrapperCol={{
                        span: 10
                      }}>
                        <Input name="name" placeholder="请输入用户真实姓名" value={this.state.showUserInfo.name} onChange={this.typeForm}/>
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="姓名拼音" labelCol={{
                        span: 8
                      }} wrapperCol={{
                        span: 10
                      }}>
                        <Input name="pinyin" placeholder="请输入用户姓名拼音" value={this.state.showUserInfo.pinyin} onChange={this.typeForm}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="联系电话" labelCol={{
                        span: 8
                      }} wrapperCol={{
                        span: 16
                      }}>
                        <Input name="tel" placeholder="请输入用户联系电话" value={this.state.showUserInfo.tel} onChange={this.typeForm}/>
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="电子邮箱" labelCol={{
                        span: 8
                      }} wrapperCol={{
                        span: 16
                      }}>
                        <Input name="email" placeholder="请输入用户电子邮箱" value={this.state.showUserInfo.email} onChange={this.typeForm}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem label="用户权限" labelCol={{
                        span: 4
                      }} wrapperCol={{
                        span: 10
                      }}>
                      <CheckboxGroup options={['创建单词', '校验单词', '发布单词']} value={this.state.showUserInfo.roleList} onChange={this.selectRole} />
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </div>
        )
    }
}
