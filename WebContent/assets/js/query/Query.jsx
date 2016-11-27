import React, { Component } from 'react';
import superagent from 'superagent';
import { Input, Button } from 'antd';

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
      <div>
        <h5>{termData.term}</h5>{this.state.configuration[5] === '1' ? <span>{termData.pronunciation}</span> :null}
        <div>
          {this.state.configuration[4] === '1' ? <div>{termData.term_char}</div> : null}
          {this.state.configuration[1] === '1' ? <div>{termData.definition}</div> : null }
          {this.state.configuration[2] === '1' ? <div>{termData.source}</div> : null}
          {this.state.configuration[0] === '1' ? <div>{termData.origin}</div> : null}
          {this.state.configuration[6] === '1' ? <div>{termData.translation}</div> : null}
          {this.state.configuration[7] === '1' ? <div>{termData.basis}</div> : null}
          {this.state.configuration[3] === '1' ? <div>{termData.example}</div> : null}
        </div>
      </div>
    )
  }
  render() {
    return (
      this.state.termData.term ?
       <div>
         <div>
           <Input value={this.state.searchTerm} onChange={this.handleChange.bind(this)} />
           <Button type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
         </div>
         {this.renderResult()}
       </div>
       :
       <div>
         <Input value={this.state.searchTerm} onChange={this.handleChange.bind(this)} />
         <Button type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
       </div>
    )
  }
}

export default Query;
