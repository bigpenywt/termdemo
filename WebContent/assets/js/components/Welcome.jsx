import React from 'react';
import {PieChart} from 'react-d3-components';
import {Card} from 'antd';
import request from 'superagent';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFirstFetch: true,
            pieChatdata: {
                values: [
                    {
                        x: '待校验',
                        y: 10
                    }, {
                        x: '被驳回',
                        y: 4
                    }, {
                        x: '待发布',
                        y: 3
                    }, {
                        x: '已发布',
                        y: 4
                    }, {
                        x: '被移除发布',
                        y: 3
                    }
                ]
            }
        }
    }
    componentDidMount() {
        request.get('/termdemo/Term/GetTotal').end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === '1') {
                let pieChatdata = {
                    values: [
                        {
                            x: '待校验',
                            y: data.tbReview
                        }, {
                            x: '被驳回',
                            y: data.tbModify
                        }, {
                            x: '待发布',
                            y: data.tbPublish
                        }, {
                            x: '已发布',
                            y: data.done
                        }, {
                            x: '从「发布」中删除',
                            y: data.deleted
                        }
                    ]
                }
                this.setState({pieChatdata: pieChatdata, isFirstFetch: false});
            }
        });
    }
    render() {
        if (this.state.isFirstFetch)
            return false
        return (
            <Card title="当前词库状态" style={{
                width: '100%'
            }}>
                <PieChart data={this.state.pieChatdata} width={550} height={400} sort={null}/>
            </Card>
        )

    }
}
