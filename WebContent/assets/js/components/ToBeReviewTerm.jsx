import 'babel-polyfill';
import React from 'react';
import request from 'superagent';
import ToBeReviewTermForm from './ToBeReviewTermForm.jsx';
import {
    Table,
    Icon,
    Card,
    Popconfirm,
    Modal,
    Button
} from 'antd';

export default class ToBeReviewTerm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTermDetails: false,
            terms: [],
            termsTotal: 0,
            pagination: {},
            record: {},
            loading: false,
            modifyTerm: false,
            isFirstFetch: true
        }
        this.hideDetails = this.hideDetails.bind(this);
        this.fetchNewData = this.fetchNewData.bind(this);
        this.reEditTerm = this.reEditTerm.bind(this);
    }
    componentDidMount() {
        request.get('/termdemo/Term/GetCreateTerm/').query({status: 0, page: 0, rows: 10}).end((err, res) => {
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
        this.setState({
            showTermDetails: true,
            modifyTerm: true,
            record: this.state.terms[record.key - 0]
        });
    }
    deleteTerm(index) {
        console.log(index);
    }
    showDetails(record) {
        this.setState({
            showTermDetails: true,
            record: this.state.terms[record.key - 0]
        });
    }
    hideDetails() {
        this.setState({showTermDetails: false, modifyTerm: false});
    }
    fetchNewData(pagination) {
        let pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({pagination: pager, loading: true});
        request.get('/termdemo/Term/GetCreateTerm/').query({status: 0, page: pager.current, rows: pagination.pageSize}).end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                let pagination = this.state.pagination;
                pagination.total = data.total;
                this.setState({terms: data.records, pagination: pagination, loading: false});
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
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time'
                }, {
                    title: '英文定义',
                    dataIndex: 'definition',
                    key: 'definition'
                }, {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                            <a href="javascript:void(0);" onClick={this.reEditItemTerm.bind(this, record)}>重新编辑</a>
                            <span className="ant-divider"/>
                            <Popconfirm title="确定删除这条单词？" onConfirm={this.deleteTerm.bind(this, record.key)} okText="确定" cancelText="取消">
                                <a href="javascript:void(0);">删除</a>
                            </Popconfirm>
                        </span>
                    )
                }
            ];
            const data = this.state.terms.map((item, i) => {
                return {key: i, term: item.term, create_time: item.create_time, definition: item.definition}
            });
            const modalBottonGroup = [< Button type = "ghost" size = "large" onClick = {
                    this.hideDetails
                } > 返回 < /Button>,this.state.modifyTerm?<Button type="primary" size="large" onClick={this.reEditTerm}> 提交修改 </Button >:
                 <Button type="primary" size="large" onClick={this.reEditTerm}> 重新编辑 </Button >]
            return (
                <div>
                    <Card title="待校验的单词（点击单词名可查看单词详细信息）" style={{
                        width: '100%'
                    }}>
                        <Table columns={columns} dataSource={data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.fetchNewData}/>
                    </Card>
                    <Modal title="单词详情" visible={this.state.showTermDetails} onCancel={this.hideDetails} width={'75%'} footer={modalBottonGroup}>
                        <ToBeReviewTermForm record={this.state.record} modifyTerm={this.state.modifyTerm}/>
                    </Modal>
                </div>
            )
        } else
            return false

    }
}
