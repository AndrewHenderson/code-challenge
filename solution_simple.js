/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import './App.css'

const GIT_USERS = ['']
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
      dhh: null,
      jashkenas: null
    }
  }

  handleClick = async (e) => {
    const dhhJSON = await fetch(`${GIT_USER_URL}dhh${GIT_EVENT_POSTFIX}`)
    .then(res => {
      return res.json();
    })
    .then(json => {
      return json;
    });

    fetch(`${GIT_USER_URL}jashkenas${GIT_EVENT_POSTFIX}`)
    .then(res => {
      return res.json();
    })
    .then(json => {
      this.calculateTotals({
        dhh: dhhJSON,
        jashkenas: json
      })
    });
  };

  calculateTotals(data) {
    const { dhh, jashkenas } = data;

    const dhhTotal = dhh.reduce((acc, item) => {
      let add = SCORE_MAP[item.type] || 1;
      return acc + add;
    }, 0);

    const jashkenasTotal = jashkenas.reduce((acc, item) => {
      let add = SCORE_MAP[item.type] || 1;
      return acc + add;
    }, 0);

    this.setState({
      dhh: dhhTotal,
      jashkenas: jashkenasTotal,
    })
  }

  render() {
    const { dhh, jashkenas } = this.state;
    let Users = 'n/a';

    if (dhh || jashkenas) {
      Users = (
        <div className="App_users">
          <div className="App_user">
            <h2>dhh</h2>
            {dhh}
          </div>
          <div className="App_user">
            <h2>jashkenas</h2>
            {jashkenas}
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <div className="App_score">
          { dhh && jashkenas && <div>Total: { dhh + jashkenas }</div> }
          { Users }
        </div>
        <button
          type="button"
          className="App_button"
          children="Get Score"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}
