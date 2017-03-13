import 'babel-polyfill';
import React from 'react';
import request from 'superagent';
import Immutable from 'immutable';
import {
    Table,
    Card,
    Button,
    message,
    Input,
    Modal,
    Popconfirm
} from 'antd';

import {pronunciation} from '../termConfig.js';

export default class Magazine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            magazines: [],
            magazinesTotal: 0,
            pagination: {},
            loading: false,
            newMagazine: '',
            isFirstFetch: true
        }
        this.fetchNewData = this.fetchNewData.bind(this);
        this.typeForm = this.typeForm.bind(this);
        this.addMagazine = this.addMagazine.bind(this);
    }
    componentDidMount() {
        request.get('/fnmt/Magazine/GetAllMagazine').query({page: 0, rows: 10}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                const pagination = {
                    total: data.total,
                    showSizeChanger: true
                };
                this.setState({magazines: data.magazines, pagination: pagination, isFirstFetch: false});
            }
        });
    }
    fetchNewData(pagination) {
        let pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({pagination: pager, loading: true});
        request.get('/fnmt/Magazine/GetAllMagazine').query({page: pager.current, rows: pagination.pageSize}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                let pagination = this.state.pagination;
                pagination.total = data.total;
                this.setState({magazines: data.magazines, pagination: pagination, loading: false});
            }
        });
    }
    typeForm(e) {
        let tempNewMagazine = this.state.newMagazine;
        tempNewMagazine = e.target.value;
        this.setState({newMagazine: tempNewMagazine});
    }
    deleteMagazine(magazine) {
        request.post('/fnmt/Magazine/Delete').type('form').send({name: magazine.name}).end((err, res) => {
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
                    this.setState({commitLoading: false});
                })()
        });
    }
    addMagazine() {
        if (this.state.newMagazine)
            request.post('/fnmt/Magazine/AddMagazine').type('form').send({name: this.state.newMagazine}).end((err, res) => {
                let data = JSON.parse(res.text);
                data.status === '1'
                    ? (() => {
                        message.success('添加成功～', 3);
                        let pagination = {
                            current: 1,
                            pageSize: 10
                        }
                        this.fetchNewData(pagination);
                        this.setState({commitLoading: false});
                        this.setState({newMagazine: ''});
                    })()
                    : (() => {
                        message.error(data.msg, 3);
                    })()
            });
        else
            Modal.warning({title: '杂志名不能为空！', content: '请输入杂志名称后再进行添加操作', okText: '确定'});
        }
    render() {
        if (!this.state.isFirstFetch) {
            const columns = [
                {
                    title: '杂志名',
                    dataIndex: 'name',
                    key: 'name'
                }, {
                    title: '操作',
                    key: 'action',
                    render: (magazine) => (
                        <span>
                            <Popconfirm title={'您即将删除：' + magazine.name} onConfirm={this.deleteMagazine.bind(this, magazine)} okText="确定删除" cancelText="取消">
                                <a href="javascript:void(0);">删除</a>
                            </Popconfirm>
                        </span>
                    )

                }
            ];
            const data = this.state.magazines.map((item, i) => {
                return {key: i, name: item.name}
            });
            return (
                <div>
                  <Card title="添加新的杂志" style={{
                    width: '100%',
                    marginBottom: '25px'
                  }}>
                    <Input style={{
                      width: '65%'
                    }} placeholder="输入杂志名称" onChange={this.typeForm} value={this.state.newMagazine}/>
                    <Popconfirm title={'您即将添加：' + this.state.newMagazine} onConfirm={this.addMagazine} okText="确认添加" cancelText="取消">
                      <Button style={{
                        float: 'right'
                      }} type="primary" size="large">
                        添加杂志
                      </Button>
                    </Popconfirm>
                  </Card>
                  <Card title="现有杂志信息" style={{
                    width: '100%'
                  }}>
                    <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
                    </Card>
                </div>
            )
        } else
            return false

    }
}
