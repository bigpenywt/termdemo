import React from 'react';
import request from 'superagent';

import {Card, Button, Checkbox, message} from 'antd';

const CheckboxGroup = Checkbox.Group;

export default class SearchConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            termChars: [
                {
                    label: '首次来源',
                    value: 0
                }, {
                    label: '英文定义',
                    value: 1
                }, {
                    label: '定义来源',
                    value: 2
                }, {
                    label: '示例',
                    value: 3
                }, {
                    label: '词性',
                    value: 4
                }, {
                    label: '发音',
                    value: 5
                }, {
                    label: '中文翻译',
                    value: 6
                }, {
                    label: '翻译理据',
                    value: 7
                }
            ],
            checkedChars: [],
            hasFetchingData: false
        };
        this.ChangeCheck = this.ChangeCheck.bind(this);
        this.setConfig = this.setConfig.bind(this);
    }
    componentDidMount() {
        request.get('/fnmt/Conf/getConf').end((err, res) => {
            let data = JSON.parse(res.text);
            let defaultConfig = [];
            data.configuration.split('').map((value, i) => {
                if (value === '1')
                    defaultConfig.push(i);
                }
            );
            this.setState({checkedChars: defaultConfig, hasFetchingData: true});
        })
    }
    ChangeCheck(checkedValues) {
        this.setState({checkedChars: checkedValues});
    }
    setConfig() {
        let configStr = new Array(8).fill(0);
        for (let index of this.state.checkedChars)
            configStr[index] = 1;
        request.post('/fnmt/Conf/setConf').type('form').send({configuration: configStr.join('')}).end((err, res) => {
            let data = JSON.parse(res.text);
            data.status === '1'
                ? (() => {
                    message.success('添加成功～', 3);
                    let pagination = {
                        current: 1,
                        pageSize: 10
                    }
                    setTimeout(() => {
                        location.reload();
                    }, 800);
                })()
                : (() => {
                    message.error(data.msg, 3);
                })()
        });
    }
    render() {
        if (this.state.hasFetchingData)
            return (
                <div>
                    <Card title="选择搜索单词时展示的单词属性" style={{
                        width: '100%'
                    }}>
                        <CheckboxGroup options={this.state.termChars} defaultValue={this.state.checkedChars} onChange={this.ChangeCheck}/>
                        <Button type="primary" style={{
                            marginTop: '20px'
                        }} onClick={this.setConfig}>保存设置</Button>
                    </Card>
                </div>
            )
        return false;
    }
}
