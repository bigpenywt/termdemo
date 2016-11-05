import React from 'react';
import {Menu, Icon, Modal} from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import '../../../public/css/page/app/action_layout.css'

export default class ActionLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: ''
        }
        this.handleClick = this.handleClick.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    signOut() {
        Modal.confirm({
            title: '您确认要退出管理系统？',
            content: '退出系统后再次进入需重新登录',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                window.location.href = '/termdemo/loginCtl/logout';
            }
        });
    }
    handleClick(e) {
        this.setState({current: e.key});
        this.context.router.push(e.key);
    }
    render() {

        return (
            <div>
                <div className="header">
                    <h2 className="title">英汉医学新术语库后台管理系统</h2>
                    <Menu style={{
                        float: 'right'
                    }} onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                        <SubMenu title={'欢迎回来，' + this.props.route.userName}>
                            <MenuItemGroup>
                                <Menu.Item key="">
                                    <a onClick={this.signOut}>退出系统</a>
                                </Menu.Item>
                                <Menu.Item key="modifyUserInfo">修改个人信息</Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="action-list">
                    <Menu theme={'dark'} onClick={this.handleClick} style={{
                        width: 220
                    }} selectedKeys={[this.state.current]} mode="inline">
                        <SubMenu key="newWorld" title={< span > <Icon type="exception"/> < span > 新词操作 < /span></span >}>
                            <Menu.Item key="creat">创建新词</Menu.Item>
                            <Menu.Item key="toBeReviewByMe">待校验的单词（我添加的）</Menu.Item>
                            <Menu.Item key="beReject">被驳回的单词</Menu.Item>
                        </SubMenu>
                        <SubMenu key="calibrate" title={< span > <Icon type="edit"/> < span > 校验操作 < /span></span >}>
                            <Menu.Item key="toBeReviewByAll">待校验的单词（所有的）</Menu.Item>
                            <Menu.Item key="hasRejectedWhenCalibrate">已驳回的单词</Menu.Item>
                        </SubMenu>
                        <SubMenu key="publish" title={< span > <Icon type="laptop"/> < span > 单词发布 < /span></span >}>
                            <Menu.Item key="toBePublish">待发布的单词</Menu.Item>
                            <Menu.Item key="hasRejectedWhenPublish">已驳回的单词</Menu.Item>
                        </SubMenu>
                        <SubMenu key="storage" title={< span > <Icon type="hdd"/> < span > 词库维护 < /span></span >}>
                            <Menu.Item key="hasPublished">已发布的单词</Menu.Item>
                            <Menu.Item key="deleted">被移除的单词</Menu.Item>
                        </SubMenu>
                        <SubMenu key="manage" title={< span > <Icon type="setting"/> < span > 系统管理 < /span></span >}>
                            <Menu.Item key="user">用户管理</Menu.Item>
                            <Menu.Item key="magazine">来源杂志管理</Menu.Item>
                            {/* <Menu.Item key="log">查看日志</Menu.Item> */}
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
ActionLayout.contextTypes = {
    router: React.PropTypes.object.isRequired
}
