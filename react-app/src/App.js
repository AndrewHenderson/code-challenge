/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import './App.css'

const GIT_USERS = ['dhh', 'jashkenas']
const GIT_USER_URL = 'https://api.github.com/users/'
const GIT_EVENT_POSTFIX = '/events'
const SCORE_MAP = {
  PushEvent: 5,
  PullRequestReviewCommentEvent: 4,
  WatchEvent: 3,
  CreateEvent: 2
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: null
    }
  }

  getSum() {
    let sum = 0;
    for (var i in this.state) {
      if (i !== 'total') {
        sum += this.state[i];
      }
    }
    return sum;
  }

  handleClick = (e) => {
    const updates = {
      total: 0
    };

    const allPromise = new Promise((resolve, reject) => {
      let remaining = GIT_USERS.length;

      for (let i = 0; i < GIT_USERS.length; i++) {
        let user = GIT_USERS[i];
        let uri = `${GIT_USER_URL}${user}${GIT_EVENT_POSTFIX}`;

        fetch(uri)
        .then(res => {
          return res.json();
        })
        .then(json => {
          return json.reduce((acc, item) => {
            let add = SCORE_MAP[item.type] || 1;
            return acc + add;
          }, 0)
        })
        .then(score => {
          updates[user] = score;
          updates.total += score;
          remaining--;

          if (remaining === 0) {
            resolve(updates);
          }
        })
      }
    });

    allPromise.then(this.setState.bind(this));
  };

  handleInputChange = (e) => {
    let total = this.getSum();
    const multiple = parseFloat(e.target.value);

    if (!isNaN(multiple)) {
      total = total * multiple;
    }

    this.setState({
      total
    })
  }

  renderUsers() {
    const users = [];

    for (var i in this.state) {
      if (i !== 'total') {
        let score = this.state[i];

        users.push(
          <li
            key={i}
            className="App_user">
            <div>{i}</div>
            <div>{score}</div>
          </li>
        );
      }
    }

    return users;
  }

  render() {
    const { total } = this.state;
    const Users = this.renderUsers();

    return (
      <div className="App">
        <div className="App_score">
          { typeof total === 'number' ? `Total: ${total}` : 'n/a' }
          <ul className="App_users">
            { Users }
          </ul>
        </div>
        <button
          type="button"
          className="App_button"
          children="Get Score"
          onClick={this.handleClick}
        />
        { typeof total === 'number' &&
          <div className="App_multipy">
          Multiply Total by: <input className="App_input" onChange={this.handleInputChange} />
          </div>
        }
      </div>
    );
  }
}
