import React, { Component } from 'react';
import superagent from 'superagent';
import { Input, Button, Row, Col } from 'antd';

import '../../../public/css/page/app/query.css'

function searchTerm(searchTerm) {
  return new Promise((resolve, reject) => {
    superagent
      .get('/termdemo/Term/QueryTerm')
      .query({ term: searchTerm })
      .end((err, res) => {
        if (err) return reject(err);
        if (res.body.status === '0') {
          return reject(res.body.msg);
        }
        resolve(res.body);
      })
  })
}
function getConfiguration() {
  return new Promise((resolve, reject) => {
    superagent
      .get('/termdemo/Conf/getConf')
      .end((err, res) => {
        if (err) return reject(err);
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
    this.setState({ searchTerm: e.target.value });
  }
  handleSearch() {
    searchTerm(this.state.searchTerm).then((res) => {
      this.setState({ termData: res.term, configuration: res.conf });
    })
  }
  renderResult() {
    const { termData, configuration } = this.state;
    return (
      <Row>
        <Col span={12} offset={2}>
          <div className="term-panel">
            <Row type="flex" justify="flex-start">
              <h2>{termData.term}</h2>
            </Row>
            {this.state.configuration[5] === '1' ? <Row><span>{'[' + termData.pronunciation + ']'}</span></Row> :null}
            <Row>
              {this.state.configuration[4] === '1' ? <span><strong>{termData.term_char}</strong></span> : null}
              {this.state.configuration[6] === '1' ? <span>{termData.translation}</span> : null}
            </Row>
            <hr/>
            {this.state.configuration[7] === '1' ? <Row><div>翻译理据</div><div className="indent-content">{termData.basis}</div></Row> : null}
            <hr />
            {this.state.configuration[1] === '1' ? <Row><div>英文定义</div><div className="indent-content">{termData.definition}</div></Row> : null }
            {this.state.configuration[2] === '1' ? <Row><div>定义来源</div><div className="indent-content">{termData.source}</div></Row> : null}
            <hr />
            {this.state.configuration[0] === '1' ? <Row><div>首次来源</div><div className="indent-content">{termData.origin}</div></Row> : null}
            <hr />
            {this.state.configuration[3] === '1' ? <Row><div>示例</div><div className="indent-content">{termData.example}</div></Row> : null}
          </div>
        </Col>
      </Row>
    )
  }
  render() {
    return (
      this.state.termData.term ?
       <div>
         <Row className="search-done-header" type="flex" justify="center" align="middle">
           <Col span={8}><Input value={this.state.searchTerm} onChange={this.handleChange.bind(this)} style={{ width: '95%', height: '40px'}}/></Col>
           <Col span={2}>
             <Button type="primary" onClick={this.handleSearch.bind(this)} icon="search" size="large" style={{ width: '105px', marginBottom: '5px'}}>查询</Button>
           </Col>
         </Row>
         <hr style={{ marginTop: '8px', color: '#f1f1f1', marginBottom: '20px' }}/>
         {this.renderResult()}
       </div>
       :
       <div>
       <Row style={{ height: '25%', position: 'absolute', width: '100%'}} type="flex" justify="center" align="bottom"><h1>蛋蛋术语查询系统</h1></Row>
       <Row className="initial-search" type="flex" justify="center" align="top">
         <Col span={8}><Input value={this.state.searchTerm} onChange={this.handleChange.bind(this)} style={{ width: '95%', height: '40px'}}/></Col>
         <Col span={2}>
           <Button type="primary" onClick={this.handleSearch.bind(this)} icon="search" size="large" style={{ width: '105px', marginTop: '4px'}}>查询</Button>
         </Col>
       </Row>
       </div>
    )
  }
}

export default Query;
