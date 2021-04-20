import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import style from './index.pcss'
import Home from "../page/home";
import {connect} from "react-redux";
import {addSocket} from "../reducers/socket";

@connect(
  state => ({socket: state.socket}),
  {addSocket}
)
class Router extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const socket = new WebSocket("ws://t-register.aegis-info.com/ws")
    this.props.addSocket(socket)
    socket.onopen = () => {
      this.props.socket.send("nihao")
    }
    socket.onmessage = res => {
      console.log(res)
    }
    socket.onerror = res => {
      console.log("失败! ", res)
    }
    socket.onclose = res => {
      console.log("关闭! ", res)
    }
  }

  render() {
    return (
      <HashRouter>
        <div className={style.init}>
          <Route exact path="/" component={Home}/>
        </div>
      </HashRouter>
    );
  }
}

export default Router;