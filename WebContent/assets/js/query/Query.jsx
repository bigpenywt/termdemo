import React, {Component} from 'react';
import superagent from 'superagent';
import {
    Input,
    Button,
    Modal,
    Form,
    Col,
    Row
} from 'antd';
const FormItem = Form.Item;

import './query.scss'

function _searchTerm(searchTerm) {
    return new Promise((resolve, reject) => {
        superagent.get('/fnmt/Term/QueryTerm').query({term: searchTerm}).end((err, res) => {
            if (err)
                return reject(err);
            if (res.body.status === '0') {
                return reject(res.body.msg);
            }
            resolve(res.body);
        })
    })
}
function getConfiguration() {
    return new Promise((resolve, reject) => {
        superagent.get('/fnmt/Conf/getConf').end((err, res) => {
            if (err)
                return reject(err);
            if (res.body.status === '0') {
                return reject(res.body.msg);
            }
            resolve(res.body);
        });
    });
}

class Query extends Component {
    constructor() {
        super();
        this.state = {
            searchTerm: '',
            termData: {}
        }
    }
    handleChange(e) {
        this.setState({searchTerm: e.target.value});
    }
    handleSearch() {
        const {searchTerm} = this.state;
        if (searchTerm)
            _searchTerm(searchTerm.trim()).then((res) => {
                this.setState({termData: res.term, configuration: res.conf});
            }, () => {
                this.setState({
                    searchTerm: '',
                    termData: {}
                }, () => {
                    Modal.warning({title: `没有查询到'${searchTerm}'`, content: `词库还未收录词条'${searchTerm}'`});
                })
            })
    }
    renderResult() {
        const {termData, configuration} = this.state;
        const origin = !termData.origin || (() => {
            const tempOrigin = termData.origin.split('%$!**');
            if (tempOrigin[1])
                return (
                    <div className="indent-content">
                        <Row>
                            <Col span={24}>
                                <FormItem label="杂志名称" labelCol={{
                                    span: 2
                                }} wrapperCol={{
                                    span: 16
                                }}>
                                    <p>{tempOrigin[0]}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <FormItem label="年份" labelCol={{
                                    span: 8
                                }} wrapperCol={{
                                    span: 16
                                }}>
                                    <p>{tempOrigin[1]}</p>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="卷号" labelCol={{
                                    span: 8
                                }} wrapperCol={{
                                    span: 16
                                }}>
                                    <p>{tempOrigin[2]}</p>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="期号" labelCol={{
                                    span: 8
                                }} wrapperCol={{
                                    span: 16
                                }}>
                                    <p>{tempOrigin[3]}</p>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="页码" labelCol={{
                                    span: 8
                                }} wrapperCol={{
                                    span: 16
                                }}>
                                    <p>{tempOrigin[4]}</p>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                )
            return (
                <div className="indent-content">
                    <Row>
                        <Col span={24}>
                            <FormItem label="" labelCol={{
                                span: 2
                            }} wrapperCol={{
                                span: 16
                            }}>
                                <p className="no-label">{termData.origin}</p>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            );
        })()
        return (
            <Row>
                <Col span={16} offset={4}>
                    <div className="term-panel">
                        <Row className="block" type="flex" justify="flex-start">
                            {this.state.configuration[5] === '1' && <p className="in-p">
                                {'['}
                                <span className="gr">
                                    {termData.pronunciation}
                                </span>{']'}
                            </p>}
                            {this.state.configuration[4] === '1' && <p className="in-p wt">
                                {termData.term_char}
                            </p>}
                        </Row>
                        {this.state.configuration[6] === '1' && <Row className="block">
                            {/* <div className="title bl">
                                <b>中文翻译</b>
                            </div> */}
                            <p className="single-item">{termData.translation}</p>
                        </Row>}
                        {this.state.configuration[7] === '1' && <Row className="block">
                            {/* <div className="title bl">
                                <b>翻译理据</b>
                            </div> */}
                            <p className="single-item">{termData.basis}</p>
                        </Row>}
                        {this.state.configuration[1] === '1' && <Row className="block">
                            {/* <div className="title bl">
                                  <b>英文定义</b>
                              </div> */}
                            <p className="single-item">{termData.definition}</p>
                        </Row>}
                        {this.state.configuration[2] === '1' && <Row className="block">
                            {/* <div className="title bl">
                                  <b>定义来源</b>
                              </div> */}
                            <p className="single-item">{termData.source}</p>
                        </Row>}
                        {this.state.configuration[0] === '1'
                            ? <Row className="block">
                                    {/* <div className="title bl">
                                        <b>首次来源</b>
                                    </div> */}
                                    {origin}
                                </Row>
                            : null}
                        {this.state.configuration[3] === '1' && <Row className="block">
                            {/* <div className="title bl">
                                <b>示例</b>
                            </div> */}
                            <p className="single-item">{termData.example}</p>
                        </Row>}
                    </div>
                </Col>
            </Row>
        )
    }
    render() {
        return (this.state.termData.term
            ? <div>
                    <Row className="search-done-header" type="flex" justify="center" align="middle">
                        <Col span={8}><Input value={this.state.searchTerm} onChange={this.handleChange.bind(this)} style={{
                    width: '95%',
                    height: '40px'
                }}/></Col>
                        <Col span={2}>
                            <Button type="primary" onClick={this.handleSearch.bind(this)} icon="search" size="large" style={{
                                width: '105px',
                                marginBottom: '5px'
                            }}>查询</Button>
                        </Col>
                    </Row>
                    {this.renderResult()}
                </div>
            : <div>
                <Row style={{
                    height: '25%',
                    position: 'absolute',
                    width: '100%',
                    paddingTop: '20vh'
                }}>
                    <h1 style={{
                        marginLeft: '29.5%'
                    }}>复旦大学英汉医学新术语查询系统</h1>
                    <img className="ga" src={require('../../../img/logo.jpg')}/>
                </Row>
                <Row className="initial-search" type="flex" justify="center" align="top">
                    <Col span={8}><Input value={this.state.searchTerm} onChange={this.handleChange.bind(this)} style={{
                width: '95%',
                height: '40px'
            }}/></Col>
                    <Col span={2}>
                        <Button type="primary" onClick={this.handleSearch.bind(this)} icon="search" size="large" style={{
                            width: '105px',
                            marginTop: '4px'
                        }}>查询</Button>
                    </Col>
                </Row>
            </div>)
    }
}

export default Query;
