import React from 'react';
import request from 'superagent';
import {Table, Card, Form, Popconfirm} from 'antd';

const FormItem = Form.Item;
export default class UserInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            pagination: {},
            loading: false
        }
        this.fetchNewData = this.fetchNewData.bind(this);
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
    reeditUser() {}
    deleteUser() {}
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
                render: (record) => (
                    <span>
                        <a href="javascript:void(0);" onClick={this.reeditUser.bind(this, record)}>编辑用户信息</a>
                        <span className="ant-divider"/>
                        <Popconfirm title="确定删除这名用户？" onConfirm={this.deleteUser.bind(this, record)} okText="确定" cancelText="取消">
                            <a href="javascript:void(0);">删除</a>
                        </Popconfirm>
                    </span>
                )

            }
        ];
        const data = this.state.userList.map((user, i) => {
            return {key: i, name: user.name, username: user.username, userrole: user.userrole}
        });
        return (
            <div>
                <Card title="被驳回的单词" style={{
                    width: '100%'
                }}>
                    <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
                </Card>
            </div>
        )
    }
}
