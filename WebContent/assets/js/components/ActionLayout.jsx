import React from 'react';
import {Menu, Icon, Switch} from 'antd';
const SubMenu = Menu.SubMenu;

import '../../../public/css/page/app/action_layout.css'

export default class ActionLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: ''
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        this.setState({current: e.key});
    }
    render() {

        return (
            <div>
                <div className="action-list">
                    <Menu theme={'dark'} onClick={this.handleClick} style={{
                        width: 220
                    }} selectedKeys={[this.state.current]} mode="inline">
                        <SubMenu key="create" title={< span > <Icon type="mail"/> < span > 新词操作 < /span></span >}>
                            <Menu.Item key="1">创建新词</Menu.Item>
                            <Menu.Item key="2">待校验的单词（我添加的）</Menu.Item>
                            <Menu.Item key="3">被驳回的单词</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={< span > <Icon type="appstore"/> < span > 校验操作 < /span></span >}>
                            <Menu.Item key="5">待校验的单词（所有的）</Menu.Item>
                            <Menu.Item key="6">已驳回的单词</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" title={< span > <Icon type="setting"/> < span > 单词发布 < /span></span >}>
                            <Menu.Item key="9">待发布的单词</Menu.Item>
                            <Menu.Item key="10">已驳回的单词</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub5" title={< span > <Icon type="setting"/> < span > 词库维护 < /span></span >}>
                            <Menu.Item key="11">已发布的单词</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub6" title={< span > <Icon type="setting"/> < span > 系统管理 < /span></span >}>
                            <Menu.Item key="12">用户管理</Menu.Item>
                            <Menu.Item key="13">查看日志</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="children-block">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
