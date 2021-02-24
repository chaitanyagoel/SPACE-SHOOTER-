import React from 'react'
import { Table, Tag, Space } from 'antd';
import 'antd/dist/antd.css';

class Data extends React.Component {
  state={
    data:[],
    }
  
  performSearch=()=>{
    const sendHttpRequest = (method, url, data) => {
      return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {}
      }).then(response => {
        if (response.status >= 400) {
          // !response.ok
          return response.json().then(errResData => {
            const error = new Error('Something went wrong!');
            error.data = errResData;
            throw error;
          });
        }
        return response.json();
      });
    };
    
    const getData = () => {
      sendHttpRequest('GET', 'https://garvitchittora.pythonanywhere.com/list').then(responseData => {
        console.log(responseData);
        this.setState({data:responseData});
      });
    };
    getData();
  }
  componentWillMount(){
    this.performSearch()
  }
  

  render() {
	  const columns = [
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      },
      
    ];
    const data = [];
    if(this.state.data.length){
      for (let i = 0; i <this.state.data.length ; i++) {
        data.push({
          name: this.state.data[i].name,
          rank: i + 1,
          score: this.state.data[i].score,
        });
      }
    }
    
    return (<Table columns={columns} dataSource={data} />)
  }
}

export default Data;