import React from 'react';

import {
    Card,
    Button,
    Checkbox,
    message
} from 'antd';

const CheckboxGroup = Checkbox.Group;

export default class SearchConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            termChars: [
                {
                    label: '词性',
                    value: 0
                }, {
                    label: '发音',
                    value: 1
                }, {
                    label: '中文翻译',
                    value: 2
                }, {
                    label: '首次来源',
                    value: 3
                }, {
                    label: '英文定义',
                    value: 4
                }, {
                    label: '定义来源',
                    value: 5
                }, {
                    label: '示例',
                    value: 6
                }, {
                    label: '翻译理据',
                    value: 7
                }
            ],
            checkedChars: []
        };
        this.ChangeCheck = this.ChangeCheck.bind(this);
    }
    ChangeCheck(value) {}
    render() {
        return (
            <div>
                <Card title="选择搜索单词时展示的单词属性" style={{
                    width: '100%'
                }}>
                    <CheckboxGroup options={this.state.termChars} defaultValue={this.state.checkedChars} onChange={this.ChangeCheck}/>
                    <Button type="primary" style={{
                        marginTop: '20px'
                    }}>保存设置</Button>
                </Card>
            </div>
        )
    }
}
